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
    <div>
      <h2>Your favourites ({ids.length})</h2>
      {loading && <p>Loading…</p>}
      {!loading && ids.length === 0 && <p>No saved books yet.</p>}
      <div className="grid">
        {books.map(b => <BookCard key={b.id} book={b} />)}
      </div>
    </div>
  )
}

export default Favourites
