// src/lib/api.ts
// Single entry point for all NestJS API calls.
// All components and contexts must go through here — no raw fetch elsewhere.

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ── Types (mirror your NestJS schemas exactly) ─────────────────────────────

export interface DeliveryZone {
  name: string;
  fee: number;
  keywords: string[];
}

export interface StorefrontConfig {
  tagline?: string;
  whatsapp?: string;
  banner?: string;
  drawerBanner?: string;
  defaultDeliveryFee: number;
  freeDeliveryThreshold: number;
  deliveryZones: DeliveryZone[];
  navigation: { id: string; label: string; path: string }[];
  socialProof: { text: string; time?: string }[];
  uiConfig: {
    announcement?: { text: string; active: boolean };
    flashSale?: { active: boolean; title: string; endTime: string; badge: string };
    hero?: {
      heading: string;
      description: string;
      ctaPrimary: string;
      ctaSecondary: string;
    };
    bespokeSourcing?: {
      badge: string;
      title: string;
      description: string;
      buttonText: string;
    };
  };
  trustItems: string[];
}

export interface TenantBusiness {
  _id: string;
  name: string;
  slug: string;
  phone: string;
  email: string;
  domain?: string;
  logoUrl?: string;
  address?: string;
  timezone: string;
  currency: string;
  isActive: boolean;
  subscriptionPlan: string;
  storefront: StorefrontConfig;
}

export interface ApiProduct {
  _id: string;
  businessId: string;
  categoryId: string;
  name: string;
  price: number;
  oldPrice?: number;
  discountPercent: number;
  description?: string;
  image?: string;
  isAvailable: boolean;
  stock: number;
  isOutOfStock: boolean;
  featured: boolean;
  trending: boolean;
  bestSelling: boolean;
  isBundle: boolean;
  onFlashSale: boolean;
}

export interface ApiCategory {
  _id: string;
  businessId: string;
  name: string;
  image?: string;
  icon?: string;
  sortOrder?: number;
}

// ── Internal fetch helper ──────────────────────────────────────────────────

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    // SSR cache: revalidate every 60s so pages stay fresh without full rebuilds
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status} on ${path}`);
  }

  return res.json() as Promise<T>;
}

// ── Business / Tenant ──────────────────────────────────────────────────────

// Called by middleware.ts and TenantContext to resolve slug → business
export async function getBusinessBySlug(slug: string): Promise<TenantBusiness> {
  return apiFetch<TenantBusiness>(`/businesses/slug/${slug}`);
}

// Called by TenantContext for lightweight storefront config only
export async function getStorefront(businessId: string): Promise<StorefrontConfig> {
  return apiFetch<StorefrontConfig>(`/businesses/${businessId}/storefront`);
}

// ── Products ───────────────────────────────────────────────────────────────

// All products for a tenant — replaces getAllProducts() from menu.json
export async function getProducts(businessId: string): Promise<ApiProduct[]> {
  return apiFetch<ApiProduct[]>(`/menu/products?businessId=${businessId}`);
}

// Categories for a tenant — replaces getCategories() from menu.json
export async function getCategories(businessId: string): Promise<ApiCategory[]> {
  return apiFetch<ApiCategory[]>(`/menu/categories?businessId=${businessId}`);
}