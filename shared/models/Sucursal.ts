export interface Sucursal {
  id: number
  nombre: string
  tipo: string
  direccion: string
  telefono: string
  email: string
  created_at: Date
}
export interface SucursalTData extends Sucursal {
  index: number
}

export type NuevaSucursal = Omit<Sucursal, "id" | "created_at">