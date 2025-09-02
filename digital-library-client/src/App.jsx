import './App.css'
import { Routes, Route, Link } from 'react-router-dom'

function Home() {
  return (
    <div className="card">
      <h1>Digital Library</h1>
      <p>Welcome to the Digital Library admin panel.</p>
      <nav style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <Link to="/books/new">Register New Book</Link>
      </nav>
    </div>
  )
}

function NewBookPlaceholder() {
  return <div className="card"><h2>Register a Book</h2><p>Form coming soon.</p></div>
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/books/new" element={<NewBookPlaceholder />} />
    </Routes>
  )
}
