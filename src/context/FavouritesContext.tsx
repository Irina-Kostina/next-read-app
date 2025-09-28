import { createContext, useContext, useEffect, useRef, useState } from "react"
import { useAuth0 } from "@auth0/auth0-react"

type Ctx = {
  ids: string[]
  has: (id: string) => boolean
  toggle: (id: string) => void
}

const FavouritesContext = createContext<Ctx | undefined>(undefined)
const KEY = "nextread:favourites"

export const FavouritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loginWithRedirect } = useAuth0()
  const [ids, setIds] = useState<string[]>([])
  const hydrated = useRef(false)

  // 1) Load favourites from localStorage on mount (only if logged in)
  useEffect(() => {
    if (!isAuthenticated) {
      setIds([]) // reset if logged out
      return
    }

    const raw = localStorage.getItem(KEY)
    if (raw) setIds(JSON.parse(raw))
    hydrated.current = true
  }, [isAuthenticated])

  // 2) Save favourites to localStorage (only if logged in)
  useEffect(() => {
    if (!hydrated.current || !isAuthenticated) return
    localStorage.setItem(KEY, JSON.stringify(ids))
  }, [ids, isAuthenticated])

  // 3) Toggle favourites (ask login if user not authenticated)
  const toggle = (id: string) => {
    if (!isAuthenticated) {
      loginWithRedirect()
      return
    }
    setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const has = (id: string) => ids.includes(id)

  return (
    <FavouritesContext.Provider value={{ ids, has, toggle }}>
      {children}
    </FavouritesContext.Provider>
  )
}

export function useFavourites() {
  const ctx = useContext(FavouritesContext)
  if (!ctx) throw new Error("useFavourites must be used within <FavouritesProvider>")
  return ctx
}
