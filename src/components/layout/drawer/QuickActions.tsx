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

      <button
        onClick={openCart}
        className="bg-surface2 border border-border p-2 rounded-xl text-center relative flex flex-col items-center justify-center aspect-square hover:border-gold/40 transition text-foreground"
      >
        <FaShoppingCart size={14} className="text-gold" />

        {cartCount > 0 && (
          <span className="absolute top-1 right-1 text-[10px] bg-danger text-background px-1.5 rounded-full">
            {cartCount}
          </span>
        )}

        <p className="text-[8px] font-bold mt-1">Cart</p>
      </button>

      <button className="bg-surface2 border border-border p-2 rounded-xl text-center flex flex-col items-center justify-center aspect-square hover:border-gold/40 transition text-foreground">
        <FaHeart size={14} className="text-gold" />
        <p className="text-[8px] font-bold mt-1">Saved</p>
      </button>

      <button className="bg-gold-soft border border-gold/30 p-2 rounded-xl text-center flex flex-col items-center justify-center aspect-square hover:border-gold/50 transition text-foreground">
        <FaFire size={14} className="text-gold" />
        <p className="text-[8px] font-bold mt-1">Deals</p>
      </button>

      <a href={`https://wa.me/${whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-whatsapp text-background p-2 rounded-xl text-center flex flex-col items-center justify-center aspect-square hover:opacity-90 transition"
      >
        <FaWhatsapp size={14} />
        <p className="text-[8px] font-bold mt-1">Chat</p>
      </a>

    </div>
  );
};

export default QuickActions;
