import './App.css'
import { Routes, Route, Link } from 'react-router-dom'
import NewBookPage from './pages/NewBookPage.jsx'
import BooksPage from './pages/BooksPage.jsx'
import LibraryLayout from './layout/LibraryLayout.jsx'
import BorrowedBooks from './pages/BorrowedBooks.jsx'

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
  <Route path="/books" element={<BooksPage />} />
  <Route path="/books/new" element={<NewBookPage />} />
  <Route path="/loans" element={<BorrowedBooks />} />
      </Route>
    </Routes>
  )
}
