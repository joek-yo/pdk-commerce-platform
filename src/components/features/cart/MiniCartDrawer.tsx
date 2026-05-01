"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { FaTrashAlt, FaPlus, FaMinus, FaTimes, FaShoppingBag, FaChevronRight } from "react-icons/fa";

// Pointing to the specific path from your terminal find command
import menuData from "@/data/menu.json";

const MiniCartDrawer: React.FC = () => {
  const {
    cart = [],
    removeFromCart,
    updateQuantity,
    isDrawerOpen,
    toggleDrawer,
    clearCart,
  } = useCart();

  const router = useRouter();
  const pathname = usePathname() ?? "";

  const [hovering, setHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // DYNAMIC DATA FROM MENU.JSON
  // Pulling 10,000 from deliverySettings.freeDeliveryThreshold
  const shippingThreshold = menuData.deliverySettings?.freeDeliveryThreshold || 0;
  
  const totalItems = Array.isArray(cart) ? cart.reduce((t, i) => t + (i?.quantity || 0), 0) : 0;
  const subtotal = Array.isArray(cart) ? cart.reduce((total, item) => total + (item?.price || 0) * (item?.quantity || 0), 0) : 0;

  const progress = Math.min((subtotal / shippingThreshold) * 100, 100);
  const remaining = shippingThreshold - subtotal;

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isDrawerOpen && !isMobile) {
      const timer = setTimeout(() => {
        if (!hovering) toggleDrawer(false);
      }, 2500); 
      return () => clearTimeout(timer);
    }
  }, [isDrawerOpen, hovering, isMobile, toggleDrawer]);

  const hideFloatingCart = pathname.includes("/cart") || pathname.includes("/review") || pathname.includes("/checkout");

  const handleViewCart = () => {
    toggleDrawer(false);
    setTimeout(() => router.push("/cart"), 50);
  };

  return (
    <>
      {/* FLOATING MOBILE TRIGGER */}
      {isMobile && totalItems > 0 && !hideFloatingCart && (
        <button
          onClick={() => toggleDrawer(true)}
          className="fixed bottom-6 right-6 z-[60] flex items-center gap-3 px-6 py-4 rounded-xl font-black bg-slate-900 text-white shadow-xl active:scale-95 transition-all"
        >
          <FaShoppingBag className="text-[#FDB813]" />
          <span className="uppercase text-[10px] tracking-widest">({totalItems})</span>
        </button>
      )}

      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* BACKDROP */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => toggleDrawer(false)}
            />

            {/* DRAWER */}
            <motion.div
              className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-[#F1F5F9] z-[101] flex flex-col shadow-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 250, damping: 30 }}
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
            >
              {/* HEADER */}
              <div className="bg-white p-5 border-b border-slate-200 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-[#FDB813] shadow-lg">
                    <FaShoppingBag size={18} />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900 tracking-tighter leading-none uppercase">
                      Your Bag
                    </h2>
                    <p className="text-slate-400 font-black text-[9px] uppercase tracking-[0.2em] mt-1">
                      {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
                    </p>
                  </div>
                </div>

                <button onClick={() => toggleDrawer(false)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 text-slate-400 hover:text-slate-900 transition-colors">
                  <FaTimes size={14} />
                </button>
              </div>

              {/* DYNAMIC PROGRESS BAR (Threshold pulled from menu.json) */}
              <div className="px-5 py-4 bg-white border-b border-slate-100">
                <p className="text-[10px] font-black uppercase tracking-widest mb-2 text-slate-600">
                  {remaining > 0 
                    ? `Add KES ${remaining.toLocaleString()} more for Free Shipping` 
                    : "🎉 You've unlocked Free Shipping!"}
                </p>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-[#FDB813]"
                  />
                </div>
              </div>

              {/* ITEMS SECTION */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-20 grayscale opacity-40">
                    <FaShoppingBag size={32} className="mb-3" />
                    <p className="font-black uppercase text-[10px] tracking-widest">Bag is Empty</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="bg-white border border-slate-100 p-3 rounded-2xl flex gap-3 shadow-sm relative group">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-50 flex-shrink-0 border border-slate-100">
                        <Image src={item.image || "/images/placeholder.jpg"} alt={item.name} fill className="object-cover" />
                      </div>

                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-tight truncate leading-tight w-4/5">{item.name}</h4>
                            <button 
                              onClick={() => removeFromCart(item.id)} 
                              className="text-slate-200 hover:text-red-500 transition-colors"
                            >
                              <FaTrashAlt size={10} />
                            </button>
                          </div>
                          <p className="text-[#FDB813] font-black text-[10px] mt-0.5">KES {item.price?.toLocaleString()}</p>
                        </div>

                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center bg-slate-50 rounded-lg p-1 border border-slate-100 scale-90 origin-left">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-1.5 text-slate-400 hover:text-slate-900"><FaMinus size={8} /></button>
                            <span className="px-2 text-xs font-black text-slate-900">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-1.5 text-slate-400 hover:text-slate-900"><FaPlus size={8} /></button>
                          </div>
                          <p className="font-black text-xs text-slate-900 tracking-tighter">
                            KES {(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* FOOTER */}
              <div className="p-5 bg-white border-t border-slate-200 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Subtotal</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs font-bold text-slate-400">KES</span>
                      <span className="text-3xl font-black text-slate-900 tracking-tighter tabular-nums leading-none">
                        {subtotal.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <button 
                    onClick={handleViewCart} 
                    className="w-full bg-[#FDB813] text-black h-14 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-yellow-500 transition-all flex items-center justify-center gap-2 shadow-xl shadow-yellow-100"
                  >
                    <span>Review Order</span>
                    <FaChevronRight size={10} />
                  </button>
                  
                  {cart.length > 0 && (
                    <button 
                      onClick={() => clearCart()} 
                      className="w-full py-2 text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] hover:text-red-500 transition-colors"
                    >
                      Clear Entire Bag
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MiniCartDrawer;