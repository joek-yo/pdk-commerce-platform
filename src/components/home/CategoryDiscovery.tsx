"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaChevronRight } from 'react-icons/fa';
import menuData from "@/data/menu.json";

const CategoryDiscovery = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const categories = useMemo(() => {
    const rawCats = menuData.categories || [];
    if (!mounted) return rawCats;
    return [...rawCats].sort(() => Math.random() - 0.5);
  }, [mounted]);

  const mobileVisible = categories.slice(0, 4);

  return (
    <section className="bg-transparent">
      
      {/* --- DESKTOP VIEW: Sidebar Style List --- */}
      <div className="hidden lg:block bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-slate-50 px-5 py-4 border-b border-slate-200">
          <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">
            Shop Categories
          </h2>
        </div>
        <div className="flex flex-col">
          {categories.map((cat) => (
            <Link 
              key={cat.id} 
              href={`/menu?category=${cat.id}`}
              className="group flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0"
            >
              <div className="flex items-center gap-4">
                {/* Image fills this 8x8 container entirely */}
                <div className="relative w-8 h-8 flex-shrink-0 overflow-hidden rounded-md border border-slate-100">
                  <Image
                    src={cat.icon || cat.items[0]?.image || '/images/placeholder.jpg'}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-110"
                  />
                </div>
                <span className="text-[13px] font-bold text-slate-700 group-hover:text-slate-900 uppercase tracking-tight">
                  {cat.name}
                </span>
              </div>
              <FaChevronRight className="text-slate-300 group-hover:text-[#FDB813] transition-colors" size={10} />
            </Link>
          ))}
          <Link href="/menu" className="px-5 py-3 text-center text-[10px] font-black text-[#FDB813] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
            View All +
          </Link>
        </div>
      </div>

      {/* --- MOBILE VIEW: Fixed Grid --- */}
      <div className="lg:hidden py-4">
        <div className="flex items-center justify-between mb-4 px-1">
           <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Departments</h2>
           <Link href="/menu" className="text-[10px] font-black text-[#FDB813] uppercase tracking-widest">More +</Link>
        </div>
        
        <div className="grid grid-cols-5 gap-2">
          {mobileVisible.map((cat) => (
            <Link 
              key={cat.id} 
              href={`/menu?category=${cat.id}`}
              className="flex flex-col items-center gap-2"
            >
              <div className="relative w-full aspect-square bg-slate-100 rounded-xl overflow-hidden border border-slate-100 active:scale-95 transition-transform">
                <Image
                  src={cat.icon || cat.items[0]?.image || '/images/placeholder.jpg'}
                  alt={cat.name}
                  fill
                  className="object-cover" 
                />
              </div>
              <span className="text-[8px] font-black text-slate-500 uppercase text-center truncate w-full px-1">
                {cat.name.split(' ')[0]}
              </span>
            </Link>
          ))}

          {/* THE "MORE" BUTTON */}
          <Link href="/menu" className="flex flex-col items-center gap-2">
            <div className="w-full aspect-square bg-slate-900 rounded-xl flex flex-col items-center justify-center gap-1 shadow-lg shadow-slate-200">
              <div className="grid grid-cols-3 gap-0.5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-1 h-1 bg-[#FDB813] rounded-full" />
                ))}
              </div>
            </div>
            <span className="text-[8px] font-black text-slate-900 uppercase">All</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoryDiscovery;