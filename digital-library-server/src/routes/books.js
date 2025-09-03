// POST /api/books/:id/loan — mark book as borrowed
router.post('/:id/loan', (req, res, next) => {
	req.action = 'loan';
	next();
}, require('../controllers/booksController.js').changeBookStatus);

// POST /api/books/:id/return — mark book as available
router.post('/:id/return', (req, res, next) => {
	req.action = 'return';
	next();
}, require('../controllers/booksController.js').changeBookStatus);
import { Router } from 'express';
import { createBook, listBooks, changeBookStatus } from '../controllers/booksController.js';
// POST /api/books/:id/loan — mark book as borrowed
router.post('/:id/loan', (req, res, next) => {
	req.action = 'loan';
	next();
}, changeBookStatus);

// POST /api/books/:id/return — mark book as available
router.post('/:id/return', (req, res, next) => {
	req.action = 'return';
	next();
}, changeBookStatus);

const router = Router();


// GET /api/books — list all books
router.get('/', listBooks);

// POST /api/books — create a new book
router.post('/', createBook);

export default router;