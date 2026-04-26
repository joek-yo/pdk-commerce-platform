"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

const CustomOrderPage: React.FC = () => {
  const router = useRouter();
  const { setCustomOrder: setCartCustomOrder, setOrderNotes: setCartOrderNotes } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [orderType, setOrderType] = useState<"pickup" | "delivery">("pickup");
  const [location, setLocation] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [customOrder, setCustomOrder] = useState("");
  const [notes, setNotes] = useState("");

  const handleProceed = () => {
    if (!name || !phone || !customOrder) {
      alert("Please fill in your name, phone, and custom order.");
      return;
    }

    if (orderType === "delivery" && !location) {
      alert("Please enter delivery location.");
      return;
    }

    setCartCustomOrder(customOrder);
    setCartOrderNotes(notes);

    sessionStorage.setItem(
      "customOrderData",
      JSON.stringify({
        name,
        phone,
        orderType,
        location,
        scheduleTime,
      })
    );

    router.push("/review");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-14 px-4 sm:px-6">

      <div className="max-w-3xl mx-auto space-y-10">

        {/* HEADER */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">
            Request a Custom Order
          </h1>
          <p className="text-gray-500">
            Cakes, catering, special meals, or bulk orders — describe what you need.
          </p>
        </div>

        {/* CUSTOMER INFO */}
        <div className="bg-white rounded-2xl shadow-sm border p-8 space-y-5">
          <h2 className="text-lg font-semibold">Customer Details</h2>

          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-green-700 focus:border-green-700 outline-none"
          />

          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-green-700 focus:border-green-700 outline-none"
          />
        </div>

        {/* ORDER TYPE */}
        <div className="bg-white rounded-2xl shadow-sm border p-8 space-y-5">
          <h2 className="text-lg font-semibold">Order Type</h2>

          <div className="flex gap-4">
            <button
              onClick={() => setOrderType("pickup")}
              className={`flex-1 py-3 rounded-lg border font-medium transition ${
                orderType === "pickup"
                  ? "bg-green-900 text-white border-green-900"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              Pickup
            </button>

            <button
              onClick={() => setOrderType("delivery")}
              className={`flex-1 py-3 rounded-lg border font-medium transition ${
                orderType === "delivery"
                  ? "bg-green-900 text-white border-green-900"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              Delivery
            </button>
          </div>

          {orderType === "delivery" && (
            <input
              type="text"
              placeholder="Delivery location or Google Maps link"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-green-700 focus:border-green-700 outline-none"
            />
          )}
        </div>

        {/* SCHEDULE */}
        <div className="bg-white rounded-2xl shadow-sm border p-8 space-y-5">
          <h2 className="text-lg font-semibold">Schedule (Optional)</h2>

          <input
            type="text"
            placeholder="Example: Saturday 4PM"
            value={scheduleTime}
            onChange={(e) => setScheduleTime(e.target.value)}
            className="w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-green-700 focus:border-green-700 outline-none"
          />
        </div>

        {/* CUSTOM ORDER */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 space-y-5">
          <h2 className="text-lg font-semibold">Custom Order Details</h2>

          <textarea
            value={customOrder}
            onChange={(e) => setCustomOrder(e.target.value)}
            placeholder="Example: 5kg vanilla birthday cake with strawberry filling and gold decorations."
            className="w-full rounded-lg border px-4 py-3 min-h-[130px] focus:ring-2 focus:ring-green-700 focus:border-green-700 outline-none"
          />
        </div>

        {/* NOTES */}
        <div className="bg-white rounded-2xl shadow-sm border p-8 space-y-5">
          <h2 className="text-lg font-semibold">Extra Notes (Optional)</h2>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Example: Less sugar, add candles."
            className="w-full rounded-lg border px-4 py-3 min-h-[110px] focus:ring-2 focus:ring-green-700 focus:border-green-700 outline-none"
          />
        </div>

        {/* SUBMIT BUTTON */}
        <button
          onClick={handleProceed}
          className="w-full py-4 text-lg font-semibold rounded-xl bg-green-900 text-white hover:bg-green-700 transition shadow-sm"
        >
          Review Order
        </button>

      </div>
    </div>
  );
};

export default CustomOrderPage;