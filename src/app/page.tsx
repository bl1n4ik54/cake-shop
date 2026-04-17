import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { cakes as cakesTable } from "@/db/schema";
import { CatalogClient } from "@/components/catalog-client";
import { db } from "@/lib/db";
import type { CakeCardItem } from "@/types/store";

export const dynamic = "force-dynamic";

async function getCatalog(): Promise<CakeCardItem[]> {
  try {
    return await db
      .select({
        id: cakesTable.id,
        slug: cakesTable.slug,
        name: cakesTable.name,
        description: cakesTable.description,
        imageUrl: cakesTable.imageUrl,
        weightGrams: cakesTable.weightGrams,
        price: cakesTable.price,
      })
      .from(cakesTable)
      .where(eq(cakesTable.inStock, true))
      .orderBy(desc(cakesTable.createdAt));
  } catch {
    return [];
  }
}

export default async function Home() {
  const cakes = await getCatalog();

  return (
    <div className="pb-10">
      <section className="mx-auto w-full max-w-7xl px-4 pb-10 pt-10 sm:px-6 lg:px-8">
        <div className="rise-in relative overflow-hidden rounded-[2rem] border border-[#efcebf] bg-[linear-gradient(120deg,#fff6f1_0%,#ffe7db_45%,#ffd9c8_100%)] p-7 shadow-[0_24px_60px_-40px_rgba(121,61,40,0.7)] sm:p-10">
          <div className="absolute -right-14 -top-16 size-56 rounded-full bg-[#f8b095]/45 blur-3xl" />
          <div className="absolute -bottom-16 left-1/2 size-72 -translate-x-1/2 rounded-full bg-[#ffd6b8]/50 blur-3xl" />

          <div className="relative grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.22em] text-[#a35f4a]">
                Крафтовая кондитерская онлайн
              </p>
              <h1 className="heading-font text-4xl leading-tight text-[#3d211a] sm:text-5xl">
                Интернет-магазин тортов для особенных событий
              </h1>
              <p className="max-w-2xl text-base leading-7 text-[#5b3b33] sm:text-lg">
                Выбирайте торты из готового каталога, добавляйте в корзину и
                оформляйте заказ за пару минут.
              </p>
              <div className="flex flex-wrap gap-3 text-sm font-semibold">
                <span className="rounded-full bg-white px-4 py-2 text-[#6a4237] shadow-sm">
                  Доставка день-в-день
                </span>
                <span className="rounded-full bg-white px-4 py-2 text-[#6a4237] shadow-sm">
                  Натуральные ингредиенты
                </span>
                <span className="rounded-full bg-white px-4 py-2 text-[#6a4237] shadow-sm">
                  Онлайн-оплата при подтверждении
                </span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-3xl bg-white/85 p-5 shadow-sm">
                <p className="text-xs uppercase tracking-[0.15em] text-[#ad634a]">
                  Тортов в каталоге
                </p>
                <p className="mt-2 text-3xl font-black text-[#4a2b23]">{cakes.length}</p>
              </div>
              <div className="rounded-3xl bg-white/85 p-5 shadow-sm">
                <p className="text-xs uppercase tracking-[0.15em] text-[#ad634a]">
                  Оформление заказа
                </p>
                <Link
                  href="/checkout"
                  className="mt-2 inline-flex rounded-full bg-[#dc6f4c] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#c45d3c]"
                >
                  Перейти в корзину
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {cakes.length > 0 ? (
        <CatalogClient cakes={cakes} />
      ) : (
        <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-[#eecfc2] bg-white p-8 text-[#573b33] shadow-sm">
            <h2 className="heading-font text-3xl text-[#3c2019]">Каталог пока пуст</h2>
            <p className="mt-3 text-sm leading-6 sm:text-base">
              База данных не инициализирована. Выполните `npm run db:setup`,
              затем перезапустите приложение.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
