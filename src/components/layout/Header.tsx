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
  FaUtensils,
  FaEnvelope,
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

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "auto";
  }, [mobileMenuOpen]);

  // ================= ICON MAPPER =================
  const getNavIcon = (id: string) => {
    switch (id) {
      case "home":
        return <FaHome />;
      case "menu":
        return <FaUtensils />;
      case "contact":
        return <FaEnvelope />;
      default:
        return <FaHome />;
    }
  };

  const getLabel = (label: string, id: string) => {
    if (id === "menu") return "Products";
    return label;
  };

  return (
    <>
      <header className="bg-[#0D0D0D] text-white shadow-md fixed top-0 left-0 w-full z-50">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ================= MOBILE ================= */}
          <div className="md:hidden">

            {/* TOP ROW */}
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

                <span className="text-lg font-bold">
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
                  <span className="absolute -top-2 -right-2 bg-[#C2922F] text-white text-xs px-2 rounded-full">
                    {totalItems}
                  </span>
                )}
              </Button>

            </div>

            {/* SECOND ROW */}
            <div className="flex justify-between items-center pb-3">

              <button
                onClick={() => setMobileMenuOpen(true)}
                className="text-white p-2"
              >
                <FaBars size={22} />
              </button>

              {/* CTA BUTTONS (FIXED SPACING PROPERLY) */}
              <div className="flex items-center gap-4">

                {business?.phone && (
                  <>
                    <a href={`tel:${business.phone}`}>
                      <Button
                        variant="primary"
                        className="px-3 py-2 text-sm flex items-center gap-2"
                        leftIcon={<FaPhoneAlt />}
                      >
                        Call Now
                      </Button>
                    </a>

                    <a href={`https://wa.me/${business.phone}`}>
                      <Button
                        variant="whatsapp"
                        className="px-3 py-2 text-sm flex items-center gap-2"
                        leftIcon={<FaWhatsapp />}
                      >
                        WhatsApp
                      </Button>
                    </a>
                  </>
                )}

              </div>

            </div>
          </div>

          {/* ================= DESKTOP ================= */}
          <div className="hidden md:flex items-center justify-between py-4">

            <div className="flex items-center space-x-2">

              {business?.logo && (
                <Image
                  src={business.logo}
                  alt={business.name}
                  width={48}
                  height={48}
                  className="rounded"
                />
              )}

              <span className="text-2xl font-bold">
                {business?.name}
              </span>

            </div>

            <nav className="flex items-center space-x-8 font-medium">

              {navigation.map((item) => (
                <Link
                  key={item.id}
                  href={item.path}
                  className="hover:text-[#FDB813] transition flex items-center gap-2"
                >
                  {getNavIcon(item.id)}
                  {getLabel(item.label, item.id)}
                </Link>
              ))}

            </nav>

            <Button
              variant="primary"
              onClick={() => toggleDrawer(true)}
              className="px-4 py-2 flex items-center gap-2"
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
                className="fixed inset-0 bg-black/60 z-[60]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
              />

              <motion.div
                className="fixed top-0 left-0 h-full w-[85%] max-w-xs bg-[#0D0D0D] text-white z-[70]"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
              >

                {/* HEADER */}
                <div className="relative h-52">

                  <Image
                    src={business?.drawerBanner || business?.banner || "/images/placeholder.jpg"}
                    alt="banner"
                    fill
                    className="object-cover"
                  />

                  <div className="absolute inset-0 bg-black/70" />

                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="absolute top-4 right-4 bg-[#FDB813] text-black p-2 rounded-full"
                  >
                    <FaTimes />
                  </button>

                  <div className="absolute bottom-5 left-5">

                    <h2 className="text-xl font-bold text-[#FDB813]">
                      {business?.name}
                    </h2>

                    <p className="text-xs text-gray-300">
                      {business?.tagline}
                    </p>

                  </div>
                </div>

                {/* LINKS */}
                <div className="p-5 space-y-4">

                  {navigation.map((item) => (
                    <DrawerLink
                      key={item.id}
                      href={item.path}
                      label={getLabel(item.label, item.id)}
                      icon={getNavIcon(item.id)}
                      onClick={() => setMobileMenuOpen(false)}
                    />
                  ))}

                  <div className="pt-5 border-t border-gray-700 space-y-3">

                    <div className="flex justify-between text-sm">
                      <span>Status</span>
                      <span className="text-green-500">
                        ● {business?.status || "Open"}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span>Location</span>
                      <span>{business?.location || ""}</span>
                    </div>

                  </div>

                </div>

                {/* CTA (FIXED LAYOUT PROPERLY) */}
                <div className="p-5 space-y-4">

                  {business?.phone && (
                    <div className="flex flex-col gap-4">

                      <a href={`tel:${business.phone}`} className="w-full">
                        <Button
                          variant="primary"
                          className="w-full py-3 flex items-center justify-center gap-2"
                          leftIcon={<FaPhoneAlt />}
                        >
                          Call Now
                        </Button>
                      </a>

                      <a href={`https://wa.me/${business.phone}`} className="w-full">
                        <Button
                          variant="whatsapp"
                          className="w-full py-3 flex items-center justify-center gap-2"
                          leftIcon={<FaWhatsapp />}
                        >
                          WhatsApp Order
                        </Button>
                      </a>

                    </div>
                  )}

                </div>

              </motion.div>
            </>
          )}
        </AnimatePresence>

      </header>

      <div className="h-20 md:h-24" />
    </>
  );
};

const DrawerLink = ({ href, icon, label, onClick }: any) => (
  <Link
    href={href}
    onClick={onClick}
    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10"
  >
    <span className="text-[#FDB813] text-lg">{icon}</span>
    <span>{label}</span>
  </Link>
);

export default Header;