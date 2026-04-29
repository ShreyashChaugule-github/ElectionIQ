import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDJiStxcKJN-8JLFQ27r7asOb2lsfLFhnQ",
  authDomain: "pw-challenge-2-494710.firebaseapp.com",
  projectId: "pw-challenge-2-494710",
  storageBucket: "pw-challenge-2-494710.firebasestorage.app",
  messagingSenderId: "409093236435",
  appId: "1:409093236435:web:173c24589f95f1122ed626",
  measurementId: "G-39FYF7WENB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);

export default app;
