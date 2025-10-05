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
    <div className="main-content">
      {!hasSearched && (
        <div className="page-header">
          <div className="btn btn-primary mb-3">
            ✨ AI-POWERED DISCOVERY
          </div>
          <h1 className="page-title">Find Your Perfect Book Match</h1>
          <p className="page-subtitle">
            Discover amazing books tailored to your taste with our intelligent recommendation system
          </p>
        </div>
      )}

      <div className="search-section">
        <h2 className="search-title">What would you like to read?</h2>
        <SearchBar onSearch={(q) => runSearch(q, 0)} initialQuery={query} />
        <AuthorFilter author={author} onChange={setAuthor} />

        <div className="filters-grid">
          <div className="filter-group">
            <span className="filter-label">Content Type</span>
            <div className="filter-checkbox">
              <input
                type="checkbox"
                id="fiction"
                checked={fictionOnly}
                onChange={(e) => setFictionOnly(e.target.checked)}
              />
              <label htmlFor="fiction">Fiction Only</label>
            </div>
          </div>

          <div className="filter-group">
            <span className="filter-label">Author Match</span>
            <div className="filter-checkbox">
              <input
                type="checkbox"
                id="exact"
                checked={exactAuthor}
                onChange={(e) => setExactAuthor(e.target.checked)}
              />
              <label htmlFor="exact">Exact Author</label>
            </div>
          </div>

          <div className="filter-group">
            <span className="filter-label">Language</span>
            <select className="filter-select" value={lang} onChange={(e) => setLang(e.target.value)}>
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
          </div>

          <div className="filter-group">
            <span className="filter-label">Sort By</span>
            <select
              className="filter-select"
              value={sort}
              onChange={(e) => setSort(e.target.value as 'relevance' | 'newest')}
            >
              <option value="relevance">Relevance</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>
      </div>

      {loading && <div className="loading">Loading…</div>}
      {error && <div className="error">Error: {error}</div>}
      {!loading && !error && hasSearched && books.length === 0 && <div className="no-results">No results found.</div>}

      {hasSearched && books.length > 0 && (
        <div className="text-center mb-3" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Showing {books.length} of {total} results
        </div>
      )}

      {books.length > 0 && (
        <div className="books-grid">
          {books.map((b) => (
            <BookCard key={b.id} book={b} />
          ))}
        </div>
      )}

      {/* Infinite scroll trigger */}
      {hasMore && (
        <div ref={loadMoreRef} style={{ height: '20px', margin: '2rem 0' }}>
          {loadingMore && (
            <div className="loading">
              Loading more books...
            </div>
          )}
        </div>
      )}

      {!hasMore && books.length > 0 && (
        <div className="text-center mt-4" style={{ color: 'var(--text-secondary)' }}>
          You've reached the end of the results
        </div>
      )}
    </div>
  )
}

export default Home
