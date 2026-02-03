import React, { useState } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import "./HeaderBar.css";

function HeaderBar({ user, onLoginClick, onCartClick }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  const navigate = useNavigate(); // ✅ hook inside component

  const getUsernameLettersOnly = (email) => {
    if (!email) return "";
    const username = email.split("@")[0];
    return username.replace(/[^a-zA-Z]/g, "");
  };

  const goToOrders = () => {
    setShowDropdown(false);
    setShowSideMenu(false);
    navigate("/my-orders");
  };

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
              Login
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

              <span className="welcome-text">
                Welcome, {getUsernameLettersOnly(user.email)}
              </span>

              {showDropdown && (
                <div className="user-dropdown">
                  <p onClick={() => setShowProfileModal(true)}>My Profile</p>
                  <p onClick={goToOrders}>My Orders</p>
                  <p onClick={() => auth.signOut()}>Logout</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Festival Banner */}
      <div className="festival-banner">
        ✨ Celebrate the Festival Season with Exclusive Offers! ✨
      </div>

      <hr className="header-divider" />

      <div className="premium-collection">
        <h1 className="premium-text">Best Collections</h1>
        <p className="premium-subtext">
          Handpicked sarees for every occasion
        </p>
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
              <p onClick={goToOrders}>My Orders</p>
              <p onClick={() => auth.signOut()}>Logout</p>
            </>
          )}

          <h3 className="menu-section">Shop</h3>
          <p
            onClick={() => {
              document
                .getElementById("products")
                ?.scrollIntoView({ behavior: "smooth" });
              setShowSideMenu(false);
            }}
          >
            New Arrivals
          </p>

          <p>Best Sellers</p>
          <p>Offers</p>

          <h3 className="menu-section">Support</h3>
          <p onClick={() => setShowContactModal(true)}>Contact Us</p>

          {showContactModal && (
            <div
              className="profile-modal-backdrop"
              onClick={() => setShowContactModal(false)}
            >
              <div
                className="profile-modal"
                onClick={(e) => e.stopPropagation()}
              >
                <h2>Contact Information</h2>

                <p>📞 <strong>+91 8309323239</strong></p>
                <p>📞 <strong>+91 7989117330</strong></p>

                <button
                  className="close-btn"
                  onClick={() => setShowContactModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          )}

          <p>FAQ</p>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && user && (
        <div
          className="profile-modal-backdrop"
          onClick={() => setShowProfileModal(false)}
        >
          <div
            className="profile-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>My Profile</h2>
            <p>
              <strong>Name:</strong> {user.displayName || "Not Provided"}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Phone:</strong>{" "}
              {user.phoneNumber || "Not Provided"}
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
