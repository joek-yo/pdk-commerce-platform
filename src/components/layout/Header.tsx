"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaWhatsapp, FaBars, FaPhoneAlt, FaShoppingCart } from "react-icons/fa";

// Lucide Icons
import { Home, ShoppingBag, Phone, Info } from "lucide-react";

import { useCart } from "@/context/CartContext";
import { getBusinessData } from "@/lib/getBusinessData";
import Button from "@/components/ui/Button";
import Sidebar from "./Sidebar";

const Header: React.FC = () => {
  const business = getBusinessData() as any;

  // 🛒 CART SYSTEM (UPDATED API)
  const { cart, openCart } = useCart();
  const totalItems = Array.isArray(cart)
    ? cart.reduce((t, i) => t + (i?.quantity || 0), 0)
    : 0;

  // 🍔 MENU SYSTEM
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getWhatsAppLink = (waNumber: string | undefined) => {
    if (!waNumber) return "#";
    const cleaned = waNumber.replace(/\D/g, "");
    return `https://wa.me/${cleaned}`;
  };

  const getNavIcon = (id: string) => {
    switch (id) {
      case "home":
        return Home;
      case "products":
      case "shop":
        return ShoppingBag;
      case "contact":
        return Phone;
      default:
        return Info;
    }
  };

  return (
    <>
      <header className="bg-[#0D0D0D] text-white shadow-xl fixed top-0 left-0 w-full z-50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ================= MOBILE ================= */}
          <div className="md:hidden">

            <div className="flex justify-between items-center py-3">
              <Link href="/" className="flex items-center space-x-3">
                {business?.logo && (
                  <Image
                    src={business.logo}
                    alt={business.name || "Prime Deals"}
                    width={32}
                    height={32}
                    className="rounded-lg"
                  />
                )}
                <span className="text-base font-black tracking-tighter uppercase">
                  {business?.name}
                </span>
              </Link>

              {/* 🛒 CART BUTTON (FIXED) */}
              <button
                onClick={openCart}
                className="relative p-2.5 bg-white/5 rounded-xl border border-white/10 active:scale-90 transition-transform"
              >
                <FaShoppingCart className="text-lg text-[#FDB813]" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-white text-black text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[18px]">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>

            <div className="flex justify-between items-center py-3 border-t border-white/5">

              {/* 🍔 MENU BUTTON */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="flex items-center gap-2 text-white font-black uppercase text-[10px] tracking-widest"
              >
                <div className="bg-[#FDB813] p-2 rounded-lg text-black">
                  <FaBars size={14} />
                </div>
                MENU
              </button>

              <div className="flex items-center gap-2">
                {business?.phone && (
                  <>
                    <a href={`tel:${business.phone}`}>
                      <Button
                        variant="primary"
                        className="px-4 py-2 text-[9px] font-black uppercase tracking-widest"
                        leftIcon={<FaPhoneAlt size={10} />}
                      >
                        Call
                      </Button>
                    </a>

                    <a
                      href={getWhatsAppLink(business.whatsapp)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="whatsapp"
                        className="px-4 py-2 text-[9px] font-black uppercase tracking-widest"
                        leftIcon={<FaWhatsapp size={12} />}
                      >
                        Chat
                      </Button>
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ================= DESKTOP ================= */}
          <div className="hidden md:flex items-center justify-between py-4 h-20">

            <Link href="/" className="flex items-center space-x-3 group">
              {business?.logo && (
                <div className="p-1 bg-white/5 rounded-xl border border-white/10 group-hover:border-[#FDB813]/50 transition-all">
                  <Image
                    src={business.logo}
                    alt="Logo"
                    width={40}
                    height={40}
                    className="rounded-lg"
                  />
                </div>
              )}
              <span className="text-2xl font-black tracking-tighter uppercase">
                {business?.name}
              </span>
            </Link>

            {/* NAV */}
            <nav className="flex items-center gap-8">
              {business?.navigation?.map((item: any) => {
                const IconComponent = getNavIcon(item.id);
                return (
                  <Link
                    key={item.id}
                    href={item.path}
                    className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-[#FDB813] transition-colors group"
                  >
                    <IconComponent size={18} className="group-hover:scale-110 transition-transform" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* CART (FIXED) */}
            <button
              onClick={openCart}
              className="group flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-2.5 rounded-2xl hover:bg-white hover:text-black transition-all"
            >
              <div className="relative">
                <FaShoppingCart className="text-[#FDB813] group-hover:text-black" />
                {totalItems > 0 && (
                  <span className="absolute -top-3 -right-3 bg-[#FDB813] text-black text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#0D0D0D]">
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
      </header>

      {/* 🍔 SIDEBAR */}
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <div className="h-[125px] md:h-20" />
    </>
  );
};

export default Header;