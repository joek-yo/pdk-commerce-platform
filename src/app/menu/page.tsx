"use client";

import React, { useState } from "react";
import Link from "next/link";
import businessData from "@/data/menu.json";
import ProductCard from "@/components/home/ProductCard";
import { useCart } from "@/context/CartContext";

const MenuPage: React.FC = () => {
  const { categories, bundles } = businessData;
  const [selectedCategory, setSelectedCategory] = useState(categories[0].name);
  const { addToCart } = useCart();

  const menuCategories = [
    ...categories,
    { id: "bundles-category", name: "Bundles", items: bundles },
  ];

  const activeCategory = menuCategories.find(
    (cat) => cat.name === selectedCategory
  );

  const placeholderImage = "/images/placeholder.jpg";

  const sortedProducts = activeCategory?.items
    .slice()
    .sort((a, b) => {
      if (a.bestSelling && !b.bestSelling) return -1;
      if (!a.bestSelling && b.bestSelling) return 1;
      if (a.jabysFavorite && !b.jabysFavorite) return -1;
      if (!a.jabysFavorite && b.jabysFavorite) return 1;
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      {/* PAGE TITLE */}
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl text-center font-bold mb-6">
          Freshly Crafted for You
        </h1>

        {/* CATEGORY TABS */}
        <div className="flex justify-center overflow-x-auto no-scrollbar py-4">
          <div className="flex bg-gray-200 rounded-full shadow-sm divide-x divide-gray-300 w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl">
            {menuCategories.map((cat, index) => {
              const isActive = selectedCategory === cat.name;
              const isFirst = index === 0;
              const isLast = index === menuCategories.length - 1;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`flex-1 text-center px-4 py-2 text-sm font-medium transition-colors
                             ${isFirst ? "rounded-l-full" : ""} 
                             ${isLast ? "rounded-r-full" : ""} 
                             focus:outline-none focus:ring-2 focus:ring-green-500
                             ${isActive ? "bg-green-900 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer"}`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* CUSTOM ORDER CTA */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="border rounded-2xl p-8 text-center bg-green-50 border-green-200">
          <h2 className="text-2xl font-bold mb-3">Can't Find What You Want?</h2>
          <p className="text-gray-600 mb-6">
            Request cakes, catering, bulk meals, or any special order and we’ll prepare it for you.
          </p>
          <Link href="/custom-order">
            <button className="px-6 py-3 bg-green-900 text-white rounded-xl font-semibold hover:bg-green-700 transition">
              🎂 Request Custom Order
            </button>
          </Link>
        </div>
      </div>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
        {sortedProducts?.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            image={product.image || placeholderImage}
            description={product.description}
            available={product.available}
            jabysFavorite={product.jabysFavorite}
            bestSelling={product.bestSelling}
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