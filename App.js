import * as React from 'react';
import { Text, View, StyleSheet, ImageBackground } from 'react-native';
import Constants from 'expo-constants';

// You can import from local files
import SplashScreen from './Layout/SplashScreen';
import Tickets from './Layout/Tickets';
import Destination from './Layout/Destination';
import Layout from './components/PageLayout';
import Footer from './components/Footer';
import BusTicket from './components/BusTicket';
import BottomNavSearch from './components/BottomNavSearch'
import History from './Layout/History'
import ScreensController from './Layout/ScreensController'

// or any pure javascript modules available in npm
import { Card } from 'react-native-paper';


export default function App() {

  const [isSplashShowing, setIsSplashShowing] = React.useState(true)

  React.useEffect(() => {
    setTimeout(() => {
      setIsSplashShowing((isSplashShowing) => false)
    }, 3000)
  }, [isSplashShowing])

  return (
    <View style={styles.container}>
     {isSplashShowing ?  <SplashScreen/> : <ScreensController/>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },

})
