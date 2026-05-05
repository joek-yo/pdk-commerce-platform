// src/context/TenantContext.tsx

"use client";

// src/context/TenantContext.tsx
// Replaces getBusinessData.ts as the runtime data source for all UI components.
// Populated server-side in layout.tsx and passed down as a prop to TenantProvider.

import React, { createContext, useContext } from "react";
import type { TenantBusiness, StorefrontConfig } from "@/lib/api";

// ── Types ──────────────────────────────────────────────────────────────────

export interface TenantContextValue {
  // Core identity
  businessId: string;
  slug: string;
  name: string;
  phone: string;
  email: string;
  logoUrl: string;
  currency: string;
  timezone: string;

  // Storefront config — replaces menu.json
  storefront: StorefrontConfig;
}

// ── Defaults (used as fallback — never shown in production) ────────────────

const defaultStorefront: StorefrontConfig = {
  tagline: "",
  whatsapp: "",
  banner: "",
  drawerBanner: "",
  defaultDeliveryFee: 300,
  freeDeliveryThreshold: 10000,
  deliveryZones: [],
  navigation: [],
  socialProof: [],
  uiConfig: {},
  trustItems: [],
};

const defaultContext: TenantContextValue = {
  businessId: "",
  slug: "",
  name: "",
  phone: "",
  email: "",
  logoUrl: "",
  currency: "KES",
  timezone: "Africa/Nairobi",
  storefront: defaultStorefront,
};

// ── Context ────────────────────────────────────────────────────────────────

const TenantContext = createContext<TenantContextValue>(defaultContext);

// ── Provider ───────────────────────────────────────────────────────────────
// layout.tsx fetches the business server-side and passes it here.
// No client-side fetch needed — data arrives via props on first render.

interface TenantProviderProps {
  business: TenantBusiness;
  children: React.ReactNode;
}

export function TenantProvider({ business, children }: TenantProviderProps) {
  const value: TenantContextValue = {
    businessId: business._id,
    slug: business.slug,
    name: business.name,
    phone: business.phone,
    email: business.email,
    logoUrl: business.logoUrl ?? "",
    currency: business.currency,
    timezone: business.timezone,
    storefront: {
      ...defaultStorefront,
      ...business.storefront,
      // Ensure nested objects are never undefined
      deliveryZones: business.storefront?.deliveryZones ?? [],
      navigation: business.storefront?.navigation ?? [],
      socialProof: business.storefront?.socialProof ?? [],
      uiConfig: business.storefront?.uiConfig ?? {},
      trustItems: business.storefront?.trustItems ?? [],
    },
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
}

// ── Hook ───────────────────────────────────────────────────────────────────
// Use this in any client component instead of getBusinessData()
// Example: const { name, storefront } = useTenant();

export function useTenant(): TenantContextValue {
  const ctx = useContext(TenantContext);
  if (!ctx.businessId && process.env.NODE_ENV === "development") {
    console.warn(
      "[TenantContext] useTenant() called outside TenantProvider — " +
      "make sure layout.tsx wraps the app in TenantProvider."
    );
  }
  return ctx;
}