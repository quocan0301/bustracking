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
import { Ionicons, Fontisto, MaterialIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import Destination from '../Layout/Destination';
import Tickets from '../Layout/Tickets';
import History from '../Layout/History';

export default function Footer({navigation}) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [showTicketsPage, setShowTicketsPage] = React.useState(false);

  return (
    <View style={(styles.container, screenHeight)}>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerIcons}
          onPress={() => navigation.navigate('Destination')}>
          <Ionicons
          style={styles.inputIcon}
          name="home"
          size={16}
          color="#1C458A"  
        />  
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerIcons}
          onPress={() => navigation.navigate('History')}>
           <Fontisto
          style={styles.inputIcon}
          name="bus-ticket"
          size={16}
          color="#1C458A"
         
        />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.footerIcons}
          onPress={() => Alert.alert('View Profile')}>
          <MaterialIcons
          style={styles.inputIcon}
          name="account-circle"
          size={16}
          color="#1C458A"
         
        />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },

  footer: {
    height: '100%',
    backgroundColor: '#0C4B8E',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerIcons: {
    margin: 20,
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    padding: 10,
    height: 35,
    borderRadius: 50,
  },
});
