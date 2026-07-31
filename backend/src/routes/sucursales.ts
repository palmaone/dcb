import { Hono } from "hono";
import { pgdb_client, isConnected } from "../db/connection.ts";
import { Sucursal, SucursalTData, NuevaSucursal } from "../../../shared/models/Sucursal.ts";

const sucursalesApp = new Hono();

sucursalesApp.post("/", async (c) => {
  const body = await c.req.json();
  try {
    const sucursalData: NuevaSucursal = body;
    await pgdb_client.queryObject<Sucursal>`
      INSERT INTO sucursales (
        nombre,
        tipo,
        telefono,
        email,
        direccion
      ) VALUES (
        ${sucursalData.nombre},
        ${sucursalData.tipo},
        ${sucursalData.telefono},
        ${sucursalData.email},
        ${sucursalData.direccion}
      )
    `;
    return c.json(201)
  } catch (error) {
    return c.json({ error }, 400);
  }
})

sucursalesApp.get("/", async (c) => {
  if(isConnected) {
    try {
      const result = await pgdb_client.queryObject<Sucursal>`SELECT * FROM sucursales`
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

sucursalesApp.delete("/:id", async (c) => {
  if(isConnected) {
    const id_sucursal = c.req.param('id')
    console.log("id_sucursal", id_sucursal);
      
    try {
      const result = await pgdb_client.queryArray<Sucursal[]>`DELETE FROM sucursales WHERE id = ${id_sucursal}`
      return c.json({ deleteCount: `${ result.rowCount }`})
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
export default sucursalesApp;