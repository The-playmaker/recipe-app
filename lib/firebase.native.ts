// Denne filen er kun for Android og iOS.
// Den vil ikke bli inkludert i web-bygget.

// For å få denne til å fungere igjen senere, må du kjøre:
// npm install @react-native-firebase/app @react-native-firebase/firestore

import firestore from '@react-native-firebase/firestore';

// For native, initialiseres Firebase automatisk via google-services.json.
const firestoreInstance = firestore();

export const db = firestoreInstance;
