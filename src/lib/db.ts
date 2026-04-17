import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../db/schema";

const fallbackConnectionUrl =
  "postgresql://local:local@localhost:5432/local?schema=public";
const connectionString =
  process.env.DATABASE_URL ?? process.env.DIRECT_URL ?? fallbackConnectionUrl;

const createSqlClient = () => postgres(connectionString, { prepare: false });
const createDbClient = (client: ReturnType<typeof createSqlClient>) =>
  drizzle(client, { schema });

type SqlClient = ReturnType<typeof createSqlClient>;
type DbClient = ReturnType<typeof createDbClient>;

declare global {
  var __cakeShopSqlClient: SqlClient | undefined;
  var __cakeShopDbClient: DbClient | undefined;
}

const sql = globalThis.__cakeShopSqlClient ?? createSqlClient();
export const db = globalThis.__cakeShopDbClient ?? createDbClient(sql);

if (process.env.NODE_ENV !== "production") {
  globalThis.__cakeShopSqlClient = sql;
  globalThis.__cakeShopDbClient = db;
}

export async function closeDbConnection() {
  await sql.end({ timeout: 5 });
}
