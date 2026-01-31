// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  sendSignInLinkToEmail,
  signInWithEmailLink,
  isSignInWithEmailLink,
  onAuthStateChanged
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const ref = doc(db, "users", firebaseUser.uid);
          const snap = await getDoc(ref);
          setUser({ uid: firebaseUser.uid, ...(snap.exists() ? snap.data() : {}) });
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("onAuthStateChanged handler error:", err);
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const sendEmailLink = async (email, name) => {
    try {
      const actionCodeSettings = {
        url: window.location.origin,
        handleCodeInApp: true
      };

      await sendSignInLinkToEmail(auth, email, actionCodeSettings);

      localStorage.setItem("emailForSignIn", email);
      localStorage.setItem("nameForSignIn", name);
    } catch (err) {
      console.error("sendEmailLink failed:", err);
      throw err;
    }
  };

  const completeSignIn = async () => {
    try {
      if (!isSignInWithEmailLink(auth, window.location.href)) return;

      const email = localStorage.getItem("emailForSignIn");
      const name = localStorage.getItem("nameForSignIn");

      if (!email) {
        // Email missing from localStorage — you may want to prompt the user to enter it
        console.warn("No email found in localStorage for sign-in link.");
        return;
      }

      const result = await signInWithEmailLink(auth, email, window.location.href);

      await setDoc(
        doc(db, "users", result.user.uid),
        { name, email },
        { merge: true }
      );

      localStorage.removeItem("emailForSignIn");
      localStorage.removeItem("nameForSignIn");
    } catch (err) {
      console.error("completeSignIn failed:", err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, sendEmailLink, completeSignIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
