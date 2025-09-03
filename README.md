# Digital Library

Backend and API for managing books in a small digital library.

## Backend Setup
- Node.js 18+, PostgreSQL 14+
- See `digital-library-server/README.md` for backend details and environment setup.

## How to Run
```bash
cd digital-library-server
npm install
cp .env.example .env # and edit with your DB credentials
npm run dev # or npm start
```

## How to Test
```bash
npm run test
```

## API Overview
- **POST /api/books** — Register a new book
  - Request: `{ "title": "Book Title", "author": "Author Name", "category": "Fiction" }`
  - Response: `201 Created` with book info or error message
- See `digital-library-server/docs/API.md` for full API documentation and examples.

## Project Structure
- `digital-library-server/` — Backend source code
- `digital-library-server/tests/` — Unit and integration tests
- `digital-library-server/docs/API.md` — API documentation

---
For questions or issues, contact the backend maintainer.
