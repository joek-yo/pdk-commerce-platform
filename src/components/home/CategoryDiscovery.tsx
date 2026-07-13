"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaChevronRight } from 'react-icons/fa';
import {
  Watch, Video, Laptop, Shield, ShoppingBag,
  Smartphone, Camera, Zap
} from 'lucide-react';

import menuData from "@/data/menu.json";

const iconMap: Record<string, React.ElementType> = {
  watch: Watch,
  video: Video,
  laptop: Laptop,
  shield: Shield,
  "shopping-bag": ShoppingBag,
  smartphone: Smartphone,
  camera: Camera,
  zap: Zap
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

      {/* DESKTOP: sticky sidebar list */}
      <div className="hidden lg:block sticky top-24 self-start bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-surface2 px-5 py-4 border-b border-border">
          <h2 className="text-[11px] font-black text-foreground uppercase tracking-[0.2em]">
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
                className="group flex items-center justify-between px-5 py-3 hover:bg-gold-soft transition-colors border-b border-border last:border-0 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-surface2 border border-border rounded-md">
                    <IconComponent size={20} className="text-subtext group-hover:text-gold transition-colors" />
                  </div>
                  <span className="text-[13px] font-bold text-foreground group-hover:text-gold uppercase tracking-tight transition-colors">
                    {cat.name}
                  </span>
                  {cat.hot && (
                    <span className="ml-2 px-2 py-0.5 text-[10px] font-bold bg-danger text-background rounded-full">
                      HOT
                    </span>
                  )}
                </div>
                <FaChevronRight className="text-muted group-hover:text-gold transition-colors" size={10} />
              </Link>
            );
          })}

          <Link href="/menu" className="px-5 py-3 text-center text-[10px] font-black text-gold uppercase tracking-widest hover:bg-gold hover:text-background transition-all cursor-pointer">
            View All +
          </Link>
        </div>
      </div>

      {/* MOBILE: department grid */}
      <div className="lg:hidden py-4">
        <div className="flex items-center justify-between mb-4 px-1">
           <h2 className="text-xs font-black text-subtext uppercase tracking-widest">Departments</h2>
           <Link href="/menu" className="text-[10px] font-black text-gold uppercase tracking-widest cursor-pointer">More +</Link>
        </div>

        <div className="grid grid-cols-5 gap-3">
          {mobileVisible.map((cat: any) => {
            const displayImage = cat.image || (cat.items && cat.items[0]?.image);

            return (
              <Link
                key={cat.id}
                href={`/menu?category=${cat.id}`}
                className="flex flex-col items-center gap-2 relative cursor-pointer"
              >
                <div className="w-full aspect-square bg-surface border border-border rounded-2xl flex items-center justify-center active:scale-95 transition-transform overflow-hidden relative hover:border-gold/50">
                  {displayImage ? (
                    <Image
                      src={displayImage}
                      alt={cat.name}
                      fill
                      className="object-cover p-1 rounded-2xl"
                    />
                  ) : (
                    <ShoppingBag size={20} className="text-muted" />
                  )}
                </div>

                <span className="text-[8px] font-black text-subtext uppercase text-center truncate w-full px-1">
                  {cat.name.split(' ')[0]}
                </span>

                {cat.hot && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-danger rounded-full border-2 border-background z-10" />
                )}
              </Link>
            );
          })}

          <Link href="/menu" className="flex flex-col items-center gap-2 cursor-pointer">
            <div className="w-full aspect-square bg-gold rounded-2xl flex flex-col items-center justify-center gap-1 shadow-lg active:scale-95 transition-transform">
              <div className="grid grid-cols-3 gap-0.5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-1 h-1 bg-background rounded-full" />
                ))}
              </div>
            </div>
            <span className="text-[8px] font-black text-foreground uppercase">All</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoryDiscovery;
