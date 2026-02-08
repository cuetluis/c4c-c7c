import React from 'react';
import {Text, View, Button, Pressable, Image, StyleSheet} from "react-native";
import {useRouter, Link} from 'expo-router';
import FullScreenImageScreen from '../../components/fullscreen';

export default function Index() {
  return (
    <View style={styles.container}>
      <FullScreenImageScreen />
      <Image
      />

      <Link href="/(auth)/login" style={{ padding: 10, backgroundColor: 'blue', color: 'white', borderRadius: 5 }}>
        Go to Login
      </Link>

    </View>
  );
}

// Stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1, // Takes up the entire screen space
    justifyContent: 'center', // Centers children vertically
    alignItems: 'center', // Centers children horizontally
  }
});