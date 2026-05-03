"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import {
  FaTrashAlt,
  FaPlus,
  FaMinus,
  FaTimes,
  FaShoppingCart,
} from "react-icons/fa";

import menuData from "@/data/menu.json";

const MiniCartDrawer: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    isCartDrawerOpen,
    openCart,
    closeCart,
    clearCart,
  } = useCart();

  const router = useRouter();
  const pathname = usePathname() ?? "";

  const [hovering, setHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const shippingThreshold =
    menuData.deliverySettings?.freeDeliveryThreshold || 0;

  const totalItems = cart.reduce((t, i) => t + i.quantity, 0);

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const progress = shippingThreshold
    ? Math.min((subtotal / shippingThreshold) * 100, 100)
    : 0;

  const remaining = Math.max(shippingThreshold - subtotal, 0);

  // MOBILE DETECTION
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // AUTO CLOSE (DESKTOP ONLY)
  useEffect(() => {
    if (isCartDrawerOpen && !isMobile) {
      const timer = setTimeout(() => {
        if (!hovering) closeCart();
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [isCartDrawerOpen, hovering, isMobile, closeCart]);

  const hideFloatingCart =
    pathname.includes("/cart") ||
    pathname.includes("/review") ||
    pathname.includes("/checkout");

  const handleViewCart = () => {
    closeCart();
    setTimeout(() => router.push("/cart"), 80);
  };

  return (
    <>
      {/* FLOATING BUTTON (MOBILE ONLY) */}
      {isMobile && totalItems > 0 && !hideFloatingCart && (
        <button
          onClick={openCart}
          className="fixed bottom-6 right-6 z-[60] flex items-center gap-3 px-6 py-4 rounded-xl font-black bg-slate-900 text-white shadow-xl active:scale-95 cursor-pointer"
        >
          <FaShoppingCart className="text-[#FDB813]" />
          <span className="text-[10px] uppercase tracking-widest">
            ({totalItems})
          </span>
        </button>
      )}

      <AnimatePresence>
        {isCartDrawerOpen && (
          <>
            {/* BACKDROP */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] cursor-pointer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeCart}
            />

            {/* DRAWER */}
            <motion.div
              className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-[#F1F5F9] z-[101] flex flex-col shadow-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 250, damping: 30 }}
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
            >
              {/* HEADER */}
              <div className="bg-white p-4 border-b border-slate-200 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-[#FDB813]">
                    <FaShoppingCart size={16} />
                  </div>

                  <div>
                    <h2 className="text-sm font-black uppercase">Your Bag</h2>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      {totalItems} items
                    </p>
                  </div>
                </div>

                <button
                  onClick={closeCart}
                  className="w-8 h-8 flex items-center justify-center rounded-md bg-slate-50 text-slate-400 hover:text-slate-900 cursor-pointer"
                >
                  <FaTimes size={14} />
                </button>
              </div>

              {/* PROGRESS */}
              <div className="px-4 py-4 bg-white border-b border-slate-200">
                <p className="text-[10px] font-black uppercase mb-2 text-slate-600">
                  {remaining > 0
                    ? `Add KES ${remaining.toLocaleString()} for Free Delivery`
                    : "Free Delivery Unlocked!"}
                </p>

                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-[#FDB813]"
                  />
                </div>
              </div>

              {/* ITEMS */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cart.length === 0 ? (
                  <div className="bg-white border border-slate-200 rounded-xl text-center py-10">
                    <FaShoppingCart
                      className="mx-auto text-slate-200 mb-3"
                      size={28}
                    />
                    <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Empty Bag
                    </h2>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white border border-slate-200 p-3 rounded-xl flex gap-4 shadow-sm"
                    >
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0">
                        <Image
                          src={item.image || "/images/placeholder.jpg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-center min-w-0">
                        <h3 className="text-sm font-black text-slate-900 uppercase truncate">
                          {item.name}
                        </h3>

                        <p className="text-[10px] text-slate-400 font-bold">
                          Unit: KES {item.price.toLocaleString()}
                        </p>

                        <p className="text-[#FDB813] font-black text-base mt-1">
                          KES {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex flex-col items-end justify-between border-l border-slate-100 pl-3">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-300 hover:text-red-500 cursor-pointer"
                        >
                          <FaTrashAlt size={12} />
                        </button>

                        <div className="flex items-center bg-slate-900 rounded-md p-0.5">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="w-6 h-6 flex items-center justify-center text-white cursor-pointer"
                          >
                            <FaMinus size={8} />
                          </button>

                          <span className="w-6 text-center text-white text-[10px] font-black">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="w-6 h-6 flex items-center justify-center text-white cursor-pointer"
                          >
                            <FaPlus size={8} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* FOOTER */}
              <div className="p-4 bg-white border-t border-slate-200">
                <button
                  onClick={handleViewCart}
                  className="w-full bg-[#FDB813] h-12 font-black uppercase text-xs rounded-xl cursor-pointer"
                >
                  Review Order
                </button>

                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="w-full text-xs mt-2 text-red-500 font-bold cursor-pointer"
                  >
                    Clear Cart
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MiniCartDrawer;