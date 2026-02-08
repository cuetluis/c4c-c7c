import React from 'react';
import {Text, View, Button, Pressable, Image, StyleSheet} from "react-native";
import FullScreenImageScreen from '../../components/fullscreen';


const imageSource = require('../../assets/images/horse.jpg');

const handlePress = () => {
    alert('Button Pressed!');
};

export default function Index() {
    return (
      <View style={styles.container}>
        <FullScreenImageScreen />
        <Image
        />
        <Text>Edit app/index.tsx to edit this screen.</Text>
        <Button
            title="Press me"
            color="#f194ff"
            onPress={async () => {
                try {
                  const response = await fetch('http://10.0.2.2:5000/get-horse/1');
                  const json = await response.json();
                  const alertMessage = JSON.stringify(json, null, 2);
                  // Display the horse name in the alert
                  alert(alertMessage);
                } catch (error) {
                  console.error(error);
                  alert('Failed to fetch horse data.');
                }
              }}
          />
  
        <Pressable onPress={handlePress}>
          <Image
            source = {imageSource} 
            style={{ width: 50, height: 50 }} 
          />
        </Pressable>
  
        <Button
          title="Sign In"
          onPress={() => alert('Signed in!')}
        />
        </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1, // Takes up the entire screen space
      justifyContent: 'center', // Centers children vertically
      alignItems: 'center', // Centers children horizontally
    }
  });