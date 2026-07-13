"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { getBusinessData, getUIConfig } from "@/lib/getBusinessData";
import { FaWhatsapp, FaShoppingCart } from "react-icons/fa";

const Hero: React.FC = () => {
  const business = getBusinessData();
  const ui = getUIConfig() as any;

  const phoneNumber = business?.phone?.replace(/[^0-9]/g, "") || "";
  const hero = ui?.hero || {};

  return (
    <section className="w-screen h-[85vh] md:h-[75vh] relative flex items-center justify-center overflow-hidden">

      {business?.banner && (
        <Image
          src={business.banner}
          alt="Hero Banner"
          fill
          className="object-cover"
          priority
        />
      )}

      <div className="absolute inset-0 bg-black/65 md:bg-black/55" />

      <motion.div
        className="relative z-10 text-center px-6 text-foreground pt-24 md:pt-20 pb-32 md:pb-0"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
      >

        <h2 className="text-2xl md:text-4xl font-black mb-2 text-gold uppercase tracking-wider">
          {hero.heading || "Smart Deals, Smart Choices"}
        </h2>

        <h1 className="text-4xl md:text-7xl font-black mb-4 tracking-tighter leading-tight text-foreground">
          {hero.description || "Everything you need in one place"}
        </h1>

        <p className="text-sm md:text-2xl mb-10 text-subtext font-medium tracking-tight">
          Trusted Products • Best Prices • Instant Ordering
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-xs sm:max-w-none mx-auto">

          <Link
            href="/menu"
            className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-black uppercase text-xs tracking-widest bg-gold text-background border border-gold hover:bg-gold-strong hover:border-gold-strong hover:scale-105 hover:shadow-2xl transition-all duration-200 shadow-xl"
          >
            <FaShoppingCart size={14} />
            Browse Products
          </Link>

          {phoneNumber && (
            <a href={`https://wa.me/${phoneNumber}?text=Hello%20I%20would%20like%20to%20order`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-black uppercase text-xs tracking-widest bg-surface/60 backdrop-blur-md text-foreground border border-foreground/20 hover:bg-whatsapp/10 hover:border-whatsapp hover:text-whatsapp hover:scale-105 transition-all duration-200 shadow-xl"
            >
              <FaWhatsapp size={16} />
              Order via WhatsApp
            </a>
          )}

        </div>

      </motion.div>
    </section>
  );
};

export default Hero;
