// Deno + Hono entrypoint
import { Hono } from "https://deno.land/x/hono@v3.11.11/mod.ts";
import { cors } from "https://deno.land/x/hono@v3.11.11/middleware.ts";
import { Client } from "https://deno.land/x/postgres@v0.19.3/mod.ts";

const app = new Hono();

// Security: configure CORS dynamically from Environment Variables
const rawCorsOrigin = Deno.env.get("CORS_ORIGIN") || Deno.env.get("FRONTEND_URL");

const allowedOrigins = rawCorsOrigin
  ? rawCorsOrigin.split(",").map((o) => o.trim()).filter(Boolean)
  : ["http://localhost:3000"];

app.use("*", cors({
  origin: (origin) => {
    // If no origin (e.g. server-to-server calls or curl) or origin is allowed
    if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
      return origin || "*";
    }
    return null;
  },
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
}));

// Postgres client initialization
const databaseUrl = Deno.env.get("DATABASE_URL") || "postgres://postgres:postgres@db:5432/postgres";
const client = new Client(databaseUrl);

app.get("/", (c) => {
  return c.json({ status: "healthy", service: "backend" });
});

app.get("/db-test", async (c) => {
  try {
    await client.connect();
    const result = await client.queryObject`SELECT NOW()`;
    await client.end();
    return c.json({ status: "connected", time: result.rows[0] });
  } catch (err) {
    return c.json({ status: "error", error: err.message }, 500);
  }
});

Deno.serve({ port: 8000 }, app.fetch);
