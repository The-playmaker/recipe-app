// Fil: lib/firebase.web.ts
import { initializeApp, getApps, getApp, getFirestore } from 'firebase/app';

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
if (firebaseConfig.apiKey) {
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  firestoreInstance = getFirestore(app);
} else {
  console.warn("Firebase web config missing.");
}
export const db = firestoreInstance;