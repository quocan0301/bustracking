import * as React from 'react';
import { WebView } from 'react-native-webview';
import { NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  ImageBackground,
  Button,
  Alert,
  TouchableOpacity,
  Icon,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  useWindowDimensions,
} from 'react-native';
// import MapView from 'react-native-maps';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import Constants from 'expo-constants';
import BottomDrawer from 'react-native-bottom-drawer-view';

// or any pure javascript modules available in npm
import { Card } from 'react-native-paper';
//import image from '../assets/bus-move.gif';
import image from '../assets/bus.jpg';
import Footer from '../components/Footer';
import CustomListItem from '../components/CustomListItem';

const Stack = createNativeStackNavigator();

const html=`<!DOCTYPE html>
<html>
<head>
    <title>Leaflet Map</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet-routing-machine/dist/leaflet-routing-machine.css" />
    <script src="https://cdn.jsdelivr.net/npm/leaflet-routing-machine/dist/leaflet-routing-machine.js"></script>
</head>
<body>
    <div id="map" style="height: 90vh;">
    </div>

    <script>
        var map = L.map('map').setView([10.8231, 106.6297], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            tileSize: 512,
            zoomOffset: -1,
        }).addTo(map);
        var routingControl;
        var marker;
        document.getElementById('search-button').addEventListener('click', function() {
            var address = document.getElementById('search-input').value;
            if (address != '') {
                fetch('https://nominatim.openstreetmap.org/search.php?q=' + address + '&format=json')
                .then(response => response.json())
                .then(data => {
                    var lat = parseFloat(data[0].lat);
                    var lon = parseFloat(data[0].lon);
                    var coordinates = [lat, lon];
                    if (marker) {
                        marker.setLatLng(coordinates);
                    } else {
                        marker = L.marker(coordinates).addTo(map)}})}});
    document.getElementById('routing-form').addEventListener('submit', function(event) {
      event.preventDefault();
      var destination = document.getElementById('destination-input').value;
      if (destination != '') {
        fetch('https://nominatim.openstreetmap.org/search.php?q=' + destination + '&format=json')
        .then(response => response.json())
        .then(data => {
          var lat = parseFloat(data[0].lat);
          var lon = parseFloat(data[0].lon);
          var coordinates = [lat, lon];
          if (routingControl) {
            routingControl.setWaypoints([marker.getLatLng(), coordinates]);
          } else {
            routingControl = L.Routing.control({
              waypoints: [marker.getLatLng(), coordinates],
              router: L.Routing.osrmv1({
                serviceUrl: 'https://router.project-osrm.org/route/v1'
              })
            }).addTo(map);
          }
        })
        .catch(error => console.error(error));
      }
    });
    </script>
</body>
</html>`;

const places = [
  { key: 'Accra' },
  { key: 'Kumasi' },
  { key: 'Takoradi' },
  { key: 'Tamale' },
  { key: 'Techiman' },
  { key: 'Sunyani' },
  { key: 'Wa' },
  { key: 'Ho' },
  { key: 'Cape Coast' },
];

export default function Destination({ navigation }) {
  const [queryData, setqueryData] = React.useState({
    departure: '',
    destination: '',
  });
  const [locResults, setLocResults] = React.useState([]);
  const [isBottomNavShowing, setIsBottomNavShowing] = React.useState(false);
  const [bottomNavProps, setBottomNavProps] = React.useState({
    color: 'orange',
    placeholder: 'placeholder',
    type: 'departure',
  });

  React.useEffect(() => {
    //console.log(queryData);
    //console.log('Location List:', locResults);
    //console.log('Bottom Props', bottomNavProps);
  }, [queryData, locResults, bottomNavProps]);

  const liveSearch = (value, type) => {
    if (type === 'departure') {
      setqueryData({ ...queryData, departure: value.nativeEvent.text });
    } else {
      setqueryData({
        ...queryData,
        destination: value.nativeEvent.text,
      });
    }

    let res = places.filter((place) =>
      place.key.toLowerCase().includes((value.nativeEvent.text).toLowerCase())
    );

    setLocResults(res);
  };

  const renderContent = ({ bottomNavProps }) => {
    //console.log('departure')
    return (
      <View style={{ padding: 0 }}>
        <View
          style={{
            height: 60,
            backgroundColor: bottomNavProps.color,
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
            placeholder={bottomNavProps.placeholder}
            keyboardType="text"
            clearButtonMode={true}
            contextMenuHidden
            onChange={(value) => liveSearch(value, bottomNavProps.type)}
            value={
              bottomNavProps.type === 'destination'
                ? queryData.destination
                : queryData.departure
            }
          />
        </View>

        <FlatList
          data={locResults}
          renderItem={({ item }) => (
            <CustomListItem
              itemName={item.key}
              setIsBottomNavShowing={setIsBottomNavShowing}
              setqueryData = {setqueryData}
            />
          )}
        />
      </View>
    );
  };

  const setUpDesination = () => {
    setIsBottomNavShowing(true);
    setBottomNavProps({
      color: '#1c458a',
      placeholder: 'Đi từ',
      type: 'destination',
    });
  };

  const setUpDeparture = () => {
    setIsBottomNavShowing(true);
    setBottomNavProps({
      color: '#8cd9e3',
      placeholder: 'Đến',
      type: 'departure',
    });
  };

  return (
    <View style={(styles.container)}>
      <View style={styles.body}>
        <View style={styles.header}>
          <Text style={{ fontSize: 24, color: 'white'}}>Tìm đường</Text>
        </View>
        <View style={styles.inputSection}>
          <FontAwesome
            style={styles.inputIcon}
            name="map-marker"
            size={20}
            color="red"
          />
          <TextInput
            style={styles.input}
            placeholder="Đi từ"
            keyboardType="text"
            clearButtonMode={true}
            contextMenuHidden
            // onFocus={setUpDeparture}
            // onChange={(value) =>
            //   setqueryData({ ...queryData, departure: value.nativeEvent.text })
            // }
            value={queryData.departure}
          />
        </View>

        <View style={styles.inputSection}>
          <FontAwesome
            style={styles.inputIcon}
            name="map-marker"
            size={20}
            color="red"
          />
          <TextInput
            style={styles.input}
            clearButtonMode={true}
            placeholder="Đến"
            keyboardType="text"
            // onFocus={setUpDesination}
            // onChange={(value) =>
            //   setqueryData({
            //     ...queryData,
            //     destination: value.nativeEvent.text,
            //   })
            // }
            value={queryData.destination}
          />
        </View>

        <View style={styles.mapSection}>
          {<WebView
            source={{html: html }}
          />}
        </View>

        <View style={styles.tourSection}>
          <Text style={{ textAlign: 'center', paddingBottom: 5, fontSize: 15, color: '#0C4B8E', borderBottomWidth: 1}}>Cách di chuyển phù hợp</Text>
          <View style={styles.tourcomponent}>
            <View style={styles.left}>
              <View style={styles.inrow}>
                <View style={[styles.busstat, {backgroundColor: '#DF2E38'}]}>{
                  <Text style={{ fontSize: 15, color: 'white', fontWeight: 'bold' }}>10</Text>
                }
                </View>
                <FontAwesome
                style={{marginTop: 10, height: 35}}
                name="chevron-right"
                size={12}
                color="gray"
                />
                <View style={[styles.busstat, {backgroundColor: '#183A1D'}]}>{
                  <Text style={{ fontSize: 15, color: 'white', fontWeight: 'bold' }}>27</Text>
                }
                </View>
                <FontAwesome
                style={{marginTop: 10, height: 35}}
                name="chevron-right"
                size={12}
                color="gray"
                />
                <View style={[styles.busstat, {backgroundColor: '#0E8388'}]}>{
                  <Text style={{ fontSize: 15, color: 'white', fontWeight: 'bold' }}>15</Text>
                }
                </View>
              </View>
              <View style={[styles.inrow, {marginLeft: 5}]}>
                <Ionicons
                    
                    name="walk"
                    size={14}
                    color= 'gray'
                />
                <Text style={{fontSize: 12}}>1.4km {"\t"} </Text>
                
                <Ionicons
                    
                    name="bus"
                    size={14}
                    color= 'gray'
                />
                <Text style={{fontSize: 12}}>12km</Text>
              </View>
              
              <View style={[styles.inrow, {marginTop: 10, marginLeft: 5}]}>
                <FontAwesome
                  name="sign-in"
                  size={14}
                  color="#F28739"
                />
                <Text style={{ marginLeft: 5, fontSize: 12}}>Xe tới trong 5 phút tại trạm <Text style={{ color: 'gray', fontWeight: 'bold' }}>Bưu điện Quận 7</Text></Text>
              </View>
            </View>
            <View style={styles.right}>
              <View style={[styles.inrow, {marginTop: 10}]}>
                <Text style={{fontSize: 15, textAlign:'center', color: '#7A7EEF', fontWeight: 'bold'}}>25 phút {"\t"} </Text>
              </View>
              <View style={[styles.inrow, {marginTop: 10}]}>
                <TouchableOpacity
                  style={styles.searchButton}
                  onPress={() =>
                    navigation.navigate('Tickets', {
                      travelFrom: queryData.departure,
                      travelTo: queryData.destination,
                    })
                  }>
                  <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold'}}>Search</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.tourcomponent}>
            <View style={styles.left}>
              <View style={styles.inrow}>
                <View style={[styles.busstat, {backgroundColor: '#DF2E38'}]}>{
                  <Text style={{ fontSize: 15, color: 'white', fontWeight: 'bold' }}>10</Text>
                }
                </View>
                <FontAwesome
                style={{marginTop: 10, height: 35}}
                name="chevron-right"
                size={12}
                color="gray"
                />
                <View style={[styles.busstat, {backgroundColor: '#0E8388'}]}>{
                  <Text style={{ fontSize: 15, color: 'white', fontWeight: 'bold' }}>15</Text>
                }
                </View>
              </View>
              <View style={[styles.inrow, {marginLeft: 5}]}>
                <Ionicons
                    
                    name="walk"
                    size={14}
                    color= 'gray'
                />
                <Text style={{fontSize: 12}}>1.4km {"\t"} </Text>
                
                <Ionicons
                    
                    name="bus"
                    size={14}
                    color= 'gray'
                />
                <Text style={{fontSize: 12}}>12km</Text>
              </View>
              
              <View style={[styles.inrow, {marginTop: 10, marginLeft: 5}]}>
                <FontAwesome
                  name="sign-in"
                  size={14}
                  color="#F28739"
                />
                <Text style={{ marginLeft: 5, fontSize: 12}}>Xe tới trong 3 phút tại trạm <Text style={{ color: 'gray', fontWeight: 'bold' }}>Bưu điện Quận 7</Text></Text>
              </View>
            </View>
            <View style={styles.right}>
              <View style={[styles.inrow, {marginTop: 10}]}>
                <Text style={{fontSize: 15, textAlign:'center', color: '#7A7EEF', fontWeight: 'bold'}}>21 phút {"\t"} </Text>
              </View>
              <View style={[styles.inrow, {marginTop: 10}]}>
                <TouchableOpacity
                  style={styles.searchButton}
                  onPress={() =>
                    navigation.navigate('Tickets', {
                      travelFrom: queryData.departure,
                      travelTo: queryData.destination,
                    })
                  }>
                  <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold'}}>Search</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.tourcomponent}>
            <View style={styles.left}>
              <View style={styles.inrow}>
                <View style={[styles.busstat, {backgroundColor: '#DF2E38'}]}>{
                  <Text style={{ fontSize: 15, color: 'white', fontWeight: 'bold' }}>10</Text>
                }
                </View>
                <FontAwesome
                style={{marginTop: 10, height: 35}}
                name="chevron-right"
                size={12}
                color="gray"
                />
                <View style={[styles.busstat, {backgroundColor: '#FFB84C'}]}>{
                  <Text style={{ fontSize: 15, color: 'white', fontWeight: 'bold' }}>28</Text>
                }
                </View>
              </View>
              <View style={[styles.inrow, {marginLeft: 5}]}>
                <Ionicons
                    
                    name="walk"
                    size={14}
                    color= 'gray'
                />
                <Text style={{fontSize: 12}}>1.4km {"\t"} </Text>
                
                <Ionicons
                    
                    name="bus"
                    size={14}
                    color= 'gray'
                />
                <Text style={{fontSize: 12}}>12km</Text>
              </View>
              
              <View style={[styles.inrow, {marginTop: 10, marginLeft: 5}]}>
                <FontAwesome
                  name="sign-in"
                  size={14}
                  color="#F28739"
                />
                <Text style={{ marginLeft: 5, fontSize: 12}}>Xe tới trong {"<"} 1 phút tại trạm <Text style={{ color: 'gray', fontWeight: 'bold' }}>Lý Thường Kiệt</Text></Text>
              </View>
            </View>
            <View style={styles.right}>
              <View style={[styles.inrow, {marginTop: 10}]}>
                <Text style={{fontSize: 15, textAlign:'center', color: '#7A7EEF', fontWeight: 'bold'}}>28 phút {"\t"} </Text>
              </View>
              <View style={[styles.inrow, {marginTop: 10}]}>
                <TouchableOpacity
                  style={styles.searchButton}
                  onPress={() =>
                    navigation.navigate('Tickets', {
                      travelFrom: queryData.departure,
                      travelTo: queryData.destination,
                    })
                  }>
                  <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold'}}>Search</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Footer navigation={navigation} />
      </View>

      {isBottomNavShowing ? (
        <BottomDrawer
          backgroundColor={'#f4f6f8'}
          containerHeight={550}
          offset={0}
          roundedEdges={true}
          shadow={true}
          onCollapsed={() => console.log('collapsed')}
          onExpanded={() => console.log('expanded')}>
          {renderContent({ bottomNavProps })}
        </BottomDrawer>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#0093E9',
  },
  body: {
    height: '93%',
    backgroundColor: '#0093E9',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  footer: {
    height: '7%',
  },
  input: {
    flex: 1,
    height: 30,
    backgroundColor: 'white',
    paddingTop: 5,
    paddingRight: 5,
    paddingBottom: 5,
    paddingLeft: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    height: 30,
  },
  inputSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 10,
    height: 30,
    borderRadius: 10,
  },
  mapSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 10,
    height: 160,
    borderRadius: 10,
  },
  tourSection: {
    flexDirection: 'row',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
    marginBottom: 10,
    height: 320,
    borderRadius: 10,
  },
  tourcomponent: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    height: 40,
    borderRadius: 10,
    borderBottomWidth: 1,
    borderColor: 'gray',
  },
  inrow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
  },

  left: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    height: 40,
    width: '75%',
  },
  
  right: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    height: 40,
    width: '25%',
  },
  busstat: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 25,
    width: 35,
    borderRadius: 5,
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5,
  },
  inputIcon: {
    padding: 10,
    height: 40,
  },
  searchButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0C4B8E',
    height: 30,
    width: 60,
    borderRadius: 10,
  },
});
