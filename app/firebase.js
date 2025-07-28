import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore, collection, query, orderBy, onSnapshot, where, Timestamp, doc, getDoc, getDocs, setDoc, limit, startAfter, writeBatch, deleteField, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCjZmvq16kBPs_xhlJp5FkiCzw42WhX5fM",
    authDomain: "kkgs-32.firebaseapp.com",
    databaseURL: "https://kkgs-32-default-rtdb.firebaseio.com",
    projectId: "kkgs-32",
    storageBucket: "kkgs-32.firebasestorage.app",
    messagingSenderId: "76744845820",
    appId: "1:76744845820:web:49f9e109c5b2776ac4ea79",
    measurementId: "G-5QYCPL520X"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);

export {
  app, db, auth,
  collection, query, orderBy, onSnapshot, where, Timestamp, doc, getDoc, getDocs, setDoc, limit, startAfter, writeBatch, deleteField, updateDoc, deleteDoc,
  onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail
};