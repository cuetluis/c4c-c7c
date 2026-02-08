import { Image } from 'react-native';
import { Tabs } from 'expo-router';

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
          tabBarIcon: ({ color }) => <Image source={require('../../assets/images/home.png')}
                                            style={{ width: 80, height: 80, tintColor: color }}
                                            resizeMode="contain"
          />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          href:null
        }}
      />
      <Tabs.Screen
        name="audits"
        options={{
          href:null
        }}
      />
      <Tabs.Screen
        name="horses"
        options={{
          href:null
        }}
      />
    </Tabs>
  );
}
