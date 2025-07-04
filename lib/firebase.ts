// Fil: lib/firebase.ts (Previously firebase.web.ts)
import { initializeApp, getApp, getApps, FirebaseOptions } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth'; // Import Firebase Auth for web

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
let authInstance: Auth | null = null;

try {
    if (firebaseConfig.apiKey && firebaseConfig.projectId) {
        const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
        authInstance = getAuth(app);
    } else {
        // Error already logged by initializeDb for missing config
    }
} catch (error) {
    console.error("CRITICAL ERROR initializing Firebase Auth for web:", error);
}


// Gir en tydelig loggmelding om suksess eller fiasko.
if (db) {
    console.log("SUCCESS: Firestore for web initialized and ready.");
} else {
    console.error("FAILURE: Firestore object ('db') for web could not be initialized.");
}

if (authInstance) {
    console.log("SUCCESS: Firebase Auth for web initialized and ready.");
} else {
    console.error("FAILURE: Firebase Auth object ('authInstance') for web could not be initialized.");
}

export { db, authInstance };
