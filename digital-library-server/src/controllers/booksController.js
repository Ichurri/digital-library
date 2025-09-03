import { updateBookStatus } from '../models/booksModel.js';
import { getBooksByStatus } from '../models/booksModel.js';

// Change book status: loan or return
export async function changeBookStatus(req, res, next) {
  try {
    const id = Number(req.params.id);
    const action = req.action;
    if (!id || !['loan','return'].includes(action)) {
      return res.status(400).json({ error: 'Invalid request' });
    }
    const status = action === 'loan' ? 'borrowed' : 'available';
    const result = await updateBookStatus(id, status);
    if (!result) {
      return res.status(404).json({ error: 'Book not found' });
    }
    if (action === 'loan' && result.already) {
      return res.status(400).json({ error: 'Book is already lent' });
    }
    res.json({ message: `Book marked as ${status}`, book: result });
  } catch (err) {
    next(err);
  }
}
// Controller for books endpoints
import { insertBook, findCategoryByName, getAllBooks } from '../models/booksModel.js';
// List all books
export async function listBooks(req, res, next) {
  try {
    const { query, author, category } = req.query;
    const books = await getAllBooks({ query, author, category });
    res.json({ books });
  } catch (err) {
    next(err);
  }
}

export async function createBook(req, res, next) {
  try {
    const { title, author, category } = req.body;
    // Validation: all fields required
    if (!title || !author || !category) {
      return res.status(400).json({ error: 'Title, author, and category are required.' });
    }
    // Check category exists
    const categoryRow = await findCategoryByName(category);
    if (!categoryRow) {
      return res.status(400).json({ error: `Category '${category}' does not exist.` });
    }
    // Insert book
    const book = await insertBook({ title, author, category_id: categoryRow.id });
    res.status(201).json({
      message: 'Book registered successfully.',
      book
    });
  } catch (err) {
    next(err);
  }
}


export async function listBooksByStatus(req, res) {
  const status = req.query.status || 'borrowed';
  try {
    const books = await getBooksByStatus(status);
    res.json({ books });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch books by status' });
  }
}

export async function listCategories(req, res) {
  try {
    const categories = await getAllCategories();
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
}