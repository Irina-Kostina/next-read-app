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
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, marginBottom: 16, maxWidth: 680 }}>
      <input
        aria-label="Search books"
        placeholder="Search books or authors…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={{ 
          flex: 1, 
          padding: '0.6rem 0.8rem', 
          border: '1px solid #ccc', 
          borderRadius: 6,
          fontSize: '1rem'
        }}
      />
      <button 
        type="submit" 
        className="btn btn-primary"
        style={{ 
          padding: '0.6rem 1.5rem', 
          fontSize: '1rem',
          fontWeight: '500'
        }}
      >
        🔍 Search
      </button>
    </form>
  )
}

export default SearchBar
