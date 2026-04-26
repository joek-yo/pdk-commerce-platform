import { getBusinessData } from "./getBusinessData";

export interface OrderDetails {
  cart: any[];
  customOrder?: string;
  orderNotes?: string;
  orderType?: string;
  deliveryLocation?: string;
  scheduleTime?: string;
  customerName?: string;
  customerPhone?: string;
}

export function generateWhatsAppCheckout(order: OrderDetails) {
  const { cart, customOrder, orderNotes, orderType, deliveryLocation, scheduleTime, customerName, customerPhone } = order;
  const business = getBusinessData();

  if ((!cart || cart.length === 0) && !customOrder) return null;

  let total = 0;
  let message = `*NEW ORDER - ${business.name}* 🎂\n\n`;

  if (customerName) message += `*Customer:* ${customerName}\n`;
  if (customerPhone) message += `*Phone:* ${customerPhone}\n\n`;

  message += `*Order Items:*\n`;
  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    message += `• ${item.quantity}x ${item.name} (KES ${itemTotal.toLocaleString()})\n`;
  });

  if (customOrder) message += `\n*Custom Request:* ${customOrder}\n`;
  if (orderNotes) message += `\n*Notes:* ${orderNotes}\n`;

  message += `\n*Total Amount: KES ${total.toLocaleString()}*\n`;
  message += `--------------------------\n`;
  if (orderType) message += `*Type:* ${orderType}\n`;
  if (deliveryLocation) message += `*Location:* ${deliveryLocation}\n`;
  if (scheduleTime) message += `*Schedule:* ${scheduleTime}\n`;

  const encoded = encodeURIComponent(message);
  return `https://wa.me/${business.phone.replace(/[^0-9]/g, '')}?text=${encoded}`;
}

export function openWhatsApp(order: OrderDetails) {
  const url = generateWhatsAppCheckout(order);
  if (url) window.open(url, "_blank");
}