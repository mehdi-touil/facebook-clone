// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyC6lTy6tusOfQ0JlZEe18spleBbVn2BuV8",
  authDomain: "facebook-colne-ba0d9.firebaseapp.com",
  projectId: "facebook-colne-ba0d9",
  storageBucket: "facebook-colne-ba0d9.appspot.com",
  messagingSenderId: "700117068379",
  appId: "1:700117068379:web:b8dcc3ee4e1402d9a8ad7e",
  measurementId: "G-39036YZVMQ",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);
