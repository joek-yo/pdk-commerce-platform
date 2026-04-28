// FILE: src/lib/pricing.ts

import { deliveryZones } from "./deliveryZones";

export const DELIVERY_FEE = 300;

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
    (total, item) => total + item.price * item.quantity,
    0
  );
}

/**
 * DELIVERY ENGINE (SINGLE SOURCE OF TRUTH)
 */
export function getDeliveryFee(
  orderType?: "pickup" | "delivery",
  location?: string
) {
  // 🚫 Pickup is always free
  if (orderType !== "delivery") return 0;

  // 🔥 normalize safely
  const loc = (location || "").toLowerCase().trim();

  // ⚡ match zones
  for (const zone of deliveryZones) {
    if (zone.keywords.some((k) => loc.includes(k))) {
      return zone.fee;
    }
  }

  // 🟢 DEFAULT FALLBACK (CRITICAL RULE)
  return DELIVERY_FEE;
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
  const delivery = getDeliveryFee(orderType, location);

  return {
    subtotal,
    delivery,
    total: subtotal + delivery,
  };
}