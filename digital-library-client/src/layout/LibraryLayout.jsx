import { NavLink, Outlet } from 'react-router-dom'

export default function LibraryLayout() {
  return (
    <div className="layout">
      <aside className="sidebar">
        <div style={{display:'flex',alignItems:'center',gap:8,paddingBottom:12,borderBottom:'1px solid rgba(0,0,0,0.07)'}}>
          <div style={{fontSize:32}}>📚</div>
          <div style={{lineHeight:1}}>
            <h1 style={{fontSize:'1rem',margin:0}}>Libeary</h1>
            <div className="muted" style={{marginTop:2}}>Sistema de Biblioteca Virtual</div>
          </div>
        </div>
        <nav>
          <NavLink to="/" end className={({isActive})=> isActive ? 'active' : undefined}>Tablero</NavLink>
          <NavLink to="/books" end className={({isActive})=> isActive ? 'active' : undefined}>Libros Disponibles</NavLink>
          <NavLink to="/search" className={({isActive})=> isActive ? 'active' : undefined}>Busqueda Avanzada</NavLink>
          <NavLink to="/loans" className={({isActive})=> isActive ? 'active' : undefined}>Libros Prestados</NavLink>
          <NavLink to="/books/new" className={({isActive})=> isActive ? 'active' : undefined}>Registrar Libro</NavLink>
        </nav>
      </aside>
      <div className="main-area">
        <header className="topbar">
          <div className="search-bar">
            <input type="text" placeholder="Busqueda rapida por titulo" aria-label="Buscar por titulo" />
            <button type="button">Buscar</button>
          </div>
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
