// src/app/menu/page.tsx

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FaArrowRight, FaFingerprint } from "react-icons/fa";

import ProductCard from "@/components/home/ProductCard";
import { useCart } from "@/context/CartContext";
import {
  getCategories,
  getBundles,
  getUIConfig,
} from "@/lib/getBusinessData";

const MenuPage: React.FC = () => {
  const categories = getCategories();
  const bundles = getBundles();
  const ui = getUIConfig(); 

  const menuCategories = [
    ...categories,
    { id: "bundles-category", name: "Bundles", items: bundles },
  ];

  const [selectedCategory, setSelectedCategory] = useState(
    menuCategories[0]?.name ?? "Bundles"
  );

  const { addToCart } = useCart();

  const activeCategory =
    menuCategories.find((cat) => cat.name === selectedCategory) ??
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

      {/* HEADER - DYNAMIC */}
      <div className="mb-12 text-center">
        <span className="text-[10px] font-black text-[#FDB813] uppercase tracking-[0.5em] mb-4 block text-center">
          {ui.menuPage.tagline}
        </span>
        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tighter mb-4">
          {ui.menuPage.title}
        </h1>
        <p className="text-slate-400 text-sm sm:text-lg font-bold tracking-tight max-w-md mx-auto leading-tight">
          {ui.menuPage.subtitle}
        </p>
      </div>

      {/* MOBILE-FIRST CATEGORY TABS */}
      <div className="sticky top-[70px] z-30 bg-[#F1F5F9]/80 backdrop-blur-md py-6 mb-12 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex justify-start sm:justify-center overflow-x-auto no-scrollbar scroll-smooth">
          {/* STANDARDIZED: rounded-2xl instead of rounded-[2rem] */}
          <div className="flex bg-white p-1.5 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 gap-1 min-w-max mx-auto">
            {menuCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`whitespace-nowrap px-6 sm:px-8 py-3 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all duration-300
                  ${selectedCategory === cat.name
                    ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                    : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
                  }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CTA CARD - DYNAMIC */}
      <div className="max-w-5xl mx-auto mb-16">
        {/* STANDARDIZED: rounded-3xl instead of rounded-[2.5rem] */}
        <div className="relative overflow-hidden bg-white border border-slate-100 rounded-3xl p-8 sm:p-12 text-center shadow-[0_30px_100px_rgba(0,0,0,0.04)]">
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-black mb-3 text-slate-900 tracking-tighter">
              {ui.menuPage.ctaTitle}
            </h2>
            <p className="text-slate-500 font-bold mb-8 text-sm sm:text-base max-w-lg mx-auto">
              {ui.menuPage.ctaDescription}
            </p>
            <Link href="/custom-order">
              {/* STANDARDIZED: rounded-xl instead of rounded-2xl for consistency with home buttons */}
              <button className="group px-10 py-4 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-black transition-all flex items-center gap-3 mx-auto shadow-xl shadow-slate-900/20">
                {ui.menuPage.ctaButton} <FaArrowRight size={10} className="text-[#FDB813] group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
          <div className="absolute top-0 right-0 p-8 opacity-5 text-slate-900 hidden sm:block">
            <FaFingerprint size={80} />
          </div>
        </div>
      </div>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
        {sortedProducts.map((product) => (
          <div key={product.id} className="transition-all duration-500 hover:-translate-y-1">
            <ProductCard
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
          </div>
        ))}
      </div>

    </div>
  );
};

export default MenuPage;