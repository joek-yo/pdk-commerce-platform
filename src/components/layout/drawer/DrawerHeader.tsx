// src/components/layout/drawer/DrawerHeader.tsx

"use client";

import React from "react";
import { getBusinessData } from "@/lib/getBusinessData";

interface Props {
  onClose: () => void;
}

const DrawerHeader: React.FC<Props> = ({ onClose }) => {
  const business = getBusinessData();

  return (
    <div className="flex items-center justify-between px-4 py-4 border-b">
      <div>
        <h2 className="font-black text-sm">
          {business?.name || "Prime Deals"}
        </h2>

        <p className="text-[10px] text-slate-500">
          {business?.tagline || ""}
        </p>
      </div>

      <button
        onClick={onClose}
        className="text-xl font-bold hover:opacity-70 transition"
        aria-label="Close drawer"
      >
        ✕
      </button>
    </div>
  );
};

export default DrawerHeader;