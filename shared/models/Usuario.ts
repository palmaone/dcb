export interface Usuario {
  id: number
  nombre: string
  apellido: string
  rol: string
  username: string
  password: string
  telefono: string
  email: string
  created_at: Date
}

export interface UsuarioTData extends Usuario {
  index: number
  nombre_completo: string
}

export type NuevoUsuario = Omit<Usuario, "id" | "created_at">