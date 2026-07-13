// src/components/home/GlobalSearch.tsx
"use client";
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getAllProducts } from '@/lib/getBusinessData';

const GlobalSearch = () => {
  const [isHidden, setIsHidden] = useState(false);
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest < 150) {
      setIsHidden(false);
      return;
    }
    if (latest > previous && latest > 150) {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }
  });

  const allProducts = useMemo(() => getAllProducts(), []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return allProducts
      .filter((p: any) => {
        const name = (p.name || "").toLowerCase();
        const desc = (p.description || "").toLowerCase();
        const cat = (p.category || "").toLowerCase();
        return name.includes(q) || desc.includes(q) || cat.includes(q);
      })
      .slice(0, 6);
  }, [query, allProducts]);

  const showDropdown = isFocused && query.trim().length >= 2;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const goToProduct = (id: any) => {
    setQuery("");
    setIsFocused(false);
    router.push(`/product/${id}`);
  };

  const submitSearch = () => {
    const q = query.trim();
    if (!q) return;
    setIsFocused(false);
    router.push(`/menu?search=${encodeURIComponent(q)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") submitSearch();
    if (e.key === "Escape") setIsFocused(false);
  };

  return (
    <motion.div
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: -100, opacity: 0 }
      }}
      animate={isHidden ? "hidden" : "visible"}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-surface border-t border-gold/40 border-b border-b-border py-3 px-4 sticky top-16 md:top-20 z-40 shadow-sm w-full"
    >
      <div ref={containerRef} className="max-w-2xl mx-auto relative">
        <div className="flex items-center bg-surface border border-border rounded-full h-11 pl-5 overflow-hidden focus-within:border-gold transition-colors">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search products, categories..."
            className="flex-1 bg-transparent outline-none focus:outline-none text-sm font-medium text-foreground placeholder:text-subtext"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="px-2 text-subtext hover:text-foreground transition-colors cursor-pointer"
            >
              <FaTimes size={12} />
            </button>
          )}
          <div className="w-px h-6 bg-border" />
          <button
            onClick={submitSearch}
            aria-label="Search"
            className="h-full px-5 flex items-center justify-center text-subtext hover:text-gold transition-colors cursor-pointer outline-none focus:outline-none focus-visible:text-gold"
          >
            <FaSearch size={14} />
          </button>
        </div>

        <AnimatePresence>
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="absolute top-[calc(100%+8px)] left-0 right-0 bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden z-50"
            >
              {results.length > 0 ? (
                <>
                  <div className="max-h-80 overflow-y-auto">
                    {results.map((p: any) => (
                      <button
                        key={p.id}
                        onClick={() => goToProduct(p.id)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-surface2 transition-colors text-left cursor-pointer border-b border-border last:border-0"
                      >
                        <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-surface2 border border-border flex-shrink-0">
                          {p.image && (
                            <Image src={p.image} alt={p.name} fill className="object-cover" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-black uppercase text-foreground truncate">{p.name}</p>
                          <p className="text-[10px] text-subtext font-bold mt-0.5">
                            KES {p.price?.toLocaleString?.() ?? p.price}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={submitSearch}
                    className="w-full py-3 text-[10px] font-black uppercase tracking-widest text-gold hover:bg-surface2 transition-colors cursor-pointer border-t border-border"
                  >
                    See all results for &quot;{query}&quot;
                  </button>
                </>
              ) : (
                <div className="p-6 text-center">
                  <p className="text-xs text-subtext font-bold">No products found for &quot;{query}&quot;</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default GlobalSearch;
