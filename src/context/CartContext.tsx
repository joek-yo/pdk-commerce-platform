"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";

// ---------------- TYPES ----------------

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

type OrderType = "pickup" | "delivery";

interface ToastState {
  show: boolean;
  message: string;
  type: "success" | "info" | "error";
}

interface CartContextType {
  cart: CartItem[];

  addToCart: (item: CartItem, options?: { silent?: boolean }) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;

  isCartDrawerOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  toast: ToastState;
  hideToast: () => void;

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

  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// ---------------- PROVIDER ----------------

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    type: "success",
  });

  // ORDER STATE
  const [customOrder, setCustomOrder] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [orderType, setOrderType] = useState<OrderType>("pickup");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");

  // ---------------- DRAWER CONTROLS ----------------

  const openCart = useCallback(() => setIsCartDrawerOpen(true), []);
  const closeCart = useCallback(() => setIsCartDrawerOpen(false), []);
  const toggleCart = useCallback(() => setIsCartDrawerOpen((p) => !p), []);

  // ---------------- SAFE DEVICE CHECK ----------------

  const isMobileDevice = () => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768;
  };

  // ---------------- HYDRATION ----------------

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("prime_deals_cart");
      const savedOrder = localStorage.getItem("prime_deals_order_meta");

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
      console.error("Cart hydration failed", err);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // ---------------- PERSISTENCE ----------------

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("prime_deals_cart", JSON.stringify(cart));
    }
  }, [cart, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(
        "prime_deals_order_meta",
        JSON.stringify({
          customOrder,
          orderNotes,
          orderType,
          deliveryLocation,
          scheduleTime,
          selectedBranch,
        })
      );
    }
  }, [
    customOrder,
    orderNotes,
    orderType,
    deliveryLocation,
    scheduleTime,
    selectedBranch,
    isHydrated,
  ]);

  // ---------------- COMPUTED ----------------

  const cartTotal = useMemo(
    () => cart.reduce((t, i) => t + i.price * i.quantity, 0),
    [cart]
  );

  const cartCount = useMemo(
    () => cart.reduce((t, i) => t + i.quantity, 0),
    [cart]
  );

  // ---------------- TOAST ----------------

  const hideToast = useCallback(
    () => setToast((p) => ({ ...p, show: false })),
    []
  );

  const triggerToast = useCallback(
    (message: string, type: ToastState["type"] = "success") => {
      setToast({ show: true, message, type });
      setTimeout(() => hideToast(), 2500);
    },
    [hideToast]
  );

  // ---------------- CART ACTIONS (FIXED) ----------------

  const addToCart = useCallback(
    (item: CartItem, options?: { silent?: boolean }) => {
      setCart((prev) => {
        const existing = prev.find((p) => p.id === item.id);

        if (existing) {
          return prev.map((p) =>
            p.id === item.id
              ? { ...p, quantity: p.quantity + item.quantity }
              : p
          );
        }

        return [...prev, item];
      });

      if (!options?.silent) {
        triggerToast(`${item.name} added to cart`, "success");

        // 🔥 FIX: ONLY OPEN CART ON DESKTOP
        if (!isMobileDevice()) {
          openCart();
        }
      }
    },
    [triggerToast, openCart]
  );

  const removeFromCart = useCallback(
    (id: number) => {
      setCart((prev) => prev.filter((item) => item.id !== id));
      triggerToast("Item removed", "info");
    },
    [triggerToast]
  );

  const updateQuantity = useCallback((id: number, quantity: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setCustomOrder("");
    setOrderNotes("");
    setDeliveryLocation("");
    setScheduleTime("");

    localStorage.removeItem("prime_deals_cart");
    localStorage.removeItem("prime_deals_order_meta");

    triggerToast("Cart cleared", "info");
  }, [triggerToast]);

  // ---------------- CONTEXT VALUE ----------------

  const value: CartContextType = {
    cart,

    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,

    isCartDrawerOpen,
    openCart,
    closeCart,
    toggleCart,

    toast,
    hideToast,

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

    cartTotal,
    cartCount,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// ---------------- HOOK ----------------

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};