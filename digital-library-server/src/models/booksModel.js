// Update book status
export async function updateBookStatus(id, status) {
	// Get current status
	const current = await pool.query('SELECT status FROM books WHERE id=$1', [id]);
	if (current.rowCount === 0) return null;
	if (current.rows[0].status === status) return { already: true };
	const res = await pool.query(
		'UPDATE books SET status=$2 WHERE id=$1 RETURNING id, title, author, status',
		[id, status]
	);
	return res.rows[0];
}
// Get all books
export async function getAllBooks({ query, author, category } = {}) {
	let sql = `SELECT b.id, b.title, b.author, b.status, c.name AS category
						 FROM books b
						 JOIN categories c ON b.category_id = c.id`;
	const clauses = [];
	const params = [];
	if (query) {
		clauses.push('b.title ILIKE $' + (params.length + 1));
		params.push(`%${query}%`);
	}
	if (author) {
		clauses.push('b.author ILIKE $' + (params.length + 1));
		params.push(`%${author}%`);
	}
	if (category) {
		clauses.push('c.name = $' + (params.length + 1));
		params.push(category);
	}
	if (clauses.length) {
		sql += ' WHERE ' + clauses.join(' AND ');
	}
	sql += ' ORDER BY b.id DESC';
	const result = await pool.query(sql, params);
	return result.rows;
}
import pool from '../db/pool.js';

// Find category by name
export async function findCategoryByName(name) {
	const result = await pool.query('SELECT id, name FROM categories WHERE name = $1', [name]);
	return result.rows[0];
}

// Insert a new book
export async function insertBook({ title, author, category_id }) {
	const result = await pool.query(
		`INSERT INTO books (title, author, category_id) VALUES ($1, $2, $3) RETURNING id, title, author, category_id, status`,
		[title, author, category_id]
	);
	return result.rows[0];
}

export async function getBooksByStatus(status) {
    const query = 'SELECT * FROM books WHERE status = $1';
    const values = [status];
    const { rows } = await pool.query(query, values);
    return rows;
}

export async function getAllCategories() {
  const query = 'SELECT id, name FROM categories ORDER BY name ASC';
  const { rows } = await pool.query(query);
  return rows;
}