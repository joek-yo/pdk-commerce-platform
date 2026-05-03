"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Import Drawer Sections
import DrawerHeader from "./drawer/DrawerHeader";
import QuickActions from "./drawer/QuickActions";
import NavigationSection from "./drawer/NavigationSection";
import CategorySection from "./drawer/CategorySection";
import DealsSection from "./drawer/DealsSection";
import SocialProofSection from "./drawer/SocialProofSection";
import SupportSection from "./drawer/SupportSection";
import FooterTrust from "./drawer/FooterTrust";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {

  // Lock background scroll when open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;

    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = originalOverflow || "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/70 z-[90]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed top-0 left-0 h-full w-[85%] max-w-sm bg-white z-[100] shadow-2xl flex flex-col"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >

            {/* Header */}
            <DrawerHeader onClose={onClose} />

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-8 custom-scrollbar">
              <QuickActions />
              <NavigationSection />
              <CategorySection />
              <DealsSection />
              <SocialProofSection />
              <SupportSection />
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 p-5">
              <FooterTrust />
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;