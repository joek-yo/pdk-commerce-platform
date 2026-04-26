// src/lib/getBusinessData.ts
import menuData from "@/data/menu.json"; // ✅ Fixed path using alias

// 🔹 Returns business info
export function getBusinessData() {
  return menuData.business;
}

// 🔹 Returns all categories
export function getCategories() {
  return menuData.categories;
}

// 🔹 Returns all products across categories
export function getAllProducts() {
  return menuData.categories.flatMap(cat => cat.items);
}

// 🔹 Returns top N best-selling products globally
export function getBestSellers(limit = 3) {
  return getAllProducts()
    .filter(p => p.bestSelling)
    .slice(0, limit);
}

// 🔹 Returns all of Jaby’s favorite products
export function getJabysFavorites() {
  return getAllProducts().filter(p => p.jabysFavorite);
}

// 🔹 Returns all bundles
export function getBundles() {
  return menuData.bundles || [];
}