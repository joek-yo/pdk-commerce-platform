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

      {/* CTA */}
      <div className="max-w-5xl mx-auto mb-16">
        <div className="relative overflow-hidden bg-white border border-slate-100 rounded-3xl p-8 sm:p-12 text-center">

          <h2 className="text-2xl sm:text-3xl font-black mb-3 text-slate-900">
            {ui.menuPage.ctaTitle}
          </h2>

          <p className="text-slate-500 font-bold mb-8 max-w-lg mx-auto">
            {ui.menuPage.ctaDescription}
          </p>

          <Link href="/custom-order">
            <button className="px-10 py-4 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 mx-auto">
              {ui.menuPage.ctaButton}
              <FaArrowRight size={10} className="text-[#FDB813]" />
            </button>
          </Link>

          <div className="absolute top-0 right-0 p-8 opacity-5 hidden sm:block">
            <FaFingerprint size={80} />
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