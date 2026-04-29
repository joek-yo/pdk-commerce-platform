// src/app/page.tsx

"use client";

import React from "react";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

import Hero from "@/components/home/Hero";
import FeaturedBundles from "@/components/home/FeaturedBundles";
import FeaturedCarousel from "@/components/home/FeaturedCarousel";
import ProductCard from "@/components/home/ProductCard";

import {
  getBundles,
  getAllProducts,
  getUIConfig,
} from "@/lib/getBusinessData";

const Pages: React.FC = () => {
  const bundlesData = getBundles();
  const allItems = getAllProducts();
  const ui = getUIConfig();

  const featuredProducts = allItems.filter(
    (i) => i?.jabysFavorite === true || i?.featured === true || i?.isFavorite === true
  );

  const bestSellers = allItems
    .filter((i) => i?.bestSelling === true || i?.isBestSeller === true)
    .slice(0, 6);

  const featuredBundles = [
    ...bundlesData,
    ...allItems.filter((i) => i?.category?.toLowerCase() === "bundle" || i?.isBundle === true)
  ].filter((b) => b?.featured !== false);

  return (
    <main className="bg-[#F1F5F9] pb-32">
      {/* 1. HERO SECTION */}
      <Hero />

      {/* 2. CUSTOM ORDER CTA - OVERLAP RESTORED */}
      {/* Added -mt-20 to pull the card up onto the Hero banner */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-20 relative z-20">
        <div className="bg-white border border-slate-100 rounded-[3rem] p-10 sm:p-16 text-center shadow-[0_40px_100px_rgba(0,0,0,0.08)] overflow-hidden relative">
          
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FDB813]/5 rounded-bl-[5rem]" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-slate-50 rounded-tr-[4rem]" />

          <div className="relative z-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-[#C2922F] text-[10px] font-black uppercase tracking-[0.4em] mb-8">
              {ui.customOrder.badge}
            </span>
            
            <h2 className="text-3xl sm:text-5xl font-black mb-6 text-slate-900 tracking-tighter leading-none">
              {ui.customOrder.title}
            </h2>
            
            <p className="text-slate-500 text-base sm:text-lg font-bold mb-10 max-w-2xl mx-auto leading-relaxed">
              {ui.customOrder.description}
            </p>

            <Link href="/custom-order">
              <button className="group relative px-12 py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-2xl shadow-slate-900/20 active:scale-95 flex items-center justify-center gap-3 mx-auto">
                {ui.customOrder.buttonText}
                <FaArrowRight size={12} className="text-[#FDB813] group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* 3. SECTION SPACING */}
      <div className="pt-24 sm:pt-40 space-y-24 sm:space-y-40">
        
        {/* BEST SELLERS */}
        {bestSellers.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col items-center mb-16">
              <span className="text-[10px] font-black text-[#FDB813] uppercase tracking-[0.6em] mb-4">The Collection</span>
              <h2 className="text-4xl sm:text-6xl font-black text-center text-slate-900 tracking-tighter">
                Most Wanted
              </h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-10">
              {bestSellers.map((product) => (
                <div key={product.id} className="transform transition-all duration-500 hover:-translate-y-2">
                   <ProductCard {...product} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FEATURED ITEMS */}
        {featuredProducts.length > 0 && (
          <div className="bg-white py-24 sm:py-32 border-y border-slate-100">
             <FeaturedCarousel products={featuredProducts} />
          </div>
        )}

        {/* BUNDLES SECTION - CLEAN HEADERS */}
        {featuredBundles.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col items-center mb-16">
               <span className="text-[10px] font-black text-[#FDB813] uppercase tracking-[0.6em] mb-4">Limited Edition</span>
               <h2 className="text-4xl sm:text-6xl font-black text-center text-slate-900 tracking-tighter">
                 Value Packs
               </h2>
            </div>
            <FeaturedBundles bundles={featuredBundles} />
          </section>
        )}
      </div>
    </main>
  );
};

export default Pages;