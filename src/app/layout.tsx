// FILE: src/app/layout.tsx

import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MiniCartDrawer from "@/components/features/cart/MiniCartDrawer";
import CartToast from "@/components/features/cart/CartToast";

export const metadata = {
  title: "Prime Deals Kenya",
  description: "Smart Deals. Smart Choices.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen flex flex-col">

        {/* Global App Wrapper */}
        <CartProvider>

          {/* Layout Shell */}
          <Header />

          {/* Global UI Overlays */}
          <MiniCartDrawer />
          <CartToast />

          {/* Page Content */}
          <main className="flex-grow">{children}</main>

          <Footer />

        </CartProvider>

      </body>
    </html>
  );
}