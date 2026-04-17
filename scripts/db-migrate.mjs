import postgres from "postgres";

const connectionString = process.env.DATABASE_URL ?? process.env.DIRECT_URL;

if (!connectionString) {
  console.error("DATABASE_URL or DIRECT_URL environment variable is required.");
  process.exit(1);
}

const sql = postgres(connectionString, { max: 1, prepare: false });

async function migrate() {
  await sql`
    DO $$
    BEGIN
      CREATE TYPE "OrderStatus" AS ENUM ('NEW', 'CONFIRMED', 'IN_PROGRESS', 'DELIVERED', 'CANCELED');
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END
    $$;
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS "Cake" (
      "id" SERIAL PRIMARY KEY,
      "slug" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "description" TEXT NOT NULL,
      "imageUrl" TEXT NOT NULL,
      "weightGrams" INTEGER NOT NULL,
      "price" INTEGER NOT NULL,
      "inStock" BOOLEAN NOT NULL DEFAULT true,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS "Order" (
      "id" SERIAL PRIMARY KEY,
      "customerName" TEXT NOT NULL,
      "customerPhone" TEXT NOT NULL,
      "customerEmail" TEXT,
      "deliveryAddress" TEXT NOT NULL,
      "comment" TEXT,
      "status" "OrderStatus" NOT NULL DEFAULT 'NEW',
      "totalAmount" INTEGER NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS "OrderItem" (
      "id" SERIAL PRIMARY KEY,
      "quantity" INTEGER NOT NULL,
      "priceAtPurchase" INTEGER NOT NULL,
      "cakeId" INTEGER NOT NULL,
      "orderId" INTEGER NOT NULL
    );
  `;

  await sql`
    CREATE UNIQUE INDEX IF NOT EXISTS "Cake_slug_key" ON "Cake"("slug");
  `;

  await sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'OrderItem_cakeId_fkey'
      ) THEN
        ALTER TABLE "OrderItem"
        ADD CONSTRAINT "OrderItem_cakeId_fkey"
        FOREIGN KEY ("cakeId")
        REFERENCES "Cake"("id")
        ON DELETE RESTRICT
        ON UPDATE CASCADE;
      END IF;
    END
    $$;
  `;

  await sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'OrderItem_orderId_fkey'
      ) THEN
        ALTER TABLE "OrderItem"
        ADD CONSTRAINT "OrderItem_orderId_fkey"
        FOREIGN KEY ("orderId")
        REFERENCES "Order"("id")
        ON DELETE CASCADE
        ON UPDATE CASCADE;
      END IF;
    END
    $$;
  `;
}

migrate()
  .then(() => {
    console.log("Database migration complete.");
  })
  .catch((error) => {
    console.error("Database migration failed.", error);
    process.exit(1);
  })
  .finally(async () => {
    await sql.end({ timeout: 5 });
  });
