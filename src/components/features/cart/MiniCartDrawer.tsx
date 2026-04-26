"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

const MiniCartDrawer: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    isDrawerOpen,
    toggleDrawer,
  } = useCart();
  const router = useRouter();
  const [hovering, setHovering] = useState(false);
  const [viewClicked, setViewClicked] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Detect mobile viewport
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-close drawer after 3s if not hovering (desktop only)
  useEffect(() => {
    if (isDrawerOpen && !isMobile) {
      const timer = setTimeout(() => {
        if (!hovering) toggleDrawer(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isDrawerOpen, hovering, isMobile, toggleDrawer]);

  // ✅ Go to full cart page instead of Review page
  const handleViewCart = () => {
    setViewClicked(true);
    toggleDrawer(false);
    router.push("/cart"); // changed from "/review" to "/cart"
  };

  return (
    <>
      {isMobile && cart.length > 0 && (
        <button
          onClick={() => toggleDrawer(true)}
          className="fixed bottom-6 right-6 z-50 bg-green-900 text-white font-semibold px-4 py-3 rounded-full shadow-lg hover:bg-green-700 transition flex items-center space-x-2"
        >
          <span>Cart ({cart.length})</span>
        </button>
      )}

      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => toggleDrawer(false)}
            />

            <motion.div
              className="fixed top-0 right-0 h-full w-full sm:w-[320px] md:w-[360px] lg:w-[420px] xl:w-[460px] bg-white shadow-2xl z-50 flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
            >
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-xl font-bold text-gray-800">
                  Your Cart ({cart.length})
                </h2>
                <button
                  onClick={() => toggleDrawer(false)}
                  className="text-gray-500 hover:text-black text-xl"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <p className="text-gray-500 text-center">Your cart is empty.</p>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 border-b pb-4">
                      <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                            IMG
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{item.name}</h4>
                        <p className="text-sm text-gray-500">
                          KES {item.price.toLocaleString()}
                        </p>

                        <div className="flex items-center mt-2 space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 bg-gray-200 rounded"
                          >
                            -
                          </button>

                          <span>{item.quantity}</span>

                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 bg-gray-200 rounded"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-gray-800">
                          KES {(item.price * item.quantity).toLocaleString()}
                        </p>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-xs text-red-500 hover:underline mt-1"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-6 border-t space-y-4">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Subtotal</span>
                  <span>KES {subtotal.toLocaleString()}</span>
                </div>

                {/* ✅ Go to full cart page instead of WhatsApp checkout */}
                <button
                  onClick={handleViewCart}
                  className={`w-full py-3 rounded-lg font-semibold transition ${
                    viewClicked
                      ? "bg-green-900 text-white"
                      : "border border-green-900 text-green-900 hover:bg-green-50"
                  }`}
                >
                  View Full Cart
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MiniCartDrawer;