"use client";
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
// Import Icons for the section headers
import { 
  FaRocket, FaCompass, FaThLarge, FaTag, 
  FaUsers, FaLifeRing, FaShieldAlt 
} from "react-icons/fa";

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
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = originalOverflow || "";
    };
  }, [isOpen]);

  // UI Standardized Styles
  const sectionClasses = "bg-white border-l-4 border-l-[#FDB813] border-y border-r border-slate-100 p-5 rounded-lg shadow-sm mb-4 relative overflow-hidden";
  const labelClasses = "flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-4 ml-1";
  const iconStyle = "text-[#FDB813]"; // Brand Gold for all icons

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[90]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          <motion.div
            className="fixed top-0 left-0 h-full w-[85%] max-w-sm bg-[#F8FAFC] z-[100] shadow-2xl flex flex-col border-r border-slate-200"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "circOut" }}
          >
            <div className="bg-white border-b border-slate-200">
                <DrawerHeader onClose={onClose} />
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
              
              <div className={sectionClasses}>
                <label className={labelClasses}><FaRocket className={iconStyle} size={10}/> Quick Start</label>
                <QuickActions />
              </div>

              <div className={sectionClasses}>
                <label className={labelClasses}><FaCompass className={iconStyle} size={10}/> Navigation</label>
                <NavigationSection />
              </div>

              <div className={sectionClasses}>
                <label className={labelClasses}><FaThLarge className={iconStyle} size={10}/> Categories</label>
                <CategorySection />
              </div>

              <div className={sectionClasses}>
                <label className={labelClasses}><FaTag className={iconStyle} size={10}/> Exclusive Deals</label>
                <DealsSection />
              </div>

              <div className={sectionClasses}>
                <label className={labelClasses}><FaUsers className={iconStyle} size={10}/> Community</label>
                <SocialProofSection />
              </div>

              <div className={sectionClasses}>
                <label className={labelClasses}><FaLifeRing className={iconStyle} size={10}/> Help & Support</label>
                <SupportSection />
              </div>

            </div>

            <div className="border-t border-slate-100 p-5 bg-white">
              <div className="flex items-center gap-2 mb-4 opacity-50">
                <FaShieldAlt className="text-slate-400" size={12}/>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Verified Secure</span>
              </div>
              <FooterTrust />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;