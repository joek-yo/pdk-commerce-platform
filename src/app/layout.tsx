// src/app/layout.tsx

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
      {/* Changed bg from #0D0D0D to #F1F5F9 and text to slate-900 */}
      <body className="bg-[#F1F5F9] text-slate-900 min-h-screen flex flex-col antialiased font-sans">
        
        <CartProvider>
          {/* Header will sit on top of the new light background */}
          <Header />

          <MiniCartDrawer />
          <CartToast />

          <main className="flex-grow relative">
            {/* Modified the top glow: 
               On a light background, we use a very faint Gold to White gradient 
               so it feels like "sunlight" at the top of the page.
            */}
            <div className="absolute top-0 left-0 right-0 h-[50vh] bg-gradient-to-b from-white to-transparent pointer-events-none -z-10" />
            
            <div className="relative z-10">
              {children}
            </div>
          </main>

          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}