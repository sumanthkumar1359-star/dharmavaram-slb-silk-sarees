import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db, auth } from "../firebase";
import "./MyOrders.css"; // import the new premium CSS

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    const uid = auth.currentUser.uid;
    const ordersRef = collection(db, "orders", uid, "userOrders");
    const q = query(ordersRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const orderList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setOrders(orderList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (!auth.currentUser) {
    return <p className="center-text">Please login to see your orders.</p>;
  }

  if (loading) {
    return <p className="center-text">Loading your orders...</p>;
  }

  return (
    <div className="orders-page">
      <h2 className="orders-title">My Orders</h2>

      {orders.length === 0 ? (
        <p className="center-text">No orders yet.</p>
      ) : (
        <div className="orders-container">
          {orders.map((order) => (
            <div key={order.id} className="order-card animate-card">
              <div className="order-header">
                <span className="order-id">Order ID: {order.id}</span>
                <span
                  className={`order-status ${
                    order.status?.toLowerCase() || "pending"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="order-info">
                <p>
                  <strong>Name:</strong> {order.address?.name}
                </p>
                <p>
                  <strong>Email:</strong> {order.address?.email}
                </p>
                <p>
                  <strong>City:</strong> {order.address?.city}
                </p>
      
              </div>

              <div className="order-items">
                <p>
                  <strong>Items:</strong>
                </p>
                <ul>
                  {order.selectedItems?.map((item, index) => (
                    <li key={index}>{item.name || item.folder}</li>
                  ))}
                </ul>
              </div>

              <p className="order-date">
                <strong>Ordered At:</strong>{" "}
                {order.createdAt?.toDate
                  ? order.createdAt.toDate().toLocaleString()
                  : ""}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
