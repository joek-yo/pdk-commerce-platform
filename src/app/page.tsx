// src/app/page.tsx

"use client";

import React from "react";
import Link from "next/link";

import Hero from "@/components/home/Hero";
import FeaturedBundles from "@/components/home/FeaturedBundles";
import JabysFavorites from "@/components/home/JabysFavorites";
import ProductCard from "@/components/home/ProductCard";

import {
  getCategories,
  getBundles,
  getAllProducts,
} from "@/lib/getBusinessData";

const Pages: React.FC = () => {
  // ================= DATA =================
  const bundlesData = getBundles();
  const allItems = getAllProducts();

  // ================= DERIVED DATA =================
  
  // 1. Favorites: Look for anything flagged as a favorite/featured in ALL items
  const featuredProducts = allItems.filter(
    (i) => i?.jabysFavorite === true || i?.featured === true || i?.isFavorite === true
  );

  // 2. Best Sellers
  const bestSellers = allItems
    .filter((i) => i?.bestSelling === true || i?.isBestSeller === true)
    .slice(0, 6);

  // 3. Bundles: Check the dedicated bundles array PLUS any item tagged as a bundle in the menu
  const featuredBundles = [
    ...bundlesData,
    ...allItems.filter((i) => i?.category?.toLowerCase() === "bundle" || i?.isBundle === true)
  ].filter((b) => b?.featured !== false); // Keep them visible unless explicitly hidden

  return (
    <main className="bg-gray-50 pb-20">
      <Hero />

      {/* CUSTOM ORDER CTA */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8 sm:mt-12">
        <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 text-center shadow-sm">
          <h2 className="text-xl sm:text-2xl font-bold mb-2 text-gray-900">
            Need Something Not on the Menu?
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mb-6">
            Request cakes, catering, bulk meals, or custom food orders made just for you.
          </p>
          <Link href="/custom-order">
            <button className="px-8 py-3 bg-[#0D0D0D] text-white rounded-xl font-bold hover:bg-gray-800 transition shadow-lg w-full sm:w-auto">
              🎂 Request Custom Order
            </button>
          </Link>
        </div>
      </div>

      <div className="pt-10 sm:pt-16 space-y-16 sm:space-y-24">
        {/* BEST SELLERS */}
        {bestSellers.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center text-gray-900">
              🔥 Best Sellers
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
              {bestSellers.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </section>
        )}

        {/* FAVORITES / FEATURED ITEMS */}
        {featuredProducts.length > 0 && (
          <JabysFavorites products={featuredProducts} />
        )}

        {/* BUNDLES */}
        {featuredBundles.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6">
            <FeaturedBundles bundles={featuredBundles} />
          </section>
        )}
      </div>
    </main>
  );
};

export default Pages;