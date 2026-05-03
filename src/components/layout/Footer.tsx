// src/components/layout/Footer.tsx

"use client";

import React from "react";
import Link from "next/link";
import menuData from "@/data/menu.json";
import { getBusinessData, getBusinessWhatsAppNumber } from "@/lib/getBusinessData";
import { 
  FaFacebookF, 
  FaInstagram, 
  FaWhatsapp, 
  FaEnvelope, 
  FaPhoneAlt, 
  FaMapMarkerAlt 
} from "react-icons/fa";

const Footer: React.FC = () => {
  const business = getBusinessData();
  const whatsapp = getBusinessWhatsAppNumber();

  // ✅ Dynamic navigation from JSON (fallback safe)
  const navigation = menuData?.navigation || [];

  return (
    <footer className="bg-[#0D0D0D] text-white pt-16 pb-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* ================= BRAND COLUMN ================= */}
        <div className="flex flex-col space-y-4 items-center md:items-start">
          <h3 className="text-3xl font-black tracking-tighter text-white">
            PRIME<span className="text-[#FDB813]">DEALS</span>
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs text-center md:text-left font-medium">
            {business.tagline || "Smart Deals. Smart Choices."}
          </p>

          <div className="flex space-x-3 pt-2">
            {[
              { icon: <FaFacebookF />, href: "#" },
              { icon: <FaInstagram />, href: "#" },
              { icon: <FaWhatsapp />, href: whatsapp ? `https://wa.me/${whatsapp}` : "#" }
            ].map((social, i) => (
              <a 
                key={i} 
                href={social.href}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#FDB813] hover:text-black transition-all duration-300 border border-white/10"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* ================= QUICK LINKS ================= */}
        <div className="flex flex-col items-center md:items-start space-y-4">
          <h4 className="text-sm uppercase tracking-[0.2em] font-bold text-gray-500">
            Navigation
          </h4>

          <nav className="flex flex-col space-y-3 items-center md:items-start text-sm font-medium">
            
            {/* 🔌 Dynamic Links from JSON */}
            {navigation.map((item: any) => (
              <Link
                key={item.id}
                href={item.path}
                className="hover:text-[#FDB813] transition-colors"
              >
                {item.label}
              </Link>
            ))}

          </nav>
        </div>

        {/* ================= CONTACT INFO ================= */}
        <div className="flex flex-col items-center md:items-start space-y-4">
          <h4 className="text-sm uppercase tracking-[0.2em] font-bold text-gray-500">
            Get in Touch
          </h4>

          <div className="flex flex-col space-y-4 text-sm items-center md:items-start">
            
            <a href={`tel:${business.phone}`} className="flex items-center gap-3 group">
              <div className="text-[#FDB813] bg-[#FDB813]/10 p-2 rounded-lg group-hover:bg-[#FDB813] group-hover:text-black transition-all">
                <FaPhoneAlt size={14} />
              </div>
              <span className="text-gray-300 group-hover:text-white transition-colors">
                {business.phone}
              </span>
            </a>

            <a href={`mailto:${business.email}`} className="flex items-center gap-3 group">
              <div className="text-[#FDB813] bg-[#FDB813]/10 p-2 rounded-lg group-hover:bg-[#FDB813] group-hover:text-black transition-all">
                <FaEnvelope size={14} />
              </div>
              <span className="text-gray-300 group-hover:text-white transition-colors">
                {business.email}
              </span>
            </a>

            <div className="flex items-center gap-3">
              <div className="text-[#FDB813] bg-[#FDB813]/10 p-2 rounded-lg">
                <FaMapMarkerAlt size={14} />
              </div>
              <span className="text-gray-300">
                {business.location || "Nairobi, Kenya"}
              </span>
            </div>

          </div>
        </div>

      </div>

      {/* ================= DIVIDER ================= */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="border-t border-white/5 mt-16 mb-8" />
      </div>

      {/* ================= BOTTOM BAR ================= */}
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        
        <div className="text-gray-500 text-[11px] font-medium text-center md:text-left uppercase tracking-wider">
          &copy; {new Date().getFullYear()}{" "}
          <span className="text-gray-300 font-bold">{business.name}</span>. All rights reserved.
        </div>

        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6">

          <div className="flex items-center gap-4 px-5 py-3 bg-white/[0.02] rounded-2xl border border-white/5 hover:border-[#FDB813]/30 transition-all group">
            
            <div className="flex flex-col items-end border-r border-white/10 pr-4">
              <span className="text-[9px] uppercase tracking-[0.2em] text-gray-500 font-bold">
                Platform by
              </span>
              <span className="text-sm font-black tracking-tighter text-white">
                BUIL<span className="text-[#FDB813]">NEX</span>
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-wider text-gray-500 font-bold">
                Build your system
              </span>
              <a 
                href="tel:0729724433" 
                className="text-xs font-black text-[#FDB813] hover:text-white transition-colors flex items-center gap-1.5"
              >
                <FaPhoneAlt size={8} /> 0729724433
              </a>
            </div>

          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;