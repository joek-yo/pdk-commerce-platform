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

  const navigation = menuData?.navigation || [];

  return (
    <footer className="bg-background text-foreground pt-16 pb-8 border-t border-border">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">

        <div className="flex flex-col space-y-4 items-center md:items-start">
          <h3 className="text-3xl font-black tracking-tighter text-foreground">
            PRIME<span className="text-gold">DEALS</span>
          </h3>
          <p className="text-subtext text-sm leading-relaxed max-w-xs text-center md:text-left font-medium">
            {business.tagline || "Smart Deals. Smart Choices."}
          </p>

          <div className="flex space-x-3 pt-2">
            {[
              { icon: <FaFacebookF />, href: "#" },
              { icon: <FaInstagram />, href: "#" },
              { icon: <FaWhatsapp />, href: whatsapp ? `https://wa.me/${whatsapp}` : "#" }
            ].map((social, i) => (
              <a key={i} href={social.href}
                className="w-10 h-10 rounded-full bg-surface2 flex items-center justify-center hover:bg-gold hover:text-background transition-all duration-300 border border-border"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center md:items-start space-y-4">
          <h4 className="text-sm uppercase tracking-[0.2em] font-bold text-subtext">
            Navigation
          </h4>

          <nav className="flex flex-col space-y-3 items-center md:items-start text-sm font-medium">
            {navigation.map((item: any) => (
              <Link key={item.id} href={item.path}
                className="text-foreground hover:text-gold transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col items-center md:items-start space-y-4">
          <h4 className="text-sm uppercase tracking-[0.2em] font-bold text-subtext">
            Get in Touch
          </h4>

          <div className="flex flex-col space-y-4 text-sm items-center md:items-start">

            <a href={`tel:${business.phone}`} className="flex items-center gap-3 group">
              <div className="text-gold bg-gold-soft p-2 rounded-lg group-hover:bg-gold group-hover:text-background transition-all">
                <FaPhoneAlt size={14} />
              </div>
              <span className="text-subtext group-hover:text-foreground transition-colors">
                {business.phone}
              </span>
            </a>

            <a href={`mailto:${business.email}`} className="flex items-center gap-3 group">
              <div className="text-gold bg-gold-soft p-2 rounded-lg group-hover:bg-gold group-hover:text-background transition-all">
                <FaEnvelope size={14} />
              </div>
              <span className="text-subtext group-hover:text-foreground transition-colors">
                {business.email}
              </span>
            </a>

            <div className="flex items-center gap-3">
              <div className="text-gold bg-gold-soft p-2 rounded-lg">
                <FaMapMarkerAlt size={14} />
              </div>
              <span className="text-subtext">
                {business.location || "Nairobi, Kenya"}
              </span>
            </div>

          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="border-t border-border mt-16 mb-8" />
      </div>

      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">

        <div className="text-subtext text-[11px] font-medium text-center md:text-left uppercase tracking-wider">
          &copy; {new Date().getFullYear()}{" "}
          <span className="text-foreground font-bold">{business.name}</span>. All rights reserved.
        </div>

        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6">

          <div className="flex items-center gap-4 px-5 py-3 bg-surface rounded-2xl border border-border hover:border-gold/30 transition-all group">

            <div className="flex flex-col items-end border-r border-border pr-4">
              <span className="text-[9px] uppercase tracking-[0.2em] text-subtext font-bold">
                Platform by
              </span>
              <span className="text-sm font-black tracking-tighter text-foreground">
                BUIL<span className="text-gold">NEX</span>
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-wider text-subtext font-bold">
                Build your system
              </span>
              <a href="tel:0729724433"
                className="text-xs font-black text-gold hover:text-foreground transition-colors flex items-center gap-1.5"
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
