import React, { useState, useEffect } from "react";
import "./App.css";
import products from "./products.json";

const PRODUCTS_PER_PAGE = 8;

/* Load product images */
const getImages = (folder) => {
  const images = [];
  for (let i = 1; i <= 10; i++) {
    images.push(`/products/${folder}/${i}.jpg`);
  }
  return images;
};

function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [imageIndex, setImageIndex] = useState({});

  // Review states
  const [reviews, setReviews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const visibleProducts = products.slice(start, start + PRODUCTS_PER_PAGE);

  const prevImage = (id) => {
    setImageIndex((p) => ({ ...p, [id]: Math.max((p[id] || 0) - 1, 0) }));
  };

  const nextImage = (id, max) => {
    setImageIndex((p) => ({ ...p, [id]: Math.min((p[id] || 0) + 1, max - 1) }));
  };

  // Fetch reviews from backend
  useEffect(() => {
    fetch("http://localhost:5000/reviews?_sort=id&_order=desc")
      .then((res) => res.json())
      .then((data) => setReviews(data));
  }, []);

  // Submit review
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim() || rating === 0) return;

    const newReview = { id: Date.now(), name, comment, rating };

    try {
      const res = await fetch("http://localhost:5000/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReview),
      });
      if (!res.ok) throw new Error("Failed to save review");
      const savedReview = await res.json();
      setReviews([savedReview, ...reviews]);
      setName("");
      setComment("");
      setRating(0);
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save review. Make sure JSON server is running.");
    }
  };

  return (
    <div className="app">
      {/* HEADER */}
      <header className="header">
        <video
          className="header-video"
          src="/header-video.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
      </header>

      {/* NOTIFICATION */}
      <div className="notification">⚠️ This app is under development</div>

      {/* INTRO */}
      <div className="intro-text">
        <h2>Premium Dharmavaram Silk Sarees</h2>
        <p>Handwoven silk with rich zari & timeless elegance</p>
      </div>
      <div className="section-line"></div>

      {/* FESTIVAL BANNER */}
      <div className="festival-banner">
        <div className="scrolling-text">
          Wedding Season Collection | Bride’s Special Dharmavaram Silks | Auspicious Festival Offers
        </div>
      </div>

      {/* PRODUCTS */}
      <section className="product-section">
        <div className="product-container">
          {visibleProducts.map((p) => {
            const images = getImages(p.folder);
            const idx = imageIndex[p.id] || 0;

            return (
              <div className="product-card" key={p.id}>
                <div className="image-wrapper">
                  {images.length > 1 && (
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
                  <img
                    src={images[idx]}
                    alt={p.name}
                    onError={(e) => (e.target.style.display = "none")}
                  />
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

      {/* PAGINATION */}
      <div className="pagination-wrapper">
        <div className="pagination">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>←</button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={currentPage === i + 1 ? "active" : ""}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>→</button>
          <span className="page-info">Page {currentPage} of {totalPages}</span>
        </div>
      </div>

      {/* FLOATING BUTTONS */}
      <div className="floating-bottom-right">
        <a href="https://www.google.com/maps?q=Dharmavaram+Silk+Sarees" target="_blank" rel="noreferrer" className="bottom-btn">🏬 Visit Store</a>
        <a href="https://wa.me/918309323239?text=Book video call" target="_blank" rel="noreferrer" className="bottom-btn">📞 Book Video Call</a>
        <a href="https://wa.me/918309323239" target="_blank" rel="noreferrer" className="bottom-btn">💬 WhatsApp</a>
        <a href="https://instagram.com/your_instagram_page" target="_blank" rel="noreferrer" className="bottom-btn">📸 Instagram</a>
      </div>

      {/* CUSTOMER REVIEWS */}
      <div className="review-section">
        <h2>Customer Reviews</h2>
        <button className="add-review-btn" onClick={() => setShowModal(true)}>Add Your Review</button>

        {/* MODAL */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Submit Your Review</h3>
              <form onSubmit={handleSubmitReview}>
                <input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <textarea placeholder="Your Review" value={comment} onChange={(e) => setComment(e.target.value)} required />
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={star <= rating ? "filled" : ""} onClick={() => setRating(star)}>★</span>
                  ))}
                </div>
                <div className="modal-buttons">
                  <button type="submit">Submit</button>
                  <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* DISPLAY REVIEWS */}
        <div className="review-list">
          {reviews.length === 0 ? (
            <p>No reviews yet. Be the first!</p>
          ) : (
            <>
              {reviews.slice(0, 3).map((r) => (
                <div key={r.id} className="review-card">
                  <div className="review-header">
                    <strong>{r.name}</strong>
                    <span className="stars">{"★".repeat(r.rating) + "☆".repeat(5 - r.rating)}</span>
                  </div>
                  <p>{r.comment}</p>
                </div>
              ))}
              {reviews.length > 3 && (
                <button className="view-all-btn" onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}>
                  View All Reviews ({reviews.length})
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <footer className="footer">© 2026 Dharmavaram SLB Silk Sarees</footer>
    </div>
  );
}

export default App;
