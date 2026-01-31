// src/components/LoginModal.jsx
import React, { useState } from "react";
import "./Login.css";
import { useAuth } from "../context/AuthContext";

export default function LoginModal({ onClose }) {
  const { sendEmailLink } = useAuth();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendEmailLink(email, name);
      alert("Sign-in link sent to your email.");
      onClose();
    } catch (err) {
      alert("Failed to send sign-in link. Check console for details.");
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-card">
        <div className="login-close" onClick={onClose}>✕</div>
        <h2>Sign in</h2>
        <form onSubmit={handleSubmit}>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required />
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" required />
          <button type="submit">Send sign-in link</button>
        </form>
      </div>
    </div>
  );
}
