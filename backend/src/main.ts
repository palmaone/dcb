// Deno + Hono entrypoint
import { Hono } from "hono";
import { cors } from "hono/cors";
import { pgdb_client, isConnected } from "./db/connection.ts"
import pedidosApp from './routes/pedidos.ts';
import clientesApp from "./routes/clientes.ts";
import usuariosApp from "./routes/usuarios.ts";
import sucursalesApp from "./routes/sucursales.ts";

const app = new Hono();

// Security: configure CORS dynamically from Environment Variables
const rawCorsOrigin =
  Deno.env.get("CORS_ORIGIN") || Deno.env.get("FRONTEND_URL");

const allowedOrigins = rawCorsOrigin
  ? rawCorsOrigin
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean)
  : ["http://localhost:3000"];

app.use(
  "*",
  cors({
    origin: (origin) => {
      // If no origin (e.g. server-to-server calls or curl) or origin is allowed
      if (
        !origin ||
        allowedOrigins.includes("*") ||
        allowedOrigins.includes(origin)
      ) {
        return origin || "*";
      }
      return null;
    },
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"]
  })
);

app.get("/", (c) => {
  return c.json({ status: "healthy", service: "backend" });
});

app.get("/db-test", async (c) => {
  if (isConnected) {
    try {
      const result = await pgdb_client.queryObject`SELECT NOW()`;
      return c.json({ status: "connected", time: result.rows[0] });
    } catch (err: Error | unknown) {
      return c.json(
        {
          status: "error",
          error: err instanceof Error ? err.message : String(err)
        },
        500
      );
    }
  }
  return c.json(
    {
      status: "error",
      error: "connection failed"
    },
  500)
});

app.route("/sucursales", sucursalesApp)
app.route("/usuarios", usuariosApp);
app.route("/pedidos", pedidosApp)
app.route("/clientes", clientesApp)

Deno.serve({ port: 8000 }, app.fetch);
