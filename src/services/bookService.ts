import type { Book } from '../types/book'

type FetchOpts = {
  inTitle?: boolean
  author?: string
  subject?: string
  maxResults?: number
  startIndex?: number
}

export type SearchResult = { items: Book[]; total: number }

export async function fetchBooks(query: string, opts: FetchOpts = {}): Promise<SearchResult> {
  const { inTitle = true, author, subject, maxResults = 20, startIndex = 0 } = opts

  const parts: string[] = []
  const q = query.trim()
  if (q) parts.push(inTitle ? `intitle:${q}` : q)
  if (author) parts.push(`inauthor:${author}`)
  if (subject) parts.push(`subject:${subject}`)
  if (parts.length === 0) throw new Error('Empty query')

  const url =
    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(parts.join('+'))}` +
    `&printType=books&maxResults=${maxResults}&startIndex=${startIndex}`

  const res = await fetch(url)
  if (!res.ok) throw new Error(`Google Books error: ${res.status}`)
  const data = await res.json()
  return { items: data.items ?? [], total: data.totalItems ?? 0 }
}

export async function fetchBookById(id: string): Promise<Book> {
  const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}`)
  if (!res.ok) throw new Error(`Failed to fetch book ${id}`)
  return await res.json()
}
