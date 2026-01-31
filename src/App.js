import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import products from "./products.json";
import { FaStore, FaInstagram, FaWhatsapp, FaVideo } from "react-icons/fa";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "./firebase";
import { doc, getDoc, collection, getDocs, addDoc, query, orderBy, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

/* Load product images */
const getImages = (folder) => {
  const images = [];
  for (let i = 1; i <= 10; i++) {
    images.push(`/products/${folder}/${i}.jpg`);
  }
  return images;
};

function App() {
  // ======== Auth & User States ========
  const [authUser, setAuthUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [phoneInput, setPhoneInput] = useState("+91");
  const [otpInput, setOtpInput] = useState("");
  const recaptchaVerifierRef = useRef(null);
  const confirmationResultRef = useRef(null);
  const [userAddresses, setUserAddresses] = useState([]);
  const [userCart, setUserCart] = useState(null);

  // ======== Products & Reviews ========
  const [imageIndex, setImageIndex] = useState({});
  const [reviews, setReviews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

  // ======== Video ========
  const videoRef = useRef(null);
  const [playedOnce, setPlayedOnce] = useState(false);

  // ======== Load user data from Firestore ========
  const loadUserData = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        // optional: set profile state
      }
      const addrSnap = await getDocs(collection(db, "users", uid, "addresses"));
      setUserAddresses(addrSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      const cartDoc = await getDoc(doc(db, "users", uid, "cart"));
      setUserCart(cartDoc.exists() ? cartDoc.data() : null);
    } catch (err) {
      console.error("loadUserData error", err);
    }
  };

  // ======== Video play on scroll/click ========
  useEffect(() => {
    const playOnce = () => {
      if (!playedOnce && videoRef.current) {
        videoRef.current.play().catch(() => {});
        setPlayedOnce(true);
        window.removeEventListener("scroll", playOnce);
        window.removeEventListener("click", playOnce);
      }
    };
    window.addEventListener("scroll", playOnce);
    window.addEventListener("click", playOnce);
    return () => {
      window.removeEventListener("scroll", playOnce);
      window.removeEventListener("click", playOnce);
    };
  }, [playedOnce]);

  // ======== Fetch reviews ========
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const q = query(
          collection(db, "reviews"),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, []);

  // ======== Review submission ========
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim() || rating === 0) return;

    try {
      const docRef = await addDoc(collection(db, "reviews"), {
        name,
        comment,
        rating,
        createdAt: serverTimestamp()
      });
      setReviews((prev) => [
        { id: docRef.id, name, comment, rating },
        ...prev
      ]);
      setName("");
      setComment("");
      setRating(0);
      setShowModal(false);
      setShowAllReviews(false);
    } catch (error) {
      console.error(error);
      alert("Failed to submit review");
    }
  };

  // ======== Product image navigation ========
  const prevImage = (id) => {
    setImageIndex((prev) => {
      const current = prev[id] || 0;
      if (current <= 0) return prev;
      return { ...prev, [id]: current - 1 };
    });
  };

  const nextImage = (id, max) => {
    setImageIndex((prev) => {
      const current = prev[id] || 0;
      if (current >= max - 1) return prev;
      return { ...prev, [id]: current + 1 };
    });
  };

  const reviewsToShow = showAllReviews ? reviews : reviews.slice(0, 3);

  // ======== Send OTP ========
  const sendOtp = async () => {
    try {
      if (!recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current = new RecaptchaVerifier(
          "recaptcha-container",
          { size: "invisible" },
          auth
        );
      }
      const phoneNumber = phoneInput.startsWith("+")
        ? phoneInput
        : `+91${phoneInput.replace(/\D/g, "")}`;
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        recaptchaVerifierRef.current
      );
      confirmationResultRef.current = confirmationResult;
      alert("OTP sent to " + phoneNumber);
    } catch (err) {
      console.error("sendOtp error:", err);
      alert("Failed to send OTP. Check console for details.");
    }
  };

  // ======== Verify OTP ========
  const verifyOtp = async () => {
    try {
      if (!confirmationResultRef.current) {
        alert("Please request OTP first");
        return;
      }
      const result = await confirmationResultRef.current.confirm(otpInput);
      const user = result.user;
      setAuthUser(user);
      await loadUserData(user.uid);
      setShowLoginModal(false);
    } catch (err) {
      console.error("verifyOtp error:", err);
      alert("Invalid or expired OTP");
    }
  };

  return (
    <div className="app">
      {/* HEADER */}
      <header className="header">
        <video
          ref={videoRef}
          className="header-video"
          src="/header-video.mp4"
          muted
          playsInline
          preload="auto"
        />
        <div className="auth-buttons">
          <button className="login-btn" onClick={() => setShowLoginModal(true)}>
            Login
          </button>
        </div>
      </header>

      {/* LOGIN MODAL */}
      {showLoginModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Login with Phone</h3>
            <div id="recaptcha-container"></div>

            <label>Phone Number</label>
            <input
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              placeholder="+91XXXXXXXXXX"
            />
            <button onClick={sendOtp}>Send OTP</button>

            <label>OTP</label>
            <input
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
              placeholder="Enter OTP"
            />
            <button onClick={verifyOtp}>Verify & Login</button>

            <button onClick={() => setShowLoginModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* USER PANEL */}
      {authUser && (
        <div className="user-panel">
          <strong>Logged in: {authUser.phoneNumber}</strong>
          <div>
            <h4>Addresses</h4>
            {userAddresses.map((a) => (
              <div key={a.id}>{a.line1 || a.name}</div>
            ))}
          </div>
          <div>
            <h4>Cart</h4>
            {userCart ? JSON.stringify(userCart) : "No cart data"}
          </div>
        </div>
      )}

      <div className="notification">⚠️ This app is under development</div>

      <div className="intro-text">
        <h2>Premium Dharmavaram Silk Sarees</h2>
        <p>Handwoven silk with rich zari & timeless elegance</p>
      </div>

      <div className="section-line"></div>

      <div className="festival-banner">
        <div className="scrolling-text">
          Wedding Season Collection | Bride’s Special Dharmavaram Silks | Auspicious Festival Offers
        </div>
      </div>

      {/* PRODUCTS */}
      <section className="product-section">
        <div className="product-container">
          {products.map((p) => {
            const images = getImages(p.folder);
            const idx = imageIndex[p.id] || 0;
            const hasMultipleImages = images.length > 1;

            return (
              <div className="product-card" key={p.id}>
                <div className="image-wrapper">
                  {images.length === 0 ? (
                    <div className="no-image">No Image Available</div>
                  ) : (
                    <>
                      <img src={images[idx]} alt={p.name} />
                      {hasMultipleImages && (
                        <>
                          <span
                            className={`arrow left ${idx === 0 ? "disabled" : ""}`}
                            onClick={() => prevImage(p.id)}
                          >
                            ‹
                          </span>
                          <span
                            className={`arrow right ${idx === images.length - 1 ? "disabled" : ""}`}
                            onClick={() => nextImage(p.id, images.length)}
                          >
                            ›
                          </span>
                        </>
                      )}
                    </>
                  )}
                </div>

                <div className="name-box">{p.name}</div>
                <div className="price-box">
                  <span className="original-price">₹{p.originalPrice}</span>
                  <span className="price">₹{p.price}</span>
                </div>

                <div className="check-availability">
                  <a
                    href={`https://wa.me/918309323239?text=Hello, I want to check availability of ${p.name}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Check Availability
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* REVIEWS */}
      <div className="review-section">
        <h2>Customer Reviews</h2>
        <button className="add-review-btn" onClick={() => setShowModal(true)}>
          Add Your Review
        </button>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Submit Your Review</h3>
              <form onSubmit={handleSubmitReview}>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <textarea
                  placeholder="Your Review"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                />
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={star <= rating ? "filled" : ""}
                      onClick={() => setRating(star)}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <div className="modal-buttons">
                  <button type="submit">Submit</button>
                  <button type="button" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="review-list">
          {reviewsToShow.map((r) => (
            <div key={r.id} className="review-card">
              <div className="review-header">
                <strong>{r.name}</strong>
                <span className="stars">
                  {"★".repeat(r.rating) + "☆".repeat(5 - r.rating)}
                </span>
              </div>
              <p>{r.comment}</p>
            </div>
          ))}

          {reviews.length > 3 && (
            <button
              className="view-all-btn"
              onClick={() => setShowAllReviews((p) => !p)}
            >
              {showAllReviews ? "Show Less" : `View All Reviews (${reviews.length})`}
            </button>
          )}
        </div>
      </div>

      {/* Floating Actions */}
      <div className="floating-actions">
        <button className="action-btn">
          <FaStore size={28} color="#FFD700" />
          <span className="tooltip-text">Visit Store</span>
        </button>
        <button className="action-btn">
          <FaInstagram size={28} color="#E1306C" />
          <span className="tooltip-text">Instagram</span>
        </button>
        <button className="action-btn">
          <FaWhatsapp size={28} color="#25D366" />
          <span className="tooltip-text">WhatsApp</span>
        </button>
        <button className="action-btn">
          <FaVideo size={28} color="#FF4500" />
          <span className="tooltip-text">Book Video Call</span>
        </button>
      </div>

      <footer className="footer">© 2026 Dharmavaram SLB Silk Sarees</footer>
    </div>
  );
}

export default App;
