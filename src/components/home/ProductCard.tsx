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
  image?: string;
  hoverImage?: string;
  description: string;
  available?: boolean;

  // UNIVERSAL FLAGS (NOT HOSPITALITY SPECIFIC)
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
  image,
  hoverImage,
  description,
  available = true,
  featured = false,
  trending = false,
  isBundle = false,
  discountPercent,
  onAddToCart,
}) => {
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  const cartItem = cart.find((item) => item.id === id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const qtyBtn =
    "w-8 h-8 flex items-center justify-center rounded-lg font-bold transition bg-gray-200 hover:bg-gray-300 disabled:opacity-40";

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
      className="
        bg-white
        border border-gray-200
        rounded-2xl
        shadow-sm
        hover:shadow-xl
        transition-all duration-300
        flex flex-col relative
        overflow-hidden
      "
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >

      {/* ---------------- DISCOUNT ---------------- */}
      {discountPercent && (
        <div className="absolute top-2 right-2 z-10 bg-red-500 text-white text-[11px] px-2 py-1 rounded-full font-bold">
          -{discountPercent}%
        </div>
      )}

      {/* ---------------- UNIVERSAL BADGES ---------------- */}
      <div className="absolute top-2 left-2 flex flex-col space-y-1 z-10">

        {featured && (
          <span className="bg-blue-500 text-white text-[10px] px-2 py-1 rounded">
            ⭐ Featured
          </span>
        )}

        {trending && (
          <span className="bg-orange-500 text-white text-[10px] px-2 py-1 rounded">
            🔥 Trending
          </span>
        )}

        {isBundle && (
          <span className="bg-gray-800 text-white text-[10px] px-2 py-1 rounded">
            📦 Bundle
          </span>
        )}

      </div>

      {/* ---------------- IMAGE ---------------- */}
      <div className="relative h-36 sm:h-44 md:h-52 w-full overflow-hidden">

        <Image
          src={
            isHovered && hoverImage
              ? hoverImage
              : image || "/images/placeholder.jpg"
          }
          alt={name}
          fill
          className="object-cover transition-all duration-500"
        />

      </div>

      {/* ---------------- CONTENT ---------------- */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between">

        <div>
          <h3 className="text-sm sm:text-lg font-semibold text-gray-800 line-clamp-1">
            {name}
          </h3>

          <p className="text-gray-500 mt-1 text-xs sm:text-sm line-clamp-2">
            {description}
          </p>
        </div>

        {/* ---------------- PRICE ---------------- */}
        <div className="mt-3">

          <div className="flex items-center gap-2">

            <span className="text-gray-900 font-bold text-sm sm:text-lg">
              KES {price.toLocaleString()}
            </span>

            {oldPrice && (
              <span className="text-gray-400 line-through text-xs sm:text-sm">
                KES {oldPrice.toLocaleString()}
              </span>
            )}

          </div>

          {/* ---------------- QUANTITY ---------------- */}
          {cartItem && (
            <div className="flex items-center justify-center gap-2 mt-2">

              <button onClick={handleDecrease} className={qtyBtn}>
                −
              </button>

              <span className="font-semibold text-sm min-w-[20px] text-center">
                {quantity}
              </span>

              <button onClick={handleAddToCart} className={qtyBtn}>
                +
              </button>

            </div>
          )}

          {/* ---------------- ADD TO CART ---------------- */}
          {!cartItem && (
            <button
              onClick={handleAddToCart}
              disabled={!available}
              className="
                mt-2 text-sm font-semibold text-[#0D0D0D]
                underline underline-offset-4
                hover:text-[#C2922F]
                transition
              "
            >
              {available ? "Add to Cart →" : "Unavailable"}
            </button>
          )}

        </div>

      </div>
    </div>
  );
};

export default ProductCard;