import { Context, Hono } from "hono";
import { Pedido, PedidoTData } from "../../../shared/models/Pedido.ts";
import { DetallesPastel } from "../../../shared/models/DetallesPastel.ts"
import { pgdb_client, isConnected } from "../db/connection.ts";
import { Usuario } from "../../../shared/models/Usuario.ts";
import { Cliente } from "../../../shared/models/Cliente.ts";
import { Sucursal } from "../../../shared/models/Sucursal.ts";
import { BlankEnv, BlankInput } from "hono/types";
import { QueryObjectResult } from "@db/postgres";

const pedidos = new Hono()

pedidos.get("/:param", async (c) => {
  console.log("fetching pedidos");
  const param = c.req.param('param')
  console.log("status param: ", param);
  
  if(isConnected) {
    switch (param) {
      case "pendientes": {
        const result = await pgdb_client.queryObject<Pedido>`SELECT * FROM pedidos WHERE status = 'pendiente'`
        return format_pedidos(result, c)
      }
      case "listos-para-entregar": {
        const result = await pgdb_client.queryObject<Pedido>`SELECT * FROM pedidos WHERE status = 'listo'`
        return format_pedidos(result, c)
      }
      case "procesando": {
        const result = await pgdb_client.queryObject<Pedido>`SELECT * FROM pedidos WHERE status = 'procesando'`
        return format_pedidos(result, c)
      }
      case "entregados": {
        const result = await pgdb_client.queryObject<Pedido>`SELECT * FROM pedidos WHERE status = 'entregado'`
        return format_pedidos(result, c)
      }
      case "todos":
      default: {
        const result = await pgdb_client.queryObject<Pedido>`SELECT * FROM pedidos`
        return format_pedidos(result, c)
      }
    }
    
  }
  return c.json(
    {
      status: "error",
      error: "connection failed"
    },
  500)
});

const format_pedidos = async ( result: QueryObjectResult<Pedido>, c: Context<BlankEnv, "/:param", BlankInput>) => {
  try {
      const pedidos = await Promise.all(result.rows.map(async (pedido, index) => {
        const sucursalData = await pgdb_client.queryObject<Sucursal>`SELECT * FROM sucursales WHERE id = ${pedido.id_sucursal}`
        const sucursal = sucursalData.rows[0].nombre
        const clienteData = await pgdb_client.queryObject<Cliente>`SELECT * FROM clientes WHERE id = ${pedido.id_cliente}`
        const nombre_cliente = clienteData.rows[0].nombre + ' ' + clienteData.rows[0].apellido
        const usuarioData = await pgdb_client.queryObject<Usuario>`SELECT * FROM usuarios WHERE id = ${pedido.id_usuario}`
        const nombre_usuario = usuarioData.rows[0].nombre
        const detallesData = await pgdb_client.queryObject<DetallesPastel>`SELECT * FROM detalles_pastel WHERE id = ${pedido.id_detalle_pastel}`
        const detalles_pastel = detallesData.rows[0]
        return { 
          ...pedido,
          index: index+1,
          sucursal,
          nombre_cliente,
          nombre_usuario,
          detalles_pastel
        } as PedidoTData
      }));
      return c.json(pedidos);
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

export default pedidos;