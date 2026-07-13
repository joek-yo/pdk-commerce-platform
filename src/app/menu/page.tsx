"use client";

import React, { useState, useEffect, useRef, useLayoutEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FaLayerGroup, FaChevronDown } from "react-icons/fa";

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
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!urlCategory) return;
    const found = menuCategories.find((cat) => cat.id === urlCategory);
    if (found) setSelectedCategoryId(found.id);
  }, [urlCategory]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMobileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      <div className="hidden md:block sticky top-[148px] z-30 py-5 mb-12">
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
                  className={`relative z-10 whitespace-nowrap px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-colors duration-300 cursor-pointer
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

      {/* CATEGORY NAV — MOBILE: fully custom dropdown */}
      <div className="md:hidden mb-8 relative" ref={dropdownRef}>
        <button
          onClick={() => setMobileDropdownOpen((p) => !p)}
          className="w-full flex items-center justify-between bg-surface border border-gold/40 rounded-2xl pl-4 pr-4 py-3.5 text-[12px] font-black uppercase tracking-wider text-foreground cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <FaLayerGroup size={11} className="text-gold" />
            {activeCategory?.name} ({activeCategory?.items?.length ?? 0})
          </span>
          <FaChevronDown
            size={10}
            className={`text-gold transition-transform duration-200 ${mobileDropdownOpen ? "rotate-180" : ""}`}
          />
        </button>

        {mobileDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-gold/40 rounded-2xl shadow-2xl overflow-hidden z-40">
            {menuCategories.map((cat) => {
              const isActive = selectedCategoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategoryId(cat.id);
                    setMobileDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-[12px] font-black uppercase tracking-wider transition-colors cursor-pointer border-b border-border last:border-0
                    ${isActive ? "bg-gold text-background" : "text-foreground hover:bg-gold-soft"}`}
                >
                  {cat.name} ({cat.items?.length ?? 0})
                </button>
              );
            })}
          </div>
        )}
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
