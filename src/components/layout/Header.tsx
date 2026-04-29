// src/components/layout/Header.tsx

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

  const { cart, toggleDrawer } = useCart();
  const totalItems = cart.reduce((t, i) => t + i.quantity, 0);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getWhatsAppLink = (waNumber: string | undefined) => {
    if (!waNumber) return "#";
    const cleaned = waNumber.replace(/\D/g, "");
    return `https://wa.me/${cleaned}`;
  };

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
      <header className="bg-[#0D0D0D] text-white shadow-md fixed top-0 left-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* ================= MOBILE VIEW ================= */}
          <div className="md:hidden">
            <div className="flex justify-between items-center py-3 border-b border-white/5">
              <div className="flex items-center space-x-3 overflow-hidden">
                {business?.logo && (
                  <Image
                    src={business.logo}
                    alt={business.name || "Logo"}
                    width={34}
                    height={34}
                    className="rounded-md flex-shrink-0"
                  />
                )}
                <span className="text-base font-black whitespace-nowrap tracking-tight">
                  {business?.name}
                </span>
              </div>

              <Button
                variant="primary"
                onClick={() => toggleDrawer(true)}
                className="relative flex items-center justify-center px-3 py-2 flex-shrink-0 ml-2"
              >
                <FaShoppingCart className="text-lg text-black" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full border-2 border-[#0D0D0D]">
                    {totalItems}
                  </span>
                )}
              </Button>
            </div>

            <div className="flex justify-between items-center py-3">
              <button onClick={() => setMobileMenuOpen(true)} className="text-white p-2">
                <FaBars size={22} />
              </button>

              <div className="flex items-center gap-2">
                {business?.phone && (
                  <>
                    <a href={`tel:${business.phone}`}>
                      <Button variant="primary" className="px-4 py-2.5 text-[10px] font-black uppercase tracking-widest flex items-center gap-2" leftIcon={<FaPhoneAlt size={10}/>}>
                        Call
                      </Button>
                    </a>
                    <a href={getWhatsAppLink(business.whatsapp)} target="_blank" rel="noopener noreferrer">
                      <Button variant="whatsapp" className="px-4 py-2.5 text-[10px] font-black uppercase tracking-widest flex items-center gap-2" leftIcon={<FaWhatsapp size={12}/>}>
                        WhatsApp
                      </Button>
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ================= DESKTOP VIEW ================= */}
          <div className="hidden md:flex items-center justify-between py-4">
            <Link href="/" className="flex items-center space-x-2 group">
              {business?.logo && (
                <Image
                  src={business.logo}
                  alt={business.name || "Logo"}
                  width={48}
                  height={48}
                  className="rounded group-hover:opacity-80 transition"
                />
              )}
              <span className="text-2xl font-bold tracking-tighter">{business?.name}</span>
            </Link>

            <nav className="flex items-center space-x-8 font-medium">
              {navigation.map((item) => (
                <Link
                  key={item.id}
                  href={item.path}
                  className="hover:text-[#FDB813] transition flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em]"
                >
                  {getNavIcon(item.id, item.label)}
                  {item.label}
                </Link>
              ))}
            </nav>

            <Button
              variant="primary"
              onClick={() => toggleDrawer(true)}
              className="px-6 py-2.5 flex items-center gap-2 font-black uppercase text-xs tracking-widest"
              leftIcon={<FaShoppingCart />}
            >
              Cart ({totalItems})
            </Button>
          </div>
        </div>

        {/* ================= MOBILE DRAWER ================= */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/90 z-[60] backdrop-blur-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
              />

              <motion.div
                className="fixed top-0 left-0 h-full w-[85%] max-w-xs bg-[#0D0D0D] text-white z-[70] shadow-2xl border-r border-white/5"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
              >
                <div className="relative h-56">
                  <Image
                    src={business?.drawerBanner || business?.banner || "/images/placeholder.jpg"}
                    alt="banner"
                    fill
                    className="object-cover opacity-40"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/40 to-transparent" />
                  
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="absolute top-5 right-5 bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-full backdrop-blur-xl transition"
                  >
                    <FaTimes size={18} />
                  </button>

                  <div className="absolute bottom-6 left-6 right-6">
                    <h2 className="text-2xl font-black text-[#FDB813] tracking-tighter uppercase mb-1">
                      {business?.name}
                    </h2>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      {business?.tagline}
                    </p>
                  </div>
                </div>

                <div className="p-6 flex flex-col h-[calc(100%-14rem)]">
                  <div className="space-y-2 flex-grow overflow-y-auto no-scrollbar">
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

                  <div className="pt-6 border-t border-white/5 space-y-5 pb-10">
                    <div className="space-y-3">
                       <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                        <span>Store Status</span>
                        <span className="text-green-500">
                          ● {business?.status || "Online"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                        <span>Hq</span>
                        <span className="text-white">{business?.location}</span>
                      </div>
                    </div>

                    {business?.phone && (
                      <div className="grid grid-cols-1 gap-3">
                        <a href={`tel:${business.phone}`}>
                          <Button variant="primary" className="w-full py-4 flex items-center justify-center gap-3 font-black uppercase text-[10px] tracking-[0.2em]" leftIcon={<FaPhoneAlt />}>
                            Direct Call
                          </Button>
                        </a>
                        <a href={getWhatsAppLink(business.whatsapp)} target="_blank" rel="noopener noreferrer">
                          <Button variant="whatsapp" className="w-full py-4 flex items-center justify-center gap-3 font-black uppercase text-[10px] tracking-[0.2em]" leftIcon={<FaWhatsapp />}>
                            WhatsApp Chat
                          </Button>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>
      
      {/* FIXED: Gap killed by matching exact header height */}
      <div className="h-[125px] md:h-[80px]" />
    </>
  );
};

const DrawerLink = ({ href, icon, label, onClick }: any) => (
  <Link
    href={href}
    onClick={onClick}
    className="flex items-center space-x-4 p-4 rounded-2xl hover:bg-white/5 active:bg-white/10 transition-colors group"
  >
    <span className="text-[#FDB813] text-xl group-hover:scale-110 transition-transform">{icon}</span>
    <span className="font-black text-xs uppercase tracking-[0.2em]">{label}</span>
  </Link>
);

export default Header;