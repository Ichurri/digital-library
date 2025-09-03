import { Router } from 'express';
import { createBook } from '../controllers/booksController.js';

const router = Router();

// POST /api/books — create a new book (no DB logic yet)
router.post('/', createBook);

export default router;