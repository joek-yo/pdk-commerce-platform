// src/lib/generateWhatsAppMessage.ts
interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface OrderData {
  orderNumber: string;
  cart: CartItem[];
  customOrder: string;
  orderNotes: string;
  orderType: "pickup" | "delivery";
  deliveryLocation?: string;
  scheduleTime?: string;
}

export function generateWhatsAppMessage(order: OrderData): string {
  const {
    orderNumber,
    cart,
    customOrder,
    orderNotes,
    orderType,
    deliveryLocation,
    scheduleTime,
  } = order;

  let message = `🍽️ *NEW ORDER*\n\n`;
  message += `Order ID: ${orderNumber}\n\n`;

  message += `Order Type: ${orderType.toUpperCase()}\n`;

  if (deliveryLocation && orderType === "delivery") {
    message += `Delivery Location: ${deliveryLocation}\n`;
  }

  if (scheduleTime) {
    message += `Schedule: ${scheduleTime}\n`;
  }

  message += `\n`;

  if (cart.length > 0) {
    message += `*Items*\n`;
    let subtotal = 0;

    cart.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;
      message += `• ${item.quantity}x ${item.name} — KES ${itemTotal}\n`;
    });

    message += `\nSubtotal: KES ${subtotal}\n\n`;
  }

  if (customOrder.trim() !== "") {
    message += `*Custom Order*\n${customOrder}\nPrice: To be confirmed\n\n`;
  }

  if (orderNotes.trim() !== "") {
    message += `*Notes*\n${orderNotes}\n\n`;
  }

  message += `Reply:\n1 Confirm\n2 Modify\n3 Cancel\n`;

  return message;
}