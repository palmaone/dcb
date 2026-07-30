interface Migration {
  version: string;
  name: string;
  description: string;
  sql: string[];
  revert_sql: string[];
}

export const migrations: Migration[] = [
  {
    version: "1",
    name: "create_schemas",
    description: "Create initial database schemas",
    sql: [
      `CREATE TABLE IF NOT EXISTS usuarios (
        id UUID PRIMARY KEY DEFAULT uuidv7(),
        nombre TEXT NOT NULL,
        apellido TEXT NOT NULL,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        telefono TEXT,
        email TEXT NOT NULL,
        rol TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `,
      `CREATE TABLE IF NOT EXISTS clientes (
        id UUID PRIMARY KEY DEFAULT uuidv7(),
        nombre TEXT NOT NULL,
        apellido TEXT NOT NULL,
        domicilio TEXT NOT NULL,
        colonia TEXT NOT NULL,
        telefono TEXT NOT NULL,
        email TEXT NOT NULL,
        entre_calles TEXT NOT NULL,
        persona_confianza TEXT NOT NULL,
        notas TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `,
      `CREATE TABLE IF NOT EXISTS sucursales(
        id UUID PRIMARY KEY DEFAULT uuidv7(),
        nombre TEXT NOT NULL,
        direccion TEXT NOT NULL,
        telefono TEXT NOT NULL,
        email TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `,
      `CREATE TABLE IF NOT EXISTS detalles_pastel(
        id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        cantidad INT NOT NULL,
        tamano TEXT NOT NULL,
        color TEXT,
        sabor TEXT,
        extra_ingredientes JSONB,
        url_img_decora TEXT,
        accesorios JSONB,
        tipo_base TEXT NOT NULL,
        observaciones TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `,
      `CREATE TABLE IF NOT EXISTS info_entregas (
        id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        domicilio TEXT NOT NULL,
        referencias TEXT NOT NULL,
        fecha_hora_entrega TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `,
      `CREATE TABLE IF NOT EXISTS cancelaciones_pedidos (
        id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        motivo TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `,
      `CREATE TABLE IF NOT EXISTS pedidos(
        id UUID PRIMARY KEY DEFAULT uuidv7(),
        folio INT NOT NULL,
        id_sucursal UUID NOT NULL REFERENCES sucursales(id),
        id_cliente UUID  NOT NULL REFERENCES clientes(id),
        id_usuario UUID NOT NULL REFERENCES usuarios(id),
        status TEXT NOT NULL,
        id_cancelacion INT REFERENCES cancelaciones_pedidos(id),
        id_detalle_pastel INT NOT NULL REFERENCES detalles_pastel(id),
        info_entrega INT NOT NULL REFERENCES info_entregas(id),
        quien_recibe TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    ],
    revert_sql: [
      "DROP TABLE IF EXISTS usuarios;",
      "DROP TABLE IF EXISTS clientes;",
      "DROP TABLE IF EXISTS sucursales;",
      "DROP TABLE IF EXISTS detalles_pastel;",
      "DROP TABLE IF EXISTS info_entrega;",
      "DROP TABLE IF EXISTS cancelaciones_pedidos;",
      "DROP TABLE IF EXISTS pedidos;"
    ]
  }
]