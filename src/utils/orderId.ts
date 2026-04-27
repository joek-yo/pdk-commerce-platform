// src/utils/orderId.ts

/**
 * Unified Order ID generator (single source of truth)
 * Format: PDK-YYYYMMDD-RANDOM
 */

export function generateOrderId(): string {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  const random = Math.floor(1000 + Math.random() * 9000);

  return `PDK-${year}${month}${day}-${random}`;
}