import { initializeApp, getApps, getApp, getFirestore } from 'firebase/app';

// Denne konfigurasjonen leser fra miljøvariabler
const firebaseConfig = {
   apiKey: "AIzaSyCO8gm2fO5mtTVnEPp4lhoQTFNRNf1mqPY",
  authDomain: "drink-app-ba155.firebaseapp.com",
  projectId: "drink-app-ba155",
  storageBucket: "drink-app-ba155.firebasestorage.app",
  messagingSenderId: "343885415965",
  appId: "1:343885415965:web:9190fa6786568d7795e8f4",
  measurementId: "G-9M1RLVSTW0"
};

let firestoreInstance;

const areVarsDefined = firebaseConfig.apiKey && firebaseConfig.projectId;

if (areVarsDefined) {
  // Initialiserer kun for web
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  firestoreInstance = getFirestore(app);
} else {
  // Gir en advarsel hvis nøklene mangler. Dette er nyttig for feilsøking.
  console.warn("Firebase web config is missing in environment variables. Web features may not work.");
}

// Eksporterer databasen for bruk i appen
export const db = firestoreInstance;
