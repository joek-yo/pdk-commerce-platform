"use client";

import React from "react";
import Link from "next/link";
import { FaArrowRight, FaStar, FaFire, FaGem } from "react-icons/fa";

import Hero from "@/components/home/Hero";
import TrustBar from "@/components/home/TrustBar";
import CategoryDiscovery from "@/components/home/CategoryDiscovery";
import FeaturedBundles from "@/components/home/FeaturedBundles";
import FeaturedCarousel from "@/components/home/FeaturedCarousel";
import ProductCard from "@/components/home/ProductCard";
import AnnouncementBar from "@/components/home/AnnouncementBar";
import FlashSales from "@/components/home/FlashSales";
import SocialProof from "@/components/home/SocialProof";

import {
  getBundles,
  getAllProducts,
  getUIConfig,
} from "@/lib/getBusinessData";

const Pages: React.FC = () => {
  const bundlesData = getBundles();
  const allItems = getAllProducts();
  const ui = getUIConfig() as any;

  const featuredProducts = allItems
    .filter((i) => i?.jabysFavorite === true || i?.featured === true || i?.isFavorite === true)
    .slice(0, 8);

  const bestSellers = allItems
    .filter((i) => i?.bestSelling === true || i?.isBestSeller === true)
    .slice(0, 6);

  const featuredBundles = [
    ...bundlesData,
    ...allItems.filter((i) => i?.category?.toLowerCase() === "bundle" || i?.isBundle === true)
  ].filter((b) => b?.featured !== false)
  .slice(0, 4);

  const ViewAllLink = ({ href }: { href: string }) => (
    <Link href={href} className="text-[10px] font-black uppercase tracking-widest text-foreground flex items-center gap-1.5 hover:text-gold transition-colors whitespace-nowrap cursor-pointer">
      {ui.viewAllText || "VIEW ALL"} <FaArrowRight size={10}/>
    </Link>
  );

  const SectionHeader = ({ title, badge, icon: Icon, href }: any) => (
    <div className="flex items-center justify-between mb-4 border-b-2 border-border-strong pb-2">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-gold mb-0.5">
          <Icon className="text-[10px] sm:text-xs" />
          <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em]">
            {badge}
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tighter uppercase whitespace-nowrap overflow-hidden text-ellipsis">
          {title}
        </h2>
      </div>
      <ViewAllLink href={href} />
    </div>
  );

  return (
    <main className="bg-background pb-6">
      <AnnouncementBar />

      <Hero />
      <div className="mt-[-20px] relative z-10">
        <TrustBar />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-13 gap-6 lg:gap-8">

          <aside className="w-full lg:col-span-3 lg:max-w-[280px]">
            <CategoryDiscovery />
          </aside>

          <div className="lg:col-span-10 space-y-6 sm:space-y-10 overflow-hidden">

            <FlashSales />

            {bestSellers.length > 0 && (
              <section>
                <SectionHeader
                  title={ui.bestSellersTitle || "MOST WANTED"}
                  badge="TOP RATED"
                  icon={FaFire}
                  href="/menu"
                />
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {bestSellers.map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>
              </section>
            )}

            {featuredProducts.length > 0 && (
              <section className="rounded-2xl border border-border">

                <div className="p-4">
                  <SectionHeader
                    title={ui.featuredTitle || "FEATURED ITEMS"}
                    badge="STAFF PICK"
                    icon={FaStar}
                    href="/menu?filter=featured"
                  />
                </div>

                <div className="px-2 sm:px-3 pb-4">
                  <FeaturedCarousel products={featuredProducts} />
                </div>

              </section>
            )}

            {featuredBundles.length > 0 && (
              <section>
                <SectionHeader
                  title={ui.bundlesTitle || "VALUE PACKS"}
                  badge="BEST SAVINGS"
                  icon={FaGem}
                  href="/menu?category=bundle"
                />
                <FeaturedBundles bundles={featuredBundles} />
              </section>
            )}

          </div>
        </div>
      </div>

    </main>
  );
};

export default Pages;
