import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function test() {
  try {
    console.log("Connecting to:", process.env.DATABASE_URL.replace(/:[^:@]+@/, ":****@"));
    const client = await pool.connect();
    console.log("Connected successfully to PG");
    const res = await client.query('SELECT 1');
    console.log("Query result:", res.rows);
    client.release();
  } catch (err) {
    console.error("Connection failed:", err);
  } finally {
    await pool.end();
  }
}

test();
