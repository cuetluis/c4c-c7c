import React, { useState, useContext } from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet, useWindowDimensions, KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import Input from '../../components/Input'
import Button from '../../components/Button'
import { Link } from 'expo-router';
import { AuthContext } from '../../context/AuthContext'
import FullWidthImage from '../../components/Fullscreen';
import { useRouter } from 'expo-router';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const {height} = useWindowDimensions();
  const {login} = useContext(AuthContext);

  const router = useRouter();

  const handleLogin = async () => {
    setError(''); // Clear previous errors
    const result = await login(email, password);
    
    if (result && !result.success) {
      setError(result.message);
      alert("Error!")
    } else if (result && result.success) {
      router.replace('../(tabs)/home');
    } else {
      alert("No data received back!")
    }
  };

  return (
    <View style={styles.root}>
      <FullWidthImage />
      <Text style={{fontSize: 30, fontWeight: 'bold'}}> Login </Text>
      <Input
        placeholder="Email"
        value={email}
        setValue={setEmail}
        secureTextEntry={false}
      />

      <Input
        placeholder="Password"
        value={password}
        setValue={setPassword}
        secureTextEntry={true}
      />

      <Button text = "Submit" onPress = { handleLogin }  />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Link href="/(auth)/register" asChild>
        <TouchableOpacity style={styles.link}>
        <Text>
          Don't have an account? <Text style={styles.linkText}>Sign up</Text>
        </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white'
  },
  logo: {
    width: '70%',
    height: 120,
    marginBottom: 10
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  link: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#007AFF',
    fontWeight: 'bold',
  }
});
