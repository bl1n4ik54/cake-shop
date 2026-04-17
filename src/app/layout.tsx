import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Сладкий Слой | Интернет-магазин тортов",
  description:
    "Фулл-стак интернет-магазин тортов на Next.js: каталог, корзина и оформление заказа онлайн.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body className="min-h-full">
        <Providers>
          <div className="relative min-h-screen">
            <SiteHeader />
            <main>{children}</main>
            <footer className="mx-auto mt-8 w-full max-w-7xl px-4 pb-10 text-sm text-[#8b6257] sm:px-6 lg:px-8">
              <p>Сладкий Слой · Натуральные ингредиенты и доставка по городу каждый день.</p>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
