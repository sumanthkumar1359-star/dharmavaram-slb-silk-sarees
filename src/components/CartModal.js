import React, { useState } from "react";
import "./CartModal.css";

const CartModal = ({ cart, onClose, onRemove, onCheckout }) => {
  const [selected, setSelected] = useState([]);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const selectedItems = cart.filter((item) => selected.includes(item.id));

  const totalAmount = selectedItems.reduce(
    (sum, item) => sum + Number(item.price || 0),
    0
  );

  return (
    <>
      {/* BACKGROUND OVERLAY */}
      <div className="cart-overlay" onClick={onClose}></div>

      {/* SLIDING CART DRAWER */}
      <div className="cart-drawer">
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button className="close-btn" onClick={onClose}>
            ✖
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart">
            🛍️ Your cart is empty
          </div>
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
                  src={`/products/${item.folder}/1.jpg`}
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

        {/* FOOTER */}
        <div className="cart-footer">
          <div className="total">
            <span>Total:</span>
            <strong>₹ {totalAmount}</strong>
          </div>

          <button
            className="checkout-btn"
            onClick={() => onCheckout(selectedItems)}
            disabled={selectedItems.length === 0}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </>
  );
};

export default CartModal;
