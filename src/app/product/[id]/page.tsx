// File: src/app/product/[id]/page.tsx
import React from "react";
import { getAllProducts, getBundles } from "@/lib/getBusinessData";
import ProductDetail from "@/components/features/products/ProductDetail";
import { notFound } from "next/navigation";

// SEO & Metadata
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const products = getAllProducts();
  const bundles = getBundles();
  const allItems = [...products, ...bundles];

  const item = allItems.find((p: any) => p.id.toString() === id);
  if (!item) return { title: "Product Not Found" };

  return {
    title: `${item.name} | Prime Deals Kenya`,
    description: item.description,
  };
}

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const products = getAllProducts();
  const bundles = getBundles();
  const allItems = [...products, ...bundles];

  const item = allItems.find((p: any) => p.id.toString() === id);
  if (!item) notFound();

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <ProductDetail product={item} />
    </main>
  );
};

export default Page;