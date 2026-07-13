"use client";

import React, { useState, useEffect, useRef, useLayoutEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FaLayerGroup } from "react-icons/fa";

import ProductCard from "@/components/home/ProductCard";
import { useCart } from "@/context/CartContext";
import {
  getCategories,
  getBundles,
  getUIConfig,
} from "@/lib/getBusinessData";

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

  useEffect(() => {
    if (!urlCategory) return;
    const found = menuCategories.find((cat) => cat.id === urlCategory);
    if (found) setSelectedCategoryId(found.id);
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

  // ── Sliding indicator (desktop) ───────────────────────────────────────
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const activeEl = tabRefs.current[selectedCategoryId];
    if (activeEl) {
      setIndicatorStyle({
        left: activeEl.offsetLeft,
        width: activeEl.offsetWidth,
      });
    }
  }, [selectedCategoryId, menuCategories.length]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-20">

      {/* HERO */}
      <div className="mb-10 text-center">
        <span className="text-[10px] font-black text-gold uppercase tracking-[0.5em] mb-4 block">
          {ui.menuPage.tagline}
        </span>

        <h1 className="text-4xl sm:text-6xl font-black text-foreground tracking-tighter mb-4">
          {ui.menuPage.title}
        </h1>

        <p className="text-subtext text-sm sm:text-lg font-bold max-w-md mx-auto">
          {ui.menuPage.subtitle}
        </p>

        <div className="mt-8 flex justify-center">
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-border-strong to-transparent" />
        </div>
      </div>

      {/* CATEGORY NAV — DESKTOP: sliding indicator */}
      <div className="hidden md:block sticky top-20 z-30 py-5 mb-12">
        <div className="flex justify-center">
          <div className="relative flex bg-surface/80 backdrop-blur-md border border-border rounded-2xl p-1.5 shadow-xl gap-1">

            <div
              className="absolute top-1.5 bottom-1.5 bg-gold rounded-xl transition-all duration-300 ease-out"
              style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
            />

            {menuCategories.map((cat) => {
              const isActive = selectedCategoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  ref={(el) => { tabRefs.current[cat.id] = el; }}
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={`relative z-10 whitespace-nowrap px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-colors duration-300
                    ${isActive ? "text-background" : "text-subtext hover:text-foreground"}`}
                >
                  {cat.name}
                  <span className={`ml-2 text-[9px] font-bold ${isActive ? "text-background/70" : "text-muted"}`}>
                    {cat.items?.length ?? 0}
                  </span>
                </button>
              );
            })}

          </div>
        </div>
      </div>

      {/* CATEGORY NAV — MOBILE: scrollable chips */}
      <div className="md:hidden sticky top-[100px] z-30 -mx-4 px-4 py-4 mb-8 bg-background/90 backdrop-blur-md">
        <div className="relative">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {menuCategories.map((cat) => {
              const isActive = selectedCategoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={`shrink-0 flex items-center gap-1.5 whitespace-nowrap px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider border transition-all
                    ${isActive
                      ? "bg-gold border-gold text-background"
                      : "bg-surface border-border text-subtext"}`}
                >
                  <FaLayerGroup size={10} className={isActive ? "text-background" : "text-gold"} />
                  {cat.name}
                </button>
              );
            })}
          </div>
          <div className="pointer-events-none absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-background to-transparent" />
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

const MenuPage: React.FC = () => {
  return (
    <Suspense fallback={<div className="p-10 text-center text-subtext">Loading menu...</div>}>
      <MenuContent />
    </Suspense>
  );
};

export default MenuPage;
