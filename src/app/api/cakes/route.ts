import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { cakes } from "@/db/schema";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const catalog = await db
      .select({
        id: cakes.id,
        slug: cakes.slug,
        name: cakes.name,
        description: cakes.description,
        imageUrl: cakes.imageUrl,
        weightGrams: cakes.weightGrams,
        price: cakes.price,
      })
      .from(cakes)
      .where(eq(cakes.inStock, true))
      .orderBy(desc(cakes.createdAt));

    return NextResponse.json({ cakes: catalog });
  } catch {
    return NextResponse.json(
      { error: "Не удалось получить каталог тортов." },
      { status: 500 },
    );
  }
}
