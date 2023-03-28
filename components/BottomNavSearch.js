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
import { FontAwesome } from '@expo/vector-icons';
import Constants from 'expo-constants';
import Destination from '../Layout/Destination';
import Tickets from '../Layout/Tickets';

export default function BottomNavSearch({placeholder, value}) {

   return (
      <View style={{ padding: 0 }}>
        <View
          style={{
            height: 60,
            backgroundColor: '#bae3ff',
            padding: 10,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}>
          <TextInput
            style={{
              borderRadius: 10,
              height: 40,
              backgroundColor: 'white',
              paddingLeft: 10,
            }}
            placeholder={placeholder}
            keyboardType="text"
            clearButtonMode={true}
            contextMenuHidden
            value={value}
          />
        </View>
      </View>
    );
}
