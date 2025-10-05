import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchBookById, fetchBooks } from '../services/bookService'
import type { Book } from '../types/book'
import BookCard from '../components/BookCard'

const BookPage: React.FC = () => {
  const { id } = useParams()
  const [book, setBook] = useState<Book | null>(null)
  const [similar, setSimilar] = useState<Book[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setError(null)
    setBook(null)
    setSimilar([])
    fetchBookById(id).then(setBook).catch(e => setError((e as Error).message))
  }, [id])

  useEffect(() => {
    if (!book) return
    const v = book.volumeInfo
    const mainAuthor = v.authors?.[0]
    const mainCategory = v.categories?.[0]

    const loadSimilar = async () => {
      try {
        if (mainAuthor) {
          const { items } = await fetchBooks('', { inTitle: false, author: mainAuthor, maxResults: 6 })
          setSimilar(items.filter((b) => b.id !== book.id))
          return
        }
        if (mainCategory) {
          const { items } = await fetchBooks('', { inTitle: false, subject: mainCategory, maxResults: 6 })
          setSimilar(items.filter((b) => b.id !== book.id))
        }
      } catch {
        /* no-op */
      }
    }

    loadSimilar()
  }, [book])

  if (error) return <p style={{ color: 'red' }}>{error}</p>
  if (!book) return <p>Loading…</p>

  const v = book.volumeInfo
  return (
    <div className="main-content">
      <div className="card">
        <div className="row mb-3">
          <Link to="/" className="btn btn-secondary">
            ← Back to Search
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '2rem', marginBottom: '2rem' }}>
          {v.imageLinks?.thumbnail && (
            <div>
              <img 
                src={v.imageLinks.thumbnail} 
                alt={v.title} 
                style={{ 
                  width: '100%', 
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-md)'
                }} 
              />
            </div>
          )}
          
          <div>
            <h1 className="page-title" style={{ fontSize: '2rem', marginBottom: '1rem' }}>
              {v.title}
            </h1>
            
            {v.authors && (
              <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                by {v.authors.join(', ')}
              </p>
            )}
            
            <div className="book-metadata">
              {v.publishedDate && (
                <div className="metadata-item">
                  <span>📅</span>
                  <span>Published: {v.publishedDate}</span>
                </div>
              )}
              {v.categories && (
                <div className="metadata-item">
                  <span>🏷️</span>
                  <span>Genres: {v.categories.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {v.description && (
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Description</h3>
            <p style={{ lineHeight: 1.6, color: 'var(--text-secondary)' }}>{v.description}</p>
          </div>
        )}
      </div>

      {similar.length > 0 && (
        <div style={{ marginTop: '3rem' }}>
          <h2 className="page-title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
            More like this
          </h2>
          <div className="books-grid">
            {similar.map((b) => <BookCard key={b.id} book={b} />)}
          </div>
        </div>
      )}
    </div>
  )
}

export default BookPage
