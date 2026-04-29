// src/components/home/FeaturedBundles.tsx

"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/home/ProductCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface FeaturedBundlesProps {
  bundles: any[];
}

const FeaturedBundles: React.FC<FeaturedBundlesProps> = ({ bundles }) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  if (!bundles || bundles.length === 0) return null;

  const scrollAmount = 320; 

  const scrollLeft = () => {
    carouselRef.current?.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  };

  const scrollRight = () => {
    carouselRef.current?.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <section className="relative group">
      {/* TITLE REMOVED: 
          Managed by the parent page (Value Packs) for better SaaS consistency.
      */}

      {/* LEFT NAVIGATION ARROW - Restored for Mobile & Desktop */}
      <button
        onClick={scrollLeft}
        className="
          absolute -left-2 sm:left-4 top-1/2 -translate-y-1/2 
          z-30 
          bg-white/95 backdrop-blur-xl 
          shadow-2xl shadow-slate-200/50 
          border border-slate-100 
          rounded-full 
          p-3.5 sm:p-5 
          hover:bg-white hover:scale-110 
          active:scale-90 
          transition-all 
          opacity-100 sm:opacity-0 sm:group-hover:opacity-100
        "
        aria-label="Previous"
      >
        <FaChevronLeft size={12} className="text-slate-900" />
      </button>

      {/* RIGHT NAVIGATION ARROW - Restored for Mobile & Desktop */}
      <button
        onClick={scrollRight}
        className="
          absolute -right-2 sm:right-4 top-1/2 -translate-y-1/2 
          z-30 
          bg-white/95 backdrop-blur-xl 
          shadow-2xl shadow-slate-200/50 
          border border-slate-100 
          rounded-full 
          p-3.5 sm:p-5 
          hover:bg-white hover:scale-110 
          active:scale-90 
          transition-all 
          opacity-100 sm:opacity-0 sm:group-hover:opacity-100
        "
        aria-label="Next"
      >
        <FaChevronRight size={12} className="text-slate-900" />
      </button>

      {/* CAROUSEL CONTAINER */}
      <div
        ref={carouselRef}
        className="
          flex 
          gap-5 sm:gap-10 
          overflow-x-auto 
          no-scrollbar 
          scroll-smooth 
          pb-10 
          px-2
        "
      >
        {bundles.map((bundle) => (
          <motion.div
            key={bundle.id}
            className="flex-none w-[85vw] sm:w-[45vw] md:w-[35vw] lg:w-[28vw]"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <ProductCard
              {...bundle}
              isBundle
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedBundles;