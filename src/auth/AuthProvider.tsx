import { Auth0Provider } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'

type Props = { children: React.ReactNode }

export default function AuthProvider({ children }: Props) {
  const navigate = useNavigate()

  const domain = import.meta.env.VITE_AUTH0_DOMAIN!
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID!
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE!

  const onRedirectCallback = (appState?: { returnTo?: string }) => {
    navigate(appState?.returnTo || window.location.pathname)
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience,
      }}
      onRedirectCallback={onRedirectCallback}
      cacheLocation="memory"
      useRefreshTokens={true}
    >
      {children}
    </Auth0Provider>
  )
}
