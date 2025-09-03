# Digital Library Server

Backend for Digital Library (basic). Node.js + Express + PostgreSQL.

## Prerequisites
- Node.js 18+
- PostgreSQL 14+

## Setup
1. Copy `.env.example` to `.env` and adjust values.
2. Ensure the database and schema exist (you can run your provided SQL to create types/tables).
3. Install dependencies and start the server.

## Scripts
- `npm run dev` — Start with nodemon at `http://localhost:4000`.
- `npm start` — Start in production mode.
- `npm test` — Run tests (to be added).

## API
- `GET /api/health` — Health check with DB ping.

The story 1 endpoint `POST /api/books` will be added in subsequent tasks.