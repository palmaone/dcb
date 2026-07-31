import { DetallesPastel } from "./DetallesPastel.ts"

export interface Pedido {
  id: string
  folio: number
  id_sucursal: number
  id_cliente: string
  id_usuario: string
  status: string
  id_cancelacion: number
  id_detalle_pastel: number
  info_entrega: number
  quien_recibe: string 
  created_at: Date
}

export type NuevoPedido = Omit<Pedido, "id" | "folio" | "created_at">

export interface PedidoTData extends Pedido {
  index: number
  sucursal: string
  nombre_cliente: string
  nombre_usuario: string
  detalles_pastel: DetallesPastel
}