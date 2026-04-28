"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";

// ------------------------- TYPES -------------------------

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

type OrderType = "pickup" | "delivery";

interface CartContextType {
  cart: CartItem[];

  addToCart: (item: CartItem, options?: { silent?: boolean }) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;

  isDrawerOpen: boolean;
  toggleDrawer: (state?: boolean) => void;

  showToast: boolean;
  toastMessage: string;

  // ORDER DATA
  customOrder: string;
  setCustomOrder: (value: string) => void;

  orderNotes: string;
  setOrderNotes: (value: string) => void;

  orderType: OrderType;
  setOrderType: (type: OrderType) => void;

  deliveryLocation: string;
  setDeliveryLocation: (location: string) => void;

  scheduleTime: string;
  setScheduleTime: (time: string) => void;

  selectedBranch: string;
  setSelectedBranch: (branch: string) => void;

  clearCart: () => void;

  // 🔥 NEW (USEFUL ACROSS APP)
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// ------------------------- PROVIDER -------------------------

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  // CART
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // TOAST
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // ORDER STATE
  const [customOrder, setCustomOrder] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [orderType, setOrderType] = useState<OrderType>("pickup");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");

  // ---------------- LOAD SAFE ----------------

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      const savedOrder = localStorage.getItem("orderData");

      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) setCart(parsed);
      }

      if (savedOrder) {
        const data = JSON.parse(savedOrder);

        setCustomOrder(data.customOrder || "");
        setOrderNotes(data.orderNotes || "");
        setOrderType(data.orderType || "pickup");
        setDeliveryLocation(data.deliveryLocation || "");
        setScheduleTime(data.scheduleTime || "");
        setSelectedBranch(data.selectedBranch || "");
      }
    } catch (err) {
      console.error("Cart load error:", err);
    }
  }, []);

  // ---------------- PERSIST ----------------

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(
      "orderData",
      JSON.stringify({
        customOrder,
        orderNotes,
        orderType,
        deliveryLocation,
        scheduleTime,
        selectedBranch,
      })
    );
  }, [
    customOrder,
    orderNotes,
    orderType,
    deliveryLocation,
    scheduleTime,
    selectedBranch,
  ]);

  // ---------------- DERIVED STATE (🔥 NEW) ----------------

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // ---------------- CART ACTIONS ----------------

  const addToCart = (item: CartItem, options?: { silent?: boolean }) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === item.id);

      if (existing) {
        return prev.map((p) =>
          p.id === item.id
            ? {
                ...p,
                quantity: p.quantity + item.quantity,
                image: item.image ?? p.image,
              }
            : p
        );
      }

      return [...prev, item];
    });

    if (!options?.silent) {
      setToastMessage(`Added ${item.name}`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // ---------------- DRAWER ----------------

  const toggleDrawer = (state?: boolean) => {
    setIsDrawerOpen((prev) =>
      typeof state === "boolean" ? state : !prev
    );
  };

  // ---------------- CLEAR CART (UPGRADED) ----------------

  const clearCart = () => {
    setCart([]);

    setCustomOrder("");
    setOrderNotes("");
    setDeliveryLocation("");
    setScheduleTime("");
    setSelectedBranch("");

    setShowToast(false);
    setToastMessage("");

    localStorage.removeItem("cart");
    localStorage.removeItem("orderData");
  };

  // ---------------- PROVIDER ----------------

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,

        isDrawerOpen,
        toggleDrawer,

        showToast,
        toastMessage,

        customOrder,
        setCustomOrder,
        orderNotes,
        setOrderNotes,
        orderType,
        setOrderType,
        deliveryLocation,
        setDeliveryLocation,
        scheduleTime,
        setScheduleTime,
        selectedBranch,
        setSelectedBranch,

        clearCart,

        // 🔥 NEW
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// ------------------------- HOOK -------------------------

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
};