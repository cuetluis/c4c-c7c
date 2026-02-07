import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './navigation/RootNavigator';
import { SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { globalStyles } from './styles/globalStyles';

const App = () => {
  return (
    <NavigationContainer>
      <SafeAreaView style={globalStyles.container}>
        <StatusBar style="auto" />
        <RootNavigator />
      </SafeAreaView>
    </NavigationContainer>
  );
};

export default App;