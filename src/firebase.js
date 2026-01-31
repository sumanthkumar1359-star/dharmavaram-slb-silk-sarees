// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBJu4GVP0k6vtdgZ1q0SBYdeBl9zLLJH_s",
  authDomain: "slb-silk-saree-reviews.firebaseapp.com",
  projectId: "slb-silk-saree-reviews",
  storageBucket: "slb-silk-saree-reviews.appspot.com",
  messagingSenderId: "843219327396",
  appId: "1:843219327396:web:ab200abd6de241a6574931",
  measurementId: "G-P96XXR6708"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
