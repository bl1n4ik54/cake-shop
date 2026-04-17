import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const orderStatusValues = [
  "NEW",
  "CONFIRMED",
  "IN_PROGRESS",
  "DELIVERED",
  "CANCELED",
] as const;

export const orderStatusEnum = pgEnum("OrderStatus", orderStatusValues);

export const cakes = pgTable(
  "Cake",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    imageUrl: text("imageUrl").notNull(),
    weightGrams: integer("weightGrams").notNull(),
    price: integer("price").notNull(),
    inStock: boolean("inStock").notNull().default(true),
    createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" }).notNull(),
  },
  (table) => ({
    slugUnique: uniqueIndex("Cake_slug_key").on(table.slug),
  }),
);

export const orders = pgTable("Order", {
  id: serial("id").primaryKey(),
  customerName: text("customerName").notNull(),
  customerPhone: text("customerPhone").notNull(),
  customerEmail: text("customerEmail"),
  deliveryAddress: text("deliveryAddress").notNull(),
  comment: text("comment"),
  status: orderStatusEnum("status").notNull().default("NEW"),
  totalAmount: integer("totalAmount").notNull(),
  createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" }).notNull(),
});

export const orderItems = pgTable("OrderItem", {
  id: serial("id").primaryKey(),
  quantity: integer("quantity").notNull(),
  priceAtPurchase: integer("priceAtPurchase").notNull(),
  cakeId: integer("cakeId")
    .notNull()
    .references(() => cakes.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),
  orderId: integer("orderId")
    .notNull()
    .references(() => orders.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
});
