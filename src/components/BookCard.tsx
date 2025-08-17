import type { Book } from '../types/book'

interface BookCardProps {
  book: Book
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const info = book.volumeInfo

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
      <h3>{info.title}</h3>
      {info.authors && <p>by {info.authors.join(', ')}</p>}
      <p>Published: {info.publishedDate || 'Unknown'}</p>
      {info.imageLinks?.thumbnail && (
        <img src={info.imageLinks.thumbnail} alt={info.title} />
      )}
    </div>
  )
}

export default BookCard
