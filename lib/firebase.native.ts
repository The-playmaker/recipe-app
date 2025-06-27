// Denne filen er kun for Android og iOS.
// Den vil ikke bli inkludert i web-bygget.

// For at denne skal fungere, må pakkene være installert.
// Kjør: npm install @react-native-firebase/app @react-native-firebase/firestore

// KORRIGERT: Koden er nå aktivert igjen for native.
import firestore from '@react-native-firebase/firestore';

// For native, initialiseres Firebase automatisk via google-services.json.
const firestoreInstance = firestore();

// Eksporterer den ekte database-instansen for mobil.
export const db = firestoreInstance;
