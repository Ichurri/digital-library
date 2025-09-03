# Digital Library API Documentation

## POST /api/books
Register a new book in the library database.

### Request
- **Content-Type:** application/json
- **Body:**
  ```json
  {
    "title": "Book Title",
    "author": "Author Name",
    "category": "Fiction"
  }
  ```

### Response
- **201 Created**
  ```json
  {
    "message": "Book registered successfully.",
    "book": {
      "id": 1,
      "title": "Book Title",
      "author": "Author Name",
      "category_id": 1,
      "status": "available"
    }
  }
  ```

### Error Responses
- **400 Bad Request** — Missing fields
  ```json
  {
    "error": "Title, author, and category are required."
  }
  ```
- **400 Bad Request** — Category does not exist
  ```json
  {
    "error": "Category 'NonExistentCategory' does not exist."
  }
  ```
- **500 Internal Server Error** — Database or server error
  ```json
  {
    "error": "Internal Server Error"
  }
  ```

### Notes
- The `category` field must match an existing category name in the database.
- The `status` field defaults to `available`.
