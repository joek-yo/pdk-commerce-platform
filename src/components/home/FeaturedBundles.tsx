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

  const scrollAmount = 300;

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
    <section className="mt-16 relative">

      {/* TITLE */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-center">
        🎁 Featured Bundles
      </h2>

      {/* LEFT ARROW */}
      <button
        onClick={scrollLeft}
        className="
          absolute left-1 top-1/2 -translate-y-1/2
          z-10
          bg-white/90
          backdrop-blur
          shadow-md
          border border-gray-200
          rounded-full
          p-2 sm:p-3
          hover:bg-white
          transition
        "
      >
        <FaChevronLeft size={16} />
      </button>

      {/* RIGHT ARROW */}
      <button
        onClick={scrollRight}
        className="
          absolute right-1 top-1/2 -translate-y-1/2
          z-10
          bg-white/90
          backdrop-blur
          shadow-md
          border border-gray-200
          rounded-full
          p-2 sm:p-3
          hover:bg-white
          transition
        "
      >
        <FaChevronRight size={16} />
      </button>

      {/* CAROUSEL */}
      <div
        ref={carouselRef}
        className="
          flex
          gap-4
          overflow-x-auto
          scrollbar-hide
          scroll-smooth
          pb-4
          px-1
        "
      >

        {bundles.map((bundle) => (
          <motion.div
            key={bundle.id}
            className="
              flex-none
              w-[85%]
              sm:w-[48%]
              md:w-[40%]
              lg:w-[32%]
            "
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
          >
            <ProductCard
              id={bundle.id}
              name={bundle.name}
              price={bundle.price}
              image={bundle.image || "/images/placeholder.jpg"}
              description={bundle.description}
              available={bundle.available}
              isBundle
              featured={bundle.featured || false}
              trending={bundle.trending || false}
            />
          </motion.div>
        ))}

      </div>

    </section>
  );
};

export default FeaturedBundles;