import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { cakes, orderItems, orders } from "@/db/schema";
import { db } from "@/lib/db";

const orderSchema = z.object({
  customerName: z.string().trim().min(2).max(80),
  customerPhone: z.string().trim().min(8).max(32),
  customerEmail: z.string().trim().email().optional().or(z.literal("")),
  deliveryAddress: z.string().trim().min(8).max(200),
  comment: z.string().trim().max(500).optional().or(z.literal("")),
  items: z
    .array(
      z.object({
        cakeId: z.number().int().positive(),
        quantity: z.number().int().min(1).max(20),
      }),
    )
    .min(1),
});

export async function GET(request: NextRequest) {
  const adminKey = request.headers.get("x-admin-key");

  if (!process.env.ADMIN_API_KEY || adminKey !== process.env.ADMIN_API_KEY) {
    return NextResponse.json({ error: "Доступ запрещён." }, { status: 401 });
  }

  try {
    const baseOrders = await db
      .select({
        id: orders.id,
        customerName: orders.customerName,
        customerPhone: orders.customerPhone,
        customerEmail: orders.customerEmail,
        deliveryAddress: orders.deliveryAddress,
        comment: orders.comment,
        status: orders.status,
        totalAmount: orders.totalAmount,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(100);

    if (baseOrders.length === 0) {
      return NextResponse.json({ orders: [] });
    }

    const orderIds = baseOrders.map((order) => order.id);

    const orderItemRows = await db
      .select({
        id: orderItems.id,
        orderId: orderItems.orderId,
        quantity: orderItems.quantity,
        priceAtPurchase: orderItems.priceAtPurchase,
        cakeName: cakes.name,
      })
      .from(orderItems)
      .innerJoin(cakes, eq(orderItems.cakeId, cakes.id))
      .where(inArray(orderItems.orderId, orderIds))
      .orderBy(asc(orderItems.orderId), asc(orderItems.id));

    const itemsByOrder = new Map<
      number,
      Array<{
        id: number;
        quantity: number;
        priceAtPurchase: number;
        cake: { name: string };
      }>
    >();

    for (const item of orderItemRows) {
      const existingItems = itemsByOrder.get(item.orderId) ?? [];

      existingItems.push({
        id: item.id,
        quantity: item.quantity,
        priceAtPurchase: item.priceAtPurchase,
        cake: { name: item.cakeName },
      });

      itemsByOrder.set(item.orderId, existingItems);
    }

    const payload = baseOrders.map((order) => ({
      ...order,
      createdAt: order.createdAt.toISOString(),
      items: itemsByOrder.get(order.id) ?? [],
    }));

    return NextResponse.json({ orders: payload });
  } catch {
    return NextResponse.json(
      { error: "Не удалось загрузить заказы." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Невалидный JSON." }, { status: 400 });
  }

  const parsed = orderSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Проверьте корректность данных формы." },
      { status: 400 },
    );
  }

  const input = parsed.data;
  const cakeIds = [...new Set(input.items.map((item) => item.cakeId))];

  try {
    const availableCakes = await db
      .select({
        id: cakes.id,
        price: cakes.price,
      })
      .from(cakes)
      .where(and(eq(cakes.inStock, true), inArray(cakes.id, cakeIds)));

    if (availableCakes.length !== cakeIds.length) {
      return NextResponse.json(
        { error: "Часть товаров недоступна для заказа." },
        { status: 400 },
      );
    }

    const priceMap = new Map(availableCakes.map((cake) => [cake.id, cake.price]));

    const totalAmount = input.items.reduce((sum, item) => {
      const currentPrice = priceMap.get(item.cakeId) ?? 0;
      return sum + currentPrice * item.quantity;
    }, 0);

    const order = await db.transaction(async (transaction) => {
      const now = new Date();

      const [createdOrder] = await transaction
        .insert(orders)
        .values({
          customerName: input.customerName,
          customerPhone: input.customerPhone,
          customerEmail: input.customerEmail ? input.customerEmail : null,
          deliveryAddress: input.deliveryAddress,
          comment: input.comment ? input.comment : null,
          status: "NEW",
          totalAmount,
          createdAt: now,
          updatedAt: now,
        })
        .returning({
          id: orders.id,
          totalAmount: orders.totalAmount,
        });

      if (!createdOrder) {
        throw new Error("Order insert failed");
      }

      await transaction.insert(orderItems).values(
        input.items.map((item) => ({
          cakeId: item.cakeId,
          quantity: item.quantity,
          priceAtPurchase: priceMap.get(item.cakeId) ?? 0,
          orderId: createdOrder.id,
        })),
      );

      return createdOrder;
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Внутренняя ошибка при создании заказа." },
      { status: 500 },
    );
  }
}
