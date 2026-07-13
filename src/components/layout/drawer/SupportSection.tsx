"use client";

import React from "react";
import { FaWhatsapp, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { getBusinessData } from "@/lib/getBusinessData";

const SupportSection = () => {
  const business = getBusinessData();

  return (
    <div className="space-y-2">

      <a href={`https://wa.me/${business.whatsapp}`}
        className="flex items-center justify-center gap-2 bg-whatsapp text-background text-center py-2 rounded-lg font-bold text-sm hover:opacity-90 transition"
      >
        <FaWhatsapp size={14} /> WhatsApp Us
      </a>

      <p className="flex items-center gap-2 text-xs text-subtext">
        <FaPhoneAlt size={11} className="text-gold" /> {business.phone}
      </p>
      <p className="flex items-center gap-2 text-xs text-subtext">
        <FaEnvelope size={11} className="text-gold" /> {business.email}
      </p>

    </div>
  );
};

export default SupportSection;
