import type { Book } from '../types/book'

type FetchOpts = {
  inTitle?: boolean      // narrows to title matches
  author?: string        // optional author filter
  maxResults?: number
}

export async function fetchBooks(query: string, opts: FetchOpts = {}): Promise<Book[]> {
  const { inTitle = false, author, maxResults = 20 } = opts

  const parts: string[] = []
  const q = query.trim()
  parts.push(inTitle ? `intitle:${q}` : q)
  if (author) parts.push(`inauthor:${author}`)

  const full = parts.join('+')
  const url =
    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(full)}&printType=books&maxResults=${maxResults}`

  const res = await fetch(url)
  if (!res.ok) throw new Error(`Google Books error: ${res.status}`)
  const data = await res.json()
  return data.items ?? []
}
