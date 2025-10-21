import { Link, useLocation } from 'react-router-dom'

const Navbar: React.FC = () => {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav>
      <div className="container">
        <Link to="/" className="brand">
          NextRead
        </Link>

        <div className="nav-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            Discover
          </Link>
          <Link to="/favourites" className={`nav-link ${isActive('/favourites') ? 'active' : ''}`}>
            Library
          </Link>
          <a href="https://books.google.com" target="_blank" rel="noreferrer" className="nav-link">
            Reviews
          </a>
        </div>

        {/* <div className="nav-actions">
          <button className="btn btn-secondary">Log In</button>
          <button className="btn btn-primary">Sign Up</button>
        </div> */}
      </div>
    </nav>
  )
}

export default Navbar