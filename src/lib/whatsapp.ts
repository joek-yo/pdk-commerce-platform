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
 * - Refactored for Prime Deals Kenya (Universal Commerce)
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

  // ✅ SINGLE SOURCE OF TRUTH (pricing engine)
  const { subtotal, delivery, total } = calculateTotal(
    cart,
    orderType,
    deliveryLocation
  );

  const itemsText = cart
    .map((item) => {
      const itemTotal = item.price * item.quantity;
      return `• ${item.quantity}x ${item.name}\n  ${icons.money || "💰"} KES ${itemTotal.toLocaleString()}`;
    })
    .join("\n");

  let message = `
${icons.order || "📦"} *NEW ORDER - ${business.name}*
${icons.sparkle || "✨"} ${business.tagline || "Smart Deals. Smart Choices."}

━━━━━━━━━━━━━━━━━━
${icons.package || "🆔"} *ORDER ID:* ${orderId}

${icons.customer || "👤"} *CUSTOMER DETAILS*
• Name: ${customerName || "Guest"}
• Phone: ${customerPhone || "N/A"}

━━━━━━━━━━━━━━━━━━
${icons.item || "🛒"} *ORDER ITEMS*
${itemsText}

━━━━━━━━━━━━━━━━━━
💰 *SUBTOTAL: KES ${subtotal.toLocaleString()}*`;

  // 🚚 Delivery Fee
  if (orderType === "delivery") {
    message += `\n🚚 *DELIVERY FEE: KES ${delivery.toLocaleString()}*`;
  }

  message += `
━━━━━━━━━━━━━━━━━━
💰 *TOTAL AMOUNT: KES ${total.toLocaleString()}*
━━━━━━━━━━━━━━━━━━
${icons.delivery || "📍"} *ORDER TYPE:* ${(orderType || "pickup").toUpperCase()}`;

  // 📍 Location info
  if (orderType === "delivery" && deliveryLocation) {
    message += `\n📍 *DELIVERY TO:* ${deliveryLocation}`;
  }

  // ⏰ Schedule
  if (scheduleTime) {
    message += `\n⏰ *SCHEDULED FOR:* ${scheduleTime}`;
  }

  // 🧾 Custom Requests
  if (customOrder?.trim()) {
    message += `\n\n${icons.custom || "✨"} *CUSTOM REQUEST*\n${customOrder}`;
  }

  // 📝 General Notes
  if (orderNotes?.trim()) {
    message += `\n\n${icons.note || "📝"} *NOTES*\n${orderNotes}`;
  }

  message += `

━━━━━━━━━━━━━━━━━━
${icons.status || "⏳"} *STATUS:* PENDING CONFIRMATION

${icons.action || "⚡"} *NEXT STEPS*
1️⃣ Wait for our representative to call
2️⃣ Confirm items & delivery time
3️⃣ Payment on delivery/M-Pesa

━━━━━━━━━━━━━━━━━━
${icons.success || "✅"} Thank you for shopping with *${business.name}*!`;

  return message;
}

/**
 * SIDE EFFECT ONLY (OPEN WHATSAPP)
 * - Improved phone number sanitization for Kenyan users
 */
export function openWhatsApp(order: OrderDetails) {
  if (typeof window === "undefined") return;

  const business = getBusinessData();
  let phone = business.whatsapp || business.phone || "";
  
  // Remove all non-numeric characters
  phone = phone.replace(/[^0-9]/g, "");

  if (!phone) {
    alert("Error: Business contact number is not configured.");
    return;
  }

  // ✅ Ensure Kenyan numbers are in International Format (254...)
  if (phone.startsWith("0")) {
    phone = "254" + phone.substring(1);
  } else if (phone.startsWith("7") || phone.startsWith("1")) {
    // Handles cases like "729..." instead of "0729..."
    phone = "254" + phone;
  }

  const message = generateWhatsAppMessage(order);
  const encodedMessage = encodeURIComponent(message);

  // Using api.whatsapp.com for better cross-device compatibility
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodedMessage}`;

  window.open(whatsappUrl, "_blank");
}