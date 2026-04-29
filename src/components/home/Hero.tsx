// src/components/home/Hero.tsx

"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { getBusinessData, getUIConfig } from "@/lib/getBusinessData";
import { FaWhatsapp, FaShoppingCart } from "react-icons/fa";
import Button from "@/components/ui/Button";

const Hero: React.FC = () => {
  const business = getBusinessData();
  const ui = getUIConfig();

  const phoneNumber = business?.phone?.replace(/[^0-9]/g, "") || "";
  const hero = ui?.hero || {};

  return (
    /* ADJUSTED: Height increased to 85vh on mobile (h-[85vh]) to account for the double-row header */
    <section className="w-screen h-[85vh] md:h-[75vh] relative flex items-center justify-center overflow-hidden">

      {/* BACKGROUND */}
      {business?.banner && (
        <Image
          src={business.banner}
          alt="Hero Banner"
          fill
          className="object-cover"
          priority
        />
      )}

      {/* OVERLAY - Slightly darker for better text readability on small screens */}
      <div className="absolute inset-0 bg-black/60 md:bg-black/50" />

      {/* CONTENT */}
      <motion.div
        /* ADJUSTED: Added pb-32 on mobile to push buttons UP away from the overlapping card */
        className="relative z-10 text-center px-6 text-white pt-24 md:pt-20 pb-32 md:pb-0"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
      >

        {/* TITLE (BUSINESS MESSAGE) */}
        <h2 className="text-2xl md:text-4xl font-black mb-2 text-[#FDB813] uppercase tracking-wider">
          {hero.heading || "Smart Deals, Smart Choices"}
        </h2>

        {/* SUBTITLE (VALUE STATEMENT) */}
        <h1 className="text-4xl md:text-7xl font-black mb-4 tracking-tighter leading-tight">
          {hero.description || "Everything you need in one place"}
        </h1>

        {/* UNIVERSAL VALUE LINE */}
        <p className="text-sm md:text-2xl mb-10 text-gray-200 font-medium tracking-tight opacity-90">
          Trusted Products • Best Prices • Instant Ordering
        </p>

        {/* CTA BUTTONS */}
        <div className="flex flex-col md:flex-row justify-center gap-4 max-w-xs mx-auto md:max-w-none">

          {/* SHOP NOW */}
          <Link href="/menu">
            <Button
              variant="primary"
              className="px-8 py-4 flex items-center justify-center gap-3 font-black uppercase text-xs tracking-widest shadow-2xl"
              leftIcon={<FaShoppingCart size={14}/>}
            >
              Browse Products
            </Button>
          </Link>

          {/* WHATSAPP */}
          {phoneNumber && (
            <a
              href={`https://wa.me/${phoneNumber}?text=Hello%20I%20would%20like%20to%20order`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="whatsapp"
                className="px-8 py-4 flex items-center justify-center gap-3 font-black uppercase text-xs tracking-widest shadow-2xl"
                leftIcon={<FaWhatsapp size={16}/>}
              >
                Order via WhatsApp
              </Button>
            </a>
          )}

        </div>

      </motion.div>
    </section>
  );
};

export default Hero;