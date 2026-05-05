// File: src/components/features/products/RecentlyViewed.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaClock } from "react-icons/fa";
import ProductCard from "@/components/home/ProductCard";
import menuData from "@/data/menu.json";

const STORAGE_KEY = "pdkRecentlyViewed";
const MAX_ITEMS = 4;

// ── Flatten all products from menu.json with category injected ──
const ALL_PRODUCTS = (menuData.categories ?? []).flatMap((cat: any) =>
  (cat.items ?? []).map((item: any) => ({
    ...item,
    category: item.category ?? cat.name,
  }))
);

function getStoredIds(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveId(id: number) {
  try {
    const existing = getStoredIds().filter((i) => i !== id); // remove if already there
    const updated = [id, ...existing].slice(0, MAX_ITEMS);   // prepend current, cap at 4
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // localStorage unavailable — fail silently
  }
}

interface RecentlyViewedProps {
  currentProductId: number | string;
}

const RecentlyViewed: React.FC<RecentlyViewedProps> = ({ currentProductId }) => {
  const [recentProducts, setRecentProducts] = useState<any[]>([]);

  useEffect(() => {
    // 1. Save current product first
    saveId(Number(currentProductId));

    // 2. Read back the list (which now includes current at index 0)
    const ids = getStoredIds();

    // 3. Exclude the current product from what we DISPLAY
    const displayIds = ids.filter((id) => id !== Number(currentProductId));

    // 4. Resolve IDs → full product objects
    const resolved = displayIds
      .map((id) => ALL_PRODUCTS.find((p) => p.id === id))
      .filter(Boolean);

    setRecentProducts(resolved);
  }, [currentProductId]);

  if (recentProducts.length === 0) return null;

  return (
    <section className="mt-10 mb-8">
      {/* SECTION HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-slate-900 rounded-full" />
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none mb-1">
              Your Browsing History
            </p>
            <h2 className="text-xl font-black uppercase tracking-tighter text-slate-900 leading-none">
              Recently Viewed
            </h2>
          </div>
        </div>

        {/* Clock badge */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">
          <FaClock size={10} className="text-slate-400" />
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
            Last {recentProducts.length} Visited
          </span>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="w-full h-px bg-gradient-to-r from-slate-900 via-slate-200 to-transparent mb-6" />

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {recentProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: index * 0.08,
              ease: "easeOut",
            }}
          >
            <ProductCard
              id={product.id}
              name={product.name}
              price={product.price}
              oldPrice={product.oldPrice}
              image={product.image}
              description={product.description}
              available={product.available}
              featured={product.featured}
              trending={product.trending}
              discountPercent={product.discountPercent}
              stock={product.stock}
              variant="grid"
            />
          </motion.div>
        ))}
      </div>

      {/* BOTTOM DIVIDER */}
      <div className="mt-6 flex items-center gap-3">
        <div className="flex-1 h-px bg-slate-100" />
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300">
          End of History
        </span>
        <div className="flex-1 h-px bg-slate-100" />
      </div>
    </section>
  );
};

export default RecentlyViewed;