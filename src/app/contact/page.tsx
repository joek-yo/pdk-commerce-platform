"use client";

import React, { useState } from "react";
import { FaUser, FaEnvelope, FaPhone, FaWhatsapp, FaEdit, FaCheckCircle, FaMapMarkerAlt, FaBullhorn } from "react-icons/fa";
import { getUIConfig } from "@/lib/getBusinessData";

const ContactSection: React.FC = () => {
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

    const whatsappNumber = business?.whatsapp || "254729724433";
    const cleanNumber = whatsappNumber.replace(/\D/g, "");
    const text = `*New Inquiry*%0A*Name:* ${form.name}%0A*Message:* ${form.message}`;

    window.open(`https://wa.me/${cleanNumber}?text=${text}`, "_blank");
  };

  const sectionClasses = "bg-surface border-l-4 border-l-gold border-y border-r border-border p-6 rounded-xl shadow-sm mb-6 relative overflow-hidden";
  const labelClasses = "flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.1em] text-subtext mb-2 ml-1";
  const inputStyle = "w-full bg-surface2 border border-border p-3 rounded-lg text-foreground font-bold text-sm placeholder:text-muted focus:bg-surface focus:border-gold outline-none transition-all duration-200";

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      {/* HEADER */}
      <header className="mb-10">
        <h1 className="text-4xl font-black tracking-tighter text-foreground leading-none italic">
          {business?.name || "PRIME DEALS"}
        </h1>
        <p className="text-subtext font-black text-[10px] uppercase tracking-[0.2em] mt-2">
          {business?.tagline || "Quality Products. Honest Prices."}
        </p>
      </header>

      {/* ANNOUNCEMENT */}
      {ui?.announcement?.active && (
        <div className="mb-6 bg-surface2 text-foreground p-4 rounded-xl flex items-center gap-4 border-b-4 border-gold">
          <FaBullhorn className="text-gold animate-pulse" />
          <p className="text-[11px] font-bold uppercase tracking-wider">
            {ui.announcement.text}
          </p>
        </div>
      )}

      <div className="space-y-4">
        {/* FORM SECTION */}
        <section className={sectionClasses}>
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-foreground flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-gold text-background flex items-center justify-center text-[8px]">01</span>
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
              className="w-full bg-whatsapp text-white h-14 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              <span>Send To WhatsApp</span>
              <FaWhatsapp size={18}/>
            </button>
          </div>
        </section>

        {/* SOCIAL PROOF */}
        {socialProof.length > 0 && (
          <section className="bg-surface2 border border-border rounded-xl p-6">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-subtext">Recent Activity</h2>
            <div className="space-y-3">
              {socialProof.map((item: any) => (
                <div key={item.id} className="flex items-start gap-3 bg-surface p-3 rounded-lg border border-border shadow-sm">
                  <FaCheckCircle size={12} className="mt-1 text-whatsapp" />
                  <div>
                    <p className="text-[11px] font-bold text-foreground leading-tight">{item.text}</p>
                    <span className="text-[9px] font-black uppercase text-gold">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FOOTER */}
        <div className="text-center pt-6">
          <div className="inline-flex items-center gap-2 text-subtext font-black text-[9px] uppercase tracking-widest bg-surface2 px-4 py-2 rounded-full">
            <FaMapMarkerAlt size={10} className="text-gold"/>
            <span>{business?.location || "Nairobi"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
