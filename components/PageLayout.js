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

export default function PageLayout() {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const [showTicketsPage, setShowTicketsPage] = React.useState(false);

  return (
    <View style={(styles.container, screenHeight)}>
      <View style={styles.body}>
        {!showTicketsPage ? (
          <Destination
            showTicketsPage={showTicketsPage}
            setShowTicketsPage={setShowTicketsPage}
          />)
         : (
          <Tickets />
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerIcons}
          onPress={() => Alert.alert('Back to Search')}>
          <Text style={{ color: 'black' }}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerIcons}
          onPress={() => setShowTicketsPage(true)}>
          <Text style={{ color: 'black' }}>Tickets</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerIcons}
          onPress={() => Alert.alert('View Profile')}>
          <Text style={{ color: 'black' }}>Profile</Text>
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

  body: {
    height: '93%',
    display: 'flex',
    flexDirection: 'column',
  },
  footer: {
    height: '7%',
    backgroundColor: '#fff',
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
