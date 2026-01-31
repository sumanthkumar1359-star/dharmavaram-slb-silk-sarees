import React, { useState } from "react";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product, images }) {
  const [index, setIndex] = useState(0);
  const { addToCart } = useCart();

  const prevImage = () => setIndex((prev) => Math.max(prev - 1, 0));
  const nextImage = () => setIndex((prev) => Math.min(prev + images.length - 1, prev + 1));

  return (
    <div className="product-card">
      <div className="image-wrapper">
        <img src={images[index]} alt={product.name} />
        {images.length > 1 && (
          <>
            <span className={`arrow left ${index === 0 ? "disabled" : ""}`} onClick={prevImage}>‹</span>
            <span className={`arrow right ${index === images.length - 1 ? "disabled" : ""}`} onClick={nextImage}>›</span>
          </>
        )}
      </div>
      <div className="name-box">{product.name}</div>
      <div className="price-box">
        <span className="original-price">₹{product.originalPrice}</span>
        <span className="price">₹{product.price}</span>
      </div>
      <div className="check-availability">
        <a href={`https://wa.me/918309323239?text=Hello, I want to check availability of ${product.name}`} target="_blank" rel="noreferrer">
          Check Availability
        </a>
      </div>
      <button onClick={() => addToCart(product)}>Add to Cart</button>
    </div>
  );
}
