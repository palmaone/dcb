import { Hono } from "hono";
import { client, isConnected } from "../db/connection.ts";
import { Cliente, ClienteTData } from "../../../shared/models/Cliente.ts";

const clientes = new Hono()

clientes.get("/", async (c) => {
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

export default clientes;