"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaBars, FaShoppingCart, FaSearch } from "react-icons/fa";
import { Home, ShoppingBag, Phone, Info, BookOpen, Users } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useTenant } from "@/context/TenantContext";
import Sidebar from "./Sidebar";

const Header: React.FC = () => {
  const { name, logoUrl, storefront } = useTenant();
  const navigation = storefront?.navigation ?? [];

  const { cart, openCart } = useCart();
  const totalItems = Array.isArray(cart)
    ? cart.reduce((t, i) => t + (i?.quantity || 0), 0)
    : 0;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getNavIcon = (id: string) => {
    switch (id) {
      case "home":       return Home;
      case "products":
      case "shop":       return ShoppingBag;
      case "contact":    return Phone;
      case "about":      return Users;
      case "blog":       return BookOpen;
      default:           return Info;
    }
  };

  return (
    <>
      <header className="bg-[#0D0D0D] text-white shadow-xl fixed top-0 left-0 w-full z-50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* MOBILE */}
          <div className="md:hidden space-y-3 py-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="bg-[#FDB813] p-2 rounded-lg text-black active:scale-90 transition-transform"
                >
                  <FaBars size={14} />
                </button>
                <Link href="/" className="flex items-center space-x-2">
                  {logoUrl && (
                    <Image
                      src={logoUrl}
                      alt={name || "Logo"}
                      width={32}
                      height={32}
                      className="rounded-lg"
                    />
                  )}
                  <span className="text-base font-black tracking-tighter uppercase">
                    {name || "Prime Deals Kenya"}
                  </span>
                </Link>
              </div>

              <button
                onClick={openCart}
                className="relative bg-white/5 border border-white/10 p-2 rounded-lg active:scale-90 transition-transform"
              >
                <FaShoppingCart size={14} className="text-[#FDB813]" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-white text-black text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[18px]">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>

            <div className="px-1">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
            </div>

            <div className="w-full">
              <div className="flex items-center bg-white/5 border border-white/10 rounded-full h-10 pl-4 overflow-hidden">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="flex-1 bg-transparent outline-none text-sm font-bold text-white placeholder:text-white/40"
                />
                <div className="w-px h-full bg-white/10" />
                <button className="h-full px-4 bg-white/10 hover:bg-[#FDB813]/20 transition-all flex items-center justify-center">
                  <FaSearch size={13} className="text-white/70 hover:text-[#FDB813]" />
                </button>
              </div>
            </div>
          </div>

          {/* DESKTOP */}
          <div className="hidden md:flex items-center justify-between py-4 h-20 gap-6">

            {/* LOGO */}
            <Link href="/" className="flex items-center space-x-3 shrink-0">
              {logoUrl && (
                <div className="p-1 bg-white/5 rounded-xl border border-white/10">
                  <Image
                    src={logoUrl}
                    alt="Logo"
                    width={40}
                    height={40}
                    className="rounded-lg"
                  />
                </div>
              )}
              <span className="text-2xl font-black tracking-tighter uppercase">
                {name || "Prime Deals Kenya"}
              </span>
            </Link>

            {/* Search */}
            <div className="flex-1 max-w-xl">
              <div className="flex items-center bg-white/5 border border-white/10 rounded-full h-10 pl-4 overflow-hidden hover:border-[#FDB813]/40 transition-all">
                <input
                  type="text"
                  placeholder="Search products, brands..."
                  className="flex-1 bg-transparent outline-none text-sm font-bold text-white placeholder:text-white/40"
                />
                <div className="w-px h-full bg-white/10" />
                <button className="h-full px-5 bg-white/10 hover:bg-[#FDB813]/20 transition-all flex items-center justify-center">
                  <FaSearch size={13} className="text-white/70 hover:text-[#FDB813]" />
                </button>
              </div>
            </div>

            {/* NAV — dynamic from tenant storefront config */}
            <nav className="flex items-center gap-6 shrink-0">
              {navigation.length > 0 ? (
                navigation.map((item: any) => {
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
                })
              ) : (
                // Fallback nav when no storefront config yet
                <>
                  <Link href="/" className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-[#FDB813] transition-colors group">
                    <Home size={18} className="group-hover:scale-110 transition-transform" /> Home
                  </Link>
                  <Link href="/menu" className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-[#FDB813] transition-colors group">
                    <ShoppingBag size={18} className="group-hover:scale-110 transition-transform" /> Shop
                  </Link>
                  <Link href="/about" className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-[#FDB813] transition-colors group">
                    <Users size={18} className="group-hover:scale-110 transition-transform" /> About
                  </Link>
                  <Link href="/blog" className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-[#FDB813] transition-colors group">
                    <BookOpen size={18} className="group-hover:scale-110 transition-transform" /> Blog
                  </Link>
                  <Link href="/contact" className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-[#FDB813] transition-colors group">
                    <Phone size={18} className="group-hover:scale-110 transition-transform" /> Contact
                  </Link>
                </>
              )}
            </nav>

            {/* CART */}
            <button
              onClick={openCart}
              className="group flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-2.5 rounded-2xl hover:bg-white hover:text-black transition-all shrink-0"
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

      <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <div className="h-[121px] md:h-20" />
    </>
  );
};

export default Header;