// js/firebase.js
// SDK via CDN (ES modules)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDw1C5HUtpHXD6Q-xdmV2lwvvEVcndLD4w",
  authDomain: "chiccha-a1c87.firebaseapp.com",
  projectId: "chiccha-a1c87",
  storageBucket: "chiccha-a1c87.firebasestorage.app",
  messagingSenderId: "436135108948",
  appId: "1:436135108948:web:634fd059e999b6c9e128c1",
  measurementId: "G-C01WMT2WQ2"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const onAuthStateChanged = onAuthStateChanged
