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
        calle,
        num_ext,
        num_int,
        colonia,
        codigo_postal,
        telefono,
        email,
        entre_calles,
        persona_confianza,
        notas
      ) VALUES (
        ${clientData.nombre.trim()},
        ${clientData.apellido.trim()},
        ${clientData.calle},
        ${clientData.num_ext},
        ${clientData.num_int},
        ${clientData.colonia},
        ${clientData.codigo_postal},
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
        const num_int = c.num_int ? `Nº Int.${c.num_int}` : '';
        const codigo_postal = c.codigo_postal ? `C.P. ${c.codigo_postal}` : '';
        const domicilio = `
          Calle ${c.calle} Nº Ext. ${c.num_ext} ${num_int}
          Col. ${c.colonia} ${codigo_postal}
        `;
        return { ...c, index: index+1, nombre_completo, domicilio } as ClienteTData
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

// GET /clientes/search?nombre=alice - search by nombre
clientesApp.get('/search', async (c) => {
  const searchQuery = c.req.query('nombre')?.toLowerCase().trim()

  if (!searchQuery) {
    return c.json({ error: 'Missing "nombre" query parameter' }, 400)
  }
  console.log("searchQuery", '%' + searchQuery + '%');
  
  if(isConnected) {
    try {
      const result = await pgdb_client.queryObject<Cliente>`
        SELECT * FROM clientes
          WHERE nombre ILIKE ${ '%' + searchQuery + '%'}
            OR apellido ILIKE ${ '%' + searchQuery + '%'}
          ORDER BY nombre;
      `;
      const clientes = result.rows.map((c, index) => {
        const nombre_completo = `${c.nombre} ${c.apellido}`
        return { ...c, index: index+1, nombre_completo } as ClienteTData
      })
      console.log("clientes", clientes);
      
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
})


export default clientesApp;