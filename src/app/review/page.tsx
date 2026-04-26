"use client";

import React, { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { openWhatsApp } from "@/lib/whatsapp";

const ReviewPage: React.FC = () => {
  const {
    cart,
    customOrder,
    orderNotes,
    orderType,
    setOrderType,
    deliveryLocation,
    setDeliveryLocation,
    scheduleTime,
    setScheduleTime,
    clearCart,
  } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  useEffect(() => {
    const stored = sessionStorage.getItem("customOrderData");
    if (stored) {
      const data = JSON.parse(stored);
      setName(data.name || "");
      setPhone(data.phone || "");
      setOrderType(data.orderType || "pickup");
      setDeliveryLocation(data.location || "");
      setScheduleTime(data.scheduleTime || "");
    }
  }, [setOrderType, setDeliveryLocation, setScheduleTime]);

  const handleSendOrder = () => {
    if (!name || !phone) {
      alert("Please enter your name and phone number.");
      return;
    }

    if (orderType === "delivery" && !deliveryLocation) {
      alert("Please provide a delivery location.");
      return;
    }

    openWhatsApp({
      cart,
      customOrder,
      orderNotes,
      orderType,
      deliveryLocation,
      scheduleTime,
      customerName: name,
      customerPhone: phone,
    });

    clearCart();
    sessionStorage.removeItem("customOrderData");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32 pt-[100px] sm:pt-[80px]">
      <div className="px-4 pt-2 pb-6 text-center">
        <h1 className="text-2xl font-bold">Review Your Order</h1>
        <p className="text-sm text-gray-500 mt-1">
          Confirm everything before sending to the restaurant
        </p>
      </div>

      <div className="max-w-xl mx-auto px-4 space-y-6 pb-32">
        {/* Custom Order */}
        {customOrder && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-5">
            <h2 className="font-semibold mb-2">Custom Order</h2>
            <p className="text-sm text-gray-700">{customOrder}</p>
            <p className="text-xs text-gray-500 mt-1">
              Price will be confirmed by the restaurant.
            </p>
          </div>
        )}

        {/* Cart Items */}
        {cart.length > 0 && (
          <div className="bg-white rounded-xl border p-5 space-y-3">
            <h2 className="font-semibold">Cart Items</h2>
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between text-sm space-x-3"
              >
                {/* Product Image */}
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}

                {/* Name and quantity */}
                <span className="flex-1">
                  {item.quantity} × {item.name}
                </span>

                {/* Price */}
                <span className="font-medium">
                  KES {(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Order Notes */}
        {orderNotes && (
          <div className="bg-white border rounded-xl p-5">
            <h2 className="font-semibold mb-2">Order Notes</h2>
            <p className="text-sm text-gray-600">{orderNotes}</p>
          </div>
        )}

        {/* Customer Details */}
        <div className="bg-white border rounded-xl p-5 space-y-4">
          <h2 className="font-semibold">Customer Details</h2>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-700 outline-none"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-700 outline-none"
          />
        </div>

        {/* Order Type */}
        <div className="bg-white border rounded-xl p-5 space-y-4">
          <h2 className="font-semibold">Order Type</h2>
          <div className="flex gap-3">
            <button
              onClick={() => setOrderType("pickup")}
              className={`flex-1 py-3 rounded-lg border font-medium ${
                orderType === "pickup" ? "bg-green-900 text-white" : "bg-white"
              }`}
            >
              Pickup
            </button>
            <button
              onClick={() => setOrderType("delivery")}
              className={`flex-1 py-3 rounded-lg border font-medium ${
                orderType === "delivery"
                  ? "bg-green-900 text-white"
                  : "bg-white"
              }`}
            >
              Delivery
            </button>
          </div>

          {orderType === "delivery" && (
            <input
              type="text"
              placeholder="Delivery location or Google Maps link"
              value={deliveryLocation}
              onChange={(e) => setDeliveryLocation(e.target.value)}
              className="w-full border rounded-lg p-3"
            />
          )}

          <input
            type="text"
            placeholder="Schedule (Optional)"
            value={scheduleTime}
            onChange={(e) => setScheduleTime(e.target.value)}
            className="w-full border rounded-lg p-3"
          />
        </div>

        {/* Subtotal */}
        <div className="flex justify-between font-semibold text-lg px-2">
          <span>Subtotal</span>
          <span>KES {subtotal.toLocaleString()}</span>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <button
        onClick={handleSendOrder}
        className="fixed bottom-5 right-5 z-50 rounded-full p-4 bg-green-900 text-white shadow-lg text-lg hover:bg-green-700 transition"
      >
        📩 WhatsApp
      </button>
    </div>
  );
};

export default ReviewPage;