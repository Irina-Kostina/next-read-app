import { createContext, useContext } from "react"

type UserPreferences = {
  lastReadBook: string
  favouriteGenres: string[]
}

export const UserPreferencesContext = createContext<UserPreferences>({
  lastReadBook: "The Hobbit",
  favouriteGenres: ["Fantasy", "Adventure"]
})

export const useUserPreferences = () => useContext(UserPreferencesContext)
