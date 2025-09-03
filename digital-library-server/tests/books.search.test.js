import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import pool from '../src/db/pool.js';

// Helper: insert and cleanup test books
async function insertBook({ title, author, category }) {
  const catRes = await pool.query('SELECT id FROM categories WHERE name=$1', [category]);
  const category_id = catRes.rows[0]?.id;
  if (!category_id) throw new Error('Category not found');
  const res = await pool.query(
    'INSERT INTO books (title, author, category_id) VALUES ($1, $2, $3) RETURNING id',
    [title, author, category_id]
  );
  return res.rows[0].id;
}

async function deleteBook(id) {
  await pool.query('DELETE FROM books WHERE id=$1', [id]);
}

describe('GET /api/books search', () => {
  let bookId;
  beforeAll(async () => {
    bookId = await insertBook({ title: 'SearchTestTitle', author: 'SearchTestAuthor', category: 'Science' });
  });
  afterAll(async () => {
    await deleteBook(bookId);
    await pool.end();
  });

  it('should find book by title', async () => {
    const res = await request(app).get('/api/books?query=SearchTestTitle');
    expect(res.status).toBe(200);
    expect(res.body.books.some(b => b.title === 'SearchTestTitle')).toBe(true);
  });

  it('should find book by author', async () => {
    const res = await request(app).get('/api/books?author=SearchTestAuthor');
    expect(res.status).toBe(200);
    expect(res.body.books.some(b => b.author === 'SearchTestAuthor')).toBe(true);
  });

  it('should find book by category', async () => {
    const res = await request(app).get('/api/books?category=Science');
    expect(res.status).toBe(200);
    expect(res.body.books.some(b => b.category === 'Science')).toBe(true);
  });

  it('should return empty for no match', async () => {
    const res = await request(app).get('/api/books?query=NoSuchBookTitle');
    expect(res.status).toBe(200);
    expect(res.body.books.length).toBe(0);
  });
});
