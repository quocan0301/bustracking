import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Tickets from '../Layout/Tickets';
import History from '../Layout/History';
import Destination from '../Layout/Destination';

const Stack = createNativeStackNavigator();

export default function ScreensController() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Destination"
          component={Destination}
          options={{ title: 'Destination', headerShown:false }}
        />
        <Stack.Screen
          name="Tickets"
          component={Tickets}
          options={{ title: 'Search Results', headerShown: false }}
        />
         <Stack.Screen
          name="History"
          component={History}
          options={{ title: 'Purchased Tickets', headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
