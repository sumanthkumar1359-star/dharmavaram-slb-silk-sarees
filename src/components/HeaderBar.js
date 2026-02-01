import React, { useState } from "react";
import { auth } from "../firebase";
import "./HeaderBar.css";

function HeaderBar({ user, onLoginClick, onCartClick }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSideMenu, setShowSideMenu] = useState(false);

  return (
    <>
      {/* Top Header Bar */}
      <div className="top-auth-bar fade-in">
        <div className="top-left">
          <div
            className="hamburger-wrapper"
            onClick={() => setShowSideMenu(true)}
          >
            &#9776;
          </div>
        </div>

        <div className="top-center">
          <h2 className="brand-logo">Dharmavaram</h2>
          <h2 className="brand-logo">SLB Silk Sarees</h2>
        </div>

        <div className="top-right">
          {!user ? (
            <button className="login-btn" onClick={onLoginClick}>
              Login / Sign Up
            </button>
          ) : (
            <button className="logout-btn" onClick={() => auth.signOut()}>
              Logout
            </button>
          )}

          <div className="icon-wrapper" onClick={onCartClick}>
            🛒
          </div>

          {user && (
            <div
              className="user-wrapper"
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <div className="icon-wrapper">👤</div>
              <span className="welcome-text">Welcome, {user.email}</span>

              {showDropdown && (
                <div className="user-dropdown">
                  <p onClick={() => setShowProfileModal(true)}>My Profile</p>
                  <p>My Orders</p>
                  <p onClick={() => auth.signOut()}>Logout</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Side Sliding Menu */}
      <div
        className={`side-menu ${showSideMenu ? "open" : ""}`}
        onClick={() => setShowSideMenu(false)}
      >
        <div
          className="side-menu-content"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ✅ CLOSE ICON (NEW) */}
          <div
            style={{
              textAlign: "right",
              fontSize: "22px",
              cursor: "pointer",
              marginBottom: "10px",
            }}
            onClick={() => setShowSideMenu(false)}
          >
            ✖
          </div>

          <h3 className="menu-section">Account</h3>
          {!user ? (
            <>
              <p onClick={onLoginClick}>Login</p>
              <p onClick={onLoginClick}>Sign Up</p>
            </>
          ) : (
            <>
              <p onClick={() => setShowProfileModal(true)}>My Profile</p>
              <p>My Orders</p>
              <p onClick={() => auth.signOut()}>Logout</p>
            </>
          )}

          <h3 className="menu-section">Shop</h3>
          <p>New Arrivals</p>
          <p>Best Sellers</p>
          <p>Offers</p>

          <h3 className="menu-section">Support</h3>
          <p>Contact Us</p>
          <p>FAQ</p>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <div
          className="profile-modal-backdrop"
          onClick={() => setShowProfileModal(false)}
        >
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <h2>My Profile</h2>
            <p>
              <strong>Name:</strong> {user.displayName || "Not Provided"}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Phone:</strong> {user.phoneNumber || "Not Provided"}
            </p>
            <button
              className="close-btn"
              onClick={() => setShowProfileModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default HeaderBar;
