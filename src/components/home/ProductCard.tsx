"use client";

import React from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

interface ProductProps {
  id: number;
  name: string;
  price?: number;
  image?: string;
  description: string;
  available?: boolean;
  jabysFavorite?: boolean;
  bestSelling?: boolean;
}

interface ProductCardProps extends ProductProps {
  isBundle?: boolean;
  onAddToCart?: () => void; // <-- added this
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price = 0,
  image,
  description,
  available = true,
  jabysFavorite = false,
  bestSelling = false,
  isBundle = false,
  onAddToCart, // <-- added here
}) => {
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();

  // Check if the product is already in the cart
  const cartItem = cart.find((item) => item.id === id);
  const quantity = cartItem ? cartItem.quantity : 0;

  // Use onAddToCart from props if passed, otherwise fallback to default
  const handleAddToCart = () => {
    if (!available) return;

    if (onAddToCart) {
      onAddToCart();
      return;
    }

    if (!cartItem) {
      addToCart({ id, name, price, quantity: 1, image: image || "/images/placeholder.jpg" });
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
    <div className="bg-white rounded-xl shadow-md flex flex-col relative hover:scale-105 transition-transform duration-200">
      {/* BADGES */}
      {(bestSelling || jabysFavorite || isBundle) && (
        <div className="absolute top-2 left-2 flex flex-col space-y-1 z-10">
          {bestSelling && <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">🔥 Best Seller</span>}
          {jabysFavorite && <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">⭐ Jaby's Favorite</span>}
          {isBundle && <span className="bg-gray-700 text-white text-xs px-2 py-1 rounded">🎁 Bundle</span>}
        </div>
      )}

      {/* PRODUCT IMAGE */}
      <div className="relative h-48 w-full rounded-t-xl overflow-hidden">
        <Image
          src={image || "/images/placeholder.jpg"}
          alt={name}
          fill
          className="object-cover"
          loading="lazy"
        />
      </div>

      {/* DETAILS */}
      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
          <p className="text-gray-500 mt-1 text-sm">{description}</p>
        </div>

        <div className="mt-4 flex flex-col space-y-2">
          <span className="text-gray-900 font-bold">{`KES ${price.toLocaleString()}`}</span>

          {/* QUANTITY CONTROLS */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDecrease}
              className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              disabled={!available || quantity === 0}
            >
              -
            </button>
            <span>{quantity}</span>
            <button
              onClick={handleAddToCart}
              className={`px-2 py-1 rounded transition ${
                !available ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-green-900 text-white hover:bg-green-700"
              }`}
              disabled={!available}
            >
              +
            </button>
          </div>

          {/* ADD TO CART BUTTON */}
          {!cartItem && (
            <button
              onClick={handleAddToCart}
              disabled={!available}
              className={`mt-2 px-4 py-2 font-semibold rounded-lg shadow-md transition-all duration-200
                ${!available ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-green-900 text-white hover:bg-green-700"}`}
            >
              {!available ? "Out of Stock" : "Add to Cart"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;