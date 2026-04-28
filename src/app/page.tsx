// src/app/page.tsx

"use client";

import React from "react";
import Link from "next/link";

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
      {/* 1. HERO SECTION (Ensure Hero component internal text is dark/gold) */}
      <Hero />

      {/* 2. DYNAMIC CUSTOM ORDER CTA - Re-styled for "Pop" */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-10 relative z-20">
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 sm:p-12 text-center shadow-[0_20px_50px_rgba(0,0,0,0.04)] backdrop-blur-sm">
          <div className="inline-block px-4 py-1.5 rounded-full bg-[#FDB813]/10 border border-[#FDB813]/20 text-[#C2922F] text-[10px] font-black uppercase tracking-[0.3em] mb-6">
            Exclusive Service
          </div>
          <h2 className="text-3xl sm:text-4xl font-black mb-4 text-slate-900 tracking-tighter">
            {ui.customOrder.title}
          </h2>
          <p className="text-slate-500 text-base sm:text-lg font-bold mb-8 max-w-xl mx-auto leading-tight">
            {ui.customOrder.description}
          </p>
          <Link href="/custom-order">
            <button className="px-12 py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black hover:scale-[1.03] active:scale-[0.98] transition-all shadow-2xl shadow-slate-900/20 w-full sm:w-auto">
              {ui.customOrder.buttonText}
            </button>
          </Link>
        </div>
      </div>

      <div className="pt-20 sm:pt-32 space-y-24 sm:space-y-40">
        
        {/* 3. BEST SELLERS - Grid Upgrade */}
        {bestSellers.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col items-center mb-12 sm:mb-16">
              <span className="text-[10px] font-black text-[#FDB813] uppercase tracking-[0.5em] mb-2">Most Wanted</span>
              <h2 className="text-3xl sm:text-5xl font-black text-center text-slate-900 tracking-tighter">
                🔥 Best Sellers
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

        {/* 4. FEATURED ITEMS (Carousel) */}
        {featuredProducts.length > 0 && (
          <div className="bg-white py-24 sm:py-32 border-y border-slate-100 shadow-inner">
             <FeaturedCarousel products={featuredProducts} />
          </div>
        )}

        {/* 5. BUNDLES SECTION */}
        {featuredBundles.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col items-center mb-12 sm:mb-16">
               <span className="text-[10px] font-black text-[#FDB813] uppercase tracking-[0.5em] mb-2">Save More</span>
               <h2 className="text-3xl sm:text-5xl font-black text-center text-slate-900 tracking-tighter">
                 Value Bundles
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