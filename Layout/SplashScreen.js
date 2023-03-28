import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from 'react-native';
import Constants from 'expo-constants';

// or any pure javascript modules available in npm
import { Card } from 'react-native-paper';
//import image from '../assets/bus-move.gif';
import image from '../assets/Home.png';


export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <ImageBackground source={image} style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#12225b',
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    height: '100%'
  },
});
