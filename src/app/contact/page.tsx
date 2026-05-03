"use client";

import React, { useState } from "react";
import { FaUser, FaEnvelope, FaPhone, FaWhatsapp, FaEdit, FaCheckCircle, FaMapMarkerAlt, FaBullhorn } from "react-icons/fa";
import { getUIConfig } from "@/lib/getBusinessData";

const ContactSection: React.FC = () => {
  // 1. SOURCING DATA FROM YOUR JSON - Cast to 'any' to fix Vercel Build Error
  const config = getUIConfig() as any; 
  const business = config?.business || {};
  const ui = config?.ui || {};
  const socialProof = business?.socialProof || [];
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleWhatsAppSend = () => {
    if (!form.name || !form.message) {
      alert("Please enter your name and a message.");
      return;
    }

    // 2. DYNAMIC WHATSAPP LINK
    const whatsappNumber = business?.whatsapp || "254729724433";
    const cleanNumber = whatsappNumber.replace(/\D/g, "");
    const text = `*New Inquiry*%0A*Name:* ${form.name}%0A*Message:* ${form.message}`;

    window.open(`https://wa.me/${cleanNumber}?text=${text}`, "_blank");
  };

  // UI Standardized Styles
  const sectionClasses = "bg-white border-l-4 border-l-[#FDB813] border-y border-r border-slate-200 p-6 rounded-xl shadow-sm mb-6 relative overflow-hidden";
  const labelClasses = "flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.1em] text-slate-500 mb-2 ml-1";
  const inputStyle = "w-full bg-slate-50 border border-slate-200 p-3 rounded-lg text-slate-900 font-bold text-sm placeholder:text-slate-300 focus:bg-white focus:border-[#FDB813] outline-none transition-all duration-200";

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      {/* HEADER */}
      <header className="mb-10">
        <h1 className="text-4xl font-black tracking-tighter text-slate-900 leading-none italic">
          PRIME <span className="text-[#FDB813]">DEALS</span>
        </h1>
        <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mt-2">
          {business?.tagline || "Smart Deals. Smart Choices."}
        </p>
      </header>

      {/* 3. DYNAMIC ANNOUNCEMENT */}
      {ui?.announcement?.active && (
        <div className="mb-6 bg-slate-900 text-white p-4 rounded-xl flex items-center gap-4 border-b-4 border-[#FDB813]">
          <FaBullhorn className="text-[#FDB813] animate-pulse" />
          <p className="text-[11px] font-bold uppercase tracking-wider">
            {ui.announcement.text}
          </p>
        </div>
      )}

      <div className="space-y-4">
        {/* FORM SECTION */}
        <section className={sectionClasses}>
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-slate-900 flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-[#FDB813] text-slate-900 flex items-center justify-center text-[8px]">01</span>
            Direct WhatsApp Inquiry
          </h2>

          <div className="space-y-5 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className={labelClasses}><FaUser size={8}/> Full Name</label>
                <input 
                  className={inputStyle} 
                  value={form.name} 
                  onChange={(e) => setForm({...form, name: e.target.value})} 
                  placeholder="e.g. John Doe"
                />
              </div>
              <div className="space-y-1">
                <label className={labelClasses}><FaPhone size={8}/> Phone</label>
                <input 
                  className={inputStyle} 
                  value={form.phone} 
                  onChange={(e) => setForm({...form, phone: e.target.value})} 
                  placeholder="07XX XXX XXX"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className={labelClasses}><FaEdit size={9}/> Your Request</label>
              <textarea 
                className={`${inputStyle} min-h-[100px] resize-none`} 
                value={form.message} 
                onChange={(e) => setForm({...form, message: e.target.value})} 
                placeholder="Describe what you are looking for..."
              />
            </div>

            <button 
              onClick={handleWhatsAppSend} 
              className="w-full bg-[#25D366] text-white h-14 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              <span>Send To WhatsApp</span>
              <FaWhatsapp size={18}/>
            </button>
          </div>
        </section>

        {/* 4. SOCIAL PROOF */}
        {socialProof.length > 0 && (
          <section className="bg-slate-50 border border-slate-200 rounded-xl p-6">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-slate-400">Prime Activity</h2>
            <div className="space-y-3">
              {socialProof.map((item: any) => (
                <div key={item.id} className="flex items-start gap-3 bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                  <FaCheckCircle size={12} className="mt-1 text-[#25D366]" />
                  <div>
                    <p className="text-[11px] font-bold text-slate-800 leading-tight">{item.text}</p>
                    <span className="text-[9px] font-black uppercase text-[#FDB813]">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FOOTER */}
        <div className="text-center pt-6">
          <div className="inline-flex items-center gap-2 text-slate-400 font-black text-[9px] uppercase tracking-widest bg-slate-100 px-4 py-2 rounded-full">
            <FaMapMarkerAlt size={10} className="text-[#FDB813]"/>
            <span>{business?.location || "Nairobi"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;