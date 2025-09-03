import { useEffect, useMemo, useState } from 'react';
import { getBooksByStatus, apiGet } from '../api/client';

export default function BorrowedBooks() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    // Fetch categories and borrowed books in parallel
    Promise.all([
      apiGet('/categories'), // Assumes you have an endpoint for categories
      getBooksByStatus('borrowed')
    ])
      .then(([catData, bookData]) => {
        if (!isMounted) return;
        const cats = catData.categories || catData; // adapt to your API response
        const booksRaw = bookData.books ? bookData.books : bookData;

        // Map category_id to category name
        const catMap = {};
        cats.forEach(c => { catMap[c.id] = c.name; });

        const booksWithCategory = booksRaw.map(b => ({
          ...b,
          category: catMap[b.category_id] || ''
        }));

        setCategories(cats);
        setBooks(booksWithCategory);
        setLoading(false);
      })
      .catch(err => {
        if (!isMounted) return;
        setError(err.message || 'Error loading borrowed books');
        setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return books.filter(b =>
      !q ||
      b.title?.toLowerCase().includes(q) ||
      b.author?.toLowerCase().includes(q)
    );
  }, [books, query]);

  return (
    <div className="card">
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:16,flexWrap:'wrap'}}>
        <h2 style={{margin:0}}>Borrowed Books</h2>
        <input
          type="text"
          placeholder="Search by title or author"
          value={query}
          onChange={e=>setQuery(e.target.value)}
          aria-label="Search borrowed books"
          style={{minWidth:240}}
        />
      </div>
      <div style={{marginTop:16}}>
        {loading && <div className="muted">Loading borrowed books...</div>}
        {error && <div style={{color:'crimson'}}>{error}</div>}
        {!loading && !error && (
          filtered.length === 0 ? <div className="muted">No borrowed books found.</div> :
          <div style={{overflowX:'auto'}}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding:'4px 6px' }}>Title</th>
                  <th style={{ textAlign: 'left', padding:'4px 6px' }}>Author</th>
                  <th style={{ textAlign: 'left', padding:'4px 6px' }}>Category</th>
                  <th style={{ textAlign: 'left', padding:'4px 6px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(book => (
                  <tr key={book.id} style={{borderTop:'1px solid rgba(0,0,0,0.06)'}}>
                    <td style={{padding:'6px 6px'}}>{book.title}</td>
                    <td style={{padding:'6px 6px'}}>{book.author}</td>
                    <td style={{padding:'6px 6px'}}>{book.category}</td>
                    <td style={{padding:'6px 6px'}}>Borrowed</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}