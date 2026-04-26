"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";

const CartToast: React.FC = () => {
  const { showToast, toastMessage } = useCart();

  return (
    <AnimatePresence>
      {showToast && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="
            fixed 
            bottom-6 
            left-1/2 
            -translate-x-1/2 
            md:left-auto 
            md:right-6 
            md:translate-x-0
            bg-black 
            text-white 
            px-6 
            py-3 
            rounded-xl 
            shadow-2xl 
            z-[100]
          "
        >
          <span className="font-medium">{toastMessage}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartToast;