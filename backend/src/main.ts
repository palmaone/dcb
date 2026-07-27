// Deno + Hono entrypoint
import { Hono } from "hono";
import { cors } from "hono/cors";
// import { logger } from "hono/logger";
import { client, isConnected } from "./db/connection.ts"
import { Usuario, UsuarioTData } from "../../shared/models/Usuario.ts";
import { Cliente, ClienteTData } from "../../shared/models/Cliente.ts";
import { Sucursal, SucursalTData } from "../../shared/models/Sucursal.ts";
import pedidos from "./routes/pedidos.ts";


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
      const result = await client.queryObject`SELECT NOW()`;
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



app.get("/clientes", async (c) => {
  if(isConnected) {
    try {
      const result = await client.queryObject<Cliente>`SELECT * FROM clientes`
      const clientes = result.rows.map((u, index) => {
        const nombre_completo = `${u.nombre} ${u.apellido}`
        return { ...u, index: index+1, nombre_completo } as ClienteTData
      })
      return c.json(clientes);
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

app.get("/usuarios", async (c) => {
  if(isConnected) {
    try {
      const result = await client.queryObject<Usuario>`SELECT * FROM usuarios`
      const usuarios = result.rows.map((u, index) => {
        return { ...u, index: index+1 } as UsuarioTData
      })
      return c.json(usuarios);
    } catch (err: Error | unknown) {
      // isConnected = false;
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

app.get("/sucursales", async (c) => {
  if(isConnected) {
    try {
      const result = await client.queryObject<Sucursal>`SELECT * FROM sucursales`
      const sucursales = result.rows.map((u, index) => ({ ...u, index: index+1 } as SucursalTData))
      return c.json(sucursales);
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

app.route("/pedidos", pedidos)

Deno.serve({ port: 8000 }, app.fetch);
