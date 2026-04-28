// src/components/home/FeaturedCarousel.tsx

"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/home/ProductCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Renamed interface to be universal
interface FeaturedCarouselProps {
  products: any[]; 
}

// Renamed component to FeaturedCarousel
const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({ products }) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  // We use the passed products directly
  const displayItems = products;

  if (displayItems.length === 0) return null;

  const scrollAmount = 280;

  const scrollLeft = () => {
    carouselRef.current?.scrollBy({
      left: -scrollAmount,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    carouselRef.current?.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="mt-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

      {/* TITLE (UNIVERSAL) */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-center text-gray-900">
        ⭐ Featured Picks
      </h2>

      {/* NAVIGATION ARROWS */}
      <button
        onClick={scrollLeft}
        aria-label="Scroll Left"
        className="absolute left-1 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur shadow-md border border-gray-100 rounded-full p-2 sm:p-3 hover:bg-white transition"
      >
        <FaChevronLeft size={16} />
      </button>

      <button
        onClick={scrollRight}
        aria-label="Scroll Right"
        className="absolute right-1 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur shadow-md border border-gray-100 rounded-full p-2 sm:p-3 hover:bg-white transition"
      >
        <FaChevronRight size={16} />
      </button>

      {/* CAROUSEL */}
      <div
        ref={carouselRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
      >
        {displayItems.map((product) => (
          <motion.div
            key={product.id}
            className="flex-none w-[48%] sm:w-56 md:w-64 lg:w-72"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <ProductCard {...product} />
          </motion.div>
        ))}
      </div>

    </section>
  );
};

export default FeaturedCarousel;