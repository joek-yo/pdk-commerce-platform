"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaChevronRight } from 'react-icons/fa';

// Lucide Icons (Recommended)
import { 
  Watch, Video, Laptop, Shield, ShoppingBag, 
  Home, Cpu, Gift 
} from 'lucide-react';

import menuData from "@/data/menu.json";

const iconMap: Record<string, React.ElementType> = {
  watch: Watch,
  video: Video,
  laptop: Laptop,
  shield: Shield,
  "shopping-bag": ShoppingBag,
  // Add more if you create new categories later
};

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

  const getIcon = (iconName: string | undefined) => {
    if (!iconName) return ShoppingBag;
    return iconMap[iconName] || ShoppingBag;
  };

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
          {categories.map((cat: any) => {
            const IconComponent = getIcon(cat.icon);
            
            return (
              <Link 
                key={cat.id} 
                href={`/menu?category=${cat.id}`}
                className="group flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-white border border-slate-100 rounded-md">
                    <IconComponent size={22} className="text-slate-700 group-hover:text-[#FDB813] transition-colors" />
                  </div>
                  <span className="text-[13px] font-bold text-slate-700 group-hover:text-slate-900 uppercase tracking-tight">
                    {cat.name}
                  </span>
                  {cat.hot && (
                    <span className="ml-2 px-2 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full">
                      HOT
                    </span>
                  )}
                </div>
                <FaChevronRight className="text-slate-300 group-hover:text-[#FDB813] transition-colors" size={10} />
              </Link>
            );
          })}

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
        
        <div className="grid grid-cols-5 gap-3">
          {mobileVisible.map((cat: any) => {
            const IconComponent = getIcon(cat.icon);
            
            return (
              <Link 
                key={cat.id} 
                href={`/menu?category=${cat.id}`}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-full aspect-square bg-white border border-slate-100 rounded-2xl flex items-center justify-center active:scale-95 transition-transform">
                  <IconComponent size={28} className="text-slate-700" />
                </div>
                <span className="text-[8px] font-black text-slate-500 uppercase text-center truncate w-full px-1">
                  {cat.name.split(' ')[0]}
                </span>
                {cat.hot && (
                  <span className="absolute -top-1 -right-1 text-[9px] bg-red-500 text-white px-1 rounded-full font-bold">●</span>
                )}
              </Link>
            );
          })}

          {/* THE "MORE" BUTTON */}
          <Link href="/menu" className="flex flex-col items-center gap-2">
            <div className="w-full aspect-square bg-slate-900 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-lg shadow-slate-200">
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