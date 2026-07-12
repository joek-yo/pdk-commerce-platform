"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FaArrowRight, FaFingerprint } from "react-icons/fa";

import ProductCard from "@/components/home/ProductCard";
import { useCart } from "@/context/CartContext";
import {
  getCategories,
  getBundles,
  getUIConfig,
} from "@/lib/getBusinessData";

/**
 * 🔥 MAIN CONTENT (uses search params)
 */
const MenuContent: React.FC = () => {
  const categories = getCategories();
  const bundles = getBundles();
  const ui = getUIConfig();

  const menuCategories = [
    ...categories,
    { id: "bundles-category", name: "Bundles", items: bundles },
  ];

  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category");

  const { addToCart } = useCart();

  const [selectedCategoryId, setSelectedCategoryId] = useState(
    menuCategories[0]?.id ?? "bundles-category"
  );

  // 🔥 URL sync
  useEffect(() => {
    if (!urlCategory) return;

    const found = menuCategories.find((cat) => cat.id === urlCategory);

    if (found) {
      setSelectedCategoryId(found.id);
    }
  }, [urlCategory]);

  const activeCategory =
    menuCategories.find((cat) => cat.id === selectedCategoryId) ??
    menuCategories[0];

  const items = activeCategory?.items ?? [];
  const placeholderImage = "/images/placeholder.jpg";

  const sortedProducts = [...items].sort((a, b) => {
    if (a?.bestSelling && !b?.bestSelling) return -1;
    if (!a?.bestSelling && b?.bestSelling) return 1;
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-20">

      {/* HEADER */}
      <div className="mb-12 text-center">
        <span className="text-[10px] font-black text-[#FDB813] uppercase tracking-[0.5em] mb-4 block">
          {ui.menuPage.tagline}
        </span>

        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tighter mb-4">
          {ui.menuPage.title}
        </h1>

        <p className="text-slate-400 text-sm sm:text-lg font-bold max-w-md mx-auto">
          {ui.menuPage.subtitle}
        </p>
      </div>

      {/* CATEGORY TABS */}
      <div className="sticky top-[70px] z-30 bg-[#F1F5F9]/80 backdrop-blur-md py-6 mb-12">
        <div className="flex justify-center overflow-x-auto no-scrollbar">
          <div className="flex bg-white p-1.5 rounded-2xl shadow-xl border border-slate-100 gap-1">

            {menuCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`whitespace-nowrap px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all
                  ${
                    selectedCategoryId === cat.id
                      ? "bg-slate-900 text-white"
                      : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
                  }`}
              >
                {cat.name}
              </button>
            ))}

          </div>
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">

        {sortedProducts.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
            image={product.image || placeholderImage}
            isBundle={selectedCategoryId === "bundles-category"}
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

/**
 * 🔥 PAGE WRAPPER (Suspense fix)
 */
const MenuPage: React.FC = () => {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading menu...</div>}>
      <MenuContent />
    </Suspense>
  );
};

export default MenuPage;