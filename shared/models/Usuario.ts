export interface Usuario {
  id: number
  nombre: string
  apellido: string
  username: string
  telefono: string
  email: string
  created_at: Date
}

export interface UsuarioTData extends Usuario {
  index: number
  nombre_completo: string
}