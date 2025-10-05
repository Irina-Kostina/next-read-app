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
    <form onSubmit={handleSubmit} className="search-form">
      <input
        aria-label="Search books"
        placeholder="Search books or authors…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="search-input"
      />
      <button type="submit" className="search-btn">
        Search
      </button>
    </form>
  )
}

export default SearchBar
