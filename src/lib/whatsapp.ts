// src/lib/whatsapp.ts
// No more getBusinessData() import.
// Business data flows in via orderDetails.tenantConfig from TenantContext.
// Falls back to getBusinessData() for local dev without tenant prefix.

import { icons } from "./icons";
import { calculateTotal } from "./pricing";
import { generateOrderId } from "@/utils/orderId";
import type { StorefrontConfig, TenantBusiness } from "@/lib/api";

export interface OrderDetails {
  cart: {
    price: number;
    quantity: number;
    name: string;
  }[];
  customOrder?: string;
  orderNotes?: string;
  orderType?: "pickup" | "delivery";
  deliveryLocation?: string;
  scheduleTime?: string;
  customerName?: string;
  customerPhone?: string;
  // Tenant data passed in from context — no direct import needed
  tenant?: {
    name: string;
    tagline?: string;
    whatsapp?: string;
    phone?: string;
    storefront?: StorefrontConfig;
  };
}

// ── Message builder ────────────────────────────────────────────────────────

export function generateWhatsAppMessage(order: OrderDetails): string {
  const {
    cart,
    customOrder,
    orderNotes,
    orderType = "pickup",
    deliveryLocation,
    scheduleTime,
    customerName,
    customerPhone,
    tenant,
  } = order;

  // Resolve business data — tenant from context, fallback to getBusinessData
  let businessName = tenant?.name ?? "";
  let businessTagline = tenant?.tagline ?? "";

  if (!businessName) {
    // Fallback for local dev
    const { getBusinessData } = require("./getBusinessData");
    const business = getBusinessData();
    businessName = business.name;
    businessTagline = business.tagline;
  }

  const orderId = generateOrderId();

  const { subtotal, delivery, total } = calculateTotal(
    cart,
    orderType,
    deliveryLocation,
    tenant?.storefront
  );

  const itemsText = cart
    .map((item) => {
      const itemTotal = item.price * item.quantity;
      return `• ${item.quantity}x ${item.name}\n  ${icons.money || "💰"} KES ${itemTotal.toLocaleString()}`;
    })
    .join("\n");

  let message = `
${icons.order || "📦"} *NEW ORDER - ${businessName}*
${icons.sparkle || "✨"} ${businessTagline || "Smart Deals. Smart Choices."}

━━━━━━━━━━━━━━━━━━
${icons.package || "🆔"} *ORDER ID:* ${orderId}

${icons.customer || "👤"} *CUSTOMER DETAILS*
• Name: ${customerName || "Guest"}
• Phone: ${customerPhone || "N/A"}

━━━━━━━━━━━━━━━━━━
${icons.item || "🛒"} *ORDER ITEMS*
${itemsText || "_(No catalog items)_"}

━━━━━━━━━━━━━━━━━━
💰 *SUBTOTAL: KES ${subtotal.toLocaleString()}*`;

  if (orderType === "delivery") {
    message += `\n🚚 *DELIVERY FEE: KES ${delivery.toLocaleString()}*`;
  }

  message += `
━━━━━━━━━━━━━━━━━━
💰 *TOTAL AMOUNT: KES ${total.toLocaleString()}*
━━━━━━━━━━━━━━━━━━
${icons.delivery || "📍"} *ORDER TYPE:* ${(orderType || "pickup").toUpperCase()}`;

  if (orderType === "delivery" && deliveryLocation) {
    message += `\n📍 *DELIVERY TO:* ${deliveryLocation}`;
  }

  if (scheduleTime) {
    message += `\n⏰ *SCHEDULED FOR:* ${scheduleTime}`;
  }

  if (customOrder?.trim()) {
    message += `\n\n${icons.custom || "✨"} *CUSTOM SOURCING REQUEST*\n${customOrder}`;
  }

  if (orderNotes?.trim()) {
    message += `\n\n${icons.note || "📝"} *DELIVERY INSTRUCTIONS*\n${orderNotes}`;
  }

  message += `

━━━━━━━━━━━━━━━━━━
${icons.status || "⏳"} *STATUS:* PENDING CONFIRMATION

${icons.action || "⚡"} *NEXT STEPS*
1️⃣ Wait for our representative to call
2️⃣ Confirm items & delivery time
3️⃣ Payment on delivery/M-Pesa

━━━━━━━━━━━━━━━━━━
${icons.success || "✅"} Thank you for shopping with *${businessName}*!`;

  return message;
}

// ── Open WhatsApp ──────────────────────────────────────────────────────────

export function openWhatsApp(order: OrderDetails): void {
  if (typeof window === "undefined") return;

  // Resolve WhatsApp number from tenant context first, fallback to getBusinessData
  let phone = order.tenant?.storefront?.whatsapp || order.tenant?.phone || "";

  if (!phone) {
    const { getBusinessWhatsAppNumber } = require("./getBusinessData");
    phone = getBusinessWhatsAppNumber();
  }

  phone = phone.replace(/[^0-9]/g, "");

  if (!phone) {
    alert("Error: Business contact number is not configured.");
    return;
  }

  if (phone.startsWith("0")) {
    phone = "254" + phone.substring(1);
  } else if ((phone.startsWith("7") || phone.startsWith("1")) && phone.length === 9) {
    phone = "254" + phone;
  }

  const message = generateWhatsAppMessage(order);
  const encodedMessage = encodeURIComponent(message);
  window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encodedMessage}`, "_blank");
}