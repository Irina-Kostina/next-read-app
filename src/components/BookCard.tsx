import { Link } from 'react-router-dom'
import type { Book } from '../types/book'
import { useFavourites } from '../context/FavouritesContext'

type Props = { book: Book }

const BookCard: React.FC<Props> = ({ book }) => {
  const v = book.volumeInfo
  const thumb = v.imageLinks?.thumbnail
  const { has, toggle } = useFavourites()

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>
        <Link to={`/book/${book.id}`}>{v.title}</Link>
      </h3>
      {v.authors && <p style={{ margin: 0 }}>by {v.authors.join(', ')}</p>}
      <p style={{ marginTop: 4, color: '#6b7280' }}>Published: {v.publishedDate ?? 'Unknown'}</p>

      {thumb && <img src={thumb} alt={v.title} style={{ width: 150, borderRadius: 6 }} />}

      <div className="row" style={{ marginTop: 8 }}>
        <button className="btn" onClick={() => toggle(book.id)}>
          {has(book.id) ? '★ Saved' : '☆ Save'}
        </button>
      </div>

      {v.categories && (
        <p style={{ marginTop: 8, fontSize: '.9rem' }}>
          <strong>Genres:</strong> {v.categories.join(', ')}
        </p>
      )}
    </div>
  )
}

export default BookCard

