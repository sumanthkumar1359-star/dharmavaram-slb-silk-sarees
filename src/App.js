import React, { useState } from "react";
import "./App.css";

function App() {
  const PRODUCTS_PER_PAGE = 12;
  const MAX_PAGES = 20;

  const products = Array.from({ length: 240 }, (_, i) => ({
    id: i + 1,
    name: `Pure Silk Saree ${i + 1}`,
    price: 25000,
    originalPrice: 32000,
    images: [
      "https://via.placeholder.com/400x520?text=Saree+Front",
      "https://via.placeholder.com/400x520?text=Saree+Back",
      "https://via.placeholder.com/400x520?text=Saree+Detail",
    ],
  }));

  const totalPages = Math.min(
    Math.ceil(products.length / PRODUCTS_PER_PAGE),
    MAX_PAGES
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [imageIndex, setImageIndex] = useState({});

  const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const visibleProducts = products.slice(start, start + PRODUCTS_PER_PAGE);

  const prevImage = (id, len) => {
    setImageIndex((p) => ({
      ...p,
      [id]: p[id] > 0 ? p[id] - 1 : len - 1,
    }));
  };

  const nextImage = (id, len) => {
    setImageIndex((p) => ({
      ...p,
      [id]: p[id] < len - 1 ? p[id] + 1 : 0,
    }));
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

      {/* FLOATING NOTIFICATION */}
      <div className="notification">
        ⚠️ This app is under development
      </div>

      {/* PRODUCTS */}
      <section className="product-container">
        {visibleProducts.map((p) => {
          const idx = imageIndex[p.id] || 0;

          return (
            <div className="product-card" key={p.id}>
              <div className="image-wrapper">
                <span
                  className="arrow left"
                  onClick={() => prevImage(p.id, p.images.length)}
                >
                  ‹
                </span>

                <img src={p.images[idx]} alt={p.name} />

                <span
                  className="arrow right"
                  onClick={() => nextImage(p.id, p.images.length)}
                >
                  ›
                </span>
              </div>

              <div className="name-box">{p.name}</div>

              <div className="price-box">
                <span className="original-price">
                  ₹{p.originalPrice.toLocaleString()}
                </span>
                <span className="price">₹{p.price.toLocaleString()}</span>
              </div>

              {/* CHECK AVAILABILITY BUTTON */}
              <div className="check-availability">
                <a
                  href={`https://wa.me/918309323239?text=Hello,%20I%20want%20to%20check%20availability%20of%20${p.name}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Check Availability
                </a>
              </div>
            </div>
          );
        })}
      </section>

      {/* PAGINATION */}
      <div className="pagination-wrapper">
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`page-btn ${currentPage === i + 1 ? "active" : ""}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* FLOATING BOTTOM-RIGHT ACTION BUTTONS */}
      <div className="floating-bottom-right">
        <a
          href={`https://wa.me/918309323239?text=Book video call`}
          target="_blank"
          rel="noreferrer"
          className="bottom-btn"
        >
          📞 Book Video Call
        </a>
        <a
          href="https://www.google.com/maps?q=Dharmavaram+Silk+Sarees"
          target="_blank"
          rel="noreferrer"
          className="bottom-btn"
        >
          🏬 Visit Our Store
        </a>
        <a
          href={`https://wa.me/918309323239`}
          target="_blank"
          rel="noreferrer"
          className="bottom-btn"
        >
          💬 WhatsApp
        </a>
        <a
          href="https://instagram.com/your_instagram_page"
          target="_blank"
          rel="noreferrer"
          className="bottom-btn"
        >
          📸 Instagram
        </a>
      </div>

      <footer className="footer">
        © 2026 Dharmavaram SLB Silk Sarees
      </footer>
    </div>
  );
}

export default App;
