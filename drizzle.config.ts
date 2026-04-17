import { defineConfig } from "drizzle-kit";

const connectionString =
  process.env.DATABASE_URL ??
  process.env.DIRECT_URL ??
  "postgresql://local:local@localhost:5432/local?schema=public";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: connectionString,
  },
});
