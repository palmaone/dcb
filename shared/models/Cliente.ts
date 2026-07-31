export interface Cliente {
  id: number
  nombre: string
  apellido: string
  calle: string
  num_ext: string
  num_int?: string
  colonia: string
  codigo_postal: string
  telefono: string
  email: string
  entre_calles: string
  persona_confianza: string
  notas: string | null
  created_at: Date
}

export interface ClienteTData extends Cliente {
  index: number
  nombre_completo: string
  domicilio: string
}

export type NuevoCliente = Omit<Cliente, "id" | "created_at">