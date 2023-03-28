import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  Button,
  Alert,
  TouchableOpacity,
  Icon,
  ScrollView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import Footer from '../components/Footer';
import BusTicket from '../components/BusTicket';
import image from '../assets/bookins.png';

export default function History({ navigation }) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  return (
    <View style={(styles.container, screenHeight)}>
      <View style={styles.top}>
        <Text style={{ color: 'black', paddingTop: 20 }}>
            Purchased Tickets
        </Text>


        <View style={styles.topData}>
          <ImageBackground
            source={image}
            style={styles.image}></ImageBackground>
        </View>
      </View>

      <ScrollView style={styles.body}>
        <BusTicket />
        <BusTicket />
        <BusTicket />
        <BusTicket />
        <BusTicket />
      </ScrollView>

      <View style={styles.footer}>
        <Footer navigation={navigation} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  top: {
    height: '30%',
    backgroundColor: '#fff',
    padding: 20,
  },
  topData: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
  },
  body: {
    height: '63%',
    backgroundColor: '#F4F6F8',
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 10,
  },
  footer: {
    height: '7%',
  },
  image: {
    flex: 1,
    width: 250,
    height: 150,
    marginLeft: 50,
  },
});
