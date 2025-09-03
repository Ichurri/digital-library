// Controller for books endpoints
export async function createBook(req, res, next) {
  try {
    // Extract fields from request body
    const { title, author, category } = req.body;
    // Placeholder: no DB logic yet
    res.status(201).json({
      message: 'Book received (not stored yet)',
      book: { title, author, category }
    });
  } catch (err) {
    next(err);
  }
}