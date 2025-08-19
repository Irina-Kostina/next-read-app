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
    <div>
      <p><Link to="/">← Back</Link></p>
      <h1>{v.title}</h1>
      {v.authors && <p><strong>Author:</strong> {v.authors.join(', ')}</p>}
      {v.publishedDate && <p><strong>Published:</strong> {v.publishedDate}</p>}
      {v.categories && <p><strong>Genres:</strong> {v.categories.join(', ')}</p>}
      {v.imageLinks?.thumbnail && <img src={v.imageLinks.thumbnail} alt={v.title} style={{ borderRadius: 8 }} />}
      {v.description && <p style={{ marginTop: '1rem', lineHeight: 1.6 }}>{v.description}</p>}

      {similar.length > 0 && (
        <>
          <h3 style={{ marginTop: 24 }}>More like this</h3>
          <div className="grid">
            {similar.map((b) => <BookCard key={b.id} book={b} />)}
          </div>
        </>
      )}
    </div>
  )
}

export default BookPage
