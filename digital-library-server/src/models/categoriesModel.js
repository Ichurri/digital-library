import pool from '../db/pool.js';

export async function getAllCategories() {
  const query = 'SELECT id, name FROM categories ORDER BY name ASC';
  const { rows } = await pool.query(query);
  return rows;
}