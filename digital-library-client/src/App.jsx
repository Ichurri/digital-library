import './App.css'
import { Routes, Route, Link } from 'react-router-dom'
import NewBookPage from './pages/NewBookPage.jsx'
import BooksListPage from './pages/BooksListPage.jsx'
import LibraryLayout from './layout/LibraryLayout.jsx'

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

export default function App() {
  return (
    <Routes>
      <Route element={<LibraryLayout />}> 
        <Route path="/" element={<Home />} />
  <Route path="/books" element={<BooksListPage />} />
  <Route path="/books/new" element={<NewBookPage />} />
      </Route>
    </Routes>
  )
}
