import type { Book } from '../types/book'

/**
 * Get recommended books from a list based on last read and favourite genres
 */
export function getRecommendedBooksFromList(
  books: Book[],
  lastReadTitle: string,
  favouriteGenres: string[]
): Book[] {
  return books.filter(book => {
    // Exclude the last read book
    if (book.volumeInfo.title === lastReadTitle) return false

    // Check if book has matching categories (Google Books genre field)
    const categories = book.volumeInfo.categories || []
    const hasMatchingGenre = categories.some(cat =>
      favouriteGenres.includes(cat)
    )

    return hasMatchingGenre
  })
}


type FetchOpts = {
  inTitle?: boolean
  author?: string
  subject?: string
  maxResults?: number
  startIndex?: number
  langRestrict?: string
  orderBy?: 'relevance' | 'newest'
  exactAuthor?: boolean
}

export type SearchResult = { items: Book[]; total: number }

export async function fetchBooks(query: string, opts: FetchOpts = {}): Promise<SearchResult> {
  const { inTitle = true, author, subject, maxResults = 20, startIndex = 0, langRestrict, orderBy, exactAuthor = false, } = opts

  const parts: string[] = []
  const q = query.trim()
  if (q) parts.push(inTitle ? `intitle:${q}` : q)
  if (author) {
    const a = exactAuthor ? `"${author}"` : author
    parts.push(`inauthor:${a}`)
  }
  if (subject) parts.push(`subject:${subject}`)
  if (parts.length === 0) throw new Error('Empty query')


  const params = new URLSearchParams({
    q: parts.join('+'),
    printType: 'books',
    maxResults: String(maxResults),
    startIndex: String(startIndex),
  })
  if (langRestrict) params.set('langRestrict', langRestrict)
  if (orderBy) params.set('orderBy', orderBy)
  
  
  const res = await fetch(`https://www.googleapis.com/books/v1/volumes?${params.toString()}`)
  if (!res.ok) throw new Error(`Google Books error: ${res.status}`)
  const data = await res.json()
  return { items: data.items ?? [], total: data.totalItems ?? 0 }
}

export async function fetchBookById(id: string): Promise<Book> {
  const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}`)
  if (!res.ok) throw new Error(`Failed to fetch book ${id}`)
  return await res.json()
}
