import React from "react";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import ClientOnly from "@/components/ClientOnly";

export const metadata = {
  title: "Dipol Butik - Kadın Giyim",
  description: "Modern ve şık kadın giyim koleksiyonu",
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="tr" data-scroll-behavior="smooth">
      <body className="antialiased">
        <AuthProvider>
          <CartProvider>
            <ClientOnly>
              {children}
            </ClientOnly>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
