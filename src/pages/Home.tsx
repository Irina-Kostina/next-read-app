import { useEffect, useState, useCallback, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import AuthorFilter from '../components/AuthorFilter'
import { fetchBooks } from '../services/bookService'
import BookCard from '../components/BookCard'
import type { Book } from '../types/book'

const PAGE_SIZE = 10

const Home: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  // Start blank if no params
  const [query, setQuery] = useState(() => searchParams.get('q') ?? '')
  const [author, setAuthor] = useState(() => searchParams.get('author') ?? '')
  const [lang, setLang] = useState(() => searchParams.get('lang') ?? '')
  const [genre, setGenre] = useState(() => searchParams.get('genre') ?? '')
  const [minRating, setMinRating] = useState<number>(() => Number(searchParams.get('rating') ?? 0))
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
  const [showAdvanced, setShowAdvanced] = useState(false)
  
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
      // Client-side filtering: languages, genres, rating
      const languageSet = new Set(l ? [l] : [])
      const genreSet = new Set(genre ? [genre] : [])
      const filtered = items.filter(b => {
        const v = b.volumeInfo
        const langOk = languageSet.size === 0 || (v.language && languageSet.has(v.language))
        const genreOk = genreSet.size === 0 || (v.categories?.some(c => Array.from(genreSet).some(g => c.toLowerCase().includes(g.toLowerCase()))) ?? false)
        const ratingOk = (v.averageRating ?? 0) >= (minRating || 0)
        return langOk && genreOk && ratingOk
      })

      if (append) {
        setBooks(prev => [...prev, ...filtered])
      } else {
        setBooks(filtered)
      }
      
      setTotal(total)
      setPage(p)
      setQuery(q)
      setHasSearched(true)
      // Limit UI to a single batch of up to 10 books
      setHasMore(false)
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
  }, [author, lang, sort, fictionOnly, exactAuthor, genre, minRating])

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

  useEffect(() => {
    const params: Record<string, string> = {}

    if (query) params.q = query
    if (page > 0) params.page = String(page)
    if (sort !== 'relevance') params.sort = sort
    if (author) params.author = author
    if (lang) params.lang = lang
    if (genre) params.genre = genre
    if (minRating > 0) params.rating = String(minRating)
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

        <button className="advanced-toggle" onClick={() => setShowAdvanced(v => !v)}>
          <span>{showAdvanced ? '▲' : '▼'}</span>
          <span>{showAdvanced ? 'Hide advanced filters' : 'Advanced filters'}</span>
        </button>

        {showAdvanced && (
        <div className="advanced-content">
          <AuthorFilter author={author} onChange={setAuthor} />

          <div className="filters-2col">
          <div className="filters-col">
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
          </div>

          <div className="filters-col">
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
            <span className="filter-label">📚 Genre</span>
            <select className="filter-select" value={genre} onChange={(e) => setGenre(e.target.value)}>
              <option value="">Any genre</option>
              <option value="fiction">Fiction</option>
              <option value="fantasy">Fantasy</option>
              <option value="romance">Romance</option>
              <option value="self-help">Self-Help</option>
              <option value="history">History</option>
              <option value="biography">Biography</option>
              <option value="science">Science</option>
              <option value="technology">Technology</option>
              <option value="mystery">Mystery</option>
              <option value="thriller">Thriller</option>
              <option value="young adult">Young Adult</option>
            </select>
            </div>

            <div className="filter-group">
            <span className="filter-label">⭐ Rating above</span>
            <select className="filter-select" value={minRating} onChange={(e) => setMinRating(Number(e.target.value))}>
              {[0,1,2,3,4].map(r => (
                <option key={r} value={r}>{r}+</option>
              ))}
            </select>
            </div>
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
        )}
      </div>

      {loading && <div className="loading">Loading…</div>}
      {error && <div className="error">Error: {error}</div>}
      {!loading && !error && hasSearched && books.length === 0 && <div className="no-results">No results found.</div>}

      {hasSearched && books.length > 0 && (
        <div className="text-center mb-3" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Showing {books.length} results
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
