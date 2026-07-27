// Automatically load environment variables from a `.env` file
import "@std/dotenv/load";

import { Client } from "@db/postgres";
import { migrations } from "./migrations/index.ts";
const dbUrl = Deno.env.get("DATABASE_URL");
const client = new Client(dbUrl);

await client.connect();

// Ensure Tracking Table Exists
await client.queryObject(`
  CREATE TABLE IF NOT EXISTS schema_migrations (
    version TEXT PRIMARY KEY,
    applied_at TIMESTAMPTZ DEFAULT NOW()
  )
`);

const result = await client.queryObject<{ version: string }>(
  "SELECT version FROM schema_migrations ORDER BY version ASC"
);

const appliedVersions = new Set(result.rows.map((r) => r.version));

//Run migrations with lock
await client.queryObject("SELECT pg_advisory_lock(12345)");
console.log("🔒 Lock acquired");

try {
  for( const migration of migrations) {
    if(appliedVersions.has(migration.version)) {
      continue;
    }
    console.log(`🚀 Running ${migration.version}: ${migration.name}`);
    const transaction = client.createTransaction(`mig_${migration.version}`);
    try {
      await transaction.begin();
    } catch (err) {
      console.error("Failed to start transaction", err);
      throw err;
    }

    try {
      for(const query of migration.sql) {
        // Execute the SQL string
        await transaction.queryObject(query);
      }
      //Record version only if ALL queries in the array succeed
      await transaction.queryObject(
        "INSERT INTO schema_migrations (version) VALUES ($1)",
        [migration.version]
      );

      await transaction.commit();
      console.log(`✅ Completed ${migration.version}`);
    } catch (error) {
      //Reverts ALL queries in this array
      await transaction.rollback();
      console.error(`❌ Failed ${migration.version}`, error);
      throw error;
    }
  }
} finally {
  await client.queryObject("SELECT pg_advisory_unlock(12345)");
  console.log("🔓 Lock released");
  await client.end();
}
