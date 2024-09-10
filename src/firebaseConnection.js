import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, update } from 'firebase/database';
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

export const createGame = (gameId) => {
  const gameRef = ref(database, `games/${gameId}`);
  set(gameRef, {
    board: Array(9).fill(null),
    currentPlayer: 'X',
    gameStatus: '',
  });
};

export const joinGame = (gameId, playerId) => {
  const gameRef = ref(database, `games/${gameId}`);
  update(gameRef, { [playerId]: true });
};

export const updateGame = (gameId, gameData) => {
  const gameRef = ref(database, `games/${gameId}`);
  update(gameRef, gameData);
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
  set(lobbyRef, true);
};

export const removeLobbyGame = (gameId) => {
  const lobbyRef = ref(database, `lobby/${gameId}`);
  set(lobbyRef, null);
};