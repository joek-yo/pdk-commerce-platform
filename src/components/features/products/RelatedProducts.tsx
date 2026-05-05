// File: src/components/features/products/RelatedProducts.tsx
"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { FaFire } from "react-icons/fa";
import ProductCard from "@/components/home/ProductCard";
import menuData from "@/data/menu.json";

interface RelatedProductsProps {
  currentProductId: number | string;
  currentCategory: string;
  maxItems?: number;
}

function getRelatedProducts(
  currentId: number | string,
  category: string,
  max: number
) {
  const categoryBlock = menuData.categories.find(
    (cat) =>
      cat.id === category ||
      cat.name.toLowerCase() === category.toLowerCase()
  );

  if (!categoryBlock) return [];

  const pool = categoryBlock.items.filter(
    (item) => String(item.id) !== String(currentId)
  );

  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, max);
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  currentProductId,
  currentCategory,
  maxItems = 4,
}) => {
  const related = useMemo(
    () => getRelatedProducts(currentProductId, currentCategory, maxItems),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentProductId, currentCategory, maxItems]
  );

  if (related.length === 0) return null;

  return (
    <section className="mt-16 mb-8">
      {/* SECTION HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-[#FDB813] rounded-full" />
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none mb-1">
              More From This Category
            </p>
            <h2 className="text-xl font-black uppercase tracking-tighter text-slate-900 leading-none">
              You Might Also Like
            </h2>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-full">
          <FaFire size={10} className="text-orange-500" />
          <span className="text-[9px] font-black uppercase tracking-widest text-orange-600">
            {currentCategory}
          </span>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="w-full h-px bg-gradient-to-r from-[#FDB813] via-slate-200 to-transparent mb-6" />

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {related.map((product, index) => (
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
          End of Suggestions
        </span>
        <div className="flex-1 h-px bg-slate-100" />
      </div>
    </section>
  );
};

export default RelatedProducts;