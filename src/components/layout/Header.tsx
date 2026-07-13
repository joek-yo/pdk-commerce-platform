"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaBars, FaShoppingCart } from "react-icons/fa";
import { Home, ShoppingBag, Phone, Info, BookOpen, Users } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useTenant } from "@/context/TenantContext";
import Sidebar from "./Sidebar";
import ThemeToggle from "@/components/ui/ThemeToggle";

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
      <header className="bg-background text-foreground shadow-xl fixed top-0 left-0 w-full z-50 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* MOBILE */}
          <div className="md:hidden flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="bg-gold p-2 rounded-lg text-background active:scale-90 transition-transform"
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

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={openCart}
                className="relative bg-surface2 border border-border p-2 rounded-lg active:scale-90 transition-transform"
              >
                <FaShoppingCart size={14} className="text-gold" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-foreground text-background text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[18px]">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* DESKTOP */}
          <div className="hidden md:flex items-center justify-between py-4 h-20 gap-6">

            {/* LOGO */}
            <Link href="/" className="flex items-center space-x-3 shrink-0">
              {logoUrl && (
                <div className="p-1 bg-surface2 rounded-xl border border-border">
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

            {/* NAV — dynamic from tenant storefront config */}
            <nav className="flex items-center gap-6 shrink-0">
              {navigation.length > 0 ? (
                navigation.map((item: any) => {
                  const IconComponent = getNavIcon(item.id);
                  return (
                    <Link
                      key={item.id}
                      href={item.path}
                      className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-gold transition-colors group"
                    >
                      <IconComponent size={18} className="group-hover:scale-110 transition-transform" />
                      {item.label}
                    </Link>
                  );
                })
              ) : (
                <>
                  <Link href="/" className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-gold transition-colors group">
                    <Home size={18} className="group-hover:scale-110 transition-transform" /> Home
                  </Link>
                  <Link href="/menu" className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-gold transition-colors group">
                    <ShoppingBag size={18} className="group-hover:scale-110 transition-transform" /> Shop
                  </Link>
                  <Link href="/about" className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-gold transition-colors group">
                    <Users size={18} className="group-hover:scale-110 transition-transform" /> About
                  </Link>
                  <Link href="/blog" className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-gold transition-colors group">
                    <BookOpen size={18} className="group-hover:scale-110 transition-transform" /> Blog
                  </Link>
                  <Link href="/contact" className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-gold transition-colors group">
                    <Phone size={18} className="group-hover:scale-110 transition-transform" /> Contact
                  </Link>
                </>
              )}
            </nav>

            {/* THEME TOGGLE + CART */}
            <div className="flex items-center gap-3 shrink-0">
              <ThemeToggle />
              <button
                onClick={openCart}
                className="group flex items-center gap-3 bg-surface2 border border-border px-5 py-2.5 rounded-2xl hover:bg-gold hover:text-background transition-all"
              >
                <div className="relative">
                  <FaShoppingCart className="text-gold group-hover:text-background" />
                  {totalItems > 0 && (
                    <span className="absolute -top-3 -right-3 bg-gold text-background text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-background">
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
      </header>

      <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <div className="h-[64px] md:h-20" />
    </>
  );
};

export default Header;
