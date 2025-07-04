// Fil: lib/firebase.ts (Previously firebase.web.ts)
import { initializeApp, getApp, getApps, FirebaseApp, FirebaseOptions } from 'firebase/app';
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

let app: FirebaseApp;
let db: Firestore | null = null;
let authInstance: Auth | null = null;

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error(
        "CRITICAL ERROR: Firebase config (API Key or Project ID) is missing from environment variables. " +
        "Firebase will not be initialized. Ensure EXPO_PUBLIC_API_KEY and EXPO_PUBLIC_PROJECT_ID are set."
    );
} else {
    try {
        if (!getApps().length) {
            app = initializeApp(firebaseConfig);
            console.log("Firebase app initialized for web.");
        } else {
            app = getApp();
            console.log("Firebase app already initialized for web.");
        }

        try {
            db = getFirestore(app);
            console.log("SUCCESS: Firestore for web initialized.");
        } catch (e) {
            console.error("FAILURE: Firestore for web could not be initialized.", e);
        }

        try {
            authInstance = getAuth(app);
            console.log("SUCCESS: Firebase Auth for web initialized.");
        } catch (e) {
            console.error("FAILURE: Firebase Auth for web could not be initialized.", e);
        }

    } catch (error) {
        console.error("CRITICAL ERROR initializing Firebase app for web:", error);
    }
}

export { db, authInstance };
