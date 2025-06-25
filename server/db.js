import { Pool } from 'pg';
import { info, error } from './helper/logger';

const pool = new Pool({
  connectionString: process.env.PostgreSQL_URI,
});

pool.on('connect', () => {
  info('DB Connection Established');
  console.log('DB Connected');
});

pool.on('error', (err) => {
  error(`DB Connection Fail | ${err.stack}`);
  console.error(err);
});

export function query(text, params) { return pool.query(text, params); }