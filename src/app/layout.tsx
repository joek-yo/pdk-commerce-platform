"use client";

import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MiniCartDrawer from "@/components/features/cart/MiniCartDrawer";
import CartToast from "@/components/features/cart/CartToast";
import { CartProvider } from "@/context/CartContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground min-h-screen flex flex-col">
        
        {/* Global Providers */}
        <CartProvider>
          
          {/* Fixed Navbar */}
          <Header />

          {/* Premium Slide-In Drawer */}
          <MiniCartDrawer />

          {/* Mobile Toast */}
          <CartToast />

          {/* Page Content */}
          <main className="flex-grow">{children}</main>

          {/* Footer */}
          <Footer />

        </CartProvider>

      </body>
    </html>
  );
}