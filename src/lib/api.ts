// src/lib/api.ts
// Single entry point for all NestJS API calls.

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ── Types ──────────────────────────────────────────────────────────────────

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

async function apiFetch<T>(
  path: string,
  options: { slug?: string; revalidate?: number } = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Inject tenant slug header for protected routes
  if (options.slug) {
    headers["x-tenant-slug"] = options.slug;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    headers,
    next: { revalidate: options.revalidate ?? 60 },
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status} on ${path}`);
  }

  return res.json() as Promise<T>;
}

// ── Business / Tenant ──────────────────────────────────────────────────────

export async function getBusinessBySlug(slug: string): Promise<TenantBusiness> {
  return apiFetch<TenantBusiness>(`/businesses/slug/${slug}`);
}

export async function getStorefront(businessId: string): Promise<StorefrontConfig> {
  return apiFetch<StorefrontConfig>(`/businesses/${businessId}/storefront`);
}

// ── Catalog ────────────────────────────────────────────────────────────────

// Get all products for a tenant
export async function getProducts(slug: string): Promise<ApiProduct[]> {
  return apiFetch<ApiProduct[]>(`/catalog/products`, { slug });
}

// Get categories for a tenant
export async function getCategories(slug: string): Promise<ApiCategory[]> {
  const res = await apiFetch<{ success: boolean; categories: ApiCategory[] }>(
    `/catalog/categories`,
    { slug }
  );
  return res.categories ?? [];
}

// Get products by category
export async function getProductsByCategory(
  categoryId: string,
  slug: string
): Promise<ApiProduct[]> {
  return apiFetch<ApiProduct[]>(
    `/catalog/products/category/${categoryId}`,
    { slug }
  );
}
