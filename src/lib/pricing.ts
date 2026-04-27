// FILE: src/lib/pricing.ts

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
 * Delivery fee rule (simple fixed rule for now)
 */
export function getDeliveryFee(orderType?: "pickup" | "delivery") {
  return orderType === "delivery" ? DELIVERY_FEE : 0;
}

/**
 * SINGLE SOURCE OF TRUTH (NO DUPLICATION ANYWHERE ELSE)
 */
export function calculateTotal(
  cart: CartItem[],
  orderType?: "pickup" | "delivery"
) {
  const subtotal = calculateSubtotal(cart);
  const delivery = getDeliveryFee(orderType);

  return {
    subtotal,
    delivery,
    total: subtotal + delivery,
  };
}