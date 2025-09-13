// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAgpqWtmTtTPHa1OdZA6h-ZxPWgfv4dww4",
  authDomain: "quiz-f322b.firebaseapp.com",
  projectId: "quiz-f322b",
  storageBucket: "quiz-f322b.firebasestorage.app",
  messagingSenderId: "392809464942",
  appId: "1:392809464942:web:bcf6003562ab57e58fd27f",
  measurementId: "G-622NH9XDCR"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };
