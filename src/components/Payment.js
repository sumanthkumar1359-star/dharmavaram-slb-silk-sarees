import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import emailjs from "emailjs-com";
import "./Payment.css";

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    selectedItems = [],
    address = {},
    orderId = null,
  } = location.state || {};

  const email = address.email || "";

  if (!auth.currentUser || !orderId || selectedItems.length === 0) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "50px" }}>
        Invalid Payment Request. Go back to checkout.
      </h2>
    );
  }

  const amount = selectedItems.reduce(
    (sum, item) => sum + Number(item.price || 0),
    0
  );

  // Load Razorpay SDK
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const loadRazorpay = async () => {
    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const uid = auth.currentUser.uid;
    const orderRef = doc(db, "orders", uid, "userOrders", orderId);

    const options = {
      key: "rzp_test_SBanoGGy58YgNA", // Your test key
      amount: amount * 100,
      currency: "INR",
      name: "SLB Silk Sarees",
      description: "Secure Payment",
      handler: async function (response) {
        try {
          console.log("Payment Success:", response);

          // ✅ UPDATE EXISTING ORDER (not creating a new one)
          await updateDoc(orderRef, {
            paymentId: response.razorpay_payment_id,
            status: "Paid",
            paidAt: new Date(),
          });

          console.log("Order updated as PAID in Firestore");

          // ✅ Send Email Confirmation
          emailjs
            .send(
              "service_q0x1d67",
              "template_3j7kiwv",
              {
                to_email: email,
                order_id: orderId,
                amount: amount,
                name: address.name,
              },
              "x49RKlEQjd04f7bc2"
            )
            .then(
              (res) => console.log("Email SUCCESS:", res),
              (err) => console.error("Email ERROR:", err)
            );

          // ✅ Go to success page
          navigate(`/order-success/${orderId}`);
        } catch (error) {
          console.error("Payment handler error:", error);
          alert(
            "Payment succeeded but something went wrong while updating order."
          );
        }
      },

      prefill: {
        name: address.name,
        email: address.email,
        contact: address.phone,
      },
      theme: { color: "#6b21a8" },
    };

    console.log("Opening Razorpay with amount:", amount);

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", function (response) {
      alert("Payment Failed: " + response.error.description);
    });

    rzp.open();
  };

  return (
    <div className="payment-page">
      <div className="payment-card">
        <h2 className="title">Secure Payment</h2>
        <p className="amount">Total Amount: ₹ {amount}</p>

        <button type="button" className="pay-btn" onClick={loadRazorpay}>
          Pay ₹ {amount} Securely
        </button>

        <div className="note">
          <p>
            Your payment is secured by Razorpay. We do not store your card
            details.
          </p>
        </div>
      </div>
    </div>
  );
}
