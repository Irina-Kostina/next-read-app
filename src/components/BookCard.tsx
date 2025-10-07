import { Link } from 'react-router-dom'
import type { Book } from '../types/book'
import { useFavourites } from '../context/FavouritesContext'

type Props = { book: Book }

const BookCard: React.FC<Props> = ({ book }) => {
  const v = book.volumeInfo
  const thumb = v.imageLinks?.thumbnail
  const { has, toggle } = useFavourites()

  // Helper function to truncate description
  const truncateDescription = (description: string, maxLength: number = 150) => {
    if (description.length <= maxLength) return description
    return description.substring(0, maxLength).trim() + '...'
  }

  // Helper function to format published date
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Unknown'
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short'
      })
    } catch {
      return dateStr
    }
  }

  // Helper function to render star rating
  const renderRating = (rating?: number, count?: number) => {
    if (!rating) return null
    
    const stars = Math.round(rating)
    const starElements = Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < stars ? '#fbbf24' : '#d1d5db' }}>
        ★
      </span>
    ))
    
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.9rem' }}>
        <span>{starElements}</span>
        <span style={{ color: '#6b7280' }}>
          {rating.toFixed(1)} ({count ? `${count} reviews` : 'No reviews'})
        </span>
      </div>
    )
  }

  return (
    <div className="book-card">
      {/* Cover Image */}
      <div className="book-cover">
        {thumb ? (
          <img 
            src={thumb} 
            alt={`${v.title} cover`}
            className="cover-image"
          />
        ) : (
          <div className="cover-placeholder">
            <span>📖</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="book-content">
        {/* Title and Author */}
        <h3 className="book-title">
          <Link to={`/book/${book.id}`}>{v.title}</Link>
        </h3>
        {v.authors && (
          <p className="book-author">by {v.authors.join(', ')}</p>
        )}

        {/* Description */}
        {v.description && (
          <p className="book-description">
            {truncateDescription(v.description)}
          </p>
        )}

        {/* Rating */}
        {renderRating(v.averageRating, v.ratingsCount)}

        {/* Metadata */}
        <div className="book-metadata">
          {v.publishedDate && (
            <span className="metadata-item">
              📅 {formatDate(v.publishedDate)}
            </span>
          )}
          {v.categories && v.categories.length > 0 && (
            <span className="metadata-item">
              🏷️ {v.categories.slice(0, 2).join(', ')}
              {v.categories.length > 2 && ` +${v.categories.length - 2} more`}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="book-actions">
          <button 
            className={`favourite-btn ${has(book.id) ? 'favourited' : ''}`}
            onClick={() => toggle(book.id)}
            title={has(book.id) ? 'Remove from favourites' : 'Add to favourites'}
          >
            {has(book.id) ? '❤️' : '🤍'}
          </button>
          
          {v.previewLink && (
            <a 
              href={v.previewLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="preview-btn"
            >
              Preview
            </a>
          )}
          
          <Link to={`/book/${book.id}`} className="details-btn">
            Details
          </Link>
        </div>
      </div>
    </div>
  )
}

export default BookCard

