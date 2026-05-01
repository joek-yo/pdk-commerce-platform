"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { getUIConfig } from "@/lib/getBusinessData";
import ProductCard from "@/components/home/ProductCard";

interface BundleProps {
  bundles: any[];
}

const FeaturedBundles: React.FC<BundleProps> = ({ bundles }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const ui = getUIConfig();

  const safeBundles = Array.isArray(bundles) ? bundles : [];

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const { clientWidth } = scrollRef.current;
    const scrollAmount = direction === "left" ? -clientWidth : clientWidth;

    scrollRef.current.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  if (safeBundles.length === 0) return null;

  return (
    <section className="relative group px-1">
      
      {/* NAVIGATION ARROWS */}
      <button
        onClick={() => scroll("left")}
        className="opacity-0 group-hover:opacity-100 absolute left-2 top-[40%] -translate-y-1/2 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-slate-900 text-white shadow-2xl transition-all duration-300 hover:bg-[#FDB813] hover:text-black cursor-pointer pointer-events-none group-hover:pointer-events-auto border border-white/10"
      >
        <FaChevronLeft size={16} />
      </button>

      <button
        onClick={() => scroll("right")}
        className="opacity-0 group-hover:opacity-100 absolute right-2 top-[40%] -translate-y-1/2 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-slate-900 text-white shadow-2xl transition-all duration-300 hover:bg-[#FDB813] hover:text-black cursor-pointer pointer-events-none group-hover:pointer-events-auto border border-white/10"
      >
        <FaChevronRight size={16} />
      </button>

      {/* SCROLL CONTAINER */}
      <div
        ref={scrollRef}
        className="flex gap-4 sm:gap-6 overflow-x-auto pb-8 no-scrollbar scroll-smooth snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {safeBundles.map((bundle) => (
          <motion.div
            key={bundle.id}
            className="flex-none w-[calc(85%-8px)] md:w-[calc(33.33%-16px)] snap-start"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* 🔥 REUSING YOUR PRODUCT CARD (NO DUPLICATE LOGIC) */}
            <ProductCard
              id={bundle.id}
              name={bundle.name}
              price={bundle.price}
              oldPrice={bundle.oldPrice}
              description={bundle.description}
              image={bundle.image}
              hoverImage={bundle.hoverImage}
              available={bundle.available}
              isBundle={true}
              variant="grid"
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedBundles;