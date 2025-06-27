import { Platform } from 'react-native';

let firestoreInstance;

if (Platform.OS === 'web') {
  // --- Web-spesifikk kode ---
  const { initializeApp, getApps, getApp } = require('firebase/app');
  const { getFirestore } = require('firebase/firestore');

  // Kopier din firebaseConfig inn her fra Firebase Console
  const firebaseConfig = {
  apiKey: "AIzaSyCO8gm2fO5mtTVnEPp4lhoQTFNRNf1mqPY",
  authDomain: "drink-app-ba155.firebaseapp.com",
  projectId: "drink-app-ba155",
  storageBucket: "drink-app-ba155.firebasestorage.app",
  messagingSenderId: "343885415965",
  appId: "1:343885415965:web:9190fa6786568d7795e8f4",
  measurementId: "G-9M1RLVSTW0"
};

  // Sjekk om appen allerede er initialisert for å unngå feil ved re-load
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  firestoreInstance = getFirestore(app);

} else {
  // --- Native-spesifikk kode (Android/iOS) ---
  const { default: firestore } = require('@react-native-firebase/firestore');
  firestoreInstance = firestore();
}

// Eksporter den riktige instansen som vi kan bruke i hele appen
export const db = firestoreInstance;
