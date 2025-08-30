import { createContext, useContext, useEffect, useRef, useState } from 'react'

type Ctx = {
  ids: string[]
  has: (id: string) => boolean
  toggle: (id: string) => void
}

const FavouritesContext = createContext<Ctx | undefined>(undefined)
const KEY = 'nextread:favourites'

export const FavouritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ids, setIds] = useState<string[]>([])
  const hydrated = useRef(false)

  // 1) Read once on mount
  useEffect(() => {
    const raw = localStorage.getItem(KEY)
    if (raw) setIds(JSON.parse(raw))
    hydrated.current = true
  }, [])

  // 2) Write only AFTER we’ve read (avoid clobbering with [])
  useEffect(() => {
    if (!hydrated.current) return
    localStorage.setItem(KEY, JSON.stringify(ids))
  }, [ids])

  const toggle = (id: string) =>
    setIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]))

  const has = (id: string) => ids.includes(id)

  return (
    <FavouritesContext.Provider value={{ ids, has, toggle }}>
      {children}
    </FavouritesContext.Provider>
  )
}

export function useFavourites() {
  const ctx = useContext(FavouritesContext)
  if (!ctx) throw new Error('useFavourites must be used within <FavouritesProvider>')
  return ctx
}
