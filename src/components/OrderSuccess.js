import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./OrderSuccess.css";

export default function OrderSuccess() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  

  return (
    <div className="success-page">
      <div className="success-card">
        <div className="icon">✅</div>
        <h1>Payment Successful</h1>
        <p>Your order has been placed successfully!</p>

        <div className="order-card">
          <strong>Order ID:</strong> {orderId}
        </div>

        <p>📧 Order confirmation sent to your email</p>

        <button className="home-btn" onClick={() => navigate("/")}>
          Go to Home
        </button>
      </div>
    </div>
  );
}
