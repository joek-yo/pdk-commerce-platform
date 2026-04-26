"use client";

import React from "react";
import Link from "next/link";

// ✅ Using alias "@/..." for all imports
import Hero from "@/components/home/Hero";
import FeaturedBundles from "@/components/home/FeaturedBundles";
import JabysFavorites from "@/components/home/JabysFavorites";
import ProductCard from "@/components/home/ProductCard";
import menuData from "@/data/menu.json";

const Pages: React.FC = () => {
  const { categories, bundles } = menuData;

  // -----------------------------
  // Combine all items once to avoid multiple flatMaps
  // -----------------------------
  const allItems = categories.flatMap((c) => c.items);

  // -----------------------------
  // Jaby's Favorites
  // -----------------------------
  const jabyFavorites = allItems.filter((i) => i.jabysFavorite);

  // -----------------------------
  // Best Sellers (Top 3 globally)
  // -----------------------------
  const bestSellers = allItems.filter((i) => i.bestSelling).slice(0, 3);

  // -----------------------------
  // Featured Bundles
  // -----------------------------
  const featuredBundles = bundles.filter(
    (b) => b.jabysFavorite || b.bestSelling
  );

  return (
    <main>
      {/* ---------------- Hero Section ---------------- */}
      <Hero />

      {/* ---------------- Custom Order Button ---------------- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="border rounded-xl p-6 text-center bg-green-50 border-green-200">
          <h2 className="font-semibold text-lg mb-2">
            Need Something Not on the Menu?
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            You can request cakes, catering, bulk meals, or any special order.
          </p>
          <Link href="/custom-order">
            <button className="px-6 py-3 bg-green-900 text-white rounded-lg font-semibold hover:bg-green-700 transition">
              🎂 Request Full Custom Order
            </button>
          </Link>
        </div>
      </div>

      {/* ---------------- Page Content ---------------- */}
      <div className="pt-16 space-y-24">
        {/* ---------------- Best Sellers ---------------- */}
        {bestSellers.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-6 text-center">🔥 Best Sellers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {bestSellers.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </section>
        )}

        {/* ---------------- Jaby's Favorites ---------------- */}
        {jabyFavorites.length > 0 && <JabysFavorites products={jabyFavorites} />}

        {/* ---------------- Featured Bundles ---------------- */}
        {featuredBundles.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FeaturedBundles bundles={featuredBundles} />
          </section>
        )}
      </div>
    </main>
  );
};

export default Pages;