export interface ImageLinks {
  smallThumbnail?: string
  thumbnail?: string
}

export interface VolumeInfo {
  title: string
  authors?: string[]
  publishedDate?: string
  description?: string
  categories?: string[]         // genres
  imageLinks?: ImageLinks
  language?: string
  pageCount?: number
  publisher?: string
  averageRating?: number
  ratingsCount?: number
  previewLink?: string
  infoLink?: string
  canonicalVolumeLink?: string
}

export interface Book {
  id: string
  volumeInfo: VolumeInfo
}
