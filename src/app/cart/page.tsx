"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import menuData from "@/data/menu.json";
import ProductCard from "@/components/home/ProductCard";
import {
  FaTrashAlt, FaPlus, FaMinus, FaChevronRight, FaChevronLeft,
  FaShoppingCart, FaPenNib, FaLightbulb, FaArrowLeft, FaTruck
} from "react-icons/fa";
import { motion } from "framer-motion";
import Image from "next/image";

const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    customOrder,
    setCustomOrder,
  } = useCart();

  const router = useRouter();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [suggestedDeals, setSuggestedDeals] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const shippingThreshold = menuData.deliverySettings?.freeDeliveryThreshold || 10000;
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const progress = Math.min((subtotal / shippingThreshold) * 100, 100);
  const remaining = shippingThreshold - subtotal;

  useEffect(() => {
    const allItems = menuData.categories.flatMap(cat => cat.items);
    const filteredItems = allItems.filter(
      (item) => !cart.some((cartItem) => cartItem.id === item.id)
    );
    const shuffled = [...filteredItems].sort(() => 0.5 - Math.random()).slice(0, 8);
    setSuggestedDeals(shuffled);
  }, [cart.length]);

  const handleProceed = () => {
    if (cart.length === 0 && !customOrder) {
      setToastMessage("⚠️ Your cart is empty");
      setTimeout(() => setToastMessage(null), 2500);
      return;
    }
    router.push("/review");
  };

  const scrollDeals = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === "left" ? -clientWidth : clientWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const sectionClasses =
    "bg-surface border-l-4 border-l-gold border-y border-r border-border p-4 rounded-xl shadow-sm mb-4 relative overflow-hidden";

  const labelClasses =
    "flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.1em] text-subtext mb-2 ml-1";

  const inputStyle =
    "w-full bg-surface2 border border-border p-3 rounded-lg text-foreground font-bold text-sm placeholder:text-muted focus:bg-surface focus:border-gold outline-none transition-all duration-200 cursor-pointer";

  return (
    <div className="min-h-screen bg-background text-foreground pt-12 pb-32 px-4 font-sans">
      <div className="max-w-2xl mx-auto">

        {/* HEADER */}
        <div className="mb-6 flex justify-between items-end px-1">
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-foreground leading-none">
              My <span className="text-gold">Bag</span>
            </h1>
            <p className="text-subtext font-black text-[9px] uppercase tracking-[0.2em] mt-1">
              {cart.length} items
            </p>
          </div>

          <button
            onClick={() => router.push("/menu")}
            className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-subtext hover:text-foreground transition-all cursor-pointer"
          >
            <FaArrowLeft size={8} />
            <span>Back to Shop</span>
          </button>
        </div>

        {/* PROGRESS */}
        {cart.length > 0 && (
          <div className="bg-surface border border-border p-4 rounded-xl mb-6 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <FaTruck
                  className={remaining <= 0 ? "text-whatsapp" : "text-gold"}
                  size={12}
                />
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground">
                  {remaining > 0
                    ? `Add KES ${remaining.toLocaleString()} for Free Delivery`
                    : "Free Delivery Unlocked!"}
                </span>
              </div>
              <span className="text-[10px] font-black text-subtext">
                {Math.round(progress)}%
              </span>
            </div>

            <div className="h-2 w-full bg-surface2 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-gold cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* CART ITEMS */}
        {cart.length > 0 ? (
          <div className="space-y-3 mb-8">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-surface border border-border p-3 rounded-xl flex gap-4 shadow-sm relative group cursor-pointer hover:shadow-md transition"
              >
                <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-surface2 flex-shrink-0 border border-border cursor-pointer">
                  <Image
                    src={item.image || "/images/placeholder.jpg"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-center min-w-0">
                  <h3 className="font-black text-foreground text-sm sm:text-base leading-tight truncate mb-1 cursor-pointer">
                    {item.name}
                  </h3>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-subtext">
                      Unit:
                    </span>
                    <p className="text-gold font-black text-xs">
                      KES {item.price.toLocaleString()}
                    </p>
                  </div>

                  <p className="mt-2 text-foreground font-black text-lg tracking-tighter">
                    KES {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-col items-end justify-between border-l border-border pl-3 py-1">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="w-8 h-8 flex items-center justify-center text-muted hover:text-danger transition-colors cursor-pointer"
                  >
                    <FaTrashAlt size={12} />
                  </button>

                  <div className="flex items-center bg-foreground rounded-lg p-0.5 shadow-md cursor-pointer">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 flex items-center justify-center text-background/50 hover:text-background cursor-pointer"
                    >
                      <FaMinus size={8} />
                    </button>

                    <span className="w-6 text-center font-black text-[10px] text-background">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center text-background/50 hover:text-background cursor-pointer"
                    >
                      <FaPlus size={8} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-surface border border-border rounded-xl text-center py-12 mb-8 cursor-pointer">
            <FaShoppingCart className="mx-auto text-muted mb-3" size={32} />
            <h2 className="text-[10px] font-black text-subtext uppercase tracking-widest">
              Empty Bag
            </h2>
          </div>
        )}

        {/* You Might Also Like */}
        {suggestedDeals.length > 0 && (
          <div className="mb-10 relative">
            <div className="flex justify-between items-center mb-4 px-1">
              <h2 className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground flex items-center gap-2">
                <FaLightbulb className="text-gold" />
                You Might Also Like
              </h2>
            </div>

            <div className="relative group/nav">
              <button
                onClick={() => scrollDeals("left")}
                className="absolute left-[-12px] top-1/2 -translate-y-1/2 z-40 w-10 h-10 flex items-center justify-center rounded-full bg-foreground text-background shadow-xl hover:bg-gold active:scale-90 cursor-pointer border-2 border-background"
              >
                <FaChevronLeft size={12} />
              </button>

              <button
                onClick={() => scrollDeals("right")}
                className="absolute right-[-12px] top-1/2 -translate-y-1/2 z-40 w-10 h-10 flex items-center justify-center rounded-full bg-foreground text-background shadow-xl hover:bg-gold active:scale-90 cursor-pointer border-2 border-background"
              >
                <FaChevronRight size={12} />
              </button>

              <div
                ref={scrollRef}
                className="flex gap-3 overflow-x-auto pb-6 no-scrollbar snap-x snap-mandatory scroll-smooth px-1 cursor-pointer"
              >
                {suggestedDeals.map((item) => (
                  <div
                    key={item.id}
                    className="flex-none w-[calc(50%-6px)] sm:w-[calc((100%-24px)/3)] snap-start cursor-pointer"
                  >
                    <ProductCard {...item} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CHECKOUT */}
        <div className="fixed bottom-0 left-0 w-full bg-surface border-t border-border p-4 z-50 shadow-[0_-10px_20px_rgba(0,0,0,0.1)]">
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[9px] font-black text-subtext uppercase">
                  Total Payable
                </span>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-xs font-bold text-subtext">KES</span>
                <span className="text-2xl font-black text-foreground tracking-tighter tabular-nums">
                  {subtotal.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={handleProceed}
              className="flex-1 max-w-[240px] bg-gold text-background h-14 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gold-strong transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 cursor-pointer"
            >
              <span>Review & Checkout</span>
              <FaChevronRight size={10} />
            </button>
          </div>
        </div>

      </div>

      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-foreground text-gold px-6 py-3 rounded-lg font-black text-[10px] uppercase tracking-widest shadow-xl z-[100] cursor-pointer">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default CartPage;
