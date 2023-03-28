import * as React from 'react';
import {
  Text,
  View,
  SafeAreaView,
  TextInput,
  StyleSheet,
  ImageBackground,
  Button,
  Alert,
  TouchableOpacity,
  Icon,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import Destination from '../Layout/Destination';
import Tickets from '../Layout/Tickets';

export default function BusTicket() {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  return (
    <View style={styles.container}>
      <Text>Ticket</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
    height: 130,
    padding: 10,
    margin: 10,
    borderRadius: 5,
    boxShadow: "10px 10px 17px -12px rgba(0,0,0,0.75)"
  },
});
