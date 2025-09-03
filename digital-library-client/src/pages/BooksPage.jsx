import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiGet, loanBook, returnBook } from '../api/client.js';

// BooksPage: lists books and provides client-side search by title or author (task011)
export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(''); // task012 added category filter

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    apiGet('/books')
      .then(data => {
        if (!isMounted) return;
        setBooks(data.books || []);
        setLoading(false);
      })
      .catch(err => {
        if (!isMounted) return;
        setError(err.message || 'Error loading books');
        setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  const categories = useMemo(() => {
    const set = new Set();
    books.forEach(b => { if (b.category) set.add(b.category); });
    return Array.from(set).sort();
  }, [books]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return books.filter(b => {
      const matchesQuery = !q || b.title?.toLowerCase().includes(q) || b.author?.toLowerCase().includes(q);
      const matchesCategory = !category || b.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [books, query, category]);

  async function handleAction(book, action) {
    // optimistic update
    const prev = books;
    const nextStatus = action === 'loan' ? 'borrowed' : 'available';
    setBooks(bs => bs.map(b => b.id === book.id ? { ...b, status: nextStatus, _updating: true } : b));
    try {
      if (action === 'loan') await loanBook(book.id); else await returnBook(book.id);
      // remove updating flag
      setBooks(bs => bs.map(b => b.id === book.id ? { ...b, _updating: false } : b));
    } catch (err) {
      // revert and surface error per row
      setBooks(prev.map(b => b.id === book.id ? { ...b, _rowError: err.message } : b));
      setTimeout(() => {
        setBooks(p => p.map(b => b.id === book.id ? { ...b, _rowError: undefined } : b));
      }, 4000);
    }
  }

  return (
    <div className="card">
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:16,flexWrap:'wrap'}}>
        <h2 style={{margin:0}}>Books</h2>
        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          <input
            type="text"
            placeholder="Search by title or author"
            value={query}
            onChange={e=>setQuery(e.target.value)}
            aria-label="Search books by title or author"
            style={{minWidth:240}}
          />
          <select
            aria-label="Filter by category"
            value={category}
            onChange={e=>setCategory(e.target.value)}
            style={{minWidth:180}}
          >
            <option value="">All categories</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </div>
      <div style={{marginTop:16}}>
        {loading && <div>Loading books...</div>}
        {error && <div style={{color:'crimson'}}>{error}</div>}
        {!loading && !error && (
          filtered.length === 0 ? <div>No matching books.</div> :
          <div style={{overflowX:'auto'}}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding:'4px 6px' }}>Title</th>
                  <th style={{ textAlign: 'left', padding:'4px 6px' }}>Author</th>
                  <th style={{ textAlign: 'left', padding:'4px 6px' }}>Category</th>
                  <th style={{ textAlign: 'left', padding:'4px 6px' }}>Status</th>
                  <th style={{ textAlign: 'left', padding:'4px 6px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(book => {
                  const isBorrowed = book.status === 'borrowed';
                  const updating = book._updating;
                  return (
                    <tr key={book.id} style={{borderTop:'1px solid rgba(0,0,0,0.06)'}}>
                      <td style={{padding:'6px 6px'}}>{book.title}</td>
                      <td style={{padding:'6px 6px'}}>{book.author}</td>
                      <td style={{padding:'6px 6px'}}>{book.category}</td>
                      <td style={{padding:'6px 6px'}}>{isBorrowed ? 'Borrowed' : 'Available'}{updating && <span style={{marginLeft:4,fontSize:10,opacity:.6}}>...</span>}</td>
                      <td style={{padding:'6px 6px',display:'flex',gap:4,flexWrap:'wrap'}}>
                        <button
                          onClick={()=>handleAction(book, 'loan')}
                          disabled={isBorrowed || updating}
                          style={{padding:'2px 8px'}}
                        >Loan</button>
                        <button
                          onClick={()=>handleAction(book, 'return')}
                          disabled={!isBorrowed || updating}
                          style={{padding:'2px 8px'}}
                        >Return</button>
                        {book._rowError && <span style={{color:'crimson',fontSize:10}}>{book._rowError}</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div style={{marginTop:16}}>
        <Link to="/books/new">Register New Book</Link>
      </div>
    </div>
  );
}
