import express from 'express';
import healthRouter from './routes/health.js';
import booksRouter from './routes/books.js';

const app = express();

// Middlewares
app.use(express.json());

// Routes
app.use('/api/health', healthRouter);

app.use('/api/books', booksRouter);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

export default app;
