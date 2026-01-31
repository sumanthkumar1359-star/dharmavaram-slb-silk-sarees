import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import products from "./products.json";

import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp
} from "firebase/firestore";

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
  const [imageIndex, setImageIndex] = useState({});

  // Review states
  const [reviews, setReviews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

  /* ============================
     VIDEO PLAY ONCE (SAFE)
     ============================ */
  const videoRef = useRef(null);
  const [playedOnce, setPlayedOnce] = useState(false);

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

  /* ============================
     FETCH REVIEWS FROM FIREBASE
     ============================ */
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

  /* ============================
     SUBMIT REVIEW
     ============================ */
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

  const reviewsToShow = showAllReviews ? reviews : reviews.slice(0, 3);

  /* ============================
     IMAGE NAVIGATION (FIXED)
     ============================ */
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
      </header>

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
                            className={`arrow right ${idx === 2 ? "disabled" : ""}`}
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
              {showAllReviews
                ? "Show Less"
                : `View All Reviews (${reviews.length})`}
            </button>
          )}
        </div>
      </div>

      <footer className="footer">
        © 2026 Dharmavaram SLB Silk Sarees
      </footer>
    </div>
  );
}

export default App;
