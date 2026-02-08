import React from 'react';
import {View, Image, StyleSheet, ImageBackground} from "react-native";

const img = require('../../assets/images/opps.png')

const SettingScreen = () => {
    return (
        <ImageBackground source = { img } style = {{flex: 1}} />
    );
}

export default SettingScreen;
