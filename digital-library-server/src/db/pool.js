import { config } from 'dotenv';
config();
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: Number(process.env.PGPORT) || 5432,
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || '',
  database: process.env.PGDATABASE || 'postgres',
//   host: 'localhost',
//   port: 5432,
//   user: 'ichurri',
//   password: 'mAchi22&09',
//   database: 'library_db',
});

export default pool;
