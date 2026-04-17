import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const orderSchema = z.object({
  customerName: z.string().trim().min(2).max(80),
  customerPhone: z.string().trim().min(8).max(32),
  customerEmail: z
    .string()
    .trim()
    .email()
    .optional()
    .or(z.literal("")),
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
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        items: {
          include: {
            cake: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ orders });
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
    const cakes = await prisma.cake.findMany({
      where: {
        id: { in: cakeIds },
        inStock: true,
      },
      select: {
        id: true,
        price: true,
      },
    });

    if (cakes.length !== cakeIds.length) {
      return NextResponse.json(
        { error: "Часть товаров недоступна для заказа." },
        { status: 400 },
      );
    }

    const priceMap = new Map(cakes.map((cake) => [cake.id, cake.price]));

    const totalAmount = input.items.reduce((sum, item) => {
      const currentPrice = priceMap.get(item.cakeId) ?? 0;
      return sum + currentPrice * item.quantity;
    }, 0);

    const order = await prisma.order.create({
      data: {
        customerName: input.customerName,
        customerPhone: input.customerPhone,
        customerEmail: input.customerEmail ? input.customerEmail : null,
        deliveryAddress: input.deliveryAddress,
        comment: input.comment ? input.comment : null,
        totalAmount,
        items: {
          create: input.items.map((item) => ({
            cakeId: item.cakeId,
            quantity: item.quantity,
            priceAtPurchase: priceMap.get(item.cakeId) ?? 0,
          })),
        },
      },
      select: {
        id: true,
        totalAmount: true,
      },
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Внутренняя ошибка при создании заказа." },
      { status: 500 },
    );
  }
}

