import { Hono } from "hono";
import { pgdb_client, isConnected } from "../db/connection.ts";
import { Cliente, ClienteTData, NuevoCliente } from "../../../shared/models/Cliente.ts";

const clientesApp = new Hono()

clientesApp.post("/", async (c) => {
  const body = await c.req.json()
  try {
    // 2. TODO: Add validation here (see below)
    const clientData: NuevoCliente = body 
    // 3. Insert into database (pseudo-code)
    await pgdb_client.queryObject<Cliente>`
      INSERT INTO clientes (
        nombre,
        apellido,
        domicilio,
        colonia,
        telefono,
        email,
        entre_calles,
        persona_confianza,
        notas
      ) VALUES (
        ${clientData.nombre.trim()},
        ${clientData.apellido.trim()},
        ${clientData.domicilio},
        ${clientData.colonia},
        ${clientData.telefono},
        ${clientData.email.trim()},
        ${clientData.entre_calles},
        ${clientData.persona_confianza.trim()},
        ${clientData.notas}
      );
    `;
    return c.json(201)
  } catch (error) {
    return c.json({ error }, 400);
  } 
})

clientesApp.delete("/:id", async (c) => {
  if(isConnected) {
     const id_cliente = c.req.param('id')
     console.log("id_cliente", id_cliente);
     
    try {
      const result = await pgdb_client.queryArray<Cliente[]>`DELETE FROM clientes WHERE id = ${id_cliente}`
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
})

clientesApp.get("/", async (c) => {
  if(isConnected) {
    try {
      const result = await pgdb_client.queryObject<Cliente>`SELECT * FROM clientes`
      const clientes = result.rows.map((c, index) => {
        const nombre_completo = `${c.nombre} ${c.apellido}`
        return { ...c, index: index+1, nombre_completo } as ClienteTData
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

export default clientesApp;