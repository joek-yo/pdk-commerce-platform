// src/components/home/SocialProof.tsx

"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaShoppingBag } from "react-icons/fa";
import { getBusinessData } from "@/lib/getBusinessData";

const DISPLAY_TIME = 7500; // 👈 +2s applied (visible = hidden)

const SocialProof: React.FC = () => {
  const { socialProof } = getBusinessData();
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!socialProof || socialProof.length === 0) return;

    let timeout: NodeJS.Timeout;

    // Initial delay
    const start = setTimeout(() => {
      setIsVisible(true);
      loop();
    }, 5000);

    const loop = () => {
      timeout = setTimeout(() => {
        setIsVisible(false);

        timeout = setTimeout(() => {
          setIndex((prev) => (prev + 1) % socialProof.length);
          setIsVisible(true);
          loop(); // 🔁 continue loop
        }, DISPLAY_TIME); // hidden time
      }, DISPLAY_TIME); // visible time
    };

    return () => {
      clearTimeout(start);
      clearTimeout(timeout);
    };
  }, [socialProof]);

  if (!socialProof || socialProof.length === 0) return null;

  const currentProof = socialProof[index];

  return (
    <div className="fixed bottom-6 left-6 z-[100] pointer-events-none">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, x: -20, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-auto flex items-center gap-4 p-4 bg-white/80 backdrop-blur-md border border-slate-100 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] max-w-[320px]"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-[#FDB813] opacity-20 blur-md rounded-full" />

              <div className="relative w-10 h-10 rounded-xl bg-[#FDB813] text-black flex items-center justify-center shadow-lg shadow-[#FDB813]/20">
                <FaShoppingBag size={16} />
              </div>

              <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-0.5 border-2 border-white">
                <FaCheckCircle size={8} />
              </div>
            </div>

            <div className="flex flex-col">
              <p className="text-[11px] font-bold text-slate-900 leading-snug">
                {currentProof.text}
              </p>

              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  Verified • {currentProof.time}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SocialProof;