"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { FaUser, FaPhone, FaMapMarkerAlt, FaClock, FaEdit, FaBoxOpen, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Link from "next/link";

const CustomOrderPage: React.FC = () => {
  const router = useRouter();
  const {
    setCustomOrder,
    setOrderNotes,
    setOrderType,
    setDeliveryLocation,
    setScheduleTime, // This maps to globalSchedule in ReviewPage
  } = useCart();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    location: "",
    schedule: "", // Local state for the timing input
    request: "",
    notes: ""
  });

  const [fulfillment, setFulfillment] = useState<"pickup" | "delivery">("pickup");

  const handleProceed = () => {
    if (!form.name || !form.phone || !form.request) {
      alert("Please complete the Name, Phone, and Request fields.");
      return;
    }

    // sync local form to Global Context
    setCustomOrder(form.request);
    setOrderNotes(form.notes);
    setOrderType(fulfillment);
    setDeliveryLocation(form.location);
    setScheduleTime(form.schedule); // CRITICAL: This fixes the "Today" / "ASAP" timing consistency

    sessionStorage.setItem("customer_info", JSON.stringify({
      name: form.name,
      phone: form.phone
    }));

    router.push("/review");
  };

  const sectionClasses = "bg-white border-l-4 border-l-[#FDB813] border-y border-r border-slate-200 p-4 rounded-xl shadow-sm mb-4 relative overflow-hidden";
  const labelClasses = "flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.1em] text-slate-500 mb-2 ml-1";
  const inputStyle = "w-full bg-slate-50 border border-slate-200 p-3 rounded-lg text-slate-900 font-bold text-sm placeholder:text-slate-300 focus:bg-white focus:border-[#FDB813] outline-none transition-all duration-200";

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-900 pt-12 pb-32 px-4 font-sans">
      <div className="max-w-2xl mx-auto">
        
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 mb-6 transition-colors font-black text-[9px] uppercase tracking-widest">
          <FaChevronLeft size={8} /> Back to Shop
        </Link>

        <header className="mb-8 px-1">
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 leading-none">
            Custom <span className="text-[#FDB813]">Request</span>
          </h1>
          <p className="text-slate-400 font-black text-[9px] uppercase tracking-[0.2em] mt-1">
            Concierge Sourcing Service
          </p>
        </header>

        <div className="space-y-1">
          
          <section className={sectionClasses}>
            <div className="absolute top-0 right-0 p-4 text-slate-50 pointer-events-none">
              <FaUser size={40} />
            </div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-slate-900 flex items-center gap-2">
               <span className="w-5 h-5 rounded bg-slate-900 text-white flex items-center justify-center text-[8px]">01</span>
               Client Info
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
              <div className="space-y-1">
                <label className={labelClasses}><FaUser size={8}/> Full Name</label>
                <input 
                  className={inputStyle} 
                  placeholder="e.g. John Doe"
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className={labelClasses}><FaPhone size={8}/> Phone Number</label>
                <input 
                  className={inputStyle} 
                  placeholder="07XX XXX XXX"
                  value={form.phone}
                  onChange={(e) => setForm({...form, phone: e.target.value})}
                />
              </div>
            </div>
          </section>

          <section className={sectionClasses}>
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-slate-900 text-white flex items-center justify-center text-[8px]">02</span>
              Sourcing Details
            </h2>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className={labelClasses}><FaBoxOpen size={9}/> What are we looking for?</label>
                <textarea 
                  className={`${inputStyle} min-h-[100px] resize-none`}
                  placeholder="Describe the product, brand, or model..."
                  value={form.request}
                  onChange={(e) => setForm({...form, request: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label className={labelClasses}>Fulfillment Preference</label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    type="button"
                    onClick={() => setFulfillment("pickup")}
                    className={`h-12 rounded-lg font-black text-[9px] uppercase tracking-widest transition-all border ${fulfillment === "pickup" ? "bg-slate-900 text-white border-slate-900 shadow-sm" : "bg-white border-slate-200 text-slate-400"}`}
                  >
                    Store Pickup
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFulfillment("delivery")}
                    className={`h-12 rounded-lg font-black text-[9px] uppercase tracking-widest transition-all border ${fulfillment === "delivery" ? "bg-slate-900 text-white border-slate-900 shadow-sm" : "bg-white border-slate-200 text-slate-400"}`}
                  >
                    Door Delivery
                  </button>
                </div>
              </div>

              {fulfillment === "delivery" && (
                <div className="space-y-1 pt-1 animate-in fade-in slide-in-from-top-1">
                  <label className={labelClasses}><FaMapMarkerAlt size={9}/> Delivery Location</label>
                  <input 
                    className={inputStyle} 
                    placeholder="Area or Building Name"
                    value={form.location}
                    onChange={(e) => setForm({...form, location: e.target.value})}
                  />
                </div>
              )}
            </div>
          </section>

          <section className={sectionClasses}>
             <h2 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-slate-900 text-white flex items-center justify-center text-[8px]">03</span>
              Timing & Notes
            </h2>
            <div className="space-y-4">
              <div className="space-y-1">
                {/* FIXED: This field now correctly updates setScheduleTime */}
                <label className={labelClasses}><FaClock size={9}/> Urgency / Timeline</label>
                <input 
                  className={inputStyle} 
                  placeholder="e.g. Today / ASAP / Within 48 hours"
                  value={form.schedule}
                  onChange={(e) => setForm({...form, schedule: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className={labelClasses}><FaEdit size={9}/> Special Instructions</label>
                <textarea 
                  className={`${inputStyle} min-h-[80px] resize-none`} 
                  placeholder="Budget range or specific color preferences..."
                  value={form.notes}
                  onChange={(e) => setForm({...form, notes: e.target.value})}
                />
              </div>
            </div>
          </section>

          <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 z-50">
            <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
              <div className="hidden xs:block">
                <span className="text-[9px] font-black text-slate-400 uppercase block leading-none mb-1">Service Fee</span>
                <span className="text-sm font-black text-slate-900 tracking-tighter">FREE REQUEST</span>
              </div>
              <button 
                onClick={handleProceed}
                className="flex-1 bg-[#FDB813] text-black h-14 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-yellow-500 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-[0.98]"
              >
                <span>Review Request</span>
                <FaChevronRight size={10}/>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomOrderPage;