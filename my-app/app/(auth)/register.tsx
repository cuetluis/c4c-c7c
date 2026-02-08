import React, { useState, useContext } from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet, useWindowDimensions, KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import Input from '../../components/Input'
import Button from '../../components/Button'
import { AuthContext } from '../../context/AuthContext'
import FullScreenImageScreen from '../../components/fullscreen'

const RegistrationScreen = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');

  const [error, setError] = useState('');

  const {height} = useWindowDimensions();
  const {registration} = useContext(AuthContext);

  const handleRegistration = async () => {
    setError(''); // Clear previous errors
    const result = await registration(email, name, password1, password2);
    
    if (result && !result.success) {
      setError(result.message);
      alert(result.message);
    }
  };

  return (
    <View style={styles.root}>
      <FullScreenImageScreen />

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