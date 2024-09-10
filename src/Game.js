import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { updateGame, listenToGameChanges } from './firebaseConnection';

export default function Game({ route }) {
  const { gameId, playerId } = route.params;
  const [board, setBoard] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [gameStatus, setGameStatus] = useState('');

  useEffect(() => {
    const unsubscribe = listenToGameChanges(gameId, (gameData) => {
      setBoard(gameData.board);
      setCurrentPlayer(gameData.currentPlayer);
      setGameStatus(gameData.gameStatus);
    });

    return () => unsubscribe();
  }, [gameId]);

  const handleClick = (index) => {
    if (!board || gameStatus !== '' || board[index] !== null || currentPlayer !== playerId) return;

    const newBoard = [...board];
    newBoard[index] = playerId;

    updateGame(gameId, {
      board: newBoard,
      currentPlayer: playerId === 'X' ? 'O' : 'X',
    });
  };

  const renderCell = (index) => (
    <TouchableOpacity
      key={index}
      style={styles.cell}
      onPress={() => handleClick(index)}
    >
      <Text style={styles.cellText}>{board[index]}</Text>
    </TouchableOpacity>
  );

  if (!board) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading game...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.status}>{gameStatus || `Player ${currentPlayer}'s turn`}</Text>
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