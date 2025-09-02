import { useState } from 'react'
import { Link } from 'react-router-dom'

/*
 * NewBookPage
 * Basic form to register a new book (Title, Author, Category)
 * Validation will be added in a subsequent task.
 */
export default function NewBookPage() {
  const [form, setForm] = useState({ title: '', author: '', category: '' })

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    // Placeholder submit (will integrate with backend later)
    console.log('Submitting new book', form)
    alert('Book submitted (demo).')
  }

  return (
    <div className="card" style={{ maxWidth: 480 }}>
      <h2>Register a Book</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div>
          <label htmlFor="title">Title</label><br />
          <input id="title" name="title" value={form.title} onChange={handleChange} placeholder="e.g. The Pragmatic Programmer" />
        </div>
        <div>
          <label htmlFor="author">Author</label><br />
            <input id="author" name="author" value={form.author} onChange={handleChange} placeholder="e.g. Andrew Hunt" />
        </div>
        <div>
          <label htmlFor="category">Category</label><br />
          <select id="category" name="category" value={form.category} onChange={handleChange}>
            <option value="">-- Select Category --</option>
            <option value="Fiction">Fiction</option>
            <option value="Science">Science</option>
            <option value="History">History</option>
            <option value="Technology">Technology</option>
          </select>
        </div>
        <button type="submit">Save Book</button>
      </form>
      <p style={{ marginTop: '1rem' }}><Link to="/">Back to Home</Link></p>
    </div>
  )
}
