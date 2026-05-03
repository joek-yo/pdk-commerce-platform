"use client";

import React, { useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  FaRocket,
  FaCompass,
  FaThLarge,
  FaTag,
  FaUsers,
  FaLifeRing,
  FaHome,
  FaShoppingBag,
  FaPhoneAlt,
  FaVideo,
  FaLaptop,
  FaBox,
  FaShieldAlt,
  FaLayerGroup,
} from "react-icons/fa";

import DrawerHeader from "./drawer/DrawerHeader";
import QuickActions from "./drawer/QuickActions";
import DealsSection from "./drawer/DealsSection";
import SocialProofSection from "./drawer/SocialProofSection";
import SupportSection from "./drawer/SupportSection";
import FooterTrust from "./drawer/FooterTrust";

import menuData from "@/data/menu.json";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
  }, [isOpen]);

  const sectionClasses =
    "bg-white border-l-4 border-l-[#FDB813] border border-slate-100 p-5 rounded-xl shadow-md mb-4 relative overflow-hidden hover:shadow-lg transition";

  const labelClasses =
    "flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 mb-4 ml-1";

  const iconStyle = "text-[#FDB813]";

  const linkStyle =
    "flex items-center gap-3 py-3 px-2 text-slate-700 hover:text-[#FDB813] hover:bg-[#FDB813]/10 rounded-lg transition-all border-b border-slate-50 last:border-0";

  const textStyle =
    "text-[11px] font-black uppercase tracking-wider";

  const categoryIcons: Record<string, React.ReactNode> = {
    wearables: <FaBox size={12} />,
    creator: <FaVideo size={12} />,
    computing: <FaLaptop size={12} />,
    "home-security": <FaShieldAlt size={12} />,
    lifestyle: <FaLayerGroup size={12} />,
  };

  const randomizedCategories = useMemo(() => {
    if (!menuData.categories) return [];
    return [...menuData.categories]
      .sort(() => Math.random() - 0.5)
      .slice(0, 6);
  }, [isOpen]);

  const navLinks = [
    { name: "Home", href: "/", icon: <FaHome size={14} /> },
    { name: "Shop All", href: "/menu", icon: <FaShoppingBag size={14} /> },
    { name: "Contacts", href: "/contact", icon: <FaPhoneAlt size={14} /> },
  ];

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
            {/* HEADER */}
            <div className="bg-white border-b border-slate-200">
              <DrawerHeader onClose={onClose} />
            </div>

            {/* BODY */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">

              {/* QUICK START */}
              <div className={sectionClasses}>
                <label className={labelClasses}>
                  <FaRocket className={iconStyle} size={10} /> Quick Start
                </label>
                <QuickActions />
              </div>

              {/* NAVIGATION */}
              <div className={sectionClasses}>
                <label className={labelClasses}>
                  <FaCompass className={iconStyle} size={10} /> Navigation
                </label>

                <div className="flex flex-col">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={onClose}
                      className={linkStyle}
                    >
                      <span className="text-[#FDB813]/70">{link.icon}</span>
                      <span className={textStyle}>{link.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* CATEGORIES */}
              <div className={sectionClasses}>
                <label className={labelClasses}>
                  <FaThLarge className={iconStyle} size={10} /> Fresh Categories
                </label>

                <div className="grid grid-cols-1">
                  {randomizedCategories.map((cat: any) => (
                    <Link
                      key={cat.id}
                      href={`/menu?category=${cat.id}`}
                      onClick={onClose}
                      className={linkStyle}
                    >
                      <span className="text-[#FDB813]/70">
                        {categoryIcons[cat.id] || <FaLayerGroup size={12} />}
                      </span>
                      <span className={textStyle}>{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* 🔥 DEALS (BRAND FIXED) */}
              <div className="bg-[#FDB813]/10 border border-[#FDB813]/30 p-5 rounded-xl shadow-md mb-4 relative overflow-hidden hover:shadow-lg transition">

                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] mb-4 ml-1">
                  <FaTag size={10} />
                  <span className="text-slate-700">Hot</span>
                  <span className="text-[#FDB813]">Deals</span>
                </label>

                <DealsSection />
              </div>

              {/* COMMUNITY */}
              <div className={sectionClasses}>
                <label className={labelClasses}>
                  <FaUsers className={iconStyle} size={10} /> Community
                </label>
                <SocialProofSection />
              </div>

              {/* SUPPORT */}
              <div className={sectionClasses}>
                <label className={labelClasses}>
                  <FaLifeRing className={iconStyle} size={10} /> Help & Support
                </label>
                <SupportSection />
              </div>

            </div>

            {/* FOOTER */}
            <div className="border-t border-slate-100 p-5 bg-white">
              <div className="flex items-center gap-2 mb-4 opacity-60">
                <FaShieldAlt className="text-[#FDB813]" size={12} />
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                  Verified Secure
                </span>
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