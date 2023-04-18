import * as React from 'react';
import { Text, TextInput, View, StyleSheet, ImageBackground } from 'react-native';
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
import WebViewMap from './components/WebViewMap';
import addressAutocomplete from './helper/addressAutocomplete';
import MapView from 'react-native-maps';
import  * as MapViewClass from './helper/MapViewClass';

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

function TestScreen() {
  const AA= new addressAutocomplete()
  const ControlPannel= new MapViewClass.MapControlPanel()

  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={text=>AA.Run(()=>{},text)}
        placeholder="Enter Address"/>

      <MapView {...a}>
        

      </MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },

})
