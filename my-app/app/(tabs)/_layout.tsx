import { Tabs } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function TabLayout() {
  return (
    <Tabs screenOptions=
      {{ 
        headerShown: false, 
        tabBarShowLabel: false, 
        tabBarStyle: {
          height: 100,
          paddingBottom: 0,

        },
        tabBarIconStyle: 
        {
          width: 80,
          height: 80,
        }
       }
      }>
      <Tabs.Screen
        name="home"
        options={{
          title: 'text',
          tabBarIcon: ({ color }) => <MaterialIcons size={80} name="home" color={color} 
          />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          href:null
        }}
      />
    </Tabs>
  );
}