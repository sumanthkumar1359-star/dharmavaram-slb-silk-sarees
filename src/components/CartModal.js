// CartModal.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CartModal.css";

function CartModal({ cart, user, onClose, onRemove, onLoginClick }) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);

  // Toggle selection
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Selected items & total
  const selectedItems = cart.filter((item) => selected.includes(item.id));
  const totalAmount = selectedItems.reduce(
    (sum, item) => sum + Number(item.price || 0),
    0
  );

  // Checkout
  const handleCheckout = () => {
    if (!user) {
      alert("Please login to continue payment");
      onLoginClick();
      return;
    }
    if (selectedItems.length === 0) {
      alert("Please select at least one item to proceed");
      return;
    }

    navigate("/checkout", {
      state: { selectedItems },
    });
  };

  return (
    <>
      {/* Overlay */}
      <div className="cart-overlay" onClick={onClose}></div>

      {/* Sliding cart */}
      <div className="cart-drawer">
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button className="close-btn" onClick={onClose}>
            ✖
          </button>
        </div>

        {/* Cart Items */}
        {cart.length === 0 ? (
          <div className="empty-cart">🛍️ Your cart is empty</div>
        ) : (
          <div className="cart-items">
            {cart.map((item) => (
              <div className="cart-item-card" key={item.id}>
                <input
                  type="checkbox"
                  checked={selected.includes(item.id)}
                  onChange={() => toggleSelect(item.id)}
                />
                <img
                  src={`/products/${item.folder}/1.jpeg`}
                  alt={item.name}
                  className="cart-item-img"
                />
                <div className="cart-item-details">
                  <h4>{item.name}</h4>
                  <p className="cart-price">₹ {item.price}</p>
                </div>
                <button
                  className="remove-btn"
                  onClick={() => onRemove(item.id)}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="cart-footer">
          <div className="total">
            <span>Total:</span>
            <strong>₹ {totalAmount}</strong>
          </div>
          <button
            className="checkout-btn"
            onClick={handleCheckout}
            disabled={selectedItems.length === 0}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </>
  );
}

export default CartModal;
