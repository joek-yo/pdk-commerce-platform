// src/app/custom-order/page.tsx

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

const CustomOrderPage: React.FC = () => {
  const router = useRouter();

  const {
    setCustomOrder: setCartCustomOrder,
    setOrderNotes: setCartOrderNotes,
    setOrderType,
    setDeliveryLocation,
    setScheduleTime,
  } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // UNIVERSAL TERM (NOT FOOD SPECIFIC)
  const [fulfillmentType, setFulfillmentType] = useState<"pickup" | "delivery">("pickup");

  const [location, setLocation] = useState("");
  const [scheduleTimeLocal, setScheduleTimeLocal] = useState("");

  const [requestDetails, setRequestDetails] = useState("");
  const [notes, setNotes] = useState("");

  const handleProceed = () => {
    if (!name.trim() || !phone.trim() || !requestDetails.trim()) {
      alert("Please fill in your name, phone, and request details.");
      return;
    }

    if (fulfillmentType === "delivery" && !location.trim()) {
      alert("Please enter delivery location.");
      return;
    }

    // Sync global state
    setCartCustomOrder(requestDetails);
    setCartOrderNotes(notes);
    setOrderType(fulfillmentType);
    setDeliveryLocation(location);
    setScheduleTime(scheduleTimeLocal);

    sessionStorage.setItem(
      "customOrderData",
      JSON.stringify({
        name,
        phone,
        fulfillmentType,
        location,
        scheduleTime: scheduleTimeLocal,
      })
    );

    router.push("/review");
  };

  const primaryBtn =
    "w-full py-4 text-lg font-semibold rounded-xl bg-[#FDB813] text-[#0D0D0D] hover:bg-[#C2922F] transition shadow-sm";

  const secondaryBtn =
    "flex-1 py-3 rounded-lg border font-medium transition hover:bg-gray-50";

  const activeBtn =
    "flex-1 py-3 rounded-lg font-medium bg-[#FDB813] text-[#0D0D0D] border-[#FDB813]";

  return (
    <div className="min-h-screen bg-gray-50 py-14 px-4 sm:px-6">

      <div className="max-w-3xl mx-auto space-y-10">

        {/* HEADER */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">
            Make a Custom Request
          </h1>
          <p className="text-gray-500">
            Request anything — products, services, bulk orders, or special requirements.
          </p>
        </div>

        {/* CUSTOMER INFO */}
        <div className="bg-white rounded-2xl shadow-sm border p-8 space-y-5">
          <h2 className="text-lg font-semibold">Your Details</h2>

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-[#FDB813] outline-none"
          />

          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-[#FDB813] outline-none"
          />
        </div>

        {/* FULFILLMENT TYPE */}
        <div className="bg-white rounded-2xl shadow-sm border p-8 space-y-5">
          <h2 className="text-lg font-semibold">Fulfillment Type</h2>

          <div className="flex gap-4">
            <button
              onClick={() => setFulfillmentType("pickup")}
              className={fulfillmentType === "pickup" ? activeBtn : secondaryBtn}
            >
              Pickup
            </button>

            <button
              onClick={() => setFulfillmentType("delivery")}
              className={fulfillmentType === "delivery" ? activeBtn : secondaryBtn}
            >
              Delivery
            </button>
          </div>

          {fulfillmentType === "delivery" && (
            <input
              type="text"
              placeholder="Enter delivery location or link"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-[#FDB813] outline-none"
            />
          )}
        </div>

        {/* SCHEDULE */}
        <div className="bg-white rounded-2xl shadow-sm border p-8 space-y-5">
          <h2 className="text-lg font-semibold">Preferred Time (Optional)</h2>

          <input
            type="text"
            placeholder="e.g. Saturday 4PM"
            value={scheduleTimeLocal}
            onChange={(e) => setScheduleTimeLocal(e.target.value)}
            className="w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-[#FDB813] outline-none"
          />
        </div>

        {/* REQUEST DETAILS */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 space-y-5">
          <h2 className="text-lg font-semibold">Request Details</h2>

          <textarea
            value={requestDetails}
            onChange={(e) => setRequestDetails(e.target.value)}
            placeholder="Describe what you need..."
            className="w-full rounded-lg border px-4 py-3 min-h-[130px] focus:ring-2 focus:ring-[#FDB813] outline-none"
          />
        </div>

        {/* NOTES */}
        <div className="bg-white rounded-2xl shadow-sm border p-8 space-y-5">
          <h2 className="text-lg font-semibold">Additional Notes (Optional)</h2>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any extra instructions..."
            className="w-full rounded-lg border px-4 py-3 min-h-[110px] focus:ring-2 focus:ring-[#FDB813] outline-none"
          />
        </div>

        {/* CTA */}
        <button onClick={handleProceed} className={primaryBtn}>
          Review Request
        </button>

      </div>
    </div>
  );
};

export default CustomOrderPage;