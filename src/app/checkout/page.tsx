"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/currency";

type CheckoutForm = {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress: string;
  comment: string;
};

const initialForm: CheckoutForm = {
  customerName: "",
  customerPhone: "",
  customerEmail: "",
  deliveryAddress: "",
  comment: "",
};

export default function CheckoutPage() {
  const { items, totalAmount, updateQuantity, removeFromCart, clearCart, isHydrated } =
    useCart();

  const [form, setForm] = useState<CheckoutForm>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isCartEmpty = useMemo(() => items.length === 0, [items]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (isCartEmpty) {
      setError("Корзина пустая. Добавьте торт перед оформлением заказа.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: form.customerName,
          customerPhone: form.customerPhone,
          customerEmail: form.customerEmail,
          deliveryAddress: form.deliveryAddress,
          comment: form.comment,
          items: items.map((item) => ({
            cakeId: item.cakeId,
            quantity: item.quantity,
          })),
        }),
      });

      const payload = (await response.json()) as {
        error?: string;
        order?: { id: number };
      };

      if (!response.ok || !payload.order) {
        setError(payload.error ?? "Не удалось создать заказ. Попробуйте снова.");
        return;
      }

      clearCart();
      setForm(initialForm);
      setSuccess(`Заказ №${payload.order.id} успешно создан.`);
    } catch {
      setError("Ошибка сети. Проверьте соединение и попробуйте снова.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
      <div className="space-y-5">
        <div className="rise-in rounded-3xl border border-[#efcfbf] bg-white p-6 shadow-sm">
          <h1 className="heading-font text-4xl text-[#3f221b]">Оформление заказа</h1>
          <p className="mt-2 text-sm leading-6 text-[#6d4940] sm:text-base">
            Укажите контактные данные и адрес доставки. Менеджер свяжется для
            подтверждения заказа и времени доставки.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rise-in space-y-4 rounded-3xl border border-[#efcfbf] bg-white p-6 shadow-sm"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-[#5e3b33]">
              Имя
              <input
                required
                value={form.customerName}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, customerName: event.target.value }))
                }
                className="w-full rounded-xl border border-[#efcfbf] bg-[#fffaf7] px-4 py-3 outline-none transition focus:border-[#dc6f4c]"
                placeholder="Анна"
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-[#5e3b33]">
              Телефон
              <input
                required
                value={form.customerPhone}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, customerPhone: event.target.value }))
                }
                className="w-full rounded-xl border border-[#efcfbf] bg-[#fffaf7] px-4 py-3 outline-none transition focus:border-[#dc6f4c]"
                placeholder="+7 (999) 123-45-67"
              />
            </label>
          </div>

          <label className="space-y-2 text-sm font-medium text-[#5e3b33]">
            Email (опционально)
            <input
              type="email"
              value={form.customerEmail}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, customerEmail: event.target.value }))
              }
              className="w-full rounded-xl border border-[#efcfbf] bg-[#fffaf7] px-4 py-3 outline-none transition focus:border-[#dc6f4c]"
              placeholder="anna@example.com"
            />
          </label>

          <label className="space-y-2 text-sm font-medium text-[#5e3b33]">
            Адрес доставки
            <input
              required
              value={form.deliveryAddress}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, deliveryAddress: event.target.value }))
              }
              className="w-full rounded-xl border border-[#efcfbf] bg-[#fffaf7] px-4 py-3 outline-none transition focus:border-[#dc6f4c]"
              placeholder="Москва, ул. Пример, д. 1"
            />
          </label>

          <label className="space-y-2 text-sm font-medium text-[#5e3b33]">
            Комментарий к заказу
            <textarea
              rows={4}
              value={form.comment}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, comment: event.target.value }))
              }
              className="w-full rounded-xl border border-[#efcfbf] bg-[#fffaf7] px-4 py-3 outline-none transition focus:border-[#dc6f4c]"
              placeholder="Например: свечи, открытка, пожелания по времени"
            />
          </label>

          <button
            disabled={isSubmitting || isCartEmpty || !isHydrated}
            className="w-full rounded-2xl bg-[#de6f4b] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#c65b3a] disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
          >
            {isSubmitting ? "Создаём заказ..." : "Подтвердить заказ"}
          </button>

          {error ? <p className="text-sm text-[#b83e30]">{error}</p> : null}
          {success ? <p className="text-sm text-[#246342]">{success}</p> : null}
        </form>
      </div>

      <aside className="rise-in h-fit rounded-3xl border border-[#efcfbf] bg-white p-6 shadow-sm lg:sticky lg:top-24">
        <h2 className="heading-font text-3xl text-[#3e2119]">Ваша корзина</h2>

        {items.length === 0 ? (
          <div className="mt-4 rounded-2xl bg-[#fff5f0] p-4 text-sm text-[#6e4a40]">
            Корзина пока пустая. <Link href="/" className="font-semibold text-[#bf4d2f]">Перейти к каталогу</Link>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {items.map((item) => (
              <article
                key={item.cakeId}
                className="rounded-2xl border border-[#f3ddd2] bg-[#fffaf7] p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-[#4d2d26]">{item.name}</p>
                    <p className="text-xs text-[#916458]">{item.weightGrams} г</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.cakeId)}
                    className="text-xs font-semibold text-[#bc5f43]"
                  >
                    Удалить
                  </button>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="inline-flex items-center rounded-full border border-[#efcfbf] bg-white">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.cakeId, item.quantity - 1)}
                      className="px-3 py-1 text-sm font-semibold text-[#5d3c33]"
                    >
                      -
                    </button>
                    <span className="px-2 text-sm font-semibold text-[#5d3c33]">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.cakeId, item.quantity + 1)}
                      className="px-3 py-1 text-sm font-semibold text-[#5d3c33]"
                    >
                      +
                    </button>
                  </div>

                  <p className="text-sm font-bold text-[#4d2d26]">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-5 border-t border-[#f2d7cb] pt-4">
          <p className="text-xs uppercase tracking-[0.15em] text-[#986356]">Итого</p>
          <p className="mt-1 text-3xl font-black text-[#482921]">{formatPrice(totalAmount)}</p>
        </div>
      </aside>
    </section>
  );
}

