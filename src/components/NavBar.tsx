import { Link } from 'react-router-dom'

const Navbar: React.FC = () => {
  return (
    <nav>
      <div className="container row" style={{ justifyContent: 'space-between' }}>
        <Link to="/" className="brand">NextRead</Link>
        <div className="row" style={{ gap: 16 }}>
          <Link to="/favourites">Favourites</Link>
          <a href="https://books.google.com" target="_blank" rel="noreferrer">Google Books</a>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
