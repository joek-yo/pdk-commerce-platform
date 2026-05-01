"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  FaWhatsapp,
  FaBars,
  FaTimes,
  FaPhoneAlt,
  FaShoppingCart,
  FaHome,
  FaBoxOpen,
  FaEnvelope,
  FaInfoCircle,
} from "react-icons/fa";

import { useCart } from "@/context/CartContext";
import { getBusinessData, getNavigation } from "@/lib/getBusinessData";
import Button from "@/components/ui/Button";

const Header: React.FC = () => {
  const business = getBusinessData();
  const navigation = getNavigation();

  // Integrated Cart Context
  const { cart, toggleDrawer } = useCart();
  const totalItems = cart.reduce((t, i) => t + i.quantity, 0);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getWhatsAppLink = (waNumber: string | undefined) => {
    if (!waNumber) return "#";
    const cleaned = waNumber.replace(/\D/g, "");
    return `https://wa.me/${cleaned}`;
  };

  // Disable scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "auto";
  }, [mobileMenuOpen]);

  const getNavIcon = (id: string, label: string) => {
    const key = (id || label || "").toLowerCase();
    if (key.includes("home")) return <FaHome />;
    if (key.includes("product") || key.includes("menu") || key.includes("shop")) return <FaBoxOpen />;
    if (key.includes("contact") || key.includes("message")) return <FaEnvelope />;
    if (key.includes("about") || key.includes("info")) return <FaInfoCircle />;
    return <FaInfoCircle />;
  };

  return (
    <>
      <header className="bg-[#0D0D0D] text-white shadow-xl fixed top-0 left-0 w-full z-50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* ================= MOBILE VIEW (125px total height) ================= */}
          <div className="md:hidden">
            {/* Top Row: Branding & Cart */}
            <div className="flex justify-between items-center py-3">
              <Link href="/" className="flex items-center space-x-3 overflow-hidden">
                {business?.logo && (
                  <Image
                    src={business.logo}
                    alt={business.name || "Logo"}
                    width={32}
                    height={32}
                    className="rounded-lg flex-shrink-0"
                  />
                )}
                <span className="text-base font-black whitespace-nowrap tracking-tighter uppercase">
                  {business?.name}
                </span>
              </Link>

              {/* Cart Trigger Button */}
              <button
                onClick={() => toggleDrawer(true)}
                className="relative p-2.5 bg-white/5 rounded-xl border border-white/10 active:scale-90 transition-transform"
              >
                <FaShoppingCart className="text-lg text-[#FDB813]" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-white text-black text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>

            {/* Bottom Row: Menu & Actions */}
            <div className="flex justify-between items-center py-3 border-t border-white/5">
              <button 
                onClick={() => setMobileMenuOpen(true)} 
                className="flex items-center gap-2 text-white font-black uppercase text-[10px] tracking-widest"
              >
                <div className="bg-[#FDB813] p-2 rounded-lg text-black">
                   <FaBars size={14} />
                </div>
                Menu
              </button>

              <div className="flex items-center gap-2">
                {business?.phone && (
                  <>
                    <a href={`tel:${business.phone}`}>
                      <Button variant="primary" className="px-4 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg" leftIcon={<FaPhoneAlt size={10}/>}>
                        Call
                      </Button>
                    </a>
                    <a href={getWhatsAppLink(business.whatsapp)} target="_blank" rel="noopener noreferrer">
                      <Button variant="whatsapp" className="px-4 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg" leftIcon={<FaWhatsapp size={12}/>}>
                        Chat
                      </Button>
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ================= DESKTOP VIEW (80px height) ================= */}
          <div className="hidden md:flex items-center justify-between py-4 h-20">
            <Link href="/" className="flex items-center space-x-3 group">
              {business?.logo && (
                <div className="p-1 bg-white/5 rounded-xl border border-white/10 group-hover:border-[#FDB813]/50 transition-all">
                  <Image
                    src={business.logo}
                    alt={business.name || "Logo"}
                    width={40}
                    height={40}
                    className="rounded-lg"
                  />
                </div>
              )}
              <span className="text-2xl font-black tracking-tighter uppercase">{business?.name}</span>
            </Link>

            <nav className="flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.id}
                  href={item.path}
                  className="text-white/60 hover:text-[#FDB813] transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]"
                >
                  <span className="opacity-50 group-hover:opacity-100">{getNavIcon(item.id, item.label)}</span>
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <button
                onClick={() => toggleDrawer(true)}
                className="group flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-2.5 rounded-2xl hover:bg-white hover:text-black transition-all"
              >
                <div className="relative">
                  <FaShoppingCart className="text-[#FDB813] group-hover:text-black" />
                  {totalItems > 0 && (
                    <span className="absolute -top-3 -right-3 bg-[#FDB813] text-black text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#0D0D0D] group-hover:border-white">
                      {totalItems}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Bag ({totalItems})
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* ================= MOBILE NAVIGATION DRAWER ================= */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/80 z-[60] backdrop-blur-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
              />

              <motion.div
                className="fixed top-0 left-0 h-full w-[85%] max-w-xs bg-[#0D0D0D] text-white z-[70] shadow-2xl border-r border-white/5 flex flex-col"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
              >
                {/* Drawer Banner */}
                <div className="relative h-48 flex-shrink-0">
                  <Image
                    src={business?.drawerBanner || business?.banner || "/images/placeholder.jpg"}
                    alt="banner"
                    fill
                    className="object-cover opacity-50"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] to-transparent" />
                  
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="absolute top-4 right-4 bg-black/40 text-white p-2 rounded-full backdrop-blur-md border border-white/10"
                  >
                    <FaTimes size={16} />
                  </button>

                  <div className="absolute bottom-6 left-6">
                    <h2 className="text-xl font-black text-[#FDB813] tracking-tighter uppercase">
                      {business?.name}
                    </h2>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">
                      {business?.tagline}
                    </p>
                  </div>
                </div>

                {/* Nav Links */}
                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 no-scrollbar">
                  {navigation.map((item) => (
                    <DrawerLink
                      key={item.id}
                      href={item.path}
                      label={item.label}
                      icon={getNavIcon(item.id, item.label)}
                      onClick={() => setMobileMenuOpen(false)}
                    />
                  ))}
                </div>

                {/* Footer of Drawer */}
                <div className="p-6 border-t border-white/5 bg-black/40">
                  <div className="grid grid-cols-1 gap-3 mb-6">
                    <a href={`tel:${business.phone}`}>
                      <button className="w-full bg-white text-black py-4 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-transform">
                        <FaPhoneAlt size={12}/>
                        Call Support
                      </button>
                    </a>
                    <a href={getWhatsAppLink(business.whatsapp)} target="_blank" rel="noopener noreferrer">
                      <button className="w-full bg-[#25D366] text-white py-4 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-transform shadow-lg shadow-green-500/10">
                        <FaWhatsapp size={14}/>
                        WhatsApp Chat
                      </button>
                    </a>
                  </div>
                  <p className="text-center text-[8px] font-bold text-gray-600 uppercase tracking-widest">
                    Build with ❤️ in Nairobi
                  </p>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>
      
      {/* Dynamic Spacer to prevent content overlap */}
      <div className="h-[125px] md:h-20" />
    </>
  );
};

const DrawerLink = ({ href, icon, label, onClick }: any) => (
  <Link
    href={href}
    onClick={onClick}
    className="flex items-center space-x-4 p-4 rounded-2xl hover:bg-white/5 active:bg-white/10 transition-all group"
  >
    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#FDB813] group-hover:bg-[#FDB813] group-hover:text-black transition-all">
      {icon}
    </div>
    <span className="font-black text-[11px] uppercase tracking-[0.2em] group-hover:translate-x-1 transition-transform">{label}</span>
  </Link>
);

export default Header;