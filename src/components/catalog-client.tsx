"use client";

import Image from "next/image";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/currency";
import type { CakeCardItem } from "@/types/store";

type CatalogClientProps = {
  cakes: CakeCardItem[];
};

export function CatalogClient({ cakes }: CatalogClientProps) {
  const { addToCart } = useCart();

  return (
    <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 pb-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8">
      {cakes.map((cake, index) => (
        <article
          key={cake.id}
          style={{ animationDelay: `${Math.min(index * 90, 500)}ms` }}
          className="rise-in group flex flex-col overflow-hidden rounded-3xl border border-[#f0d5c9] bg-white shadow-[0_12px_40px_-28px_rgba(74,38,28,0.6)]"
        >
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={cake.imageUrl}
              alt={cake.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2e1f1a]/45 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 rounded-full bg-[#fff7f2]/90 px-3 py-1 text-xs font-semibold text-[#66382c]">
              {cake.weightGrams} г
            </div>
          </div>

          <div className="flex grow flex-col gap-3 p-5">
            <h3 className="heading-font text-2xl leading-tight text-[#3f231b]">{cake.name}</h3>
            <p className="text-sm leading-6 text-[#66443a]">{cake.description}</p>

            <div className="mt-auto flex items-end justify-between gap-4 pt-2">
              <p className="text-xl font-extrabold text-[#c15037]">{formatPrice(cake.price)}</p>
              <button
                type="button"
                onClick={() => addToCart(cake)}
                className="rounded-full bg-[#e37452] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#cf603f]"
              >
                В корзину
              </button>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}

