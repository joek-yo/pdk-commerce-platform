"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Cart item interface
interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

// Order type
type OrderType = "pickup" | "delivery";

// Context interface
interface CartContextType {
  cart: CartItem[];

  addToCart: (item: CartItem, options?: { silent?: boolean }) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;

  isDrawerOpen: boolean;
  toggleDrawer: (state?: boolean) => void;

  showToast: boolean;
  toastMessage: string;

  // NEW ORDER STATES
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

  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  // ------------------------- STATE -------------------------
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  const [customOrder, setCustomOrder] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [orderType, setOrderType] = useState<OrderType>("pickup");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  // ------------------------- INIT -------------------------
  // Detect mobile viewport
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Load cart and order data from localStorage on first render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    const savedOrder = localStorage.getItem("orderData");

    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedOrder) {
      const data = JSON.parse(savedOrder);
      setCustomOrder(data.customOrder || "");
      setOrderNotes(data.orderNotes || "");
      setOrderType(data.orderType || "pickup");
      setDeliveryLocation(data.deliveryLocation || "");
      setScheduleTime(data.scheduleTime || "");
    }
  }, []);

  // ------------------------- PERSIST -------------------------
  // Save cart whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Save order details whenever they change
  useEffect(() => {
    const data = {
      customOrder,
      orderNotes,
      orderType,
      deliveryLocation,
      scheduleTime,
    };
    localStorage.setItem("orderData", JSON.stringify(data));
  }, [customOrder, orderNotes, orderType, deliveryLocation, scheduleTime]);

  // ------------------------- CART ACTIONS -------------------------
  const addToCart = (item: CartItem, options?: { silent?: boolean }) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === item.id);
      if (existing) {
        return prev.map(p =>
          p.id === item.id
            ? { ...p, quantity: p.quantity + item.quantity, image: item.image ?? p.image }
            : p
        );
      }
      return [...prev, item];
    });

    if (!options?.silent) {
      if (isMobile) {
        setToastMessage(`✅ ${item.name} added to cart`);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } else {
        setIsDrawerOpen(true);
      }
    }
  };

  const removeFromCart = (id: number) => setCart(prev => prev.filter(item => item.id !== id));
  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    setCart(prev => prev.map(item => (item.id === id ? { ...item, quantity } : item)));
  };

  const toggleDrawer = (state?: boolean) => {
    if (typeof state === "boolean") setIsDrawerOpen(state);
    else setIsDrawerOpen(prev => !prev);
  };

  const clearCart = () => {
    setCart([]);
    setCustomOrder("");
    setOrderNotes("");
    setDeliveryLocation("");
    setScheduleTime("");
    localStorage.removeItem("cart");
    localStorage.removeItem("orderData");
  };

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
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};