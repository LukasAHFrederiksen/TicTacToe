import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { createGame, joinGame, listenToLobby, createLobbyGame, removeLobbyGame } from './firebaseConnection';

export default function Lobby({ navigation }) {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const unsubscribe = listenToLobby((lobbyGames) => {
      setGames(lobbyGames);
    });

    return () => unsubscribe();
  }, []);

  const handleCreateGame = async () => {
    try {
      const gameId = Math.random().toString(36).substr(2, 9);
      const { gameId: createdGameId, playerId } = await createGame(gameId);
      await createLobbyGame(createdGameId);
      navigation.navigate('Game', { gameId: createdGameId, playerId });
    } catch (error) {
      console.error("Failed to create game:", error);
      Alert.alert("Error", "Failed to create game. Please try again.");
    }
  };

  const handleJoinGame = async (gameId) => {
    try {
      const { gameId: joinedGameId, playerId } = await joinGame(gameId, 'O');
      await removeLobbyGame(joinedGameId);
      navigation.navigate('Game', { gameId: joinedGameId, playerId });
    } catch (error) {
      console.error("Failed to join game:", error);
      Alert.alert("Error", "Failed to join game. Please try again.");
    }
  };

  const renderGame = ({ item }) => (
    <TouchableOpacity style={styles.gameItem} onPress={() => handleJoinGame(item)}>
      <Text>Join Game: {item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.createButton} onPress={handleCreateGame}>
        <Text style={styles.buttonText}>Create New Game</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Available Games:</Text>
      <FlatList
        data={games}
        renderItem={renderGame}
        keyExtractor={(item) => item}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  createButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  gameItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});