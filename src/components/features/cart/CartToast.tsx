// src/components/features/cart/CartToast.tsx

"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { FaCheckCircle } from "react-icons/fa";

const CartToast: React.FC = () => {
  const { toast, openCart } = useCart(); // ← added openCart

  return (
    <AnimatePresence>
      {toast?.show && (
        <motion.div
          initial={{ y: 100, opacity: 0, x: "-50%" }}
          animate={{ y: 0, opacity: 1, x: "-50%" }}
          exit={{ y: 100, opacity: 0, x: "-50%" }}
          className="fixed bottom-10 left-1/2 z-[110] w-[90%] max-w-xs"
        >
          <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10 flex items-center justify-between gap-4">

            {/* Message */}
            <div className="flex items-center gap-3">
              <FaCheckCircle className="text-[#FDB813]" size={18} />
              <span className="text-[11px] font-black uppercase tracking-widest">
                {toast.message || "Added to Bag"}
              </span>
            </div>

            {/* View button — opens MiniCartDrawer */}
            <button
              onClick={openCart} // ← this is the only change
              className="text-[#FDB813] text-[10px] font-black uppercase tracking-tighter border-l border-white/10 pl-4 hover:text-white transition-colors cursor-pointer"
            >
              View
            </button>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartToast;