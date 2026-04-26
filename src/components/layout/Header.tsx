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
  FaUtensils,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";
import { useCart } from "@/context/CartContext";
import { getBusinessData } from "@/lib/getBusinessData";
import menuData from "@/data/menu.json";

const Header: React.FC = () => {
  const business = getBusinessData();
  const { cart, toggleDrawer } = useCart();
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "auto";
  }, [mobileMenuOpen]);

  return (
    <>
      <header className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* MOBILE TOP BAR */}
          <div className="md:hidden">
            <div className="flex justify-between items-center py-3">
              <div className="flex items-center space-x-2">
                {business.logo && (
                  <Image src={business.logo} alt={business.name} width={40} height={40} className="object-contain" />
                )}
                <span className="text-xl font-bold text-gray-800 tracking-tight">{business.name}</span>
              </div>

              <button
                onClick={() => toggleDrawer(true)}
                className="relative flex items-center bg-green-900 text-white px-3 py-2 rounded-lg shadow-md"
              >
                <FaShoppingCart />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>

            <div className="flex justify-between items-center pb-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="text-gray-800 p-2 rounded-md hover:bg-gray-100 transition"
              >
                <FaBars size={22} />
              </button>

              <div className="flex space-x-2">
                <a href={`https://wa.me/${business.phone}`} target="_blank" rel="noopener noreferrer" className="flex items-center px-3 py-2 bg-green-500 text-white rounded-lg shadow text-sm font-medium">
                  <FaWhatsapp className="mr-2" /> Chat
                </a>
                <a href={`tel:${business.phone}`} className="flex items-center px-3 py-2 bg-green-700 text-white rounded-lg shadow text-sm font-medium">
                  <FaPhoneAlt className="mr-2" /> Call
                </a>
              </div>
            </div>
          </div>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center justify-between py-4">
            <div className="flex items-center space-x-2">
              {business.logo && <Image src={business.logo} alt={business.name} width={50} height={50} className="object-contain" />}
              <span className="text-2xl font-bold text-gray-800">{business.name}</span>
            </div>

            <nav className="flex items-center space-x-8 font-medium">
              <Link href="/" className="hover:text-green-700 transition">Home</Link>
              <Link href="/menu" className="hover:text-green-700 transition">Menu</Link>
              <Link href="/contact" className="hover:text-green-700 transition">Contact</Link>
            </nav>

            <button onClick={() => toggleDrawer(true)} className="relative flex items-center bg-green-900 text-white px-4 py-2 rounded-lg shadow-md font-bold">
              <FaShoppingCart className="mr-2" /> Cart ({totalItems})
            </button>
          </div>
        </div>

        {/* MOBILE DRAWER */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                onClick={() => setMobileMenuOpen(false)}
              />

              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 left-0 h-full w-[85%] max-w-xs bg-white shadow-2xl z-[70] flex flex-col overflow-hidden"
              >
                {/* DRAWER HERO */}
                <div className="relative w-full h-52 shrink-0">
                  <Image
                    src={business.drawerBanner || business.banner}
                    alt="Banner"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  <button onClick={() => setMobileMenuOpen(false)} className="absolute top-4 right-4 text-white bg-black/20 p-2 rounded-full backdrop-blur-md">
                    <FaTimes size={18} />
                  </button>
                  <div className="absolute bottom-5 left-5 text-white">
                    <h2 className="text-2xl font-black text-yellow-400 drop-shadow-lg tracking-tight">{business.name}</h2>
                    <div className="flex items-center space-x-2 mt-1">
                        <span className="h-[2px] w-4 bg-yellow-400 rounded-full" />
                        <p className="text-xs font-semibold italic text-white/90 tracking-wide drop-shadow-md">{business.slogan}</p>
                    </div>
                  </div>
                </div>

                {/* DRAWER NAV + STATS */}
                <div className="flex-grow overflow-y-auto p-5 space-y-6">
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-400 mb-3 tracking-[0.2em]">Main Menu</p>
                    <div className="space-y-1">
                      <DrawerLink href="/" icon={<FaHome />} label="Home" onClick={() => setMobileMenuOpen(false)} />
                      <DrawerLink href="/menu" icon={<FaUtensils />} label="Explore Menu" onClick={() => setMobileMenuOpen(false)} />
                      <DrawerLink href="/contact" icon={<FaEnvelope />} label="Contact Us" onClick={() => setMobileMenuOpen(false)} />
                    </div>
                  </div>

                  <div className="pt-5 border-t border-gray-100">
                    <p className="text-[10px] font-black uppercase text-gray-400 mb-3 tracking-[0.2em]">Business Info</p>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                        <div className="flex items-center text-gray-600 text-sm font-semibold">
                          <FaClock className="mr-3 text-green-700" /> Status
                        </div>
                        <div className="flex items-center space-x-2">
                           <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                          </span>
                          <span className="text-green-700 text-xs font-black uppercase tracking-tighter">{menuData.hero.status}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                        <div className="flex items-center text-gray-600 text-sm font-semibold">
                          <FaMapMarkerAlt className="mr-3 text-green-700" /> Location
                        </div>
                        <span className="text-gray-800 text-xs font-bold">{menuData.hero.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* DRAWER FOOTER - With Call Button for Hurrying Customers */}
                <div className="p-5 bg-gray-50 border-t border-gray-100 space-y-3">
                  <a 
                    href={`tel:${business.phone}`} 
                    className="flex items-center justify-center w-full py-3 bg-green-800 text-white rounded-xl font-bold shadow-lg transition-transform active:scale-95"
                  >
                    <FaPhoneAlt className="mr-3" /> Call to Order Now
                  </a>
                  
                  <a 
                    href={`https://wa.me/${business.phone}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full py-3 bg-green-500 text-white rounded-xl font-bold shadow-lg shadow-green-100 transition-transform active:scale-95"
                  >
                    <FaWhatsapp className="mr-3 text-xl" /> Order via WhatsApp
                  </a>
                  
                  <p className="text-[9px] text-center text-gray-400 mt-2 font-medium tracking-widest uppercase italic">
                    {business.tagline || "Crafted Moments The Jaby Way"}
                  </p>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>
      <div className="h-20 md:h-24"></div>
    </>
  );
};

const DrawerLink = ({ href, icon, label, onClick }: any) => (
  <Link href={href} onClick={onClick} className="flex items-center space-x-4 p-3 rounded-xl hover:bg-green-50 text-gray-700 font-bold transition group">
    <div className="bg-gray-100 p-2 rounded-lg group-hover:bg-green-100 transition text-green-700">{icon}</div>
    <span className="text-sm">{label}</span>
  </Link>
);

export default Header;