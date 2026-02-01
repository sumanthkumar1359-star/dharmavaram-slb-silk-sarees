import React, { useState } from "react";
import "./LoginModal.css";
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from "firebase/auth";
import { auth } from "../firebase";

function LoginModal({ onClose }) {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const isValidPassword = (pwd) => {
    const hasDigit = /\d/;
    const hasSpecial = /[!@#$%^&*]/;
    return pwd.length >= 5 && hasDigit.test(pwd) && hasSpecial.test(pwd);
  };

  const handleSignup = async () => {
    setError("");
    setMessage("");

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    if (!email.includes("@gmail.com")) {
      setError("Email must be a valid @gmail.com address");
      return;
    }

    if (!isValidPassword(password)) {
      setError("Password must have 1 digit, 5 characters & 1 special character");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setMessage("Signup successful! You can now login.");
      setIsSignup(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogin = async () => {
    setError("");
    setMessage("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage("Login successful!");
      setTimeout(onClose, 1500);
    } catch (err) {
      setError("Email or password is incorrect");
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Enter your email first");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset link sent to your email.");
    } catch (err) {
      setError("Failed to send reset email");
    }
  };

  return (
    <div className="login-modal-overlay">
      <div className="login-modal">
        <h3>{isSignup ? "Create Account" : "Login"}</h3>

        {message && <p className="success-msg">{message}</p>}
        {error && <p className="error-msg">{error}</p>}

        {isSignup && (
          <>
            <label>Name</label>
            <input 
              type="text" 
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </>
        )}

        <label>Email</label>
        <input 
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input 
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {isSignup && (
          <p className="password-note">
            Password must have 1 digit, 5 characters & 1 special character.
          </p>
        )}

        {isSignup ? (
          <button className="primary-btn" onClick={handleSignup}>
            Sign Up
          </button>
        ) : (
          <button className="primary-btn" onClick={handleLogin}>
            Login
          </button>
        )}

        {!isSignup && (
          <button className="link-btn" onClick={handleForgotPassword}>
            Forgot Password?
          </button>
        )}

        <div className="toggle-auth">
          {isSignup ? (
            <p>
              Already have an account?{" "}
              <span onClick={() => setIsSignup(false)}>Login</span>
            </p>
          ) : (
            <p>
              New user?{" "}
              <span onClick={() => setIsSignup(true)}>Sign Up</span>
            </p>
          )}
        </div>

        <button className="cancel-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default LoginModal;
