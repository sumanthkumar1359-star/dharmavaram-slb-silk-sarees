import React from "react";
import "./App.css";

function App() {
  const products = [
    {
      id: 1,
      name: "Pure Dharmavaram Silk Saree",
      price: "₹25,000",
      image: "https://via.placeholder.com/300x400?text=Silk+Saree",
    },
    {
      id: 2,
      name: "Traditional Wedding Saree",
      price: "₹32,000",
      image: "https://via.placeholder.com/300x400?text=Wedding+Saree",
    },
    {
      id: 3,
      name: "Designer Border Silk Saree",
      price: "₹18,500",
      image: "https://via.placeholder.com/300x400?text=Designer+Saree",
    },
  ];

  return (
    <div className="app">
      {/* HEADER */}
      <header className="header">
        <img src="/logo.png" alt="Logo" className="logo" />
        <h1>Dharmavaram SLB Silk Sarees</h1>
        <p>Authentic Handloom Silk Sarees</p>
      </header>

      {/* PRODUCTS */}
      <section className="product-container">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p className="price">{product.price}</p>
            <a
              href="https://wa.me/+918309323239"
              target="_blank"
              rel="noreferrer"
              className="buy-btn"
            >
              Buy on WhatsApp
            </a>
          </div>
        ))}
      </section>

      {/* FLOATING SOCIAL ICONS */}
      <div className="social-icons">
        <a
          href="https://wa.me/+918309323239"
          target="_blank"
          rel="noreferrer"
          className="whatsapp"
        >
          <i className="fab fa-whatsapp"></i>
        </a>

        <a
          href="https://instagram.com/your_instagram_page"
          target="_blank"
          rel="noreferrer"
          className="instagram"
        >
          <i className="fab fa-instagram"></i>
        </a>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <p>© 2026 Dharmavaram SLB Silk Sarees</p>
      </footer>
    </div>
  );
}

export default App;