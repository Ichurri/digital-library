import { Router } from 'express';
import { createBook, listBooks } from '../controllers/booksController.js';

const router = Router();


// GET /api/books — list all books
router.get('/', listBooks);

// POST /api/books — create a new book
router.post('/', createBook);

export default router;