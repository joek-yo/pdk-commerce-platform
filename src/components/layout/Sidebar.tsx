// src/components/layout/Sidebar.tsx

"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  
  // 🔒 Lock background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 🔲 BACKDROP */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-[90]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* 🧭 DRAWER */}
          <motion.div
            className="fixed top-0 left-0 h-full w-[85%] max-w-sm bg-white z-[100] shadow-xl flex flex-col"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            
            {/* 🟡 HEADER */}
            <div className="flex items-center justify-between px-4 py-4 border-b">
              <div>
                <h2 className="font-black text-sm">Prime Deals Kenya</h2>
                <p className="text-[10px] text-slate-500">
                  Smart Deals. Smart Choices.
                </p>
              </div>

              <button
                onClick={onClose}
                className="text-xl font-bold"
              >
                ✕
              </button>
            </div>

            {/* 🧱 CONTENT AREA */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">

              {/* 🔥 PLACEHOLDER SECTIONS (we wire next) */}

              <div className="border p-3 rounded-lg text-sm font-bold text-center">
                Quick Actions (coming next)
              </div>

              <div className="border p-3 rounded-lg text-sm font-bold text-center">
                Navigation
              </div>

              <div className="border p-3 rounded-lg text-sm font-bold text-center">
                Categories
              </div>

              <div className="border p-3 rounded-lg text-sm font-bold text-center">
                Deals
              </div>

              <div className="border p-3 rounded-lg text-sm font-bold text-center">
                Social Proof
              </div>

              <div className="border p-3 rounded-lg text-sm font-bold text-center">
                Support
              </div>

            </div>

            {/* 💳 FOOTER */}
            <div className="border-t p-4 text-[10px] text-center text-slate-500">
              Secure Payments • M-PESA • Cards
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;