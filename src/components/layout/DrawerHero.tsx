"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { getBusinessData } from "@/lib/getBusinessData";

const DrawerHero: React.FC = () => {
  // FIXED: Cast to 'any' to allow dynamic properties like 'slogan' or 'drawerBanner'
  const business = getBusinessData() as any;

  return (
    <div className="relative w-full h-52 shrink-0 overflow-hidden">
      {/* Background Image with optimized loading */}
      <Image
        src={business.drawerBanner || business.banner}
        alt={`${business.name} Banner`}
        fill
        className="object-cover"
        priority
      />
      
      {/* Cinematic Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      {/* Animated Content */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
        className="absolute bottom-5 left-5 text-white"
      >
        <h2 className="text-2xl font-black text-[#FDB813] drop-shadow-lg tracking-tight">
          {business.name}
        </h2>
        
        <div className="flex items-center space-x-2 mt-1">
          <span className="h-[2px] w-4 bg-[#FDB813] rounded-full" />
          <p className="text-xs font-semibold italic text-white/90 tracking-wide drop-shadow-md">
            {business.slogan || "Crafted Moments The Jaby Way"}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default DrawerHero;