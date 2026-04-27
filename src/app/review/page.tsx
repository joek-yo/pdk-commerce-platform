// FILE: src/app/review/page.tsx

"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useCart } from "@/context/CartContext";
import { openWhatsApp } from "@/lib/whatsapp";
import { calculateTotal } from "@/lib/pricing"; // ✅ SINGLE SOURCE OF TRUTH

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

  // ================= PRICING (ONLY SOURCE OF TRUTH) =================
  const { subtotal, delivery, total } = useMemo(
    () => calculateTotal(cart, orderType),
    [cart, orderType]
  );

  // ================= LOAD SESSION DATA =================
  useEffect(() => {
    const stored = sessionStorage.getItem("customOrderData");

    if (stored) {
      try {
        const data = JSON.parse(stored);

        setName(data.name || "");
        setPhone(data.phone || "");
        setOrderType(data.orderType || "pickup");
        setDeliveryLocation(data.location || "");
        setScheduleTime(data.scheduleTime || "");
      } catch (err) {
        console.error("Invalid session data:", err);
      }
    }
  }, [setOrderType, setDeliveryLocation, setScheduleTime]);

  // ================= SEND ORDER =================
  const handleSendOrder = () => {
    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (!phone.trim()) {
      alert("Please enter your phone number.");
      return;
    }

    if (orderType === "delivery" && !deliveryLocation.trim()) {
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
      customerName: name.trim(),
      customerPhone: phone.trim(),
    });

    setTimeout(() => {
      clearCart();
      sessionStorage.removeItem("customOrderData");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32 pt-[100px] sm:pt-[80px]">

      {/* HEADER */}
      <div className="px-4 pt-2 pb-6 text-center">
        <h1 className="text-2xl font-bold">Review Your Order</h1>
        <p className="text-sm text-gray-500 mt-1">
          Confirm everything before sending to WhatsApp
        </p>
      </div>

      <div className="max-w-xl mx-auto px-4 space-y-6 pb-32">

        {/* CUSTOM ORDER */}
        {customOrder && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-5">
            <h2 className="font-semibold mb-2">Custom Order</h2>
            <p className="text-sm text-gray-700">{customOrder}</p>
          </div>
        )}

        {/* CART */}
        {cart.length > 0 && (
          <div className="bg-white rounded-xl border p-5 space-y-3">
            <h2 className="font-semibold">Cart Items</h2>

            {cart.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.quantity} × {item.name}</span>
                <span>KES {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}

        {/* ORDER TYPE */}
        <div className="bg-white border rounded-xl p-5 space-y-4">
          <h2 className="font-semibold">Order Type</h2>

          <div className="flex gap-3">
            <button
              onClick={() => setOrderType("pickup")}
              className={`flex-1 py-3 rounded-lg border ${
                orderType === "pickup" ? "bg-green-900 text-white" : ""
              }`}
            >
              Pickup
            </button>

            <button
              onClick={() => setOrderType("delivery")}
              className={`flex-1 py-3 rounded-lg border ${
                orderType === "delivery" ? "bg-green-900 text-white" : ""
              }`}
            >
              Delivery
            </button>
          </div>

          {orderType === "delivery" && (
            <input
              value={deliveryLocation}
              onChange={(e) => setDeliveryLocation(e.target.value)}
              placeholder="Delivery location"
              className="w-full border p-3 rounded-lg"
            />
          )}

          <input
            value={scheduleTime}
            onChange={(e) => setScheduleTime(e.target.value)}
            placeholder="Schedule (optional)"
            className="w-full border p-3 rounded-lg"
          />
        </div>

        {/* TOTAL (FROM pricing.ts ONLY) */}
        <div className="bg-white border rounded-xl p-5 space-y-2">

          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>KES {subtotal.toLocaleString()}</span>
          </div>

          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span>KES {delivery.toLocaleString()}</span>
          </div>

          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total</span>
            <span>KES {total.toLocaleString()}</span>
          </div>

        </div>

        {/* CUSTOMER */}
        <div className="bg-white border rounded-xl p-5 space-y-4">
          <h2 className="font-semibold">Customer Details</h2>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full border p-3 rounded-lg"
          />

          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone"
            className="w-full border p-3 rounded-lg"
          />
        </div>

      </div>

      <button
        onClick={handleSendOrder}
        className="fixed bottom-5 right-5 p-4 rounded-full bg-green-900 text-white shadow-lg"
      >
        📩 WhatsApp
      </button>

    </div>
  );
};

export default ReviewPage;