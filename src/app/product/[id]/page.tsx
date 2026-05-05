// src/app/product/[id]/page.tsx
import React from "react";
import { headers } from "next/headers";
import { getAllProducts, getBundles } from "@/lib/getBusinessData";
import ProductDetail from "@/components/features/products/ProductDetail";
import { notFound } from "next/navigation";
import { getBusinessBySlug } from "@/lib/api";

// ── Metadata ───────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Resolve tenant name for title
  let businessName = "Prime Deals Kenya";
  try {
    const headersList = await headers();
    const slug = headersList.get("x-business-slug");
    if (slug) {
      const business = await getBusinessBySlug(slug);
      businessName = business.name;
    }
  } catch {
    // fallback to default
  }

  // Find product from fallback data for description
  const products = getAllProducts();
  const bundles = getBundles();
  const allItems = [...products, ...bundles];
  const item = allItems.find((p: any) => p.id?.toString() === id);

  if (!item) return { title: "Product Not Found" };

  return {
    title: `${item.name} | ${businessName}`,
    description: item.description,
  };
}

// ── Page ───────────────────────────────────────────────────────────────────

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const products = getAllProducts();
  const bundles = getBundles();
  const allItems = [...products, ...bundles];

  const item = allItems.find((p: any) => p.id?.toString() === id);
  if (!item) notFound();

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <ProductDetail product={item} />
    </main>
  );
};

export default Page;