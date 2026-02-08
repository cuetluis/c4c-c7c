import React from 'react';
import {View, Image, StyleSheet, ImageBackground} from "react-native";
import {Link} from 'expo-router';

const logo = require("../assets/images/logo.png")
const back_image = require("../assets/images/image.png");

export default function Index() {
  return (
    <ImageBackground source = {back_image} style = {{flex: 1}}>
    <View style = {styles.container}>
      <Image source = {logo}/>

      <Link href="/(auth)/login" style={{ padding: 20, fontSize: 30, fontWeight: 'bold', color: 'black', borderRadius: 5}}>
        Login
      </Link>
    </View>
    </ImageBackground>
  );
}

// Stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
