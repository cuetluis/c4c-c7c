import React, { useState, useContext } from 'react';
import { useRouter, Link } from 'expo-router'
import { View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import Input from '../../components/Input'
import Button from '../../components/Button'
import { AuthContext } from '../../context/AuthContext'
import FullScreenImageScreen from '../../components/Fullscreen'

const RegistrationScreen = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');

  const [error, setError] = useState('');

  const {registration} = useContext(AuthContext);
  const router = useRouter();

  const handleRegistration = async () => {
    setError(''); // Clear previous errors
    const result = await registration(email, name, password1, password2);
    
    if (result && !result.success) {
      setError(result.message);
      alert(result.message);
    } else {
      router.replace('../(tabs)/home');
    }
  };

  return (
    <View style={styles.root}>
      <FullScreenImageScreen />

      <Text style={{fontSize: 30, fontWeight: 'bold'}}> Register </Text>

      <Input
        placeholder="Email"
        value={email}
        setValue={setEmail}
        secureTextEntry={false}
      />

    <Input
        placeholder="Name"
        value={name}
        setValue={setName}
        secureTextEntry={false}
      />

      <Input
        placeholder="Password"
        value={password1}
        setValue={setPassword1}
        secureTextEntry={true}
      />

      <Input
        placeholder="Reeenter Password"
        value={password2}
        setValue={setPassword2}
        secureTextEntry={true}
      />

      <Button text="Submit" onPress={handleRegistration} />

      <Link href="/(auth)/login" asChild>
        <TouchableOpacity style={styles.link}>
        <Text>
          Don't have an account? <Text style={styles.linkText}>Back to login?</Text>
        </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

export default RegistrationScreen;

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
