import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import FloatingButtons from "@/components/FloatingButtons";
import CookieBanner from "@/components/CookieBanner";

export const metadata = {
  title: "Dipol Butik - Kadın Giyim",
  description: "Modern ve şık kadın giyim koleksiyonu",
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="tr" data-scroll-behavior="smooth">
      <body>
        <AuthProvider>
          <CartProvider>
            {children}
            <FloatingButtons />
            <CookieBanner />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
