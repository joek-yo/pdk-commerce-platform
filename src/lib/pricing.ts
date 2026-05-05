// src/lib/pricing.ts
// No more direct menu.json import.
// Delivery settings flow in from TenantContext via tenantConfig param.
// Falls back to menu.json data when no tenantConfig provided (local dev).

import menuData from "@/data/menu.json";
import type { StorefrontConfig } from "@/lib/api";

export interface CartItem {
  price: number;
  quantity: number;
}

export function calculateSubtotal(cart: CartItem[]): number {
  return cart.reduce(
    (total, item) => total + (item.price || 0) * (item.quantity || 0),
    0
  );
}

export function getDeliveryFee(
  orderType?: "pickup" | "delivery",
  location?: string,
  tenantConfig?: StorefrontConfig
): number {
  if (orderType !== "delivery") return 0;

  const loc = (location || "").toLowerCase().trim();

  if (tenantConfig) {
    for (const zone of tenantConfig.deliveryZones ?? []) {
      if (zone.keywords.some((k) => loc.includes(k.toLowerCase()))) {
        return zone.fee;
      }
    }
    return tenantConfig.defaultDeliveryFee ?? 300;
  }

  const { deliverySettings } = menuData;
  for (const zone of deliverySettings.zones) {
    if (zone.keywords.some((k) => loc.includes(k.toLowerCase()))) {
      return zone.fee;
    }
  }
  return deliverySettings.defaultFee;
}

export function calculateTotal(
  cart: CartItem[],
  orderType?: "pickup" | "delivery",
  location?: string,
  tenantConfig?: StorefrontConfig
): { subtotal: number; delivery: number; total: number } {
  const subtotal = calculateSubtotal(cart);
  let delivery = getDeliveryFee(orderType, location, tenantConfig);

  const threshold = tenantConfig
    ? tenantConfig.freeDeliveryThreshold
    : menuData.deliverySettings.freeDeliveryThreshold;

  if (subtotal >= threshold) delivery = 0;

  return { subtotal, delivery, total: subtotal + delivery };
}