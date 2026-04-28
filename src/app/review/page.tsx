"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";

export default function ReviewPage() {
  const { cart } = useCart();
  const [orderType, setOrderType] = useState<"pickup" | "delivery">("pickup");
  
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    location: "",
    schedule: "",
  });

  const subtotal = cart.reduce(
    (total, item) => total + (item.price || 0) * (item.quantity || 0),
    0
  );

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-6">Add some delicious items to get started!</p>
        <Link href="/menu" className="bg-[#FDB813] px-8 py-3 rounded-xl font-bold shadow-md hover:bg-[#e5a711] transition">
          Browse Menu
        </Link>
      </div>
    );
  }

  const inputStyle = "w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FDB813] outline-none transition bg-white";

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 min-h-screen pb-32 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Review Your Order</h1>

      {/* 1. ORDER SUMMARY (BEGIN WITH THIS) */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span className="bg-[#FDB813] text-xs px-2 py-1 rounded">1</span>
          Order Summary
        </h2>
        
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between items-center pb-4 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 border">
                  {item.image && (
                    <Image 
                      src={item.image} 
                      alt={item.name} 
                      fill 
                      className="object-cover" 
                    />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{item.name}</h3>
                  <p className="text-sm text-gray-500">Qty: {item.quantity} × KES {item.price.toLocaleString()}</p>
                </div>
              </div>
              <p className="font-bold text-gray-900">
                KES {(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center text-xl font-black text-gray-900">
            <span>Total Amount</span>
            <span>KES {subtotal.toLocaleString()}</span>
          </div>
        </div>
      </section>

      {/* 2. CUSTOMER DETAILS */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6 space-y-5">
        <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
          <span className="bg-[#FDB813] text-xs px-2 py-1 rounded">2</span>
          Customer Details
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1 ml-1">Your Name</label>
            <input 
              type="text" 
              placeholder="e.g. John Doe" 
              className={inputStyle}
              value={customer.name}
              onChange={(e) => setCustomer({...customer, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1 ml-1">Phone Number</label>
            <input 
              type="tel" 
              placeholder="0712 345 678" 
              className={inputStyle}
              value={customer.phone}
              onChange={(e) => setCustomer({...customer, phone: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-gray-500 mb-2 ml-1">Order Type</label>
          <div className="flex gap-3">
            <button 
              onClick={() => setOrderType("pickup")}
              className={`flex-1 py-3 rounded-xl font-bold border-2 transition flex items-center justify-center gap-2 ${orderType === "pickup" ? "border-[#FDB813] bg-[#FDB813]/5 text-black" : "border-gray-100 text-gray-400"}`}
            >
              🛍️ Pickup
            </button>
            <button 
              onClick={() => setOrderType("delivery")}
              className={`flex-1 py-3 rounded-xl font-bold border-2 transition flex items-center justify-center gap-2 ${orderType === "delivery" ? "border-[#FDB813] bg-[#FDB813]/5 text-black" : "border-gray-100 text-gray-400"}`}
            >
              🚚 Delivery
            </button>
          </div>
        </div>

        {orderType === "delivery" && (
          <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1 ml-1">Delivery Address / Google Maps Link</label>
            <textarea 
              placeholder="House No, Apartment Name, or Link" 
              className={inputStyle}
              rows={2}
              value={customer.location}
              onChange={(e) => setCustomer({...customer, location: e.target.value})}
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-bold uppercase text-gray-500 mb-1 ml-1">Schedule (Optional)</label>
          <input 
            type="text" 
            placeholder="e.g. Leave at the gate / Deliver at 5pm" 
            className={inputStyle}
            value={customer.schedule}
            onChange={(e) => setCustomer({...customer, schedule: e.target.value})}
          />
        </div>
      </section>

      {/* STICKY CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t shadow-lg z-10">
        <div className="max-w-2xl mx-auto">
          <button 
            disabled={!customer.name || !customer.phone}
            className="w-full bg-[#FDB813] text-black py-4 rounded-2xl font-black text-lg hover:bg-[#e5a711] disabled:bg-gray-200 disabled:text-gray-400 transition-all active:scale-[0.98]"
          >
            Place Order • KES {subtotal.toLocaleString()}
          </button>
        </div>
      </div>
    </div>
  );
}