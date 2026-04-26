"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { getBusinessData } from "@/lib/getBusinessData";
import { FaWhatsapp } from "react-icons/fa";

const Hero: React.FC = () => {
  const business = getBusinessData();

  return (
    <section className="w-screen max-w-none h-[75vh] relative flex items-center justify-center overflow-hidden">
      {/* Hero Background Image */}
      {business.banner && (
        <Image
          src={business.banner}
          alt="Hero Banner"
          fill
          className="absolute top-0 left-0 w-full h-full object-cover"
          priority
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-6 text-white pt-16 md:pt-20"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-2 drop-shadow-lg text-yellow-300">
          {business.name || "House Of Jaby"}
        </h2>

        <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
          {business.tagline || "Crafted Moments The Jaby Way"}
        </h1>

        <p className="text-lg md:text-2xl mb-6 drop-shadow">
          Fast Delivery • Fresh Ingredients • Hit Us Up
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-4">
          <Link
            href="/menu"
            className="px-8 py-4 bg-green-900 text-white font-semibold rounded-lg shadow-lg hover:bg-green-800 transition-colors"
          >
            View Menu
          </Link>

          <Link
            href={`https://wa.me/${business.phone}?text=Hello%20I%20would%20like%20to%20order`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-green-500 text-white font-semibold rounded-lg shadow-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
          >
            <FaWhatsapp className="text-white w-5 h-5" />
            Order via WhatsApp
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;