import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import pool from '../src/db/pool.js';

async function getCategoryRow() {
  const r = await pool.query('SELECT id, name FROM categories LIMIT 1');
  return r.rows[0];
}

describe('Integration: POST /api/books -> DB', () => {
  let category;
  beforeAll(async () => {
    category = await getCategoryRow();
  });

  afterAll(async () => {
    await pool.end();
  });

  it('should persist a new book into DB', async () => {
    const payload = { title: 'Int Test Book', author: 'Int Tester', category: category.name };
    const res = await request(app).post('/api/books').send(payload);
    expect(res.status).toBe(201);
    const { id } = res.body.book;
    expect(id).toBeTruthy();

    // Verify in DB
    const dbRes = await pool.query('SELECT id, title, author, category_id, status FROM books WHERE id=$1', [id]);
    expect(dbRes.rows.length).toBe(1);
    expect(dbRes.rows[0].title).toBe(payload.title);
    expect(dbRes.rows[0].author).toBe(payload.author);
    expect(dbRes.rows[0].category_id).toBe(category.id);

    // cleanup: delete the inserted row
    await pool.query('DELETE FROM books WHERE id=$1', [id]);
  });

  it('should fail when category does not exist', async () => {
    const res = await request(app).post('/api/books').send({
      title: 'Bad',
      author: 'Bad',
      category: 'Category_That_Does_Not_Exist__' + Date.now()
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/does not exist/);
  });
});
