export interface Cliente {
  id: number
  nombre: string
  apellido: string
  domicilio: string
  colonia: string
  telefono: string
  email: string
  entre_calles: string
  persona_confianza: string
  notas: JSON
  created_at: Date
}

export interface ClienteTData extends Cliente {
  index: number
  nombre_completo: string
}