// src/app/review/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";
import { openWhatsApp } from "@/lib/whatsapp";
import { FaWhatsapp, FaChevronLeft, FaShoppingCart, FaMapMarkerAlt, FaUser, FaCheckCircle } from "react-icons/fa";

export default function ReviewPage() {
  const { 
    cart, 
    customOrder, 
    orderNotes, 
    orderType: globalOrderType, 
    deliveryLocation: globalLocation,
    scheduleTime: globalSchedule 
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
    openWhatsApp({
      cart,
      customerName: customer.name,
      customerPhone: customer.phone,
      orderType: globalOrderType,
      deliveryLocation: globalOrderType === "delivery" ? globalLocation : "Store Pickup",
      orderNotes: `Notes: ${orderNotes} | Schedule: ${globalSchedule}`,
      customRequest: customOrder
    });
  };

  // --- THE "POP" STYLING ---
  const sectionClasses = "bg-white border border-slate-200 p-8 rounded-[2.5rem] mb-10 shadow-xl shadow-slate-200/40";
  const labelClasses = "flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 ml-2";
  
  // 🔥 HIGH VISIBILITY INPUTS: 
  // Pure white background, thicker border, and a shadow to make it lift off the page.
  const inputStyle = "w-full bg-white border-2 border-slate-200 p-5 rounded-2xl text-slate-900 font-bold text-lg placeholder:text-slate-300 shadow-sm focus:border-[#FDB813] focus:shadow-[0_0_15px_rgba(253,184,19,0.1)] focus:ring-0 outline-none transition-all duration-300";

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
          <p className="text-slate-500 font-bold mt-2 text-sm uppercase tracking-wide">Almost there! Verify your details.</p>
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
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-[#FDB813]">Custom Sourcing</h4>
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

        {/* 2. CUSTOMER DETAILS CARD */}
        <section className={sectionClasses}>
          <h2 className={labelClasses}><FaUser size={12}/> Delivery Info</h2>
          <div className="grid grid-cols-1 gap-8 mb-8">
            
            {/* NAME BOX */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Full Name</label>
              <input 
                className={inputStyle} 
                value={customer.name} 
                placeholder="e.g. Joseph Kihiu" 
                onChange={(e) => setCustomer({...customer, name: e.target.value})} 
              />
            </div>

            {/* PHONE BOX */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Phone Number</label>
              <input 
                className={inputStyle} 
                value={customer.phone} 
                placeholder="07XX XXX XXX" 
                onChange={(e) => setCustomer({...customer, phone: e.target.value})} 
              />
            </div>

          </div>

          {/* METHOD BOX - High Contrast */}
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 flex justify-between items-center shadow-lg">
             <span className="text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
               <FaMapMarkerAlt/> Preferred Method
             </span>
             <span className="font-black text-[#FDB813] uppercase text-[10px] px-5 py-2 bg-white/10 rounded-xl border border-white/10">
               {globalOrderType}
             </span>
          </div>
        </section>

        {/* STICKY CTA */}
        <div className="fixed bottom-0 left-0 right-0 p-8 pt-24 bg-gradient-to-t from-[#F1F5F9] via-[#F1F5F9] to-transparent z-50 pointer-events-none">
          <div className="max-w-2xl mx-auto pointer-events-auto">
            <button 
              onClick={handleCheckout}
              disabled={!customer.name || !customer.phone}
              className="w-full bg-[#FDB813] text-black py-6 rounded-[2rem] font-black text-2xl hover:bg-[#E5A711] transition-all disabled:opacity-40 shadow-[0_25px_60px_rgba(253,184,19,0.5)] flex items-center justify-center gap-4 group"
            >
              <FaWhatsapp size={32} />
              <span>Confirm Order</span>
            </button>
            <p className="text-center text-[10px] text-slate-400 mt-5 font-black uppercase tracking-[0.3em]">
              Prime Deals Kenya • Secure Checkout
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}