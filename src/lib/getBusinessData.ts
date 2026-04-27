// src/lib/getBusinessData.ts

import menuData from "@/data/menu.json";

// ================= BUSINESS INFO =================
export function getBusinessData() {
  return menuData.business;
}

// ================= CATEGORIES =================
export function getCategories() {
  return menuData.categories || [];
}

// ================= PRODUCTS =================
export function getAllProducts() {
  return (menuData.categories || []).flatMap((cat) => cat.items || []);
}

// ================= BEST SELLERS =================
export function getBestSellers(limit = 3) {
  return getAllProducts()
    .filter((p) => p?.bestSelling === true && p?.available !== false)
    .slice(0, limit);
}

// ================= JABY FAVORITES =================
export function getJabysFavorites() {
  return getAllProducts().filter(
    (p) => p?.jabysFavorite === true && p?.available !== false
  );
}

// ================= AVAILABLE PRODUCTS ONLY =================
export function getAvailableProducts() {
  return getAllProducts().filter((p) => p?.available !== false);
}

// ================= BUNDLES =================
export function getBundles() {
  return menuData.bundles || [];
}

// ================= WHATSAPP HELPERS =================
export function getBusinessWhatsAppNumber() {
  return menuData.business?.phone?.replace(/[^0-9]/g, "") || "";
}