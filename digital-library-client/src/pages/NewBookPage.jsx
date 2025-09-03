import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'

/*
 * NewBookPage
 * Basic form to register a new book (Title, Author, Category)
 * Validation will be added in a subsequent task.
 */
export default function NewBookPage() {
  const [form, setForm] = useState({ title: '', author: '', category: '' })
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const refs = {
    title: useRef(null),
    author: useRef(null),
    category: useRef(null)
  }

  function validate(values = form) {
    const errors = {}
    if (!values.title.trim()) errors.title = 'Title is required'
    if (!values.author.trim()) errors.author = 'Author is required'
    if (!values.category.trim()) errors.category = 'Category is required'
    return errors
  }

  const errors = validate()
  const isValid = Object.keys(errors).length === 0

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    // Clear feedback on change
    setApiError(null)
    setApiSuccess(null)
  }

  function handleBlur(e) {
    const { name } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
  }

  const [apiError, setApiError] = useState(null)
  const [apiSuccess, setApiSuccess] = useState(null)
  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
    setApiError(null)
    setApiSuccess(null)
    if (!isValid) {
      // focus first error field
      const firstErrorField = ['title','author','category'].find(f => errors[f])
      if (firstErrorField && refs[firstErrorField].current) {
        refs[firstErrorField].current.focus()
      }
      return
    }
    try {
      const res = await fetch('http://localhost:4000/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) {
        setApiError(data.error || 'Unknown error')
      } else {
        setApiSuccess('Book registered successfully!')
        setForm({ title: '', author: '', category: '' })
        setTouched({})
        setSubmitted(false)
      }
    } catch (err) {
      setApiError('Network error: ' + err.message)
    }
  }

  return (
    <div className="card" style={{ maxWidth: 480 }}>
      <h2>Register a Book</h2>
  {apiError && <div role="alert" style={{ color: 'crimson', marginBottom: '0.5rem' }}>{apiError}</div>}
  {apiSuccess && <div role="status" style={{ color: 'green', marginBottom: '0.5rem' }}>{apiSuccess}</div>}
      <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div>
          <label htmlFor="title">Title</label><br />
          <input ref={refs.title} id="title" name="title" value={form.title} onChange={handleChange} onBlur={handleBlur} aria-invalid={!!errors.title} aria-describedby={errors.title ? 'title-error' : undefined} placeholder="e.g. The Pragmatic Programmer" />
          {(touched.title || submitted) && errors.title && <div id="title-error" style={{ color: 'crimson', fontSize: '0.8rem' }}>{errors.title}</div>}
        </div>
        <div>
          <label htmlFor="author">Author</label><br />
          <input ref={refs.author} id="author" name="author" value={form.author} onChange={handleChange} onBlur={handleBlur} aria-invalid={!!errors.author} aria-describedby={errors.author ? 'author-error' : undefined} placeholder="e.g. Andrew Hunt" />
          {(touched.author || submitted) && errors.author && <div id="author-error" style={{ color: 'crimson', fontSize: '0.8rem' }}>{errors.author}</div>}
        </div>
        <div>
          <label htmlFor="category">Category</label><br />
          <select ref={refs.category} id="category" name="category" value={form.category} onChange={handleChange} onBlur={handleBlur} aria-invalid={!!errors.category} aria-describedby={errors.category ? 'category-error' : undefined}>
            <option value="">-- Select Category --</option>
            <option value="Fiction">Fiction</option>
            <option value="Science">Science</option>
            <option value="History">History</option>
            <option value="Technology">Technology</option>
          </select>
          {(touched.category || submitted) && errors.category && <div id="category-error" style={{ color: 'crimson', fontSize: '0.8rem' }}>{errors.category}</div>}
        </div>
  <button type="submit">Save Book</button>
      </form>
      <p style={{ marginTop: '1rem' }}><Link to="/">Back to Home</Link></p>
    </div>
  )
}
