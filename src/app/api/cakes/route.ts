import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cakes = await prisma.cake.findMany({
      where: { inStock: true },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        imageUrl: true,
        weightGrams: true,
        price: true,
      },
    });

    return NextResponse.json({ cakes });
  } catch {
    return NextResponse.json(
      { error: "Не удалось получить каталог тортов." },
      { status: 500 },
    );
  }
}

