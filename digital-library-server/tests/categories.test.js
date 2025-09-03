import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import pool from '../src/db/pool.js';

// Helper: insert and cleanup test category
async function insertCategory(name) {
  const res = await pool.query(
    'INSERT INTO categories (name) VALUES ($1) RETURNING id',
    [name]
  );
  return res.rows[0].id;
}

async function deleteCategory(id) {
  await pool.query('DELETE FROM categories WHERE id=$1', [id]);
}

describe('GET /api/categories', () => {
  let categoryId;
  const testCategoryName = 'TestCategory';

  beforeAll(async () => {
    categoryId = await insertCategory(testCategoryName);
  });

  afterAll(async () => {
    await deleteCategory(categoryId);
    await pool.end();
  });

  it('should return all categories including the test category', async () => {
    const res = await request(app).get('/api/categories');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.categories)).toBe(true);
    expect(res.body.categories.some(c => c.name === testCategoryName)).toBe(true);
  });
});