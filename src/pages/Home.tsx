import { useEffect, useState, useCallback, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import AuthorFilter from '../components/AuthorFilter'
import { fetchBooks } from '../services/bookService'
import BookCard from '../components/BookCard'
import type { Book } from '../types/book'

const PAGE_SIZE = 20

const Home: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  // Start blank if no params
  const [query, setQuery] = useState(() => searchParams.get('q') ?? '')
  const [author, setAuthor] = useState(() => searchParams.get('author') ?? '')
  const [lang, setLang] = useState(() => searchParams.get('lang') ?? '')
  const [sort, setSort] = useState<'relevance' | 'newest'>(
    () => (searchParams.get('sort') as 'relevance' | 'newest') ?? 'relevance'
  )

  const [fictionOnly, setFictionOnly] = useState(() => searchParams.get('fiction') === '1')
  const [exactAuthor, setExactAuthor] = useState(() => searchParams.get('exact') === '1')

  const [books, setBooks] = useState<Book[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(() => Number(searchParams.get('page') ?? 0))
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false) // Track if user searched
  const [hasMore, setHasMore] = useState(true)
  
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  const runSearch = async (
    q: string,
    p = 0,
    a = author,
    l = lang,
    s: 'relevance' | 'newest' = sort,
    f = fictionOnly,
    e = exactAuthor,
    append = false
  ) => {
    if (!q) return // skip blank searches
    
    if (append) {
      setLoadingMore(true)
    } else {
      setLoading(true)
      setBooks([])
    }
    setError(null)
    
    try {
      const { items, total } = await fetchBooks(q, {
        inTitle: true,
        author: a || undefined,
        subject: f ? 'fiction' : undefined,
        startIndex: p * PAGE_SIZE,
        maxResults: PAGE_SIZE,
        langRestrict: l || undefined,
        orderBy: s,
        exactAuthor: e,
      })
      
      if (append) {
        setBooks(prev => [...prev, ...items])
      } else {
        setBooks(items)
      }
      
      setTotal(total)
      setPage(p)
      setQuery(q)
      setHasSearched(true)
      setHasMore(items.length === PAGE_SIZE && (p + 1) * PAGE_SIZE < total)
    } catch (e) {
      if (!append) {
        setBooks([])
        setTotal(0)
      }
      setError((e as Error).message)
      setHasSearched(true)
      setHasMore(false)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  // Load from URL if there's a query
  useEffect(() => {
    if (query) {
      runSearch(query, page)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // When filters change, re-run search (if already searched)
  useEffect(() => {
    if (query) {
      runSearch(query, 0, author, lang, sort, fictionOnly, exactAuthor)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [author, lang, sort, fictionOnly, exactAuthor])

  // Load more books when user scrolls to bottom
  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore && query) {
      runSearch(query, page + 1, author, lang, sort, fictionOnly, exactAuthor, true)
    }
  }, [loadingMore, hasMore, query, page, author, lang, sort, fictionOnly, exactAuthor])

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect()
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )
    
    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current)
    }
    
    return () => {
      if (observerRef.current) observerRef.current.disconnect()
    }
  }, [loadMore, hasMore, loadingMore])

  // ✅ Clean URL: only meaningful params
  useEffect(() => {
    const params: Record<string, string> = {}

    if (query) params.q = query
    if (page > 0) params.page = String(page)
    if (sort !== 'relevance') params.sort = sort
    if (author) params.author = author
    if (lang) params.lang = lang
    if (fictionOnly) params.fiction = '1'
    if (exactAuthor) params.exact = '1'

    setSearchParams(params, { replace: true })
  }, [query, author, lang, sort, fictionOnly, exactAuthor, page, setSearchParams])

  return (
    <div>
      <h2>Find your next read</h2>

      <SearchBar onSearch={(q) => runSearch(q, 0)} initialQuery={query} />
      <AuthorFilter author={author} onChange={setAuthor} />

      <div className="row" style={{ gap: 8, maxWidth: 680, marginBottom: 12, flexWrap: 'wrap' }}>
        <label className="row" style={{ gap: 6 }}>
          <input
            type="checkbox"
            checked={fictionOnly}
            onChange={(e) => setFictionOnly(e.target.checked)}
          />
          Fiction only
        </label>
        <label className="row" style={{ gap: 6 }}>
          <input
            type="checkbox"
            checked={exactAuthor}
            onChange={(e) => setExactAuthor(e.target.checked)}
          />
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

        <select
          className="input"
          value={sort}
          onChange={(e) => setSort(e.target.value as 'relevance' | 'newest')}
        >
          <option value="relevance">Sort: Relevance</option>
          <option value="newest">Sort: Newest</option>
        </select>
      </div>

      {loading && <p>Loading…</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {!loading && !error && hasSearched && books.length === 0 && <p>No results.</p>}

      {hasSearched && books.length > 0 && (
        <div style={{ marginBottom: '1rem', color: '#6b7280', fontSize: '0.9rem' }}>
          Showing {books.length} of {total} results
        </div>
      )}

      <div className="grid">
        {books.map((b) => (
          <BookCard key={b.id} book={b} />
        ))}
      </div>

      {/* Infinite scroll trigger */}
      {hasMore && (
        <div ref={loadMoreRef} style={{ height: '20px', margin: '2rem 0' }}>
          {loadingMore && (
            <div style={{ textAlign: 'center', color: '#6b7280' }}>
              Loading more books...
            </div>
          )}
        </div>
      )}

      {!hasMore && books.length > 0 && (
        <div style={{ textAlign: 'center', color: '#6b7280', margin: '2rem 0' }}>
          You've reached the end of the results
        </div>
      )}
    </div>
  )
}

export default Home
