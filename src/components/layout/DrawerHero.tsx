"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { getBusinessData } from "@/lib/getBusinessData";
import { FaBoxOpen, FaHeart } from "react-icons/fa"; // New Icons

const DrawerHero: React.FC = () => {
  const business = getBusinessData() as any;

  return (
    <div className="relative w-full shrink-0 flex flex-col bg-slate-950">
      {/* 1. THE VISUAL BANNER (Your current code, slightly shorter) */}
      <div className="relative w-full h-40 overflow-hidden">
        <Image
          src={business.drawerBanner || business.banner}
          alt={`${business.name} Banner`}
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        
        {/* Profile Info Overlay */}
        <div className="absolute bottom-4 left-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-[#FDB813] bg-slate-800 flex items-center justify-center text-[#FDB813] font-black">
            J
          </div>
          <div>
            <h2 className="text-sm font-black text-white leading-none">Hello, Joseph</h2>
            <span className="text-[10px] text-[#FDB813] font-bold uppercase tracking-tighter">Prime Member</span>
          </div>
        </div>
      </div>

      {/* 2. THE BENTO UPGRADE (New functional grid) */}
      <div className="px-4 pb-4 -mt-2 z-10 grid grid-cols-2 gap-2">
        {/* Active Orders Tile */}
        <motion.div 
          whileTap={{ scale: 0.95 }}
          className="bg-white/5 backdrop-blur-md border border-white/10 p-3 rounded-lg flex flex-col gap-1"
        >
          <div className="flex justify-between items-start">
            <FaBoxOpen className="text-[#FDB813]" size={14} />
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          </div>
          <span className="text-[10px] font-bold text-white uppercase">Orders</span>
          <span className="text-[9px] text-slate-400">2 In Transit</span>
        </motion.div>

        {/* Favorites Tile */}
        <motion.div 
          whileTap={{ scale: 0.95 }}
          className="bg-white/5 backdrop-blur-md border border-white/10 p-3 rounded-lg flex flex-col gap-1"
        >
          <FaHeart className="text-red-500" size={14} />
          <span className="text-[10px] font-bold text-white uppercase">Saved</span>
          <span className="text-[9px] text-slate-400">15 Items</span>
        </motion.div>
      </div>
    </div>
  );
};

export default DrawerHero;