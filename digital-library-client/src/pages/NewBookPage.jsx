import { useState, useRef } from 'react'

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
      const firstErrorField = ['title','author','category'].find(f => errors[f])
      if (firstErrorField && refs[firstErrorField].current) {
        refs[firstErrorField].current.focus()
      }
      return
    }
    // Placeholder success (still local until backend integration stable)
    setApiSuccess('Libro registrado (demo).')
    setForm({ title: '', author: '', category: '' })
    setTouched({})
    setSubmitted(false)
  }

  return (
    <div className="dl-card">
      <h2 className="page-title">Registrar Nuevo Libro</h2>
      <p className="page-subtitle">Complete la informacion del libro para agregarlo al inventario</p>
      {apiError && <div className="error-text" role="alert">{apiError}</div>}
      {apiSuccess && <div style={{color:'var(--color-primary)',fontSize:'.75rem',fontWeight:600,marginBottom:'8px'}} role="status">{apiSuccess}</div>}
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid-2">
          <div>
            <label htmlFor="author">Autor</label>
            <input ref={refs.author} id="author" name="author" value={form.author} onChange={handleChange} onBlur={handleBlur} aria-invalid={!!errors.author} aria-describedby={errors.author ? 'author-error' : undefined} placeholder="Ej. Gabriel Garcia Marquez" />
            {(touched.author || submitted) && errors.author && <div id="author-error" className="error-text">{errors.author}</div>}
          </div>
          <div>
            <label htmlFor="title">Titulo</label>
            <input ref={refs.title} id="title" name="title" value={form.title} onChange={handleChange} onBlur={handleBlur} aria-invalid={!!errors.title} aria-describedby={errors.title ? 'title-error' : undefined} placeholder="Ej. Cien Años de Soledad" />
            {(touched.title || submitted) && errors.title && <div id="title-error" className="error-text">{errors.title}</div>}
          </div>
          <div>
            <label htmlFor="category">Categoria</label>
            <select ref={refs.category} id="category" name="category" value={form.category} onChange={handleChange} onBlur={handleBlur} aria-invalid={!!errors.category} aria-describedby={errors.category ? 'category-error' : undefined}>
              <option value="">Seleccionar Categoria</option>
              <option value="Fiction">Ficcion</option>
              <option value="Science">Ciencia</option>
              <option value="History">Historia</option>
              <option value="Technology">Tecnologia</option>
            </select>
            {(touched.category || submitted) && errors.category && <div id="category-error" className="error-text">{errors.category}</div>}
          </div>
        </div>
        <div style={{marginTop:'var(--space-6)'}}>
          <button type="submit">Guardar Libro</button>
        </div>
      </form>
    </div>
  )
}
