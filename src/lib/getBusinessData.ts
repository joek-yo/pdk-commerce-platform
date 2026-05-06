// src/lib/getBusinessData.ts
// Same function signatures as before — zero component changes needed.
// Server components call these directly with a businessId.
// Client components use useTenant() from TenantContext instead.

import menuData from "@/data/menu.json";
import type { StorefrontConfig } from "@/lib/api";
import { getProducts, getCategories as apiGetCategories } from "@/lib/api";

// ── Types (kept identical to what components expect) ───────────────────────

export interface CartItem {
  price: number;
  quantity: number;
}

// ── Fallback data from menu.json (used when no businessId available) ───────
// This keeps localhost:3000 working without /t/pdk prefix during dev.

const data = (menuData as any) ?? {};

// ── BUSINESS ───────────────────────────────────────────────────────────────
// Client components: use useTenant() instead of this
// Server components: pass storefront from layout via props

export function getBusinessData() {
  const business = data.business ?? {};
  return {
    name: business.name ?? "Business Name",
    tagline: business.tagline ?? "",
    phone: business.phone ?? "",
    email: business.email ?? "",
    location: business.location ?? "",
    status: business.status ?? "",
    whatsapp: business.whatsapp ?? business.phone ?? "",
    logo: business.logo ?? "",
    banner: business.banner ?? "",
    drawerBanner: business.drawerBanner ?? "",
    socialProof: business.socialProof ?? [],
    navigation: data.navigation ?? [],
  };
}

// ── UI CONFIG ──────────────────────────────────────────────────────────────
// For server components still reading from menu.json fallback.
// Client components: read from useTenant().storefront.uiConfig

export function getUIConfig() {
  const ui = data.ui ?? {};
  return {
    announcement: {
      text: ui.announcement?.text ?? "",
      active: ui.announcement?.active ?? false,
    },
    flashSale: {
      active: ui.flashSale?.active ?? false,
      title: ui.flashSale?.title ?? "Flash Sale",
      endTime: ui.flashSale?.endTime ?? "",
      badge: ui.flashSale?.badge ?? "Limited Time",
    },
    hero: {
      title: ui.hero?.title ?? "Welcome",
      subtitle: ui.hero?.subtitle ?? "",
      ctaPrimary: ui.hero?.ctaPrimary ?? "Shop Now",
      ctaSecondary: ui.hero?.ctaSecondary ?? "Contact Us",
    },
    menuPage: {
      tagline: ui.menuPage?.tagline ?? "Selection",
      title: ui.menuPage?.title ?? "Our Collection",
      subtitle: ui.menuPage?.subtitle ?? "",
      ctaTitle: ui.menuPage?.ctaTitle ?? "",
      ctaDescription: ui.menuPage?.ctaDescription ?? "",
      ctaButton: ui.menuPage?.ctaButton ?? "Request Custom",
    },
    customOrder: {
      badge: ui.customOrder?.badge ?? "Bespoke",
      title: ui.customOrder?.title ?? "Need Something Custom?",
      description: ui.customOrder?.description ?? "Request specialized items.",
      buttonText: ui.customOrder?.buttonText ?? "Request Custom Order",
    },
    bespokeSourcing: data.bespokeSourcing ?? {},
  };
}

// ── NAVIGATION ─────────────────────────────────────────────────────────────

export function getNavigation() {
  return (data.navigation ?? []).map((item: any) => ({
    id: item.id ?? "",
    label: item.label ?? "",
    path: item.path ?? "#",
  }));
}

// ── CATEGORIES (fallback — menu.json) ─────────────────────────────────────

export function getCategories() {
  return (data.categories ?? []).map((cat: any) => ({
    id: cat.id ?? "",
    name: cat.name ?? "",
    image: cat.image ?? "",
    icon: cat.icon ?? "",
    hot: cat.hot ?? false,
    items: cat.items ?? [],
  }));
}

// ── PRODUCTS (fallback — menu.json) ───────────────────────────────────────

export function getAllProducts() {
  const fromCategories = (data.categories ?? []).flatMap((cat: any) =>
    (cat.items ?? []).map((item: any) => ({
      ...item,
      category: item.category ?? cat.name,
    }))
  );
  const fromFlatList = data.products ?? [];
  return [...fromCategories, ...fromFlatList];
}

// ── PRODUCTS (tenant-aware — from NestJS) ─────────────────────────────────
// Use these in server components when businessId is available.

export async function getTenantProducts(slug: string) {
  try {
    const products = await getProducts(slug);
    return products.map((p) => ({
      id: p._id,
      name: p.name,
      price: p.price,
      oldPrice: p.oldPrice,
      discountPercent: p.discountPercent,
      description: p.description ?? "",
      image: p.image ?? "",
      available: p.isAvailable,
      stock: p.stock,
      isOutOfStock: p.isOutOfStock,
      featured: p.featured,
      trending: p.trending,
      bestSelling: p.bestSelling,
      isBundle: p.isBundle,
      onFlashSale: p.onFlashSale,
      category: "",
    }));
  } catch {
    // Backend unavailable — fall back to menu.json
    return getAllProducts();
  }
}

export async function getTenantCategories(slug: string) {
  try {
    return await apiGetCategories(slug);
  } catch {
    return getCategories();
  }
}

// ── BUNDLES ────────────────────────────────────────────────────────────────

export function getBundles() {
  return (data.bundles ?? []).map((bundle: any) => ({
    ...bundle,
    available: bundle.available !== false,
  }));
}

// ── FEATURED ──────────────────────────────────────────────────────────────

export function getFeaturedProducts() {
  return getAllProducts().filter(
    (p) => (p?.featured || p?.isFavorite || p?.jabysFavorite) && p?.available !== false
  );
}

// ── BEST SELLERS ──────────────────────────────────────────────────────────

export function getBestSellers(limit = 6) {
  return getAllProducts()
    .filter((p) => (p?.bestSelling || p?.isBestSeller) && p?.available !== false)
    .slice(0, limit);
}

// ── FLASH SALE ────────────────────────────────────────────────────────────

export function getFlashSaleProducts() {
  return getAllProducts().filter(
    (p) => (p?.discountPercent > 0 || p?.onFlashSale === true) && p?.available !== false
  );
}

// ── WHATSAPP ──────────────────────────────────────────────────────────────

export function getBusinessWhatsAppNumber() {
  const wa = data.business?.whatsapp || data.business?.phone || "";
  return wa.replace(/[^0-9]/g, "");
}

// ── DELIVERY SETTINGS (fallback) ──────────────────────────────────────────
// pricing.ts will read from TenantContext in Step 6.
// This keeps it working from menu.json in the meantime.

export function getDeliverySettings() {
  return data.deliverySettings ?? {
    defaultFee: 300,
    freeDeliveryThreshold: 10000,
    zones: [],
  };
}

// ── STOREFRONT CONFIG helper ───────────────────────────────────────────────
// Maps TenantContext storefront → shape components already expect

export function storefrontToBusinessData(storefront: StorefrontConfig) {
  return {
    tagline: storefront.tagline ?? "",
    whatsapp: storefront.whatsapp ?? "",
    banner: storefront.banner ?? "",
    drawerBanner: storefront.drawerBanner ?? "",
    navigation: storefront.navigation ?? [],
    socialProof: storefront.socialProof ?? [],
    trustItems: storefront.trustItems ?? [],
    deliverySettings: {
      defaultFee: storefront.defaultDeliveryFee,
      freeDeliveryThreshold: storefront.freeDeliveryThreshold,
      zones: storefront.deliveryZones,
    },
    uiConfig: storefront.uiConfig ?? {},
  };
}