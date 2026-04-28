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

  // --- FIX: WhatsApp Link Formatter ---
  const getWhatsAppLink = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    // Ensure it uses the Kenya country code (254)
    const formatted = cleaned.startsWith("0") ? "254" + cleaned.substring(1) : cleaned;
    const finalNumber = formatted.startsWith("254") ? formatted : "254" + formatted;
    return `https://wa.me/${finalNumber}`;
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
            <div className="flex justify-between items-center py-3">
              <div className="flex items-center space-x-2">
                {business?.logo && (
                  <Image
                    src={business.logo}
                    alt={business.name}
                    width={38}
                    height={38}
                    className="rounded"
                  />
                )}
                <span className="text-lg font-bold truncate max-w-[150px]">
                  {business?.name}
                </span>
              </div>

              <Button
                variant="primary"
                onClick={() => toggleDrawer(true)}
                className="relative flex items-center justify-center px-3 py-2"
              >
                <FaShoppingCart className="text-lg text-black" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-[#0D0D0D]">
                    {totalItems}
                  </span>
                )}
              </Button>
            </div>

            <div className="flex justify-between items-center pb-3">
              <button onClick={() => setMobileMenuOpen(true)} className="text-white p-2">
                <FaBars size={22} />
              </button>

              <div className="flex items-center gap-2">
                {business?.phone && (
                  <>
                    <a href={`tel:${business.phone}`}>
                      <Button variant="primary" className="px-3 py-2 text-xs flex items-center gap-1.5" leftIcon={<FaPhoneAlt size={12}/>}>
                        Call
                      </Button>
                    </a>
                    <a href={getWhatsAppLink(business.phone)} target="_blank" rel="noopener noreferrer">
                      <Button variant="whatsapp" className="px-3 py-2 text-xs flex items-center gap-1.5" leftIcon={<FaWhatsapp size={14}/>}>
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
                  alt={business.name}
                  width={48}
                  height={48}
                  className="rounded group-hover:opacity-80 transition"
                />
              )}
              <span className="text-2xl font-bold">{business?.name}</span>
            </Link>

            <nav className="flex items-center space-x-8 font-medium">
              {navigation.map((item) => (
                <Link
                  key={item.id}
                  href={item.path}
                  className="hover:text-[#FDB813] transition flex items-center gap-2 text-sm uppercase tracking-wider"
                >
                  {getNavIcon(item.id, item.label)}
                  {item.label}
                </Link>
              ))}
            </nav>

            <Button
              variant="primary"
              onClick={() => toggleDrawer(true)}
              className="px-5 py-2 flex items-center gap-2 font-bold"
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
                className="fixed inset-0 bg-black/80 z-[60] backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
              />

              <motion.div
                className="fixed top-0 left-0 h-full w-[85%] max-w-xs bg-[#0D0D0D] text-white z-[70] shadow-2xl"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
              >
                <div className="relative h-48">
                  <Image
                    src={business?.drawerBanner || business?.banner || "/images/placeholder.jpg"}
                    alt="banner"
                    fill
                    className="object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] to-transparent" />
                  
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-md transition"
                  >
                    <FaTimes />
                  </button>

                  <div className="absolute bottom-5 left-5 right-5">
                    <h2 className="text-xl font-bold text-[#FDB813] truncate">
                      {business?.name}
                    </h2>
                    <p className="text-xs text-gray-400 line-clamp-1">
                      {business?.tagline}
                    </p>
                  </div>
                </div>

                <div className="p-5 flex flex-col h-[calc(100%-12rem)]">
                  <div className="space-y-1 flex-grow">
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

                  <div className="pt-5 border-t border-gray-800 space-y-4 pb-8">
                    <div className="space-y-2">
                       <div className="flex justify-between text-xs text-gray-400">
                        <span>Status</span>
                        <span className="text-green-500 font-bold uppercase tracking-tighter">
                          ● {business?.status || "Online"}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Location</span>
                        <span className="text-white text-right line-clamp-1">{business?.location}</span>
                      </div>
                    </div>

                    {business?.phone && (
                      <div className="grid grid-cols-1 gap-3">
                        <a href={`tel:${business.phone}`}>
                          <Button variant="primary" className="w-full py-3 flex items-center justify-center gap-2 font-bold uppercase text-xs" leftIcon={<FaPhoneAlt />}>
                            Call Support
                          </Button>
                        </a>
                        {/* WhatsApp Drawer Link Fix */}
                        <a href={getWhatsAppLink(business.phone)} target="_blank" rel="noopener noreferrer">
                          <Button variant="whatsapp" className="w-full py-3 flex items-center justify-center gap-2 font-bold uppercase text-xs" leftIcon={<FaWhatsapp />}>
                            WhatsApp Order
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
      {/* Increased spacer to fix the "Freshly Crafted" overlap on mobile */}
      <div className="h-24 md:h-32" />
    </>
  );
};

const DrawerLink = ({ href, icon, label, onClick }: any) => (
  <Link
    href={href}
    onClick={onClick}
    className="flex items-center space-x-4 p-4 rounded-xl hover:bg-white/5 active:bg-white/10 transition"
  >
    <span className="text-[#FDB813] text-xl">{icon}</span>
    <span className="font-medium tracking-wide">{label}</span>
  </Link>
);

export default Header;