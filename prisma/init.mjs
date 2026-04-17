import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const schemaStatements = [
  'PRAGMA foreign_keys = ON;',
  `
    CREATE TABLE IF NOT EXISTS "Cake" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "slug" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "description" TEXT NOT NULL,
      "imageUrl" TEXT NOT NULL,
      "weightGrams" INTEGER NOT NULL,
      "price" INTEGER NOT NULL,
      "inStock" BOOLEAN NOT NULL DEFAULT true,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL
    );
  `,
  `
    CREATE TABLE IF NOT EXISTS "Order" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "customerName" TEXT NOT NULL,
      "customerPhone" TEXT NOT NULL,
      "customerEmail" TEXT,
      "deliveryAddress" TEXT NOT NULL,
      "comment" TEXT,
      "status" TEXT NOT NULL DEFAULT 'NEW',
      "totalAmount" INTEGER NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL
    );
  `,
  `
    CREATE TABLE IF NOT EXISTS "OrderItem" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "quantity" INTEGER NOT NULL,
      "priceAtPurchase" INTEGER NOT NULL,
      "cakeId" INTEGER NOT NULL,
      "orderId" INTEGER NOT NULL,
      CONSTRAINT "OrderItem_cakeId_fkey"
        FOREIGN KEY ("cakeId")
        REFERENCES "Cake" ("id")
        ON DELETE RESTRICT ON UPDATE CASCADE,
      CONSTRAINT "OrderItem_orderId_fkey"
        FOREIGN KEY ("orderId")
        REFERENCES "Order" ("id")
        ON DELETE CASCADE ON UPDATE CASCADE
    );
  `,
  'CREATE UNIQUE INDEX IF NOT EXISTS "Cake_slug_key" ON "Cake"("slug");',
  'CREATE INDEX IF NOT EXISTS "OrderItem_cakeId_idx" ON "OrderItem"("cakeId");',
  'CREATE INDEX IF NOT EXISTS "OrderItem_orderId_idx" ON "OrderItem"("orderId");',
];

async function main() {
  for (const statement of schemaStatements) {
    await prisma.$executeRawUnsafe(statement);
  }

  console.log("SQLite schema is ready.");
}

main()
  .catch((error) => {
    console.error("Schema init failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
