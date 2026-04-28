// src/components/features/cart/MiniCartDrawer.tsx

"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";

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

  // ================= SAFE TOTALS =================
  const totalItems = Array.isArray(cart)
    ? cart.reduce((t, i) => t + (i?.quantity || 0), 0)
    : 0;

  const subtotal = Array.isArray(cart)
    ? cart.reduce(
        (total, item) =>
          total + (item?.price || 0) * (item?.quantity || 0),
        0
      )
    : 0;

  // ================= DEVICE DETECTION =================
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth < 768);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ================= AUTO CLOSE =================
  useEffect(() => {
    if (isDrawerOpen && !isMobile) {
      const timer = setTimeout(() => {
        if (!hovering) toggleDrawer(false);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [isDrawerOpen, hovering, isMobile, toggleDrawer]);

  // ================= ROUTE SAFETY =================
  const hideFloatingCart =
    pathname.includes("/cart") ||
    pathname.includes("/review") ||
    pathname.includes("/checkout");

  // ================= NAVIGATION =================
  const handleViewCart = () => {
    toggleDrawer(false);

    // IMPORTANT: ensure drawer closes before route change
    setTimeout(() => {
      router.push("/cart");
    }, 50);
  };

  const handleClearCart = () => {
    const confirmClear = window.confirm("Clear all items in your cart?");
    if (confirmClear) {
      clearCart();
      toggleDrawer(false);
    }
  };

  // ================= STYLES =================
  const primaryBtn =
    "w-full py-3 rounded-lg font-bold bg-[#FDB813] text-[#0D0D0D] hover:bg-[#C2922F] transition";

  const dangerBtn =
    "w-full py-3 rounded-lg font-bold bg-red-500 text-white hover:bg-red-600 transition";

  const qtyBtn =
    "px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition font-bold";

  return (
    <>
      {/* FLOATING CART */}
      {isMobile && totalItems > 0 && !hideFloatingCart && (
        <button
          onClick={() => toggleDrawer(true)}
          className="fixed bottom-6 right-6 z-40 px-5 py-3 rounded-full font-bold bg-[#FDB813] text-[#0D0D0D] shadow-lg hover:bg-[#C2922F] transition"
        >
          Cart ({totalItems})
        </button>
      )}

      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* BACKDROP */}
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => toggleDrawer(false)}
            />

            {/* DRAWER */}
            <motion.div
              className="fixed top-0 right-0 h-full w-full sm:w-[380px] bg-white shadow-2xl z-50 flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
            >
              {/* HEADER */}
              <div className="flex justify-between items-center p-5 border-b">
                <h2 className="text-lg font-bold">
                  Your Cart ({totalItems})
                </h2>

                <button
                  onClick={() => toggleDrawer(false)}
                  className="text-gray-500 hover:text-black text-xl"
                >
                  ✕
                </button>
              </div>

              {/* ITEMS */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                {cart.length === 0 ? (
                  <div className="text-center text-gray-500">
                    <p className="font-semibold">Your cart is empty</p>
                    <p className="text-sm">Add items to continue</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 border-b pb-4"
                    >
                      <div className="w-14 h-14 rounded overflow-hidden">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name || "item"}
                            width={56}
                            height={56}
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100" />
                        )}
                      </div>

                      <div className="flex-1">
                        <p className="font-semibold text-sm">
                          {item.name}
                        </p>

                        <p className="text-xs text-gray-500">
                          KES {(item.price || 0).toLocaleString()}
                        </p>

                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className={qtyBtn}
                          >
                            -
                          </button>

                          <span className="text-sm">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className={qtyBtn}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-sm">
                          KES {((item.price || 0) * item.quantity).toLocaleString()}
                        </p>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-xs text-red-500 hover:text-red-700 mt-1"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* FOOTER */}
              <div className="p-5 border-t space-y-3">
                <div className="flex justify-between font-bold">
                  <span>Subtotal</span>
                  <span>KES {subtotal.toLocaleString()}</span>
                </div>

                <button onClick={handleViewCart} className={primaryBtn}>
                  View Full Cart
                </button>

                {cart.length > 0 && (
                  <button onClick={handleClearCart} className={dangerBtn}>
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