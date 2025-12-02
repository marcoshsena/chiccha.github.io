// Import SDK via CDN (não precisa de import ES6 com servidor)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, addDoc } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Configuração do seu projeto
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
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
