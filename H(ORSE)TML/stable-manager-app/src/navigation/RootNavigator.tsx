import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import HorseTableScreen from '../screens/HorseTableScreen';
import TreatmentTableScreen from '../screens/TreatmentTableScreen';
import ActionTakenTableScreen from '../screens/ActionTakenTableScreen';
import DailyObservationsScreen from '../screens/DailyObservationsScreen';
import AuditTrailScreen from '../screens/AuditTrailScreen';

const Stack = createStackNavigator();

const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Horse Table" component={HorseTableScreen} />
        <Stack.Screen name="Treatment Table" component={TreatmentTableScreen} />
        <Stack.Screen name="Action Taken" component={ActionTakenTableScreen} />
        <Stack.Screen name="Daily Observations" component={DailyObservationsScreen} />
        <Stack.Screen name="Audit Trail" component={AuditTrailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;