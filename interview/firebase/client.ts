import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCnrmU8-iR2FOokj0c1QQiQw_IkCPI2rKc",
  authDomain: "prepinterview-73ac9.firebaseapp.com",
  projectId: "prepinterview-73ac9",
  storageBucket: "prepinterview-73ac9.firebasestorage.app",
  messagingSenderId: "272739436901",
  appId: "1:272739436901:web:7d29731d3a5e790891b98c",
  measurementId: "G-MREF6QF64S"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
