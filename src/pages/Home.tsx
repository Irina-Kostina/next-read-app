import { useEffect, useState } from 'react'
import SearchBar from '../components/SearchBar'
import AuthorFilter from '../components/AuthorFilter'
import { fetchBooks } from '../services/bookService'
import BookCard from '../components/BookCard'
import type { Book } from '../types/book'

const PAGE_SIZE = 20

const Home: React.FC = () => {
  const [query, setQuery] = useState('Harry Potter')
  const [author, setAuthor] = useState('')
  const [books, setBooks] = useState<Book[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runSearch = async (q: string, p = 0, a = author) => {
    setLoading(true)
    setError(null)
    try {
      const { items, total } = await fetchBooks(q, {
        inTitle: true,
        author: a || undefined,
        startIndex: p * PAGE_SIZE,
        maxResults: PAGE_SIZE,
      })
      setBooks(items)
      setTotal(total)
      setPage(p)
      setQuery(q)
    } catch (e) {
      setBooks([])
      setTotal(0)
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    runSearch(query, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    runSearch(query, 0, author)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [author])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div>
      <h2>Find your next read</h2>

      <SearchBar onSearch={(q) => runSearch(q, 0)} initialQuery={query} debounceMs={500} />
      <AuthorFilter author={author} onChange={setAuthor} />

      {loading && <p>Loading…</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {!loading && !error && books.length === 0 && <p>No results.</p>}

      <div className="grid">
        {books.map((b) => <BookCard key={b.id} book={b} />)}
      </div>

      {totalPages > 1 && (
        <div className="row" style={{ marginTop: 16 }}>
          <button className="btn" disabled={page === 0 || loading} onClick={() => runSearch(query, page - 1)}>← Prev</button>
          <span style={{ padding: '0 .5rem' }}>Page {page + 1} / {totalPages}</span>
          <button className="btn" disabled={page + 1 >= totalPages || loading} onClick={() => runSearch(query, page + 1)}>Next →</button>
        </div>
      )}
    </div>
  )
}

export default Home
