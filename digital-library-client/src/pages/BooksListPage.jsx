import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function BooksListPage() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('http://localhost:4000/api/books')
      .then(res => res.json())
      .then(data => {
        setBooks(data.books || [])
        setLoading(false)
      })
      .catch(err => {
        setError('Error loading books: ' + err.message)
        setLoading(false)
      })
  }, [])

  return (
    <div className="card" style={{ maxWidth: 640 }}>
      <h2>Books List</h2>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'crimson' }}>{error}</div>}
      {!loading && !error && (
        books.length === 0 ? <div>No books registered.</div> :
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Title</th>
              <th style={{ textAlign: 'left' }}>Author</th>
              <th style={{ textAlign: 'left' }}>Category</th>
              <th style={{ textAlign: 'left' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {books.map(book => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.category}</td>
                <td>{book.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p style={{ marginTop: '1rem' }}><Link to="/books/new">Register a new book</Link></p>
      <p><Link to="/">Back to Home</Link></p>
    </div>
  )
}
