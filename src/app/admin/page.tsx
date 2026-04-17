"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/currency";

type AdminOrder = {
  id: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  deliveryAddress: string;
  comment: string | null;
  status: "NEW" | "CONFIRMED" | "IN_PROGRESS" | "DELIVERED" | "CANCELED";
  totalAmount: number;
  createdAt: string;
  items: Array<{
    id: number;
    quantity: number;
    priceAtPurchase: number;
    cake: { name: string };
  }>;
};

const statusTitle: Record<AdminOrder["status"], string> = {
  NEW: "Новый",
  CONFIRMED: "Подтвержден",
  IN_PROGRESS: "В работе",
  DELIVERED: "Доставлен",
  CANCELED: "Отменен",
};

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState("");
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadOrders = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/orders", {
        method: "GET",
        headers: {
          "x-admin-key": adminKey,
        },
      });

      const payload = (await response.json()) as {
        error?: string;
        orders?: AdminOrder[];
      };

      if (!response.ok || !payload.orders) {
        setError(payload.error ?? "Не удалось загрузить заказы.");
        setOrders([]);
        return;
      }

      setOrders(payload.orders);
    } catch {
      setError("Ошибка сети при загрузке заказов.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-7xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <div className="rise-in rounded-3xl border border-[#efcfbf] bg-white p-6 shadow-sm">
        <h1 className="heading-font text-4xl text-[#3f221b]">Админ-панель заказов</h1>
        <p className="mt-2 text-sm text-[#68473d]">
          Введите admin key из `.env`, чтобы получить список заявок.
        </p>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <input
            type="password"
            value={adminKey}
            onChange={(event) => setAdminKey(event.target.value)}
            placeholder="ADMIN_API_KEY"
            className="w-full rounded-xl border border-[#efcfbf] bg-[#fffaf7] px-4 py-3 text-sm outline-none transition focus:border-[#dc6f4c]"
          />
          <button
            type="button"
            onClick={loadOrders}
            disabled={!adminKey || isLoading}
            className="rounded-xl bg-[#de6f4b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c65b3a] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Загружаю..." : "Показать заказы"}
          </button>
        </div>

        {error ? <p className="mt-3 text-sm text-[#ba3f30]">{error}</p> : null}
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <article
            key={order.id}
            className="rise-in rounded-3xl border border-[#efcfbf] bg-white p-6 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-[#a56858]">
                  Заказ №{order.id}
                </p>
                <p className="heading-font text-2xl text-[#3f231b]">{order.customerName}</p>
                <p className="text-sm text-[#66443a]">{order.customerPhone}</p>
              </div>
              <span className="rounded-full bg-[#ffe8dc] px-3 py-1 text-xs font-semibold text-[#8e4a35]">
                {statusTitle[order.status]}
              </span>
            </div>

            <div className="mt-3 space-y-1 text-sm text-[#5f3f36]">
              <p>Адрес: {order.deliveryAddress}</p>
              {order.customerEmail ? <p>Email: {order.customerEmail}</p> : null}
              {order.comment ? <p>Комментарий: {order.comment}</p> : null}
            </div>

            <div className="mt-4 rounded-2xl bg-[#fff8f4] p-4">
              <p className="text-xs uppercase tracking-[0.15em] text-[#9b6557]">Состав заказа</p>
              <ul className="mt-2 space-y-1 text-sm text-[#51342c]">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.cake.name} · {item.quantity} шт. · {formatPrice(item.priceAtPurchase)}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm">
              <p className="text-[#7b574c]">
                {new Date(order.createdAt).toLocaleString("ru-RU")}
              </p>
              <p className="text-xl font-black text-[#492b23]">{formatPrice(order.totalAmount)}</p>
            </div>
          </article>
        ))}

        {!isLoading && orders.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#efcfbf] bg-white/70 p-6 text-sm text-[#6f4d43]">
            После загрузки здесь появятся оформленные заказы.
          </div>
        ) : null}
      </div>
    </section>
  );
}

