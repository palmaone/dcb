import { Hono } from "hono";
import { hash } from "@felix/argon2";
import { pgdb_client, isConnected } from "../db/connection.ts";
import { NuevoUsuario, Usuario, UsuarioTData } from "../../../shared/models/Usuario.ts";

const usuariosApp = new Hono();

usuariosApp.get("/", async (c) => {
  if(isConnected) {
    try {
      const result = await pgdb_client.queryObject<Usuario>`
        SELECT id, nombre, apellido, username, rol, telefono, email
          FROM usuarios`
      const usuarios = result.rows.map((u, index) => {
        const nombre_completo = `${u.nombre} ${u.apellido}` 
        return { ...u, index: index+1, nombre_completo } as UsuarioTData
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

usuariosApp.post("/", async (c) => {
  // 1. Parse the JSON body
  const body = await c.req.json()
  try {
    const usuarioData: NuevoUsuario = body
    const hashedPass = await hash(usuarioData.password)
    console.log("hashedPass", hashedPass);
    
    const nuevoUsuario = await pgdb_client.queryObject<Usuario>`
      INSERT INTO usuarios (
        nombre,
        apellido,
        username,
        rol,
        password,
        telefono,
        email
      )
      VALUES (
        ${usuarioData.nombre},
        ${usuarioData.apellido},
        ${usuarioData.username},
        ${usuarioData.rol},
        ${hashedPass},
        ${usuarioData.telefono},
        ${usuarioData.email}
      );
    `
    return c.json({ id: nuevoUsuario.rows[0] }, 201)
  } catch (error) {
    return c.json({ error }, 400)
  }
})

usuariosApp.delete("/:id", async (c) => {
  if(isConnected) {
    const id_usuario = c.req.param('id')
    console.log("id_usuario", id_usuario);
      
    try {
      const result = await pgdb_client.queryArray<Usuario[]>`DELETE FROM usuarios WHERE id = ${id_usuario}`
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

export default usuariosApp