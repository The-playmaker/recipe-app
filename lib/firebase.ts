// Fil: lib/firebase.ts
import { initializeApp, getApp, getApps, FirebaseApp, FirebaseOptions } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth, browserLocalPersistence, initializeAuth, connectAuthEmulator } from 'firebase/auth'; // Added browserLocalPersistence, initializeAuth

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

console.log("LOG: lib/firebase.ts evaluating. API Key from env:", process.env.EXPO_PUBLIC_API_KEY ? "Exists" : "MISSING");

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error(
        "CRITICAL ERROR: Firebase config (API Key or Project ID) is missing from environment variables. " +
        "Firebase will not be initialized. Ensure EXPO_PUBLIC_API_KEY and EXPO_PUBLIC_PROJECT_ID are set."
    );
} else {
    try {
        if (!getApps().length) {
            app = initializeApp(firebaseConfig);
            console.log("LOG: Firebase app initialized for web.");
        } else {
            app = getApp(); // Get existing app
            console.log("LOG: Firebase app already initialized for web.");
        }

        // Ensure 'app' is valid before proceeding
        if (app!) {
            try {
                db = getFirestore(app);
                console.log("LOG: SUCCESS: Firestore for web initialized.");
            } catch (e: any) {
                console.error("LOG: FAILURE: Firestore for web could not be initialized.", e.message, e.stack);
            }

            try {
                // Using initializeAuth for explicit setup with persistence.
                // This is generally more robust for web.
                authInstance = initializeAuth(app, {
                    persistence: browserLocalPersistence
                    // No need for popupRedirectResolver unless using popups/redirects for sign-in
                });
                console.log("LOG: SUCCESS: Firebase Auth for web initialized (using initializeAuth).");

                // For debugging, you can check if you are using the emulator
                // if (process.env.NODE_ENV === 'development' && authInstance) {
                //    connectAuthEmulator(authInstance, "http://localhost:9099", { disableWarnings: true });
                //    console.log("LOG: Connected to Firebase Auth Emulator for web.");
                // }

            } catch (e: any) {
                console.error("LOG: FAILURE: Firebase Auth for web could not be initialized.", e.message, e.stack);
            }
        } else {
             console.error("LOG: Firebase app object ('app') is undefined or null after initialization attempts. Cannot initialize services.");
        }

    } catch (e: any) {
        console.error("LOG: CRITICAL ERROR during Firebase app initialization process for web:", e.message, e.stack);
    }
}

if (!db) {
    console.warn("LOG: Firestore instance (db) is null after initialization attempt.");
}
if (!authInstance) {
    console.warn("LOG: Auth instance (authInstance) is null after initialization attempt.");
}

export { app as firebaseApp, db, authInstance };
