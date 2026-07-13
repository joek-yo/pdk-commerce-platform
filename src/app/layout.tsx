// src/app/layout.tsx
import "./globals.css";
import { headers } from "next/headers";
import { CartProvider } from "@/context/CartContext";
import { TenantProvider } from "@/context/TenantContext";
import { ThemeProvider } from "@/context/ThemeContext";
import Header from "@/components/layout/Header";
import GlobalSearch from "@/components/home/GlobalSearch";
import Footer from "@/components/layout/Footer";
import MiniCartDrawer from "@/components/features/cart/MiniCartDrawer";
import CartToast from "@/components/features/cart/CartToast";
import { getBusinessBySlug } from "@/lib/api";
import type { TenantBusiness } from "@/lib/api";

// ── Fallback business (used when no tenant header is present) ──────────────
// This keeps localhost:3000 working exactly as before during development.
// When a slug IS resolved by middleware, this is never used.
import menuData from "@/data/menu.json";

const fallbackBusiness: TenantBusiness = {
  _id: "local",
  name: (menuData as any).business?.name ?? "Prime Deals Kenya",
  slug: "pdk",
  phone: (menuData as any).business?.phone ?? "",
  email: (menuData as any).business?.email ?? "",
  logoUrl: (menuData as any).business?.logo ?? "",
  currency: "KES",
  timezone: "Africa/Nairobi",
  isActive: true,
  subscriptionPlan: "starter",
  storefront: {
    tagline: (menuData as any).business?.tagline ?? "",
    whatsapp: (menuData as any).business?.whatsapp ?? "",
    banner: (menuData as any).business?.banner ?? "",
    drawerBanner: (menuData as any).business?.drawerBanner ?? "",
    defaultDeliveryFee: (menuData as any).deliverySettings?.defaultFee ?? 300,
    freeDeliveryThreshold: (menuData as any).deliverySettings?.freeDeliveryThreshold ?? 10000,
    deliveryZones: (menuData as any).deliverySettings?.zones ?? [],
    navigation: (menuData as any).navigation ?? [],
    socialProof: (menuData as any).business?.socialProof ?? [],
    uiConfig: {
      announcement: (menuData as any).ui?.announcement,
      flashSale: (menuData as any).ui?.flashSale,
      hero: (menuData as any).ui?.hero,
      bespokeSourcing: (menuData as any).bespokeSourcing,
    },
    trustItems: (menuData as any).drawer?.trust ?? [],
  },
};

// ── Dynamic metadata per tenant ────────────────────────────────────────────
export async function generateMetadata() {
  const headersList = await headers();
  const businessId = headersList.get("x-business-id");
  const slug = headersList.get("x-business-slug");

  if (!businessId || !slug) {
    return {
      title: fallbackBusiness.name,
      description: fallbackBusiness.storefront.tagline,
    };
  }

  try {
    const business = await getBusinessBySlug(slug);
    return {
      title: business.name,
      description: business.storefront?.tagline ?? "",
    };
  } catch {
    return {
      title: fallbackBusiness.name,
      description: fallbackBusiness.storefront.tagline,
    };
  }
}

// ── Root layout ────────────────────────────────────────────────────────────
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const slug = headersList.get("x-business-slug");

  // Resolve tenant — fall back to menu.json if no slug header
  let business: TenantBusiness = fallbackBusiness;

  if (slug) {
    try {
      business = await getBusinessBySlug(slug);
    } catch {
      // Backend down or slug not found — use fallback silently
      business = fallbackBusiness;
    }
  }

  return (
    <html lang="en">
      <body className="bg-background text-foreground min-h-screen flex flex-col antialiased font-sans">
        <ThemeProvider>
        <TenantProvider business={business}>
          <CartProvider>
            <Header />
            <GlobalSearch />
            <MiniCartDrawer />
            <CartToast />

            <main className="flex-grow relative">
              <div className="absolute top-0 left-0 right-0 h-[50vh] bg-gradient-to-b from-gold-soft to-transparent pointer-events-none -z-10" />
              <div className="relative z-10">
                {children}
              </div>
            </main>

            <Footer />
          </CartProvider>
        </TenantProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}