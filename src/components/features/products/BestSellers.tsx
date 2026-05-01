"use client";

import React from "react";
import menuData from "@/data/menu.json";
import ProductCard from "@/components/home/ProductCard";

const BestSellers: React.FC = () => {
  const categories = menuData.categories;

  // Get top 3 best-selling products globally
  // FIXED: Added (item: any) to bypass the missing property check during build
  const bestSellers = categories
    .flatMap((cat) => cat.items)
    .filter((item: any) => item.bestSelling)
    .slice(0, 3);

  if (!bestSellers.length) return null;

  return (
    <section className="mb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold italic uppercase tracking-tighter text-slate-900">
          <span className="text-[#FDB813]">🔥</span> Best Sellers
        </h2>
        <p className="text-slate-400 mt-2 uppercase tracking-[0.2em] font-black text-[10px]">
          Top 3 Most Loved Products
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {bestSellers.map((product: any) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price || 0}
            image={product.image || "/images/placeholder.jpg"}
            description={product.description}
            available={product.available}
            /* Pass the remaining props carefully */
            {...product}
          />
        ))}
      </div>
    </section>
  );
};

export default BestSellers;