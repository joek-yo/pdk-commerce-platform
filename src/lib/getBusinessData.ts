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
    socialProof: business.socialProof ?? [],

    // ←←← NAVIGATION ADDED HERE
    navigation: data.navigation ?? [],
  };
}

// ================= UI CONFIG =================
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

// ================= FLASH SALE PRODUCTS =================
export function getFlashSaleProducts() {
  return getAllProducts().filter(
    (p) => (p?.discountPercent > 0 || p?.onFlashSale === true) && p?.available !== false
  );
}

// ================= WHATSAPP =================
export function getBusinessWhatsAppNumber() {
  const wa = data.business?.whatsapp || data.business?.phone || "";
  return wa.replace(/[^0-9]/g, "");
}