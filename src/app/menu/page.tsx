// src/app/menu/page.tsx

"use client";

import React, { useState } from "react";
import Link from "next/link";

import ProductCard from "@/components/home/ProductCard";
import { useCart } from "@/context/CartContext";
import {
  getCategories,
  getBundles,
} from "@/lib/getBusinessData";

const MenuPage: React.FC = () => {
  // ================= SAFE DATA =================
  const categories = getCategories();
  const bundles = getBundles();

  const menuCategories = [
    ...categories,
    { id: "bundles-category", name: "Bundles", items: bundles },
  ];

  // ================= SAFE INITIAL STATE =================
  const [selectedCategory, setSelectedCategory] = useState(
    menuCategories[0]?.name ?? "Bundles"
  );

  const { addToCart } = useCart();

  const activeCategory =
    menuCategories.find((cat) => cat.name === selectedCategory) ??
    menuCategories[0];

  const items = activeCategory?.items ?? [];

  const placeholderImage = "/images/placeholder.jpg";

  // ================= SAFE SORT =================
  const sortedProducts = [...items].sort((a, b) => {
    if (a?.bestSelling && !b?.bestSelling) return -1;
    if (!a?.bestSelling && b?.bestSelling) return 1;
    if (a?.jabysFavorite && !b?.jabysFavorite) return -1;
    if (!a?.jabysFavorite && b?.jabysFavorite) return 1;
    return 0;
  });

  const primaryBtn =
    "inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold bg-[#FDB813] text-[#0D0D0D] hover:bg-[#C2922F] transition shadow-md";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-14">

      {/* HEADER */}
      <div className="mb-6 sm:mb-10 text-center">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3">
          Freshly Crafted for You
        </h1>
        <p className="text-gray-500 text-sm sm:text-base">
          Browse, select and order instantly
        </p>
      </div>

      {/* CATEGORY TABS */}
      <div className="sticky top-16 z-30 bg-white py-3 mb-6">

        <div className="flex justify-center overflow-x-auto no-scrollbar">
          <div className="flex bg-gray-100 rounded-full shadow-sm divide-x divide-gray-300 w-full max-w-sm sm:max-w-md md:max-w-xl">

            {menuCategories.map((cat, index) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex-1 text-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition
                  ${selectedCategory === cat.name
                    ? "bg-green-900 text-white"
                    : "text-gray-700 hover:bg-gray-200"
                  }`}
              >
                {cat.name}
              </button>
            ))}

          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-3xl mx-auto mb-8 sm:mb-12">
        <div className="border rounded-2xl p-5 sm:p-8 text-center bg-green-50 border-green-200">

          <h2 className="text-lg sm:text-2xl font-bold mb-2">
            Need Something Custom?
          </h2>

          <p className="text-gray-600 mb-5 text-sm sm:text-base">
            Request special meals, cakes, or bulk orders tailored to you.
          </p>

          <Link href="/custom-order" className={primaryBtn}>
            🧾 Request Custom Order
          </Link>

        </div>
      </div>

      {/* PRODUCTS */}
      <div className="
        grid
        grid-cols-2
        sm:grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
        gap-3 sm:gap-5 md:gap-6
      ">
        {sortedProducts.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
            image={product.image || placeholderImage}
            isBundle={selectedCategory === "Bundles"}
            onAddToCart={() =>
              addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                image: product.image || placeholderImage,
              })
            }
          />
        ))}
      </div>

    </div>
  );
};

export default MenuPage;