// src/components/home/ProductCard.tsx

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

interface ProductProps {
  id: number;
  name: string;
  price?: number;
  oldPrice?: number;
  discount?: number; // Added to match your JSON
  image?: string;
  hoverImage?: string;
  description: string;
  available?: boolean;
  featured?: boolean;
  trending?: boolean;
  discountPercent?: number;
}

interface ProductCardProps extends ProductProps {
  isBundle?: boolean;
  onAddToCart?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price = 0,
  oldPrice,
  discount, // From JSON
  image,
  hoverImage,
  description,
  available = true,
  featured = false,
  trending = false,
  isBundle = false,
  discountPercent, // From Props
  onAddToCart,
}) => {
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  // 1. Determine the percentage to display (prioritize discountPercent prop, then discount from JSON)
  const finalDiscount = discountPercent || discount;

  // 2. Determine the strikethrough price (prioritize oldPrice, then calculate from discount)
  const strikePrice = oldPrice 
    ? oldPrice 
    : (finalDiscount ? Math.round(price / (1 - finalDiscount / 100)) : null);

  const cartItem = cart.find((item) => item.id === id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const qtyBtn =
    "w-8 h-8 flex items-center justify-center rounded-lg font-bold transition bg-slate-100 hover:bg-slate-200 text-slate-900 disabled:opacity-40";

  const handleAddToCart = () => {
    if (!available) return;
    if (onAddToCart) return onAddToCart();

    if (!cartItem) {
      addToCart({
        id,
        name,
        price,
        quantity: 1,
        image: image || "/images/placeholder.jpg",
      });
    } else {
      updateQuantity(id, quantity + 1);
    }
  };

  const handleDecrease = () => {
    if (!cartItem) return;
    if (quantity <= 1) {
      removeFromCart(id);
    } else {
      updateQuantity(id, quantity - 1);
    }
  };

  return (
    <div
      className="bg-white border border-slate-100 rounded-[1.5rem] shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 flex flex-col relative overflow-hidden group h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ---------------- DISCOUNT TAG (Sleek Red) ---------------- */}
      {finalDiscount && finalDiscount > 0 && (
        <div className="absolute top-3 right-3 z-10 bg-red-600 text-white text-[9px] px-2 py-1 rounded-full font-black uppercase tracking-tighter shadow-lg animate-pulse">
          -{finalDiscount}%
        </div>
      )}

      {/* ---------------- STUDIO BADGES ---------------- */}
      <div className="absolute top-3 left-3 flex flex-col space-y-1.5 z-10">
        {featured && (
          <span className="bg-slate-900 text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded shadow-md">
            Featured
          </span>
        )}
        {trending && (
          <span className="bg-[#FDB813] text-slate-900 text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded shadow-md">
            Trending
          </span>
        )}
        {isBundle && (
          <span className="bg-white border border-slate-200 text-slate-500 text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded shadow-sm">
            Bundle
          </span>
        )}
      </div>

      {/* ---------------- IMAGE SECTION ---------------- */}
      <div className="relative h-44 sm:h-56 w-full overflow-hidden bg-slate-50">
        <Image
          src={isHovered && hoverImage ? hoverImage : image || "/images/placeholder.jpg"}
          alt={name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>

      {/* ---------------- CONTENT ---------------- */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between bg-white">
        <div className="mb-4">
          <h3 className="text-sm sm:text-base font-black text-slate-900 line-clamp-1 tracking-tight">
            {name}
          </h3>
          <p className="text-slate-400 mt-1 text-xs font-bold leading-snug line-clamp-2">
            {description}
          </p>
        </div>

        {/* ---------------- PRICE & ACTIONS ---------------- */}
        <div className="mt-auto">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-slate-900 font-black text-base sm:text-lg tracking-tighter">
              KES {price.toLocaleString()}
            </span>
            {strikePrice && (
              <span className="text-slate-300 line-through text-[10px] sm:text-xs font-bold">
                KES {strikePrice.toLocaleString()}
              </span>
            )}
          </div>

          {cartItem ? (
            <div className="flex items-center justify-between p-1 bg-slate-50 rounded-xl border border-slate-100">
              <button onClick={handleDecrease} className={qtyBtn}>−</button>
              <span className="font-black text-xs text-slate-900">{quantity}</span>
              <button onClick={handleAddToCart} className={qtyBtn}>+</button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={!available}
              className={`
                w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                ${available 
                  ? "bg-slate-900 text-white hover:bg-black shadow-lg shadow-slate-200 hover:shadow-slate-300 active:scale-95" 
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }
              `}
            >
              {available ? "Add to Cart" : "Out of Stock"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;