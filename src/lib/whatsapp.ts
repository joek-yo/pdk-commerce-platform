// FILE: src/lib/whatsapp.ts

import { getBusinessData } from "./getBusinessData";
import { icons } from "./icons";
import { calculateTotal } from "./pricing";
import { generateOrderId } from "@/utils/orderId";

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
}

/**
 * WHATSAPP MESSAGE BUILDER (PURE FORMATTER)
 * - NO BUSINESS LOGIC
 * - NO PRICING LOGIC
 * - ONLY PRESENTATION
 */
export function generateWhatsAppMessage(order: OrderDetails) {
  const {
    cart,
    customOrder,
    orderNotes,
    orderType = "pickup",
    deliveryLocation,
    scheduleTime,
    customerName,
    customerPhone,
  } = order;

  const business = getBusinessData();
  const orderId = generateOrderId();

  // ✅ SINGLE SOURCE OF TRUTH (pricing engine with location support)
  const { subtotal, delivery, total } = calculateTotal(
    cart,
    orderType,
    deliveryLocation
  );

  const itemsText = cart
    .map((item) => {
      const itemTotal = item.price * item.quantity;

      return `• ${item.quantity}x ${item.name}
  ${icons.money} KES ${itemTotal.toLocaleString()}`;
    })
    .join("\n");

  let message = `
${icons.order} *NEW ORDER - ${business.name}*
${icons.sparkle} ${business.tagline || "Smart Deals. Smart Choices."}

━━━━━━━━━━━━━━━━━━
${icons.package} *ORDER ID:* ${orderId}

${icons.customer} *CUSTOMER DETAILS*
• Name: ${customerName || "N/A"}
• Phone: ${customerPhone || "N/A"}

━━━━━━━━━━━━━━━━━━
${icons.item} *ORDER ITEMS*
${itemsText}

━━━━━━━━━━━━━━━━━━
💰 *SUBTOTAL: KES ${subtotal.toLocaleString()}*`;

  // 🚚 only show delivery fee when applicable
  if (orderType === "delivery") {
    message += `
🚚 *DELIVERY FEE: KES ${delivery.toLocaleString()}`;
  }

  message += `
━━━━━━━━━━━━━━━━━━
💰 *TOTAL AMOUNT: KES ${total.toLocaleString()}*
━━━━━━━━━━━━━━━━━━
${icons.delivery} *ORDER TYPE:* ${(orderType || "pickup").toUpperCase()}`;

  // 📍 delivery info
  if (orderType === "delivery") {
    message += `
📍 *DELIVERY LOCATION:* ${deliveryLocation || "N/A"}`;
  }

  // ⏰ schedule
  if (scheduleTime) {
    message += `
⏰ *SCHEDULE:* ${scheduleTime}`;
  }

  // 🧾 custom order
  if (customOrder?.trim()) {
    message += `

${icons.custom} *CUSTOM REQUEST*
${customOrder}`;
  }

  // 📝 notes
  if (orderNotes?.trim()) {
    message += `

${icons.note} *NOTES*
${orderNotes}`;
  }

  message += `

━━━━━━━━━━━━━━━━━━
${icons.status} *ORDER STATUS:* PENDING CONFIRMATION

${icons.action} *NEXT ACTION*
1️⃣ Confirm Order
2️⃣ Modify Order
3️⃣ Cancel Order

━━━━━━━━━━━━━━━━━━
${icons.success} Thank you for choosing *${business.name}*`;

  return message;
}

/**
 * SIDE EFFECT ONLY (OPEN WHATSAPP)
 */
export function openWhatsApp(order: OrderDetails) {
  if (typeof window === "undefined") return;

  const phone = getBusinessData().phone?.replace(/[^0-9]/g, "");

  if (!phone) {
    console.error("Business phone missing in configuration");
    return;
  }

  const message = generateWhatsAppMessage(order);

  window.open(
    `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
    "_blank"
  );
}