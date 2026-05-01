// FILE: src/lib/pricing.ts

import menuData from "@/data/menu.json";

/**
 * Cart item contract
 */
export interface CartItem {
  price: number;
  quantity: number;
}

/**
 * Subtotal calculator
 */
export function calculateSubtotal(cart: CartItem[]) {
  return cart.reduce(
    (total, item) => total + (item.price || 0) * (item.quantity || 0),
    0
  );
}

/**
 * DELIVERY ENGINE (SINGLE SOURCE OF TRUTH)
 * Updated to pull data from deliverySettings in menu.json
 */
export function getDeliveryFee(
  orderType?: "pickup" | "delivery",
  location?: string
) {
  // 🚫 Pickup is always free
  if (orderType !== "delivery") return 0;

  const { deliverySettings } = menuData;
  const loc = (location || "").toLowerCase().trim();

  // ⚡ match zones using keywords from JSON
  for (const zone of deliverySettings.zones) {
    if (zone.keywords.some((k) => loc.includes(k.toLowerCase()))) {
      return zone.fee;
    }
  }

  // 🟢 DEFAULT FALLBACK (Pulls from JSON defaultFee)
  return deliverySettings.defaultFee;
}

/**
 * SINGLE PRICING ENGINE (ONLY ENTRY POINT)
 */
export function calculateTotal(
  cart: CartItem[],
  orderType?: "pickup" | "delivery",
  location?: string
) {
  const subtotal = calculateSubtotal(cart);
  let delivery = getDeliveryFee(orderType, location);

  // Apply Free Delivery Threshold if subtotal exceeds limit in JSON
  const { deliverySettings } = menuData;
  if (subtotal >= deliverySettings.freeDeliveryThreshold) {
    delivery = 0;
  }

  return {
    subtotal,
    delivery,
    total: subtotal + delivery,
  };
}