"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/currency";

const navItems = [
  { href: "/", label: "Каталог" },
  { href: "/checkout", label: "Оформление" },
  { href: "/admin", label: "Админ" },
];
const storeName = process.env.NEXT_PUBLIC_STORE_NAME ?? "Сладкий Слой";

export function SiteHeader() {
  const pathname = usePathname();
  const { totalCount, totalAmount } = useCart();

  return (
    <header className="sticky top-0 z-20 border-b border-[#f2d6cb] bg-[#fff9f5]/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-[#f6a07a] to-[#d16748] text-lg font-bold text-white shadow-sm">
            C
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#b26a50]">
              Интернет-магазин тортов
            </p>
            <p className="heading-font text-xl text-[#3d2018]">{storeName}</p>
          </div>
        </div>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-[#e37a59] text-white"
                    : "text-[#5b3a31] hover:bg-[#ffe8de]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/checkout"
          className="rounded-2xl border border-[#f1c8b7] bg-white px-4 py-2 text-right shadow-sm transition hover:-translate-y-0.5 hover:shadow"
        >
          <p className="text-xs uppercase tracking-[0.15em] text-[#bb6b4f]">Корзина</p>
          <p className="text-sm font-bold text-[#4a2c25]">
            {totalCount} шт. · {formatPrice(totalAmount)}
          </p>
        </Link>
      </div>

      <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 pb-4 md:hidden">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
                isActive
                  ? "bg-[#e37a59] text-white"
                  : "bg-white text-[#5b3a31] hover:bg-[#ffe8de]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}

