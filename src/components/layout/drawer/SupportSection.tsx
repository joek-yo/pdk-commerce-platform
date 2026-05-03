// src components/layout/drawer/SupportSection.tsx

import React from "react";
import { getBusinessData } from "@/lib/getBusinessData";

const SupportSection = () => {
  const business = getBusinessData();

  return (
    <div className="space-y-2">

      <a
        href={`https://wa.me/${business.whatsapp}`}
        className="block bg-green-500 text-white text-center py-2 rounded-lg font-bold text-sm"
      >
        💬 WhatsApp Us
      </a>

      <p className="text-xs">📞 {business.phone}</p>
      <p className="text-xs">✉️ {business.email}</p>

    </div>
  );
};

export default SupportSection;