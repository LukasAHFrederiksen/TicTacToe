import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { updateGame, listenToGameChanges } from './firebaseConnection';

export default function Game({ route }) {
  const { gameId, playerId } = route.params;
  const [game, setGame] = useState(null);

  useEffect(() => {
    const unsubscribe = listenToGameChanges(gameId, (gameData) => {
      console.log('Game data received:', gameData);
      setGame(gameData);
    });

    return () => unsubscribe();
  }, [gameId]);

  const handleClick = (index) => {
    if (!game) {
      console.log('Game is null, cannot make a move');
      return;
    }
    if (game.gameStatus !== 'active') {
      console.log('Game is not active, cannot make a move');
      return;
    }
    if (game.moves && game.moves[index]) {
      console.log('Cell already occupied');
      return;
    }
    if (game.currentPlayer !== playerId) {
      console.log('Not your turn');
      return;
    }

    const newMoves = { ...(game.moves || {}), [index]: playerId };

    updateGame(gameId, {
      moves: newMoves,
      currentPlayer: playerId === 'X' ? 'O' : 'X',
    });
  };

  const renderCell = (index) => {
    const cellValue = game && game.moves ? game.moves[index] : null;
    return (
      <TouchableOpacity
        key={index}
        style={styles.cell}
        onPress={() => handleClick(index)}
      >
        <Text style={styles.cellText}>{cellValue}</Text>
      </TouchableOpacity>
    );
  };

  if (!game) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading game...</Text>
      </View>
    );
  }

  console.log('Current game state:', game);

  if (game.gameStatus === 'waiting') {
    return (
      <View style={styles.container}>
        <Text>Waiting for other player to join...</Text>
      </View>
    );
  }

  const board = Array(9).fill(null);

  return (
    <View style={styles.container}>
      <Text style={styles.status}>
        {game.gameStatus === 'active'
          ? `Player ${game.currentPlayer}'s turn`
          : `Game Over: ${game.gameStatus}`}
      </Text>
      <View style={styles.board}>
        {board.map((_, index) => renderCell(index))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  status: {
    fontSize: 24,
    marginBottom: 20,
  },
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 300,
    height: 300,
  },
  cell: {
    width: 100,
    height: 100,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellText: {
    fontSize: 48,
  },
});