export interface Sucursal {
  id: number
  nombre: string
  direccion: string
  telefono: string
  email: string
  created_at: Date
}

export interface SucursalTData extends Sucursal {
  index: number
}