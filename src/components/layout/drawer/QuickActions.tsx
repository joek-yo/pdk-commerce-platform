// src components/layout/drawer/QuickActions.tsx

"use client";

import React from "react";
import { getBusinessData } from "@/lib/getBusinessData";
import { useCart } from "@/context/CartContext";

const QuickActions = () => {
  const business = getBusinessData();
  const whatsapp = business?.whatsapp || "";

  const { cart } = useCart();

  const cartCount = cart?.length || 0;

  return (
    <div className="grid grid-cols-4 gap-2">

      {/* CART */}
      <div className="bg-slate-100 p-3 rounded-lg text-center relative">
        🛒

        {cartCount > 0 && (
          <span className="absolute top-1 right-1 text-[10px] bg-red-500 text-white px-1 rounded">
            {cartCount}
          </span>
        )}

        <p className="text-[9px] font-bold mt-1">Cart</p>
      </div>

      {/* SAVED */}
      <div className="bg-slate-100 p-3 rounded-lg text-center">
        ❤️
        <p className="text-[9px] font-bold mt-1">Saved</p>
      </div>

      {/* FLASH */}
      <div className="bg-yellow-100 p-3 rounded-lg text-center">
        🔥
        <p className="text-[9px] font-bold mt-1">Deals</p>
      </div>

      {/* WHATSAPP */}
      <a
        href={`https://wa.me/${whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 text-white p-3 rounded-lg text-center"
      >
        💬
        <p className="text-[9px] font-bold mt-1">Chat</p>
      </a>

    </div>
  );
};

export default QuickActions;