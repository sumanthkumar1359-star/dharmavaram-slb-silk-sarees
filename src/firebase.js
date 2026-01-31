// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJu4GVP0k6vtdgZ1q0SBYdeBl9zLLJH_s",
  authDomain: "slb-silk-saree-reviews.firebaseapp.com",
  projectId: "slb-silk-saree-reviews",
  storageBucket: "slb-silk-saree-reviews.firebasestorage.app",
  messagingSenderId: "843219327396",
  appId: "1:843219327396:web:ab200abd6de241a6574931",
  measurementId: "G-P96XXR6708"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Analytics (optional – safe to keep)
const analytics = getAnalytics(app);

// ✅ Firestore database instance
export const db = getFirestore(app);

// (optional export if needed later)
export { app, analytics };
