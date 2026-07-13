"use client";

import React from "react";
import { FaTruck, FaBolt } from "react-icons/fa";
import { getUIConfig } from "@/lib/getBusinessData";

const DealsSection = () => {
  const { flashSale } = getUIConfig();

  return (
    <div className="text-xs font-bold space-y-2 text-foreground">

      <p className="flex items-center gap-2">
        <FaTruck size={12} className="text-gold" /> Free Delivery over KES 10,000
      </p>

      {flashSale.active && (
        <p className="flex items-center gap-2 text-danger">
          <FaBolt size={12} /> Flash Sale Active
        </p>
      )}

      <p className="flex items-center gap-2 text-subtext">
        <FaBolt size={12} className="text-gold" /> Limited stock on selected items
      </p>

    </div>
  );
};

export default DealsSection;
