// src components/layout/drawer/DealsSection.tsx

import React from "react";
import { getUIConfig } from "@/lib/getBusinessData";

const DealsSection = () => {
  const { flashSale } = getUIConfig();

  return (
    <div className="bg-yellow-50 p-3 rounded-lg text-xs font-bold space-y-1">

      <p>🚚 Free Delivery over KES 10,000</p>

      {flashSale.active && (
        <p className="text-red-600">🔥 Flash Sale Active</p>
      )}

      <p>⚡ Limited stock on selected items</p>

    </div>
  );
};

export default DealsSection;