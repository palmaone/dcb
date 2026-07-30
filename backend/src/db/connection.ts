import { Client } from "@db/postgres"

// Postgres client initialization
const databaseUrl =
  Deno.env.get("DATABASE_URL") ||
  "postgres://postgres:postgres@db:5432/postgres";
console.log(`Connecting to database at ${databaseUrl}`);
const pgdb_client = new Client(databaseUrl);
let isConnected = false;
try {
  isConnected = await ensureDbConnected()
} catch (e) {
  const error = e instanceof Error ? e.message : String(e) 
  console.error("db connection", error);
  
  isConnected = false
}

async function ensureDbConnected(): Promise<boolean> {
  if (!isConnected) {
    await pgdb_client.connect();
    return true;
  }
  return isConnected
}

export {
  pgdb_client,
  isConnected
}