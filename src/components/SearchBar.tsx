import { useEffect, useRef, useState } from 'react'

type Props = {
  onSearch: (q: string) => void
  initialQuery?: string
  debounceMs?: number
}

const SearchBar: React.FC<Props> = ({ onSearch, initialQuery = '', debounceMs = 500 }) => {
  const [value, setValue] = useState(initialQuery)

  // Keep the latest onSearch without putting it in the effect deps
  const onSearchRef = useRef(onSearch)
  useEffect(() => {
    onSearchRef.current = onSearch
  }, [onSearch])

  // Debounce only on value change (not on onSearch identity change)
  useEffect(() => {
    if (!debounceMs) return
    const id = setTimeout(() => {
      const q = value.trim()
      if (q) onSearchRef.current(q)
    }, debounceMs)
    return () => clearTimeout(id)
  }, [value, debounceMs]) // ← intentionally not including onSearch

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = value.trim()
    if (q) onSearchRef.current(q)
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, marginBottom: 16, maxWidth: 680 }}>
      <input
        aria-label="Search books"
        placeholder="Search books or authors…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={{ flex: 1, padding: '0.6rem 0.8rem', border: '1px solid #ccc', borderRadius: 6 }}
      />
      <button type="submit" style={{ padding: '0.6rem 1rem', borderRadius: 6, border: '1px solid #ccc' }}>
        Search
      </button>
    </form>
  )
}

export default SearchBar
