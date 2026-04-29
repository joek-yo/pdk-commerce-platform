// src/app/review/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";
import { openWhatsApp } from "@/lib/whatsapp";
import { FaWhatsapp, FaChevronLeft, FaShoppingCart, FaMapMarkerAlt, FaUser, FaCheckCircle, FaPhone } from "react-icons/fa";

export default function ReviewPage() {
  const { 
    cart, 
    customOrder, 
    orderNotes, 
    orderType: globalOrderType, 
    deliveryLocation: globalLocation,
    scheduleTime: globalSchedule,
    setOrderType,
    setDeliveryLocation
  } = useCart();

  const [customer, setCustomer] = useState({ name: "", phone: "" });

  useEffect(() => {
    const savedInfo = sessionStorage.getItem("customer_info");
    if (savedInfo) setCustomer(JSON.parse(savedInfo));
  }, []);

  const subtotal = cart.reduce((t, i) => t + (i.price || 0) * (i.quantity || 0), 0);
  const hasItems = cart.length > 0;
  const hasCustomRequest = !!(customOrder && customOrder.trim());

  if (!hasItems && !hasCustomRequest) {
    return (
      <div className="min-h-screen bg-[#F1F5F9] flex flex-col items-center justify-center p-6 text-center">
         <FaShoppingCart className="text-slate-300 text-6xl mb-4" />
         <h2 className="text-2xl font-black text-slate-800">Your cart is empty</h2>
         <Link href="/" className="mt-4 text-[#FDB813] font-black uppercase text-sm tracking-widest">Return to Shop</Link>
      </div>
    );
  }

  const handleCheckout = () => {
    if (!customer.name || !customer.phone) return alert("Please provide details.");
    if (globalOrderType === "delivery" && !globalLocation) return alert("Please provide a delivery address.");

    openWhatsApp({
      cart,
      customerName: customer.name,
      customerPhone: customer.phone,
      orderType: globalOrderType,
      deliveryLocation: globalOrderType === "delivery" ? globalLocation : "Store Pickup",
      orderNotes: `Notes: ${orderNotes} | Timing: ${globalSchedule}`,
      customRequest: customOrder
    });
  };

  const sectionClasses = "bg-white border border-slate-200 p-8 rounded-[2.5rem] mb-10 shadow-xl shadow-slate-200/40";
  const labelClasses = "flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 ml-2";
  const inputStyle = "w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-2xl text-slate-900 font-bold text-lg placeholder:text-slate-300 shadow-sm focus:bg-white focus:border-[#FDB813] outline-none transition-all duration-300";

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-900 pt-24 pb-60 px-4 font-sans">
      <div className="max-w-2xl mx-auto">
        
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 mb-8 transition-colors font-black text-xs uppercase tracking-widest">
          <FaChevronLeft size={10} /> Back to Catalog
        </Link>

        <header className="mb-10">
          <h1 className="text-5xl font-black tracking-tighter text-slate-900">
            Final <span className="text-[#FDB813]">Review</span>
          </h1>
          <p className="text-slate-500 font-bold mt-2 text-sm uppercase tracking-wide">Verify your details before we chat.</p>
        </header>

        {/* 1. ORDER SUMMARY CARD */}
        <section className={sectionClasses}>
          <h2 className={labelClasses}><FaShoppingCart size={12}/> Your Selection</h2>
          <div className="space-y-6">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center group">
                <div className="flex items-center gap-5">
                  <div className="relative w-20 h-20 rounded-3xl overflow-hidden bg-slate-100 border border-slate-200">
                    <Image src={item.image || "/images/placeholder.jpg"} alt={item.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg leading-tight tracking-tight">{item.name}</h3>
                    <p className="text-xs font-black text-[#FDB813] mt-1 uppercase tracking-widest">
                      {item.quantity} Unit{item.quantity > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <p className="font-black text-slate-900 text-lg">KES {(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}

            {hasCustomRequest && (
              <div className="p-6 rounded-[2rem] bg-slate-900 text-white shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                  <FaCheckCircle className="text-[#FDB813]" size={14}/>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-[#FDB813]">Custom Sourcing Request</h4>
                </div>
                <p className="text-base italic font-bold leading-relaxed">"{customOrder}"</p>
              </div>
            )}
          </div>

          <div className="mt-10 pt-8 border-t-2 border-slate-100 flex justify-between items-end">
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] block mb-1">Total Amount</span>
              <span className="text-4xl font-black text-slate-900 tracking-tighter">KES {subtotal.toLocaleString()}</span>
            </div>
          </div>
        </section>

        {/* 2. CUSTOMER & DELIVERY INFO */}
        <section className={sectionClasses}>
          <h2 className={labelClasses}><FaUser size={12}/> Delivery Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-1">
              <label className={labelClasses}><FaUser size={10}/> Full Name</label>
              <input 
                className={inputStyle} 
                value={customer.name}
                placeholder="e.g. Joseph Kihiu"
                onChange={(e) => setCustomer({...customer, name: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className={labelClasses}><FaPhone size={10}/> Phone Number</label>
              <input 
                className={inputStyle} 
                value={customer.phone}
                placeholder="07XX XXX XXX"
                onChange={(e) => setCustomer({...customer, phone: e.target.value})}
              />
            </div>
          </div>

          {/* UNIFORM DELIVERY PREFERENCE TOGGLE */}
          <div className="space-y-4">
            <label className={labelClasses}><FaMapMarkerAlt size={10}/> Delivery Preference</label>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setOrderType("pickup")}
                className={`py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border-2 ${globalOrderType === "pickup" ? "bg-slate-900 text-white border-slate-900 shadow-xl" : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"}`}
              >
                Store Pickup
              </button>
              <button 
                onClick={() => setOrderType("delivery")}
                className={`py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border-2 ${globalOrderType === "delivery" ? "bg-slate-900 text-white border-slate-900 shadow-xl" : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"}`}
              >
                Door Delivery
              </button>
            </div>
          </div>

          {globalOrderType === "delivery" && (
            <div className="mt-6 space-y-1 animate-in fade-in slide-in-from-top-4 duration-500">
              <label className={labelClasses}><FaMapMarkerAlt size={10}/> Delivery Address</label>
              <input 
                className={inputStyle} 
                value={globalLocation}
                placeholder="Area, Apartment or Road"
                onChange={(e) => setDeliveryLocation(e.target.value)}
              />
            </div>
          )}
        </section>

        {/* STICKY CTA */}
        <div className="fixed bottom-0 left-0 right-0 p-8 pt-24 bg-gradient-to-t from-[#F1F5F9] via-[#F1F5F9] to-transparent z-50 pointer-events-none">
          <div className="max-w-2xl mx-auto pointer-events-auto">
            <button 
              onClick={handleCheckout}
              disabled={!customer.name || !customer.phone || (globalOrderType === "delivery" && !globalLocation)}
              className="w-full bg-[#FDB813] text-black py-6 rounded-[2rem] font-black text-2xl hover:bg-[#E5A711] transition-all disabled:opacity-40 shadow-[0_25px_60px_rgba(253,184,19,0.5)] flex items-center justify-center gap-4 group"
            >
              <FaWhatsapp size={32} />
              <span>Confirm & Send</span>
            </button>
            <p className="text-center text-[10px] text-slate-400 mt-5 font-black uppercase tracking-[0.3em]">
              Prime Deals Kenya • Secure Checkout via WhatsApp
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}