"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/home/ProductCard";

interface JabysFavoritesProps {
  products: {
    id: number;
    name: string;
    price?: number;
    image?: string;
    description: string;
    available?: boolean;
    jabysFavorite?: boolean;
    bestSelling?: boolean;
    isBundle?: boolean;
  }[];
}

const JabysFavorites: React.FC<JabysFavoritesProps> = ({ products }) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  const favorites = products.filter(p => p.jabysFavorite);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    let scrollPos = 0;
    const speed = 0.5;
    let animationFrame: number;

    const animate = () => {
      if (!isInteracting) {
        scrollPos += speed;
        if (scrollPos >= carousel.scrollWidth - carousel.clientWidth) scrollPos = 0;
        carousel.scrollLeft = scrollPos;
      }
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [isInteracting]);

  if (favorites.length === 0) return null;

  // Handle both mouse hover and touch events
  const handleStartInteraction = () => setIsInteracting(true);
  const handleEndInteraction = () => setIsInteracting(false);

  return (
    <section className="mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-center">
        ⭐ Jaby’s Favorites
      </h2>

      <div
        ref={carouselRef}
        className="flex space-x-6 overflow-x-auto scrollbar-hide py-4 touch-pan-x"
        onMouseEnter={handleStartInteraction}
        onMouseLeave={handleEndInteraction}
        onTouchStart={handleStartInteraction}
        onTouchEnd={handleEndInteraction}
      >
        {favorites.map((product) => (
          <motion.div
            key={product.id}
            className="flex-none w-64 sm:w-56 md:w-64 lg:w-72"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <ProductCard {...product} />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default JabysFavorites;