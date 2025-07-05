import { Platform } from 'react-native';
import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Henter konfigurasjonen fra miljøvariabler
const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_APP_ID,
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

// Sjekker at vi har nøklene vi trenger FØR vi prøver å koble til
if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    // Initialiserer Firebase appen. Sjekker om den allerede eksisterer for å unngå feil.
    if (!getApps().length) {
        app = initializeApp(firebaseConfig);
    } else {
        app = getApp();
    }

    // Initialiserer Auth og Firestore
    // For native (mobil), må vi spesifisere hvordan innloggingsstatus skal lagres
    if (Platform.OS === 'web') {
        auth = getAuth(app);
    } else {
        auth = initializeAuth(app, {
            persistence: getReactNativePersistence(AsyncStorage),
        });
    }
    
    db = getFirestore(app);
    
    console.log("SUCCESS: Firebase services initialized.");
} else {
    console.error("CRITICAL ERROR: Firebase config is missing from environment variables.");
}

// Eksporterer de initialiserte tjenestene
export { db, auth };
