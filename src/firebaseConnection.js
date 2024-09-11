import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, update, get } from 'firebase/database';
import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID,
  FIREBASE_DATABASE_URL
} from '@env';

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID,
  databaseURL: FIREBASE_DATABASE_URL
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export const createGame = async (gameId) => {
  const gameRef = ref(database, `games/${gameId}`);
  try {
    await set(gameRef, {
      players: {
        X: { joined: true },
        O: { joined: false }
      },
      moves: {},
      currentPlayer: 'X',
      gameStatus: 'waiting',
    });
    return { gameId, playerId: 'X' };
  } catch (error) {
    console.error("Error creating game:", error);
    throw error;
  }
};

export const joinGame = async (gameId, playerId) => {
  const gameRef = ref(database, `games/${gameId}`);
  try {
    const gameSnapshot = await get(gameRef);
    const gameData = gameSnapshot.val();

    if (!gameData) {
      throw new Error("Game not found");
    }

    if (gameData.players[playerId].joined) {
      throw new Error("Player slot already taken");
    }

    const updates = {
      [`players/${playerId}/joined`]: true,
      gameStatus: 'active'
    };

    await update(gameRef, updates);
    return { gameId, playerId };
  } catch (error) {
    console.error("Error joining game:", error);
    throw error;
  }
};

export const updateGame = (gameId, gameData) => {
  const gameRef = ref(database, `games/${gameId}`);
  return update(gameRef, gameData);
};

export const listenToGameChanges = (gameId, callback) => {
  const gameRef = ref(database, `games/${gameId}`);
  return onValue(gameRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      callback(data);
    }
  });
};

export const listenToLobby = (callback) => {
  const lobbyRef = ref(database, 'lobby');
  return onValue(lobbyRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      callback(Object.keys(data));
    } else {
      callback([]);
    }
  });
};

export const createLobbyGame = (gameId) => {
  const lobbyRef = ref(database, `lobby/${gameId}`);
  return set(lobbyRef, true);
};

export const removeLobbyGame = (gameId) => {
  const lobbyRef = ref(database, `lobby/${gameId}`);
  return set(lobbyRef, null);
};