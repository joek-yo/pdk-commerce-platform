// src/lib/getBusinessData.ts

import menuData from "@/data/menu.json";

// ================= SAFE BASE =================
const data = (menuData as any) ?? {};

// ================= BUSINESS =================
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
  };
}

// ================= UI CONFIG =================
export function getUIConfig() {
  const ui = data.ui ?? {};
  return {
    hero: {
      title: ui.hero?.title ?? "Welcome",
      subtitle: ui.hero?.subtitle ?? "",
      ctaPrimary: ui.hero?.ctaPrimary ?? "Shop Now",
      ctaSecondary: ui.hero?.ctaSecondary ?? "Contact Us",
    },
    menuPage: {
      tagline: ui.menuPage?.tagline ?? "Selection", // NEW: For high-end labels
      title: ui.menuPage?.title ?? "Our Collection",
      subtitle: ui.menuPage?.subtitle ?? "",
      ctaTitle: ui.menuPage?.ctaTitle ?? "",
      ctaDescription: ui.menuPage?.ctaDescription ?? "",
      ctaButton: ui.menuPage?.ctaButton ?? "Request Custom",
    },
    customOrder: {
      badge: ui.customOrder?.badge ?? "Bespoke", // NEW: For studio-style badges
      title: ui.customOrder?.title ?? "Need Something Custom?",
      description: ui.customOrder?.description ?? "Request specialized items made just for you.",
      buttonText: ui.customOrder?.buttonText ?? "Request Custom Order",
    }
  };
}

// ================= NAVIGATION =================
export function getNavigation() {
  return (data.navigation ?? []).map((item: any) => ({
    id: item.id ?? "",
    label: item.label ?? "",
    path: item.path ?? "#",
  }));
}

// ================= CATEGORIES =================
export function getCategories() {
  return (data.categories ?? []).map((cat: any) => ({
    id: cat.id ?? "",
    name: cat.name ?? "",
    image: cat.image ?? "",
    items: cat.items ?? [],
  }));
}

// ================= PRODUCTS =================
export function getAllProducts() {
  const fromCategories = (data.categories ?? []).flatMap((cat: any) => cat.items ?? []);
  const fromFlatList = data.products ?? [];
  return [...fromCategories, ...fromFlatList];
}

// ================= BUNDLES =================
export function getBundles() {
  return (data.bundles ?? []).map((bundle: any) => ({
    ...bundle,
    available: bundle.available !== false 
  }));
}

// ================= UNIVERSAL FEATURED PRODUCTS =================
export function getFeaturedProducts() {
  return getAllProducts().filter(
    (p) => (p?.featured || p?.isFavorite || p?.jabysFavorite) && p?.available !== false
  );
}

// ================= BEST SELLERS =================
export function getBestSellers(limit = 6) {
  return getAllProducts()
    .filter((p) => (p?.bestSelling || p?.isBestSeller) && p?.available !== false)
    .slice(0, limit);
}

// ================= WHATSAPP =================
export function getBusinessWhatsAppNumber() {
  // Pull directly from the dedicated whatsapp field, fallback to phone
  const wa = data.business?.whatsapp || data.business?.phone || "";
  return wa.replace(/[^0-9]/g, "");
}