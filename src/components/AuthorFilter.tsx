type Props = {
  author: string
  onChange: (author: string) => void
}

const AuthorFilter: React.FC<Props> = ({ author, onChange }) => {
  return (
    <div style={{ maxWidth: 680, marginBottom: 16 }}>
      <input
        className="input"
        aria-label="Filter by author"
        placeholder="Filter by author (optional)…"
        value={author}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

export default AuthorFilter
