// src/app/custom-order/page.tsx

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { FaUser, FaPhone, FaMapMarkerAlt, FaClock, FaEdit, FaBoxOpen, FaChevronLeft } from "react-icons/fa";
import Link from "next/link";

const CustomOrderPage: React.FC = () => {
  const router = useRouter();
  const {
    setCustomOrder,
    setOrderNotes,
    setOrderType,
    setDeliveryLocation,
    setScheduleTime,
  } = useCart();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    location: "",
    schedule: "",
    request: "",
    notes: ""
  });

  const [fulfillment, setFulfillment] = useState<"pickup" | "delivery">("pickup");

  const handleProceed = () => {
    if (!form.name || !form.phone || !form.request) {
      alert("Please complete the Name, Phone, and Request fields.");
      return;
    }

    setCustomOrder(form.request);
    setOrderNotes(form.notes);
    setOrderType(fulfillment);
    setDeliveryLocation(form.location);
    setScheduleTime(form.schedule);

    sessionStorage.setItem("customer_info", JSON.stringify({
      name: form.name,
      phone: form.phone
    }));

    router.push("/review");
  };

  // --- REFINED LIGHT THEME STYLES ---
  const sectionClasses = "bg-white border border-slate-200 p-8 rounded-[2.5rem] mb-8 shadow-xl shadow-slate-200/50 relative overflow-hidden";
  const labelClasses = "flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 ml-1";
  
  // High-visibility input boxes that "pop"
  const inputStyle = "w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-2xl text-slate-900 font-bold text-lg placeholder:text-slate-300 shadow-sm focus:bg-white focus:border-[#FDB813] outline-none transition-all duration-300";

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-900 pt-24 pb-40 px-4 font-sans">
      <div className="max-w-2xl mx-auto">
        
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 mb-8 transition-colors font-black text-xs uppercase tracking-widest">
          <FaChevronLeft size={10} /> Back to Shop
        </Link>

        {/* HEADER SECTION */}
        <div className="mb-12">
          <div className="inline-block px-4 py-1.5 rounded-full bg-[#FDB813]/10 border border-[#FDB813]/20 text-[#C2922F] text-[10px] font-black uppercase tracking-[0.2em] mb-4">
            Concierge Sourcing
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-slate-900 mb-4">
            Custom <span className="text-[#FDB813]">Request</span>
          </h1>
          <p className="text-slate-500 text-lg font-bold leading-tight max-w-md">
            Describe what you need. Our team will source the best price for you.
          </p>
        </div>

        <div className="space-y-4">
          
          {/* STEP 1: CONTACT */}
          <section className={sectionClasses}>
            <div className="absolute top-0 right-0 p-8 text-slate-50 opacity-[0.03] pointer-events-none">
              <FaUser size={120} />
            </div>
            <h2 className="text-xl font-black mb-8 flex items-center gap-4 text-slate-900">
              <span className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-sm font-black shadow-lg">1</span>
              Client Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className={labelClasses}><FaUser size={10}/> Full Name</label>
                <input 
                  className={inputStyle} 
                  placeholder="e.g. Joseph Kihiu"
                  onChange={(e) => setForm({...form, name: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className={labelClasses}><FaPhone size={10}/> Phone Number</label>
                <input 
                  className={inputStyle} 
                  placeholder="07XX XXX XXX"
                  onChange={(e) => setForm({...form, phone: e.target.value})}
                />
              </div>
            </div>
          </section>

          {/* STEP 2: THE REQUEST */}
          <section className={sectionClasses}>
            <h2 className="text-xl font-black mb-8 flex items-center gap-4 text-slate-900">
              <span className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-sm font-black shadow-lg">2</span>
              What are we finding?
            </h2>
            <div className="space-y-8">
              <div className="space-y-1">
                <label className={labelClasses}><FaBoxOpen size={10}/> Product Description</label>
                <textarea 
                  className={`${inputStyle} min-h-[160px] resize-none leading-relaxed`}
                  placeholder="Tell us about the product, brand, or model..."
                  onChange={(e) => setForm({...form, request: e.target.value})}
                />
              </div>
              
              <div className="space-y-4">
                <label className={labelClasses}>Delivery Preference</label>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setFulfillment("pickup")}
                    className={`py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border-2 ${fulfillment === "pickup" ? "bg-slate-900 text-white border-slate-900 shadow-xl" : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"}`}
                  >
                    Store Pickup
                  </button>
                  <button 
                    onClick={() => setFulfillment("delivery")}
                    className={`py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border-2 ${fulfillment === "delivery" ? "bg-slate-900 text-white border-slate-900 shadow-xl" : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"}`}
                  >
                    Door Delivery
                  </button>
                </div>
              </div>

              {fulfillment === "delivery" && (
                <div className="space-y-1 animate-in fade-in slide-in-from-top-4 duration-500">
                  <label className={labelClasses}><FaMapMarkerAlt size={10}/> Delivery Address</label>
                  <input 
                    className={inputStyle} 
                    placeholder="Area, Apartment or Road"
                    onChange={(e) => setForm({...form, location: e.target.value})}
                  />
                </div>
              )}
            </div>
          </section>

          {/* STEP 3: LOGISTICS */}
          <section className={sectionClasses}>
             <h2 className="text-xl font-black mb-8 flex items-center gap-4 text-slate-900">
              <span className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-sm font-black shadow-lg">3</span>
              Preferences
            </h2>
            <div className="space-y-8">
              <div className="space-y-1">
                <label className={labelClasses}><FaClock size={10}/> Preferred Timing</label>
                <input 
                  className={inputStyle} 
                  placeholder="e.g. As soon as possible / Next week"
                  onChange={(e) => setForm({...form, schedule: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className={labelClasses}><FaEdit size={10}/> Special Instructions</label>
                <textarea 
                  className={`${inputStyle} min-h-[100px] resize-none`} 
                  placeholder="Color preferences, budget, or other notes..."
                  onChange={(e) => setForm({...form, notes: e.target.value})}
                />
              </div>
            </div>
          </section>

          {/* FINAL ACTION BUTTON */}
          <div className="pt-6">
            <button 
              onClick={handleProceed}
              className="w-full bg-[#FDB813] text-black py-7 rounded-[2rem] font-black text-2xl hover:bg-[#E5A711] hover:scale-[1.01] active:scale-[0.98] transition-all shadow-[0_20px_50px_rgba(253,184,19,0.4)] flex items-center justify-center gap-4"
            >
              <span>Review Special Order</span>
            </button>
            <p className="text-center text-[10px] text-slate-400 mt-6 font-black uppercase tracking-[0.4em]">
              Requesting is free • No commitment required
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CustomOrderPage;