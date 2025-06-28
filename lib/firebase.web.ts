// Fil: lib/firebase.web.ts
import { initializeApp, getApp, getApps, FirebaseOptions } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig: FirebaseOptions = {
    apiKey: process.env.EXPO_PUBLIC_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_APP_ID,
};

// En funksjon som initialiserer og returnerer databasen.
// Dette unngår timing-problemer med 'export'.
function initializeDb(): Firestore | null {
    try {
        if (firebaseConfig.apiKey && firebaseConfig.projectId) {
            const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
            return getFirestore(app);
        } else {
            console.error("CRITICAL ERROR: Firebase config is missing from environment variables.");
            return null;
        }
    } catch (error) {
        console.error("CRITICAL ERROR initializing Firebase:", error);
        return null;
    }
}

// Vi kaller funksjonen én gang og eksporterer resultatet.
const db = initializeDb();

// Gir en tydelig loggmelding om suksess eller fiasko.
if (db) {
    console.log("SUCCESS: Firebase for web initialized and ready.");
} else {
    console.error("FAILURE: Database object ('db') could not be initialized.");
}

export { db };
