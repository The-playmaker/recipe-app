// Fil: lib/firebase.native.ts
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

// It's generally good practice to ensure Firebase app is initialized,
// though @react-native-firebase often handles this if `google-services.json` (Android)
// or `GoogleService-Info.plist` (iOS) is correctly in place.
// import firebase from '@react-native-firebase/app'; // Not always needed to explicitly call initializeApp

let dbInstance: FirebaseFirestoreTypes.Module;

try {
  // You can add more specific configuration here if needed, but typically,
  // @react-native-firebase/app initializes the default app automatically.
  dbInstance = firestore();
  console.log("SUCCESS: @react-native-firebase/firestore initialized.");
} catch (error) {
  console.error("CRITICAL ERROR initializing @react-native-firebase/firestore:", error);
  // Fallback or error state. For a critical service like DB,
  // you might want to prevent app usage or alert the user.
  // For now, we'll assign null, but this should be handled gracefully in the app.
  dbInstance = null as any; // Cast to allow assignment, but this indicates a failure.
  console.error("FAILURE: db object for native could not be initialized. App might not work correctly.");
}

export const db = dbInstance;

// Initialize and export Firebase Auth
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

let authInstanceExport: FirebaseAuthTypes.Module;

try {
  authInstanceExport = auth();
  console.log("SUCCESS: @react-native-firebase/auth initialized.");
} catch (error) {
  console.error("CRITICAL ERROR initializing @react-native-firebase/auth:", error);
  authInstanceExport = null as any; // Cast to allow assignment, indicates failure.
  console.error("FAILURE: auth object for native could not be initialized. Authentication will not work.");
}

export const authInstance = authInstanceExport;


// You might also export other Firebase services if you use them:
// import functions from '@react-native-firebase/functions';
// export const functionsInstance = functions();
