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
      ctaPrimary: ui.hero?.ctaPrimary ?? "",
      ctaSecondary: ui.hero?.ctaSecondary ?? "",
    },
    menuPage: {
      title: ui.menuPage?.title ?? "",
      subtitle: ui.menuPage?.subtitle ?? "",
      ctaTitle: ui.menuPage?.ctaTitle ?? "",
      ctaDescription: ui.menuPage?.ctaDescription ?? "",
      ctaButton: ui.menuPage?.ctaButton ?? "",
    },
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

// ================= FEATURED / FAVORITES =================
export function getFeaturedProducts() {
  return getAllProducts().filter(
    (p) => (p?.jabysFavorite || p?.featured || p?.isFavorite) && p?.available !== false
  );
}

// Alias for older components still looking for "JabysFavorites"
export const getJabysFavorites = getFeaturedProducts;

// ================= BEST SELLERS =================
export function getBestSellers(limit = 6) {
  return getAllProducts()
    .filter((p) => (p?.bestSelling || p?.isBestSeller) && p?.available !== false)
    .slice(0, limit);
}

// ================= WHATSAPP =================
export function getBusinessWhatsAppNumber() {
  const phone = data.business?.phone ?? "";
  return phone.replace(/[^0-9]/g, "");
}