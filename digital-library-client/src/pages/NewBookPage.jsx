import { useState, useRef } from 'react'
import { apiPost } from '../api/client.js'

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
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
    setApiError(null)
    setApiSuccess(null)
    if (!isValid) {
      const firstErrorField = ['title','author','category'].find(f => errors[f])
      if (firstErrorField && refs[firstErrorField].current) {
        refs[firstErrorField].current.focus()
      }
      return
    }
    try {
      setLoading(true)
      const data = await apiPost('/books', form)
  setApiSuccess(data.message || 'Book registered.')
      setForm({ title: '', author: '', category: '' })
      setTouched({})
      setSubmitted(false)
    } catch (err) {
      setApiError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dl-card">
  <h2 className="page-title">Register New Book</h2>
  <p className="page-subtitle">Complete the book information to add it to the catalogue</p>
      {apiError && <div className="error-text" role="alert">{apiError}</div>}
      {apiSuccess && <div style={{color:'var(--color-primary)',fontSize:'.75rem',fontWeight:600,marginBottom:'8px'}} role="status">{apiSuccess}</div>}
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid-2">
          <div>
            <label htmlFor="author">Author</label>
            <input ref={refs.author} id="author" name="author" value={form.author} onChange={handleChange} onBlur={handleBlur} aria-invalid={!!errors.author} aria-describedby={errors.author ? 'author-error' : undefined} placeholder="e.g. Gabriel Garcia Marquez" />
            {(touched.author || submitted) && errors.author && <div id="author-error" className="error-text">{errors.author}</div>}
          </div>
          <div>
            <label htmlFor="title">Title</label>
            <input ref={refs.title} id="title" name="title" value={form.title} onChange={handleChange} onBlur={handleBlur} aria-invalid={!!errors.title} aria-describedby={errors.title ? 'title-error' : undefined} placeholder="e.g. One Hundred Years of Solitude" />
            {(touched.title || submitted) && errors.title && <div id="title-error" className="error-text">{errors.title}</div>}
          </div>
          <div>
            <label htmlFor="category">Category</label>
            <select ref={refs.category} id="category" name="category" value={form.category} onChange={handleChange} onBlur={handleBlur} aria-invalid={!!errors.category} aria-describedby={errors.category ? 'category-error' : undefined}>
              <option value="">Select Category</option>
              <option value="Fiction">Fiction</option>
              <option value="Science">Science</option>
              <option value="History">History</option>
              <option value="Technology">Technology</option>
            </select>
            {(touched.category || submitted) && errors.category && <div id="category-error" className="error-text">{errors.category}</div>}
          </div>
        </div>
        <div style={{marginTop:'var(--space-6)'}}>
          <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Book'}</button>
        </div>
      </form>
    </div>
  )
}
