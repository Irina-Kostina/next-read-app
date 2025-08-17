import { useEffect, useState } from 'react'
import SearchBar from '../components/SearchBar'
import { fetchBooks } from '../services/bookService'
import BookCard from '../components/BookCard'
import type { Book } from '../types/book'

const Home: React.FC = () => {
  const [query, setQuery] = useState('Harry Potter')
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runSearch = async (q: string) => {
    setQuery(q)
    setLoading(true)
    setError(null)
    try {
      const items = await fetchBooks(q, { inTitle: true })
      setBooks(items)
    } catch (e) {
      setBooks([])
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // initial search
    runSearch(query)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Find your next read</h2>
      <SearchBar onSearch={runSearch} initialQuery={query} />

      {loading && <p>Loading…</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {!loading && !error && books.length === 0 && <p>No results. Try a different query.</p>}

      <div>
        {books.map((b) => (
          <BookCard key={b.id} book={b} />
        ))}
      </div>
    </div>
  )
}

export default Home
