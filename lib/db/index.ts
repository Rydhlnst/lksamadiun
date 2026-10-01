import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

function connect() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL belum diatur (lihat .env.example)");
  }
  return drizzle(neon(process.env.DATABASE_URL), { schema });
}

type Db = ReturnType<typeof connect>;
let instance: Db | undefined;

// Connect on first use rather than at import, so a missing DATABASE_URL
// surfaces as this error at the query that needs it instead of as an opaque
// module-load failure during `next build`.
export const db = new Proxy({} as Db, {
  get(_target, prop) {
    instance ??= connect();
    const value = Reflect.get(instance, prop, instance);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});
