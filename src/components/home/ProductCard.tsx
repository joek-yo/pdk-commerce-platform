"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaMinus, FaShoppingBag } from "react-icons/fa";

interface ProductProps {
  id: any;
  name: string;
  price?: number;
  oldPrice?: number;
  image?: string;
  hoverImage?: string;
  description: string;
  available?: boolean;
  featured?: boolean;
  trending?: boolean;
  discountPercent?: number;
  stock?: number;
}

interface ProductCardProps extends ProductProps {
  isBundle?: boolean;
  onAddToCart?: () => void;
  variant?: "grid" | "compact";
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price = 0,
  oldPrice,
  image,
  hoverImage,
  description,
  available = true,
  featured = false,
  trending = false,
  isBundle = false,
  discountPercent,
  stock,
  onAddToCart,
  variant = "grid",
}) => {
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  const cartItem = cart.find((item) => item.id === id);
  const quantity = cartItem ? cartItem.quantity : 0;

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
    if (quantity <= 1) removeFromCart(id);
    else updateQuantity(id, quantity - 1);
  };

  const badgeBase =
    "absolute top-2 left-2 z-30 px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded-md shadow-sm";

  return (
    <div
      className={`group bg-white rounded-lg border border-slate-100 flex flex-col overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ${
        isBundle ? "min-h-[300px] sm:min-h-[340px]" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* IMAGE CONTAINER */}
      <div
        className={`relative bg-white overflow-hidden ${
          isBundle ? "h-36 sm:h-44" : "aspect-square"
        }`}
      >
        {stock && stock <= 5 ? (
          <span className={`${badgeBase} bg-red-600 text-white`}>
            Only {stock}
          </span>
        ) : featured ? (
          <span className={`${badgeBase} bg-slate-900 text-white`}>
            Featured
          </span>
        ) : trending ? (
          <span className={`${badgeBase} bg-[#FDB813] text-black`}>
            Hot
          </span>
        ) : discountPercent ? (
          <span className={`${badgeBase} bg-red-600 text-white`}>
            -{discountPercent}%
          </span>
        ) : !available ? (
          <span className={`${badgeBase} bg-slate-400 text-white`}>
            Sold Out
          </span>
        ) : null}

        <Image
          src={isHovered && hoverImage ? hoverImage : image || "/placeholder.jpg"}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* CONTENT SECTION */}
      <div className="p-2 flex flex-col flex-1">
        <h3 className="text-[11px] sm:text-xs font-black uppercase text-slate-900 line-clamp-1 leading-tight">
          {name}
        </h3>

        <p className="text-[9px] text-slate-400 font-bold mt-0.5 line-clamp-1">
          {description}
        </p>

        {/* PRICE SECTION WITH OLD PRICE FIX */}
        <div className="mt-1.5 flex items-center gap-1.5">
          <span className="text-xs sm:text-sm font-black text-slate-900">
            KES {price.toLocaleString()}
          </span>
          
          {oldPrice && oldPrice > price && (
            <span className="text-[9px] sm:text-[10px] text-slate-400 line-through font-bold">
              KES {oldPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* COMPACT CTA BAR */}
        <div className="mt-auto pt-2">
          <AnimatePresence mode="wait">
            {cartItem ? (
              <motion.div
                key="qty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-7 bg-slate-900 rounded-md flex items-center justify-between px-3"
              >
                <button onClick={handleDecrease} className="text-[#FDB813]">
                  <FaMinus size={8} />
                </button>
                <span className="text-white font-black text-[10px]">
                  {quantity}
                </span>
                <button onClick={handleAddToCart} className="text-[#FDB813]">
                  <FaPlus size={8} />
                </button>
              </motion.div>
            ) : (
              <motion.button
                key="add"
                onClick={handleAddToCart}
                disabled={!available}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`
                  w-full h-7 rounded-md flex items-center justify-center gap-1.5
                  text-[9px] font-black uppercase tracking-wider
                  transition-all duration-300
                  ${
                    available
                      ? "bg-slate-900 text-white hover:bg-[#FDB813] hover:text-black"
                      : "bg-slate-200 text-slate-400"
                  }
                `}
              >
                <FaShoppingBag size={9} />
                {available ? "Add to Bag" : "Out"}
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;