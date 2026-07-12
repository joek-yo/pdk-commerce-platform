// src/components/home/ShopByCategory.tsx
"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { getCategories } from "@/lib/getBusinessData";

const ShopByCategory = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const categories = useMemo(() => {
    const all = getCategories();
    if (!mounted) return all.slice(0, 6);
    const shuffled = [...all].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 6);
  }, [mounted]);

  return (
    <section className="hidden lg:block mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#FDB813] mb-0.5">
            Browse
          </p>
          <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none">
            Shop by Category
          </h2>
        </div>
        <Link
          href="/menu"
          className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
        >
          All Categories →
        </Link>
      </div>

      <div className="grid grid-cols-6 gap-3">
        {categories.map((cat: any) => {
          const displayImage = cat.image || (cat.items?.[0]?.image);

          return (
            <Link
              key={cat.id}
              href={`/menu?category=${cat.id}`}
              className="group flex flex-col items-center gap-2 cursor-pointer"
            >
              <div className="w-full aspect-square bg-white border border-slate-100 rounded-2xl overflow-hidden relative shadow-sm group-hover:shadow-md group-hover:border-[#FDB813] transition-all duration-300">
                {displayImage ? (
                  <Image
                    src={displayImage}
                    alt={cat.name}
                    fill
                    className="object-cover p-2 group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag size={24} className="text-slate-200" />
                  </div>
                )}

                {cat.hot && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                )}
              </div>

              <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight text-center truncate w-full group-hover:text-slate-900 transition-colors">
                {cat.name.split(" ")[0]}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default ShopByCategory;