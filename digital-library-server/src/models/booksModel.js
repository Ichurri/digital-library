// Get all books
export async function getAllBooks() {
	const result = await pool.query(
		`SELECT b.id, b.title, b.author, b.status, c.name AS category
		 FROM books b
		 JOIN categories c ON b.category_id = c.id
		 ORDER BY b.id DESC`
	);
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