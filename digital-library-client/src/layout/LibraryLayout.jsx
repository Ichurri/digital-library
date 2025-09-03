import { NavLink, Outlet } from 'react-router-dom'

export default function LibraryLayout() {
  return (
    <div className="layout">
      <aside className="sidebar">
        <div style={{display:'flex',alignItems:'center',gap:8,paddingBottom:12,borderBottom:'1px solid rgba(0,0,0,0.07)'}}>
          <div style={{fontSize:32}}>📚</div>
          <div style={{lineHeight:1}}>
            <h1 style={{fontSize:'1rem',margin:0}}>Libeary</h1>
            <div className="muted" style={{marginTop:2}}>Virtual Library System</div>
          </div>
        </div>
        <nav>
          <NavLink to="/" end className={({isActive})=> isActive ? 'active' : undefined}>Dashboard</NavLink>
          <NavLink to="/books" end className={({isActive})=> isActive ? 'active' : undefined}>Available Books</NavLink>
          {/* <NavLink to="/search" className={({isActive})=> isActive ? 'active' : undefined}>Advanced Search</NavLink> */}
          <NavLink to="/loans" className={({isActive})=> isActive ? 'active' : undefined}>Borrowed Books</NavLink>
          <NavLink to="/books/new" className={({isActive})=> isActive ? 'active' : undefined}>Register Book</NavLink>
        </nav>
      </aside>
      <div className="main-area">
        {/* <header className="topbar">
          <div className="search-bar">
            <input type="text" placeholder="Quick search by title" aria-label="Search by title" />
            <button type="button">Search</button>
          </div>
        </header> */}
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
