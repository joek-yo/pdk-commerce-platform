"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";
import { openWhatsApp } from "@/lib/whatsapp";
import { calculateTotal } from "@/lib/pricing";
import { 
  FaWhatsapp, FaChevronLeft, FaShoppingCart, FaMapMarkerAlt, 
  FaUser, FaPhone, FaStickyNote, FaTruck, 
  FaMoneyBillWave, FaEdit, FaQuoteLeft, FaClock 
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

  // Mandatory logic: Name, Phone, and (if delivery) Address
  const isCertified = useMemo(() => {
    const hasInfo = customer.name.trim() !== "" && customer.phone.trim() !== "";
    const hasLocationIfRequired = globalOrderType === "delivery" ? globalLocation?.trim() !== "" : true;
    
    return hasInfo && hasLocationIfRequired;
  }, [customer, globalOrderType, globalLocation]);

  const handleCheckout = () => {
    // Check basic info first
    if (customer.name.trim() === "" || customer.phone.trim() === "") {
      return alert("Please fill in your Name and Phone Number.");
    }

    // Check location specifically if delivery is selected
    if (globalOrderType === "delivery" && (!globalLocation || globalLocation.trim() === "")) {
      return alert("Please provide a Delivery Address to proceed.");
    }
    
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

        {/* DYNAMIC ORDER CONTENT */}
        <div className="mb-8 space-y-4">
          <h2 className={labelClasses}><FaShoppingCart size={10}/> Order Content</h2>

          {customOrder && customOrder.trim() !== "" && (
            <div className="bg-[#0F172A] p-6 rounded-2xl shadow-xl relative border border-slate-800 overflow-hidden mb-4">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-slate-600 to-transparent opacity-30" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <FaEdit className="text-slate-500" size={12} />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Custom Sourcing</span>
                    </div>
                    <FaQuoteLeft className="text-slate-800" size={16} />
                </div>
                <p className="text-white text-base font-medium leading-relaxed italic">
                  {customOrder}
                </p>
              </div>
            </div>
          )}

          {cart.length > 0 && (
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="bg-white border border-slate-200 p-3 rounded-xl flex gap-4 shadow-sm relative group">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-50 flex-shrink-0 border border-slate-100">
                    <Image src={item.image || "/images/placeholder.jpg"} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center min-w-0">
                    <h3 className="font-black text-slate-900 text-sm leading-tight truncate uppercase tracking-tight">{item.name}</h3>
                    <p className="text-[#FDB813] font-black text-[10px] mt-1">QTY: {item.quantity} × KES {item.price.toLocaleString()}</p>
                  </div>
                  <div className="flex flex-col justify-center text-right pr-2">
                    <p className="text-slate-900 font-black text-lg tracking-tighter leading-none">KES {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* LOGISTICS */}
        <section className={sectionClasses}>
          <h2 className={labelClasses}><FaTruck size={10}/> Fulfillment & Logistics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-1">
              <label className={labelClasses}><FaUser size={8}/> Full Name</label>
              <input className={inputStyle} value={customer.name} onChange={(e) => setCustomer({...customer, name: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className={labelClasses}><FaPhone size={8}/> Phone</label>
              <input className={inputStyle} value={customer.phone} onChange={(e) => setCustomer({...customer, phone: e.target.value})} />
            </div>
          </div>

          <div className="space-y-1 mb-6">
            <label className={labelClasses}><FaClock size={8}/> Requested Timeline / Urgency</label>
            <input 
              placeholder="e.g. ASAP / Today" 
              className={inputStyle} 
              value={globalSchedule} 
              onChange={(e) => setScheduleTime(e.target.value)} 
            />
          </div>

          <div className="space-y-3 mb-6">
            <label className={labelClasses}><FaMapMarkerAlt size={8}/> Fulfillment Method</label>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setOrderType("pickup")} className={`h-12 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all border cursor-pointer ${globalOrderType === "pickup" ? "bg-slate-900 text-white border-slate-900" : "bg-white border-slate-200 text-slate-400"}`}>Pickup</button>
              <button onClick={() => setOrderType("delivery")} className={`h-12 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all border cursor-pointer ${globalOrderType === "delivery" ? "bg-slate-900 text-white border-slate-900" : "bg-white border-slate-200 text-slate-400"}`}>Delivery</button>
            </div>
          </div>

          {globalOrderType === "delivery" && (
            <div className="space-y-1 mb-6 text-slate-900">
              <label className={labelClasses}><FaMapMarkerAlt size={8}/> Delivery Address</label>
              <input placeholder="e.g. Westlands, Nairobi" className={inputStyle} value={globalLocation} onChange={(e) => setDeliveryLocation(e.target.value)} />
            </div>
          )}

          <div className="space-y-1">
            <label className={labelClasses}><FaStickyNote size={8}/> General Notes</label>
            <textarea placeholder="Any other instructions..." className={`${inputStyle} h-24 resize-none`} value={orderNotes} onChange={(e) => setOrderNotes(e.target.value)} />
          </div>
        </section>

        {/* BILLING SUMMARY */}
        <section className={sectionClasses}>
          <h2 className={labelClasses}><FaMoneyBillWave size={10}/> Billing Summary</h2>
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-slate-400 px-1">
              <span>Items</span>
              <span className="text-slate-900">KES {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-[#FDB813] px-1">
              <span className="flex items-center gap-2"><FaTruck size={10}/> Delivery Fee</span>
              <span>KES {delivery || 0}</span>
            </div>
            
            <div className="pt-4 border-t border-dashed border-slate-200">
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1 px-1">Total Payable</p>
                <div className="flex justify-between items-end px-1">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">
                        KES {total.toLocaleString()}
                    </h2>
                    <span className="bg-slate-100 text-slate-400 text-[8px] font-black px-2 py-1 rounded uppercase tracking-widest">
                        Tax Included
                    </span>
                </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-200 z-50">
          <div className="max-w-2xl mx-auto">
            <button 
              onClick={handleCheckout}
              className={`w-full h-16 rounded-xl font-black text-sm uppercase tracking-widest shadow-sm flex items-center justify-center gap-3 border-2 transition-all active:scale-95 cursor-pointer ${
                isCertified 
                ? "bg-[#25D366] text-white border-[#25D366]" 
                : "bg-[#B2F5CC] text-[#15803D] border-white"
              }`}
            >
              <FaWhatsapp size={20} />
              <span>Confirm via WhatsApp</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}