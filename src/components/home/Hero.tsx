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

  const phoneNumber =
    business?.phone?.replace(/[^0-9]/g, "") || "";

  const hero = ui?.hero || {};

  return (
    <section className="w-screen h-[75vh] relative flex items-center justify-center overflow-hidden">

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

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/50" />

      {/* CONTENT */}
      <motion.div
        className="relative z-10 text-center px-6 text-white pt-16 md:pt-20"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
      >

        {/* TITLE (BUSINESS MESSAGE) */}
        <h2 className="text-3xl md:text-4xl font-bold mb-2 text-[#FDB813]">
          {hero.heading || "Smart Deals, Smart Choices"}
        </h2>

        {/* SUBTITLE (VALUE STATEMENT) */}
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          {hero.description || "Everything you need in one place"}
        </h1>

        {/* UNIVERSAL VALUE LINE */}
        <p className="text-lg md:text-2xl mb-8 text-gray-200">
          Trusted Products • Best Prices • Instant Ordering
        </p>

        {/* CTA BUTTONS */}
        <div className="flex flex-col md:flex-row justify-center gap-4">

          {/* SHOP NOW (UNIVERSAL) */}
          <Link href="/menu">
            <Button
              variant="primary"
              className="px-8 py-4 flex items-center gap-2"
              leftIcon={<FaShoppingCart />}
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
                className="px-8 py-4 flex items-center gap-2"
                leftIcon={<FaWhatsapp />}
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