import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// CRITICAL: Add your Firebase config here before building APK
// Get these values from: https://console.firebase.google.com/
// Project Settings > General > Your apps > Web app
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyDummy-Key-Replace-Before-Build",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "finansim-app.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "finansim-app",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "finansim-app.appspot.com",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:123456789:android:abc123"
};

// Validate Firebase config to prevent crashes
const isValidConfig = firebaseConfig.apiKey && !firebaseConfig.apiKey.includes('Dummy');

let app, auth, db;

if (isValidConfig) {
  try {
    app = initializeApp(firebaseConfig);
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
    db = getFirestore(app);
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
} else {
  console.warn('⚠️ Firebase not configured. Auth features will be disabled.');
  // Create mock auth and db to prevent crashes
  auth = {
    currentUser: null,
    onAuthStateChanged: (callback) => {
      callback(null);
      return () => { };
    }
  };
  db = {};
}

export { auth, db };
