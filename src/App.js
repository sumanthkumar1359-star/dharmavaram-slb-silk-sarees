import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import products from "./products.json";
import { FaStore, FaInstagram, FaWhatsapp, FaVideo } from "react-icons/fa";
import { collection, getDocs, addDoc, query, orderBy, serverTimestamp } from "firebase/firestore";
import { db, auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import LoginModal from "./components/LoginModal";
import HeaderBar from "./components/HeaderBar";
import CartModal from "./components/CartModal";

/* Load product images */
const getImages = (folder) => {
  const images = [];
  for (let i = 1; i <= 10; i++) {
    images.push(`/products/${folder}/${i}.jpg`);
  }
  return images;
};

function App() {
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // ======== PRODUCTS & REVIEWS ========
  const [imageIndex, setImageIndex] = useState({});
  const [reviews, setReviews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

  // ======== CART ========
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  // ======== PAGINATION STATE (NEW) ========
  const productsPerPage = 9;
const [currentPage, setCurrentPage] = useState(1);
const totalPages = Math.ceil(products.length / productsPerPage);

const indexOfLastProduct = currentPage * productsPerPage;
const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

const nextPage = () => {
  if (currentPage < totalPages) {
    setCurrentPage(currentPage + 1);
    window.scrollTo({ top: 300, behavior: "smooth" });
  }
};

const prevPage = () => {
  if (currentPage > 1) {
    setCurrentPage(currentPage - 1);
    window.scrollTo({ top: 300, behavior: "smooth" });
  }
};

  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCheckout = (selectedItems) => {
    if (!user) {
      setShowCart(false);
      setShowLoginModal(true);
      return;
    }
    alert("Proceeding to checkout with " + selectedItems.length + " items");
  };

  // ======== VIDEO ========
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

  // ======== FIREBASE AUTH STATE ========
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // ======== FETCH REVIEWS ========
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, []);

  // ======== SUBMIT REVIEW ========
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim() || rating === 0) return;

    try {
      const docRef = await addDoc(collection(db, "reviews"), {
        name,
        comment,
        rating,
        createdAt: serverTimestamp(),
      });

      setReviews((prev) => [
        { id: docRef.id, name, comment, rating },
        ...prev,
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

  // ======== IMAGE NAVIGATION ========
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

  return (
    <div className="app">

      {/* LOGIN MODAL */}
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}

      {/* PREMIUM HEADER BAR */}
      <HeaderBar
        user={user}
        cartCount={cart.length}
        onLoginClick={() => setShowLoginModal(true)}
        onCartClick={() => setShowCart(true)}
        onLogout={async () => {
          await auth.signOut();
          setCart([]);
        }}
      />

      {/* CART MODAL */}
      {showCart && (
        <CartModal
          cart={cart}
          onClose={() => setShowCart(false)}
          onRemove={removeFromCart}
          onCheckout={handleCheckout}
          user={user}
        />
      )}

      <div className="notification">⚠️ This app is under development</div>

      <div className="festival-banner">
        <div className="scrolling-text">
          Wedding Season Collection | Bride’s Special Dharmavaram Silks | Auspicious Festival Offers
        </div>
      </div>

      {/* PRODUCTS */}
      <section className="product-section">
        <div className="product-container">
          {currentProducts.map((p) => {
            const images = getImages(p.folder);
            const idx = imageIndex[p.id] || 0;

            return (
              <div className="product-card" key={p.id}>
                <div className="image-wrapper">
                  <img src={images[idx]} alt={p.name} />

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
                </div>

                <div className="name-box">{p.name}</div>

                <div className="price-box">
                  <span className="original-price">₹{p.originalPrice}</span>
                  <span className="price">₹{p.price}</span>
                </div>

                <button
                  className="add-to-cart-btn"
                  onClick={() => addToCart(p)}
                >
                  Add to Cart
                </button>

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

        {/* PAGINATION UI */}
        <div className="pagination">
  {currentPage > 1 && (
    <button className="prev-btn" onClick={prevPage}>
      Prev
    </button>
  )}

  {currentPage === 1 && (
    <>
      <button className="active-page">1</button>
      {totalPages >= 2 && (
        <button onClick={() => setCurrentPage(2)}>2</button>
      )}
    </>
  )}

  {currentPage > 1 && (
    <>
      <button
        className={currentPage === currentPage ? "active-page" : ""}
        onClick={() => setCurrentPage(currentPage)}
      >
        {currentPage}
      </button>

      {currentPage < totalPages && (
        <button
          className={currentPage + 1 === currentPage ? "active-page" : ""}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          {currentPage + 1}
        </button>
      )}
    </>
  )}

  {currentPage < totalPages && (
    <button className="next-btn" onClick={nextPage}>
      Next
    </button>
  )}
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

      {/* FLOATING ACTIONS */}
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

      <footer className="footer">
        © 2026 Dharmavaram SLB Silk Sarees
      </footer>
    </div>
  );
}

export default App;
