import { useState } from 'react'

type Props = {
  onSearch: (q: string) => void
  initialQuery?: string
}

const SearchBar: React.FC<Props> = ({ onSearch, initialQuery = '' }) => {
  const [value, setValue] = useState(initialQuery)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = value.trim()
    if (q) onSearch(q)
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', maxWidth: 640 }}>
      <input
        aria-label="Search books"
        placeholder="Search books or authors…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={{ flex: 1, padding: '0.6rem 0.8rem', border: '1px solid #ccc', borderRadius: 6 }}
      />
      <button type="submit" style={{ padding: '0.6rem 1rem', borderRadius: 6, border: '1px solid #ccc', cursor: 'pointer' }}>
        Search
      </button>
    </form>
  )
}

export default SearchBar
