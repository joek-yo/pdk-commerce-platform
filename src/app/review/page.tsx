"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";
import { openWhatsApp } from "@/lib/whatsapp";
import { calculateTotal } from "@/lib/pricing";
import { 
  FaWhatsapp, FaChevronLeft, FaShoppingCart, FaMapMarkerAlt, 
  FaUser, FaCheckCircle, FaPhone, FaStickyNote, FaTruck, 
  FaMoneyBillWave, FaClock 
} from "react-icons/fa";

export default function ReviewPage() {
  const { 
    cart, 
    customOrder, 
    orderNotes, 
    orderType: globalOrderType, 
    deliveryLocation: globalLocation,
    scheduleTime: globalSchedule,
    setOrderType,
    setDeliveryLocation,
    setOrderNotes,
    setScheduleTime 
  } = useCart();

  const [customer, setCustomer] = useState({ name: "", phone: "" });

  useEffect(() => {
    const savedInfo = sessionStorage.getItem("customer_info");
    if (savedInfo) setCustomer(JSON.parse(savedInfo));
  }, []);

  const { subtotal, delivery, total } = useMemo(() => {
    return calculateTotal(cart, globalOrderType, globalLocation);
  }, [cart, globalOrderType, globalLocation]);

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
      orderNotes: orderNotes,
      scheduleTime: globalSchedule,
      customOrder: customOrder 
    });
  };

  // Restored the yellow stripe for generic sections
  const sectionClasses = "bg-white border-l-4 border-l-[#FDB813] border-y border-r border-slate-200 p-5 rounded-xl mb-4 shadow-sm relative overflow-hidden";
  const labelClasses = "flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 ml-1";
  const inputStyle = "w-full bg-slate-50 border border-slate-200 p-4 rounded-lg text-slate-900 font-bold text-sm placeholder:text-slate-300 focus:bg-white focus:border-[#FDB813] outline-none transition-all duration-200";

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-900 pt-12 pb-48 px-4 font-sans">
      <div className="max-w-2xl mx-auto">
        
        <Link href="/cart" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 mb-6 transition-colors font-black text-[10px] uppercase tracking-widest">
          <FaChevronLeft size={8} /> Back to Bag
        </Link>

        <header className="mb-8 px-1">
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 leading-none">
            Final <span className="text-[#FDB813]">Review</span>
          </h1>
          <p className="text-slate-400 font-black text-[9px] uppercase tracking-[0.2em] mt-2">Verify details before sending</p>
        </header>

        {/* 1. ORDER ITEMS SUMMARY - UNBOXED TO MATCH CART PAGE */}
        <div className="mb-8">
          <h2 className={labelClasses}><FaShoppingCart size={10}/> Order Content</h2>
          
          {hasCustomRequest && (
            <div className="mb-4 p-4 rounded-xl bg-slate-900 text-white shadow-md border-l-4 border-[#FDB813]">
              <div className="flex items-center gap-2 mb-2">
                <FaCheckCircle className="text-[#FDB813]" size={10}/>
                <h4 className="text-[9px] font-black uppercase tracking-widest text-[#FDB813]">Special Sourcing</h4>
              </div>
              <p className="text-sm font-bold italic leading-relaxed opacity-90">{customOrder}</p>
            </div>
          )}

          {hasItems && (
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="bg-white border border-slate-200 p-3 rounded-xl flex gap-4 shadow-sm relative group">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-50 flex-shrink-0 border border-slate-100">
                    <Image src={item.image || "/images/placeholder.jpg"} alt={item.name} fill className="object-cover" />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-center min-w-0">
                    <h3 className="font-black text-slate-900 text-sm leading-tight truncate uppercase tracking-tight">
                      {item.name}
                    </h3>
                    <p className="text-[#FDB813] font-black text-[10px] mt-1">
                      QTY: {item.quantity} × KES {item.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex flex-col justify-center text-right pr-2">
                    <p className="text-slate-900 font-black text-lg tracking-tighter leading-none">
                      KES {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 px-2 flex justify-between items-center">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Subtotal</span>
            <span className="font-black text-slate-900 text-lg tracking-tighter">KES {subtotal.toLocaleString()}</span>
          </div>
        </div>

        {/* 2. LOGISTICS & CUSTOMER INFO - RETAINED YELLOW STRIPE */}
        <section className={sectionClasses}>
          <h2 className={labelClasses}><FaTruck size={10}/> Fulfillment & Logistics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-1">
              <label className={labelClasses}><FaUser size={8}/> Full Name</label>
              <input 
                className={inputStyle} 
                value={customer.name}
                onChange={(e) => setCustomer({...customer, name: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className={labelClasses}><FaPhone size={8}/> Phone</label>
              <input 
                className={inputStyle} 
                value={customer.phone}
                onChange={(e) => setCustomer({...customer, phone: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <label className={labelClasses}><FaClock size={8}/> Requested Timeline</label>
            <input 
              className={inputStyle} 
              value={globalSchedule}
              placeholder="e.g. ASAP / Within 48 hours"
              onChange={(e) => setScheduleTime(e.target.value)}
            />
          </div>

          <div className="space-y-3 mb-6">
            <label className={labelClasses}><FaMapMarkerAlt size={8}/> Fulfillment Method</label>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setOrderType("pickup")}
                className={`h-12 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all border ${globalOrderType === "pickup" ? "bg-slate-900 text-white border-slate-900" : "bg-white border-slate-200 text-slate-400"}`}
              >
                Pickup
              </button>
              <button 
                onClick={() => setOrderType("delivery")}
                className={`h-12 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all border ${globalOrderType === "delivery" ? "bg-slate-900 text-white border-slate-900" : "bg-white border-slate-200 text-slate-400"}`}
              >
                Delivery
              </button>
            </div>
          </div>

          {globalOrderType === "delivery" && (
            <div className="space-y-1 mb-6">
              <label className={labelClasses}><FaMapMarkerAlt size={8}/> Delivery Address</label>
              <input 
                className={inputStyle} 
                value={globalLocation}
                placeholder="e.g. Westlands, Nairobi"
                onChange={(e) => setDeliveryLocation(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-1">
            <label className={labelClasses}><FaStickyNote size={8}/> General Notes</label>
            <textarea 
              className={`${inputStyle} h-20 resize-none`}
              value={orderNotes}
              placeholder="Any other details for our team..."
              onChange={(e) => setOrderNotes(e.target.value)}
            />
          </div>
        </section>

        {/* 3. BILLING - RETAINED YELLOW STRIPE */}
        <section className={sectionClasses}>
          <h2 className={labelClasses}><FaMoneyBillWave size={10}/> Billing Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-slate-500 font-bold text-xs uppercase">
              <span>Items</span>
              <span>KES {subtotal.toLocaleString()}</span>
            </div>

            {globalOrderType === "delivery" && (
              <div className="flex justify-between items-center text-[#FDB813] font-black text-xs uppercase">
                <span className="flex items-center gap-2"><FaTruck size={10}/> Delivery Fee</span>
                <span>KES {delivery.toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between items-end mt-4 pt-4 border-t-2 border-dashed border-slate-100">
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Total Payable</span>
                <span className="text-3xl font-black text-slate-900 tracking-tighter tabular-nums leading-none">
                  KES {total.toLocaleString()}
                </span>
              </div>
              <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-500 font-black text-[8px] uppercase tracking-widest">
                COD / M-Pesa
              </span>
            </div>
          </div>
        </section>

        {/* FOOTER CTA */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 z-50">
          <div className="max-w-2xl mx-auto">
            <button 
              onClick={handleCheckout}
              disabled={!customer.name || !customer.phone || (globalOrderType === "delivery" && !globalLocation)}
              className="w-full bg-[#25D366] text-white h-16 rounded-xl font-black text-lg uppercase tracking-widest hover:bg-[#1ebd5b] transition-all disabled:opacity-40 shadow-lg flex items-center justify-center gap-3"
            >
              <FaWhatsapp size={24} />
              <span>Confirm via WhatsApp</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}