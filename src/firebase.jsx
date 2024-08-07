import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAoB7jPca5UoD--vYdTE43HDZgqrwmDJBI",
  authDomain: "icecreamfactory-fbe1b.firebaseapp.com",
  projectId: "icecreamfactory-fbe1b",
  storageBucket: "icecreamfactory-fbe1b.appspot.com",
  messagingSenderId: "33392143586",
  appId: "1:33392143586:web:d8d0bec618cd4c377602bb",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
