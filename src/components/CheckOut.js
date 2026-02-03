import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { doc, setDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";
import "./CheckOut.css";

export default function Checkout() {
  const { state } = useLocation() || {};
  const navigate = useNavigate();
  const selectedItems = state?.selectedItems || [];

  const [address, setAddress] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!address.name.trim()) newErrors.name = "Full Name is required";
    if (!address.email.trim()) newErrors.email = "Email is required";
    if (!address.phone.trim()) newErrors.phone = "Phone Number is required";
    if (!address.address.trim()) newErrors.address = "Address is required";
    if (!address.city.trim()) newErrors.city = "City is required";
    if (!address.pincode.trim()) newErrors.pincode = "Pincode is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = async () => {
    console.log("Current User:", auth.currentUser);
    console.log("Selected Items:", selectedItems);

    if (!validate()) return;

    if (!auth.currentUser) {
      alert("Please login to place an order");
      return;
    }

    const uid = auth.currentUser.uid;

    const orderData = {
      selectedItems,
      address: {
        name: address.name,
        email: address.email,
        phone: address.phone,
        address: address.address,
        city: address.city,
        pincode: address.pincode,
      },
      amount: selectedItems.reduce((sum, item) => sum + (item.price || 0), 0),
      status: "Pending Payment",
      createdAt: serverTimestamp(),
    };

    try {
      const orderRef = doc(collection(db, "orders", uid, "userOrders"));

      await setDoc(orderRef, orderData);

      console.log("Order saved successfully for UID:", uid);

      navigate("/payment", {
        state: { ...orderData, orderId: orderRef.id },
      });
    } catch (error) {
      console.error("Firestore Error:", error);
      alert("Failed to save order. Check console.");
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-card">
        <h2 className="title">Delivery Address</h2>

        <input name="name" placeholder="Full Name" value={address.name} onChange={handleChange} />
        {errors.name && <span className="error">{errors.name}</span>}

        <input name="email" placeholder="Email" value={address.email} onChange={handleChange} />
        {errors.email && <span className="error">{errors.email}</span>}

        <input name="phone" placeholder="Mobile Number" value={address.phone} onChange={handleChange} />
        {errors.phone && <span className="error">{errors.phone}</span>}

        <textarea name="address" placeholder="Address" value={address.address} onChange={handleChange} />
        {errors.address && <span className="error">{errors.address}</span>}

        <input name="city" placeholder="City" value={address.city} onChange={handleChange} />
        {errors.city && <span className="error">{errors.city}</span>}

        <input name="pincode" placeholder="Pincode" value={address.pincode} onChange={handleChange} />
        {errors.pincode && <span className="error">{errors.pincode}</span>}

        <button className="continue-btn" onClick={handleContinue}>
          Continue to Payment
        </button>
      </div>
    </div>
  );
}
