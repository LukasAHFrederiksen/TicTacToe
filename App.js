import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Lobby from './src/Lobby';
import Game from './src/Game';

const Stack = createStackNavigator();

export default function App() {
  return (
      <Stack.Navigator>
        <Stack.Screen name="Lobby" component={Lobby} />
        <Stack.Screen name="Game" component={Game} />
      </Stack.Navigator>
  );
}