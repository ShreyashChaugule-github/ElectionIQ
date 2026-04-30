import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "pw-challenge-2-494710.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "pw-challenge-2-494710",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "pw-challenge-2-494710.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "409093236435",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:409093236435:web:173c24589f95f1122ed626",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-39FYF7WENB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);

export default app;
