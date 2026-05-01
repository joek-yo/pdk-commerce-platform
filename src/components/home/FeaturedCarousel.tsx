"use client";

import React, { useRef, forwardRef, useImperativeHandle } from "react";
import ProductCard from "@/components/home/ProductCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface FeaturedCarouselProps {
  products: any[];
}

const FeaturedCarousel = forwardRef<HTMLDivElement, FeaturedCarouselProps>(
  ({ products }, ref) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const displayItems = Array.isArray(products) ? products : [];

    useImperativeHandle(ref, () => scrollRef.current as HTMLDivElement);

    const scroll = (direction: "left" | "right") => {
      if (scrollRef.current) {
        const { clientWidth } = scrollRef.current;
        const scrollAmount = direction === "left" ? -clientWidth : clientWidth;
        
        scrollRef.current.scrollBy({
          left: scrollAmount,
          behavior: "smooth",
        });
      }
    };

    if (displayItems.length === 0) return null;

    return (
      <div className="relative group px-1">
        {/* Navigation Arrows - Pulled inside with left-2 and right-2 */}
        <button 
          onClick={() => scroll("left")}
          className="opacity-0 group-hover:opacity-100 absolute left-2 top-[40%] -translate-y-1/2 z-50 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-slate-900 text-white shadow-2xl transition-all duration-300 hover:bg-[#FDB813] hover:text-black active:scale-95 cursor-pointer pointer-events-none group-hover:pointer-events-auto border-2 border-white/10"
        >
          <FaChevronLeft size={16} />
        </button>
        
        <button 
          onClick={() => scroll("right")}
          className="opacity-0 group-hover:opacity-100 absolute right-2 top-[40%] -translate-y-1/2 z-50 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-slate-900 text-white shadow-2xl transition-all duration-300 hover:bg-[#FDB813] hover:text-black active:scale-95 cursor-pointer pointer-events-none group-hover:pointer-events-auto border-2 border-white/10"
        >
          <FaChevronRight size={16} />
        </button>

        {/* SCROLLABLE AREA - THE SNAP ZONE */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-8 snap-x snap-mandatory"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
          }}
        >
          <style jsx>{`
            div::-webkit-scrollbar { display: none; }
          `}</style>

          {displayItems.map((product) => (
            <div
              key={product.id}
              className="flex-none w-[calc(50%-8px)] md:w-[calc(25%-12px)] snap-start transition-transform duration-500 hover:-translate-y-2"
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>
    );
  }
);

FeaturedCarousel.displayName = "FeaturedCarousel";

export default FeaturedCarousel;