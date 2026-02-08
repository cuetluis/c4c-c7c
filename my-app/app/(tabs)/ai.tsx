import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, ActivityIndicator, Platform, ScrollView } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system/legacy';
import { GoogleGenerativeAI } from '@google/generative-ai';

// --- CONFIGURATION ---
// ⚠️ SECURITY WARNING: In a real app, never store keys in client-side code.
const ELEVENLABS_API_KEY = 'sk_7d84a0e283e8a0d4c11a6f3af22c2af14fef68aa1ab49148';
const GEMINI_API_KEY = 'AIzaSyDz_XMrUM-d1DjAn_Tf7jAkdPO7iuSH_Dg';
const ELEVENLABS_VOICE_ID = '21m00Tcm4TlvDq8ikWAM'; // Example: "Rachel"
const LOCAL_SERVER_PORT = '5000';

// Android Emulator uses 10.0.2.2 for localhost; iOS uses localhost
const API_URL = Platform.OS === 'android' 
  ? `http://10.0.2.2:${LOCAL_SERVER_PORT}/api-example`
  : `http://localhost:${LOCAL_SERVER_PORT}/api-example`;

// Initialize Gemini
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export default function App() {
  const [recording, setRecording] = useState();
  const [status, setStatus] = useState('Idle'); // Idle, Recording, Processing, Playing
  const [conversation, setConversation] = useState([]);

  // 1. PERMISSIONS
  useEffect(() => {
    (async () => {
      await Audio.requestPermissionsAsync();
    })();
  }, []);

  // 2. START RECORDING
  async function startRecording() {
    try {
      setStatus('Recording...');
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  // 3. STOP RECORDING & PROCESS
  async function stopRecording() {
    setStatus('Processing...');
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI(); 
    
    // Start the AI Pipeline
    await handleConversationLoop(uri);
  }

  // --- THE AI PIPELINE ---
  async function handleConversationLoop(audioUri) {
    try {
      // Step A: Speech-to-Text (ElevenLabs Scribe)
      setStatus('Transcribing (ElevenLabs)...');
      const transcript = await transcribeAudio(audioUri);
      addToLog('User', transcript);

      // Step B: Fetch Local Context (RAG)
      setStatus('Fetching Local Context...');
      const contextData = await fetchLocalContext();
      
      // Step C: Gemini LLM Processing
      setStatus('Thinking (Gemini)...');
      const aiResponseText = await generateGeminiResponse(transcript, contextData);
      addToLog('Gemini', aiResponseText);

      // Step D: Text-to-Speech (ElevenLabs TTS)
      setStatus('Synthesizing Audio...');
      const audioPath = await synthesizeSpeech(aiResponseText);

      // Step E: Playback
      setStatus('Playing Response...');
      await playAudio(audioPath);
      setStatus('Idle');

    } catch (error) {
      console.error(error);
      setStatus('Error: ' + error.message);
    }
  }

  // --- HELPER FUNCTIONS ---

  async function transcribeAudio(uri) {
    // ElevenLabs "Scribe" (STT) API
    // We use FileSystem.uploadAsync for multipart/form-data upload
    const response = await FileSystem.uploadAsync(
      'https://api.elevenlabs.io/v1/speech-to-text/convert',
      uri,
      {
        fieldName: 'file',
        httpMethod: 'POST',
        uploadType: 1,
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        parameters: {
          model_id: 'scribe_v2', // The STT model
        },
      }
    );

    const data = JSON.parse(response.body);
    return data.text;
  }

  async function fetchLocalContext() {
    try {
      const response = await fetch(API_URL);
      const json = await response.json();
      return JSON.stringify(json);
    } catch (error) {
      console.warn("Could not fetch local context. Is the server running?");
      return "No local context available (Server unreachable).";
    }
  }

  async function generateGeminiResponse(userQuestion, context) {
    const prompt = `
      You are a helpful voice assistant.
      
      CONTEXT INFORMATION (from localhost):
      ${context}

      USER QUESTION:
      ${userQuestion}

      INSTRUCTIONS:
      Answer the question using ONLY the context information provided above. 
      Keep the answer conversational and concise (suitable for voice output).
    `;

    const result = await model.generateContent(prompt);
    return result.response.text();
  }

  async function synthesizeSpeech(text) {
  if (!text) throw new Error("No text to speak");

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': ELEVENLABS_API_KEY,
    },
    body: JSON.stringify({
      text: text,
      model_id: "eleven_flash_v2_5",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.5
      }
    })
  });

  // --- UPDATED ERROR HANDLING ---
  if (!response.ok) {
    const errorBody = await response.text(); // Get the detailed error from ElevenLabs
    console.error("ElevenLabs Error Details:", errorBody);
    throw new Error(`TTS Failed (${response.status}): ${errorBody}`);
  }
  // -----------------------------

  const blob = await response.blob();
  const reader = new FileReader();
  
  return new Promise((resolve, reject) => {
    reader.onload = async () => {
      const base64data = reader.result.split(',')[1];
      const path = FileSystem.documentDirectory + 'response.mp3';
      await FileSystem.writeAsStringAsync(path, base64data, {
        encoding: FileSystem.EncodingType.Base64,
      });
      resolve(path);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

  async function playAudio(path) {
    const { sound } = await Audio.Sound.createAsync({ uri: path });
    await sound.playAsync();
  }

  function addToLog(sender, text) {
    setConversation(prev => [...prev, { sender, text }]);
  }

  // --- RENDER ---
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Gemini + ElevenLabs Voice</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>{status}</Text>
        {status !== 'Idle' && <ActivityIndicator size="small" color="#0000ff" />}
      </View>

      <Button
        title={recording ? 'Stop Recording' : 'Hold to Speak'}
        onPress={recording ? stopRecording : startRecording}
        color={recording ? 'red' : '#2196F3'}
      />

      <ScrollView style={styles.log}>
        {conversation.map((msg, index) => (
          <View key={index} style={styles.msgRow}>
            <Text style={styles.sender}>{msg.sender}:</Text>
            <Text>{msg.text}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60, backgroundColor: '#f5f5f5' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  statusContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20, height: 30 },
  statusText: { marginRight: 10, fontSize: 16, color: '#555' },
  log: { marginTop: 20, flex: 1 },
  msgRow: { marginBottom: 15, padding: 10, backgroundColor: 'white', borderRadius: 8 },
  sender: { fontWeight: 'bold', marginBottom: 4, color: '#333' },
});