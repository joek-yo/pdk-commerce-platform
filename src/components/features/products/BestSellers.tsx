"use client";

import React from "react";
import menuData from "@/data/menu.json";
import ProductCard from "@/components/home/ProductCard";

const BestSellers: React.FC = () => {
  const categories = menuData.categories;

  // Get top 3 best-selling products globally
  const bestSellers = categories
    .flatMap((cat) => cat.items)
    .filter((item) => item.bestSelling)
    .slice(0, 3);

  if (!bestSellers.length) return null;

  return (
    <section className="mb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">🔥 Best Sellers</h2>
        <p className="text-gray-500 mt-2 uppercase tracking-widest text-sm">
          Top 3 Most Loved Products
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {bestSellers.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price || 0}
            image={product.image || "/images/placeholder.jpg"}
            description={product.description}
            available={product.available}
            bestSelling={product.bestSelling}
            jabysFavorite={product.jabysFavorite}
          />
        ))}
      </div>
    </section>
  );
};

export default BestSellers;