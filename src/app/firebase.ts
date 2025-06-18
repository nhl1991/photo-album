
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDFZ_1A_G4R6IjolqGwB39R2ub-7Q9sFU0",
  authDomain: "photo-album-by-next-js.firebaseapp.com",
  projectId: "photo-album-by-next-js",
  storageBucket: "photo-album-by-next-js.firebasestorage.app",
  messagingSenderId: "812743555913",
  appId: "1:812743555913:web:803e3dfb8da067b426f898",
  measurementId: "G-NWTN50XG64"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);
