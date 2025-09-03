import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import pool from '../src/db/pool.js';

// Helper: get a valid category name from DB
async function getValidCategory() {
  const result = await pool.query('SELECT name FROM categories LIMIT 1');
  return result.rows[0]?.name || 'Fiction';
}

describe('POST /api/books', () => {
  let category;
  beforeAll(async () => {
    category = await getValidCategory();
  });
  afterAll(async () => {
    await pool.end();
  });

  it('should register a book with valid data', async () => {
    const res = await request(app)
      .post('/api/books')
      .send({ title: 'Test Book', author: 'Test Author', category });
    expect(res.status).toBe(201);
    expect(res.body.book).toBeDefined();
    expect(res.body.book.title).toBe('Test Book');
    expect(res.body.book.author).toBe('Test Author');
  });

  it('should fail with missing fields', async () => {
    const res = await request(app)
      .post('/api/books')
      .send({ title: '', author: '', category: '' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/required/);
  });

  it('should fail with non-existent category', async () => {
    const res = await request(app)
      .post('/api/books')
      .send({ title: 'Book', author: 'Author', category: 'NonExistentCategory' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/does not exist/);
  });
});
