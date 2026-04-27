// FILE: src/lib/generateWhatsAppMessage.ts

interface CartItem {
id: number;
name: string;
price: number;
quantity: number;
}

interface Branch {
id: string;
name: string;
phone: string;
location: string;
}

interface OrderData {
orderNumber: string;
customerName: string;
customerPhone: string;
branch: Branch;
cart: CartItem[];
customOrder: string;
orderNotes: string;
orderType: "pickup" | "delivery";
deliveryLocation?: string;
scheduleTime?: string;
deliveryFee?: number;
}

export function generateWhatsAppMessage(order: OrderData): string {
const {
orderNumber,
customerName,
customerPhone,
branch,
cart,
customOrder,
orderNotes,
orderType,
deliveryLocation,
scheduleTime,
deliveryFee = 0,
} = order;

let subtotal = 0;

let message =
`NEW ORDER - PRIME DEALS KENYA

Order ID: ${orderNumber}

CUSTOMER DETAILS
Name: ${customerName}
Phone: ${customerPhone}

BRANCH
${branch.name}
${branch.location}
Contact: ${branch.phone}

ORDER TYPE: ${orderType.toUpperCase()}
`;

if (orderType === "delivery") {
if (deliveryLocation) {
message += `Location: ${deliveryLocation}\n`;
}
if (scheduleTime) {
message += `Schedule: ${scheduleTime}\n`;
}
}

message += `\nORDER ITEMS:\n`;

if (cart.length === 0) {
message += `No items in cart\n`;
} else {
cart.forEach((item) => {
const itemTotal = item.price * item.quantity;
subtotal += itemTotal;

```
  message += `* ${item.quantity}x ${item.name} (KES ${itemTotal})\n`;
});
```

}

let total = subtotal;

if (orderType === "delivery") {
total += deliveryFee;
message += `\nDelivery Fee: KES ${deliveryFee}`;
}

message += `\n\nTOTAL AMOUNT: KES ${total}\n`;

if (customOrder.trim()) {
message += `\nCUSTOM REQUEST:\n${customOrder}\n`;
}

if (orderNotes.trim()) {
message += `\nNOTES:\n${orderNotes}\n`;
}

message += `\n--------------------------`;

return message;
}
