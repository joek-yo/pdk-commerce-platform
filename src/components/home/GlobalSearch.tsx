// src/components/home/GlobalSearch.tsx

"use client";

import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

const GlobalSearch = () => {
  const [isHidden, setIsHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest < 150) {
      setIsHidden(false);
      return;
    }
    if (latest > previous && latest > 150) {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }
  });

  return (
    <motion.div 
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: -100, opacity: 0 }
      }}
      animate={isHidden ? "hidden" : "visible"}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-white/80 backdrop-blur-md border-b border-slate-100 py-3 px-4 sticky top-[60px] z-40 shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          
          <div className="relative flex-1 group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#FDB813] transition-colors cursor-pointer">
              <FaSearch size={15} />
            </div>

            <input 
              type="text" 
              placeholder="Search products, brands and categories..." 
              className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:border-[#FDB813] focus:bg-white transition-all duration-200 cursor-pointer"
            />
          </div>

          <button className="h-12 bg-[#FDB813] text-black px-8 rounded-xl font-black uppercase text-[10px] tracking-[0.1em] hover:bg-yellow-500 transition-all active:scale-[0.98] shadow-lg shadow-yellow-500/10 cursor-pointer">
            Search
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default GlobalSearch;