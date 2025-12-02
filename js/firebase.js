// Import SDK via CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

import {
  initializeFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDw1C5HUtpHXD6Q-xdmV2lwvvEVcndLD4w",
  authDomain: "chiccha-a1c87.firebaseapp.com",
  projectId: "chiccha-a1c87",
  storageBucket: "chiccha-a1c87.firebasestorage.app",
  messagingSenderId: "436135108948",
  appId: "1:436135108948:web:634fd059e999b6c9e128c1",
  measurementId: "G-C01WMT2WQ2"
};

// Inicializa Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// 🔥 FIRESTORE USANDO DATABASE PERSONALIZADO
export const db = initializeFirestore(app, {
  databaseId: "chiccha"
});

// REEXPORTA TUDO
export {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy
};
