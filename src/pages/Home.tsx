import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import AuthorFilter from '../components/AuthorFilter'
import { fetchBooks } from '../services/bookService'
import BookCard from '../components/BookCard'
import type { Book } from '../types/book'

const PAGE_SIZE = 20

const Home: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const [query, setQuery] = useState(() => searchParams.get('q') ?? 'Harry Potter')
  const [author, setAuthor] = useState(() => searchParams.get('author') ?? '')
  const [lang, setLang] = useState(() => searchParams.get('lang') ?? 'en')
  const [sort, setSort] = useState<'relevance'|'newest'>(() =>
    (searchParams.get('sort') as 'relevance'|'newest') ?? 'relevance'
  )

  // NEW: toggles with URL defaults
  const [fictionOnly, setFictionOnly] = useState(() => searchParams.get('fiction') === '1')
  const [exactAuthor, setExactAuthor] = useState(() => searchParams.get('exact') === '1')

  const [books, setBooks] = useState<Book[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(() => Number(searchParams.get('page') ?? 0))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runSearch = async (
    q: string,
    p = 0,
    a = author,
    l = lang,
    s: 'relevance'|'newest' = sort,
    f = fictionOnly,
    e = exactAuthor
  ) => {
    setLoading(true)
    setError(null)
    try {
      const { items, total } = await fetchBooks(q, {
        inTitle: true,
        author: a || undefined,
        subject: f ? 'fiction' : undefined,       // NEW
        startIndex: p * PAGE_SIZE,
        maxResults: PAGE_SIZE,
        langRestrict: l || undefined,
        orderBy: s,
        exactAuthor: e,                           // NEW
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
    runSearch(query, page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Re-run when any filter changes
  useEffect(() => {
    runSearch(query, 0, author, lang, sort, fictionOnly, exactAuthor)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [author, lang, sort, fictionOnly, exactAuthor])

  // Keep URL shareable
  useEffect(() => {
    const params: Record<string, string> = {
      q: query, page: String(page), sort,
    }
    if (author) params.author = author
    if (lang) params.lang = lang
    if (fictionOnly) params.fiction = '1'
    if (exactAuthor) params.exact = '1'
    setSearchParams(params, { replace: true })
  }, [query, author, lang, sort, fictionOnly, exactAuthor, page, setSearchParams])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div>
      <h2>Find your next read</h2>

      <SearchBar onSearch={(q) => runSearch(q, 0)} initialQuery={query} debounceMs={500} />
      <AuthorFilter author={author} onChange={setAuthor} />

      {/* NEW toggles + existing selects */}
      <div className="row" style={{ gap: 8, maxWidth: 680, marginBottom: 12, flexWrap: 'wrap' }}>
        <label className="row" style={{ gap: 6 }}>
          <input type="checkbox" checked={fictionOnly} onChange={(e) => setFictionOnly(e.target.checked)} />
          Fiction only
        </label>
        <label className="row" style={{ gap: 6 }}>
          <input type="checkbox" checked={exactAuthor} onChange={(e) => setExactAuthor(e.target.checked)} />
          Exact author
        </label>

        <select className="input" value={lang} onChange={(e) => setLang(e.target.value)}>
          <option value="">Any language</option>
          <option value="en">English</option>
          <option value="ru">Russian</option>
          <option value="de">German</option>
          <option value="fr">French</option>
          <option value="es">Spanish</option>
          <option value="it">Italian</option>
          <option value="ja">Japanese</option>
          <option value="zh">Chinese</option>
        </select>

        <select className="input" value={sort} onChange={(e) => setSort(e.target.value as 'relevance'|'newest')}>
          <option value="relevance">Sort: Relevance</option>
          <option value="newest">Sort: Newest</option>
        </select>
      </div>

      {loading && <p>Loading…</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {!loading && !error && books.length === 0 && <p>No results.</p>}

      <div className="grid">
        {books.map((b) => <BookCard key={b.id} book={b} />)}
      </div>

      {totalPages > 1 && (
        <div className="row" style={{ marginTop: 16 }}>
          <button className="btn" disabled={page === 0 || loading} onClick={() => runSearch(query, page - 1)}>
            ← Prev
          </button>
          <span style={{ padding: '0 .5rem' }}>Page {page + 1} / {totalPages}</span>
          <button className="btn" disabled={page + 1 >= totalPages || loading} onClick={() => runSearch(query, page + 1)}>
            Next →
          </button>
        </div>
      )}
    </div>
  )
}

export default Home
