// Controller for books endpoints
import { insertBook, findCategoryByName } from '../models/booksModel.js';

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