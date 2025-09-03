import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import pool from '../src/db/pool.js';

async function insertBook({ title, author, category }) {
  const catRes = await pool.query('SELECT id FROM categories WHERE name=$1', [category]);
  const category_id = catRes.rows[0]?.id;
  if (!category_id) throw new Error('Category not found');
  const res = await pool.query(
    'INSERT INTO books (title, author, category_id) VALUES ($1, $2, $3) RETURNING id, status',
    [title, author, category_id]
  );
  return res.rows[0];
}

async function deleteBook(id) {
  await pool.query('DELETE FROM books WHERE id=$1', [id]);
}

describe('POST /api/books/:id/loan and /return', () => {
  let book;
  beforeAll(async () => {
    book = await insertBook({ title: 'LoanTestBook', author: 'LoanTestAuthor', category: 'Fiction' });
  });
  afterAll(async () => {
    await deleteBook(book.id);
    await pool.end();
  });

  it('should mark book as borrowed', async () => {
    const res = await request(app).post(`/api/books/${book.id}/loan`).send();
    expect(res.status).toBe(200);
    expect(res.body.book.status).toBe('borrowed');
  });

  it('should not loan already borrowed book', async () => {
    const res = await request(app).post(`/api/books/${book.id}/loan`).send();
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/already lent/);
  });

  it('should mark book as available', async () => {
    const res = await request(app).post(`/api/books/${book.id}/return`).send();
    expect(res.status).toBe(200);
    expect(res.body.book.status).toBe('available');
  });

  it('should return 404 for non-existent book', async () => {
    const res = await request(app).post(`/api/books/999999/loan`).send();
    expect(res.status).toBe(404);
  });
});
