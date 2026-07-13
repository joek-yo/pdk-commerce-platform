"use client";

import React from "react";
import { FaTimes } from "react-icons/fa";
import { useTenant } from "@/context/TenantContext";

interface Props {
  onClose: () => void;
}

const DrawerHeader: React.FC<Props> = ({ onClose }) => {
  const { name, storefront } = useTenant();

  return (
    <div className="flex items-center justify-between px-4 py-4 border-b border-border">
      <div>
        <h2 className="font-black text-sm text-foreground">
          {name || "Prime Deals"}
        </h2>

        <p className="text-[10px] text-subtext">
          {storefront?.tagline || ""}
        </p>
      </div>

      <button
        onClick={onClose}
        className="text-foreground hover:text-gold transition p-2"
        aria-label="Close drawer"
      >
        <FaTimes size={16} />
      </button>
    </div>
  );
};

export default DrawerHeader;
