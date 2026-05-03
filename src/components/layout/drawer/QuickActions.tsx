// src components/layout/drawer/QuickActions.tsx

"use client";

import React from "react";
import { getBusinessData } from "@/lib/getBusinessData";
import { useCart } from "@/context/CartContext";
import { FaShoppingCart, FaHeart, FaFire, FaWhatsapp } from "react-icons/fa";

const QuickActions = () => {
  const { whatsapp } = getBusinessData();
  const { cart, openCart } = useCart();

  const cartCount = cart?.reduce((t, i) => t + i.quantity, 0) || 0;

  return (
    <div className="grid grid-cols-4 gap-2">

      {/* CART → NOW OPENS MINICARTDRAWER */}
      <button
        onClick={openCart}
        className="bg-slate-100 p-2 rounded-xl text-center relative flex flex-col items-center justify-center aspect-square hover:bg-slate-200 transition"
      >
        <FaShoppingCart size={14} />

        {cartCount > 0 && (
          <span className="absolute top-1 right-1 text-[10px] bg-red-500 text-white px-1.5 rounded-full">
            {cartCount}
          </span>
        )}

        <p className="text-[8px] font-bold mt-1">Cart</p>
      </button>

      {/* SAVED */}
      <button className="bg-slate-100 p-2 rounded-xl text-center flex flex-col items-center justify-center aspect-square hover:bg-slate-200 transition">
        <FaHeart size={14} />
        <p className="text-[8px] font-bold mt-1">Saved</p>
      </button>

      {/* DEALS */}
      <button className="bg-yellow-100 p-2 rounded-xl text-center flex flex-col items-center justify-center aspect-square hover:bg-yellow-200 transition">
        <FaFire size={14} />
        <p className="text-[8px] font-bold mt-1">Deals</p>
      </button>

      {/* WHATSAPP */}
      <a
        href={`https://wa.me/${whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 text-white p-2 rounded-xl text-center flex flex-col items-center justify-center aspect-square hover:bg-green-600 transition"
      >
        <FaWhatsapp size={14} />
        <p className="text-[8px] font-bold mt-1">Chat</p>
      </a>

    </div>
  );
};

export default QuickActions;