import React from 'react';
import {Text, Pressable, Image, StyleSheet} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router';

export default function Index() {
    const router = useRouter();

    const menuItems = [
      { id: '1', title: 'Horse Information', path: '/horses', image: require('../../assets/images/horse_db.png' )},
      { id: '2', title: 'AI Assistant', path: '/ai', image: require('../../assets/images/ai.png')},
      { id: '3', title: 'Audit', path: '/audit', image: require('../../assets/images/audit.png') },
      { id: '4', title: 'Settings', path: '/settings', image: require('../../assets/images/settings.png') },
    ];

    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Main Menu</Text>

        {menuItems.map((item) => (
          <Pressable 
            key={item.id}
            onPress={() => router.push(item.path as any)}
          >
            <Image source={item.image}
                    style = {styles.menuItemImage} />
          </Pressable>
        ))}

        </SafeAreaView>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 40,
      fontWeight: "bold",
      marginBottom: 10
    },
    menuItemImage: {
      width: 150,
      height: 150,
      resizeMode: "contain",
      marginBottom: 10
    }
  });
