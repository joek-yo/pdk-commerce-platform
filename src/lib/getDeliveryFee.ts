// FILE: src/lib/getDeliveryFee.ts

import { deliveryZones } from "./deliveryZones";

const MAX_DELIVERY_FEE = 300;
const DEFAULT_FEE = 300;

export function getDeliveryFee(location?: string): number {
  if (!location) return DEFAULT_FEE;

  const normalized = location.toLowerCase();

  for (const zone of deliveryZones) {
    if (zone.keywords.some((k) => normalized.includes(k))) {
      // ✅ cap fee at 300
      return Math.min(zone.fee, MAX_DELIVERY_FEE);
    }
  }

  // fallback (also capped)
  return DEFAULT_FEE;
}