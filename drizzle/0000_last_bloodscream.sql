CREATE TYPE "public"."OrderStatus" AS ENUM('NEW', 'CONFIRMED', 'IN_PROGRESS', 'DELIVERED', 'CANCELED');--> statement-breakpoint
CREATE TABLE "Cake" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"imageUrl" text NOT NULL,
	"weightGrams" integer NOT NULL,
	"price" integer NOT NULL,
	"inStock" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "OrderItem" (
	"id" serial PRIMARY KEY NOT NULL,
	"quantity" integer NOT NULL,
	"priceAtPurchase" integer NOT NULL,
	"cakeId" integer NOT NULL,
	"orderId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Order" (
	"id" serial PRIMARY KEY NOT NULL,
	"customerName" text NOT NULL,
	"customerPhone" text NOT NULL,
	"customerEmail" text,
	"deliveryAddress" text NOT NULL,
	"comment" text,
	"status" "OrderStatus" DEFAULT 'NEW' NOT NULL,
	"totalAmount" integer NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_cakeId_Cake_id_fk" FOREIGN KEY ("cakeId") REFERENCES "public"."Cake"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_Order_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE UNIQUE INDEX "Cake_slug_key" ON "Cake" USING btree ("slug");