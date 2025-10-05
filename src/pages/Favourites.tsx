import { useEffect, useState } from 'react'
import { fetchBookById } from '../services/bookService'
import type { Book } from '../types/book'
import BookCard from '../components/BookCard'
import { useFavourites } from '../context/FavouritesContext'

const Favourites: React.FC = () => {
  const { ids } = useFavourites()
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      try {
        const results = await Promise.all(ids.map(id => fetchBookById(id)))
        if (!cancelled) setBooks(results)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    if (ids.length) load()
    else setBooks([])
    return () => { cancelled = true }
  }, [ids])

  return (
    <div className="main-content">
      <div className="page-header">
        <h1 className="page-title">Your Library</h1>
        <p className="page-subtitle">
          Your personal collection of saved books ({ids.length} {ids.length === 1 ? 'book' : 'books'})
        </p>
      </div>

      {loading && <div className="loading">Loading your library…</div>}
      {!loading && ids.length === 0 && (
        <div className="no-results">
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📚</div>
          <h3>No saved books yet</h3>
          <p>Start exploring and save books you love to build your personal library!</p>
        </div>
      )}
      
      {books.length > 0 && (
        <div className="books-grid">
          {books.map(b => <BookCard key={b.id} book={b} />)}
        </div>
      )}
    </div>
  )
}

export default Favourites
