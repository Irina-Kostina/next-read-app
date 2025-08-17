import { Link } from 'react-router-dom'

const Navbar: React.FC = () => {
  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
      <h1>Next Read</h1>
      <Link to="/">Home</Link>
    </nav>
  )
}

export default Navbar
