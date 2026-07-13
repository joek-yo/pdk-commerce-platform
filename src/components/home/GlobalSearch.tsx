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
      className="bg-surface border-t border-gold/40 border-b border-b-border py-3 px-4 sticky top-[64px] md:top-20 z-40 shadow-sm w-full"
    >
      <div className="max-w-2xl mx-auto flex items-center bg-surface border border-border rounded-full h-11 pl-5 overflow-hidden focus-within:border-gold transition-colors">
        <input
          type="text"
          placeholder="Search"
          className="flex-1 bg-transparent outline-none focus:outline-none text-sm font-medium text-foreground placeholder:text-subtext"
        />
        <div className="w-px h-6 bg-border" />
        <button
          aria-label="Search"
          className="h-full px-5 flex items-center justify-center text-subtext hover:text-gold transition-colors cursor-pointer outline-none focus:outline-none focus-visible:text-gold"
        >
          <FaSearch size={14} />
        </button>
      </div>
    </motion.div>
  );
};

export default GlobalSearch;
