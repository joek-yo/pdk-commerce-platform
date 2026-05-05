// src/proxy.ts
// Next.js 16 renamed middleware to proxy.
// Runs on every request before any page loads.
// Resolves which tenant (business) is being visited and injects
// x-business-id + x-business-slug headers so layout.tsx can read them.

import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// These paths skip tenant resolution entirely
const PUBLIC_PATHS = [
  "/_next",
  "/favicon.ico",
  "/images",
  "/file.svg",
  "/globe.svg",
  "/window.svg",
  "/next.svg",
  "/vercel.svg",
];

export async function proxy(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;

  // Skip static assets and Next.js internals
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // ── Slug resolution strategy ───────────────────────────────────────────
  // Priority order:
  // 1. Path-based: /t/pdk/... → slug = "pdk"  (local dev, easiest to test)
  // 2. Subdomain:  pdk.myapp.com → slug = "pdk"
  // 3. Custom domain: shop.primedeals.co.ke → lookup by domain

  let slug: string | null = null;
  let rewritePath: string | null = null;

  // Strategy 1 — path-based /t/:slug (dev/testing)
  const pathMatch = pathname.match(/^\/t\/([a-z0-9-]+)(\/.*)?$/);
  if (pathMatch) {
    slug = pathMatch[1];
    // Rewrite /t/pdk/menu → /menu so pages render normally
    rewritePath = pathMatch[2] || "/";
  }

  // Strategy 2 — subdomain (pdk.yourdomain.com)
  if (!slug) {
    const parts = hostname.split(".");
    if (
      parts.length >= 3 &&
      parts[0] !== "www" &&
      !hostname.includes("localhost") &&
      !hostname.includes("127.0.0.1")
    ) {
      slug = parts[0];
    }
  }

  // Strategy 3 — custom domain lookup
  if (!slug && !hostname.includes("localhost") && !hostname.includes("127.0.0.1")) {
    try {
      const res = await fetch(
        `${API_URL}/businesses/domain/${encodeURIComponent(hostname)}`,
        { next: { revalidate: 300 } }
      );
      if (res.ok) {
        const business = await res.json();
        slug = business.slug;
      }
    } catch {
      // Domain not found — fall through
    }
  }

  // No tenant resolved — serve as-is (localhost dev without /t/ prefix)
  if (!slug) {
    return NextResponse.next();
  }

  // ── Fetch business by slug ─────────────────────────────────────────────
  let businessId: string | null = null;

  try {
    const res = await fetch(
      `${API_URL}/businesses/slug/${slug}`,
      { next: { revalidate: 60 } }
    );
    if (res.ok) {
      const business = await res.json();
      businessId = business._id;
    }
  } catch {
    // Backend unreachable — continue without tenant headers
  }

  // ── Build response with tenant headers injected ────────────────────────
  const response = rewritePath
    ? NextResponse.rewrite(new URL(rewritePath, request.url))
    : NextResponse.next();

  if (businessId) {
    response.headers.set("x-business-id", businessId);
    response.headers.set("x-business-slug", slug);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};