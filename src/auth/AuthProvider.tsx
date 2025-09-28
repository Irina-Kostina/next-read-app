import { Auth0Provider } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'
import React from 'react'

type Props = { children: React.ReactNode }

export default function AuthProvider({ children }: Props) {
  const navigate = useNavigate()

  // Load environment variables
  const domain = import.meta.env.VITE_AUTH0_DOMAIN || ''
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID || ''

  // Debug log to confirm env vars
  console.log('Auth0 config:', { domain, clientId })

  const onRedirectCallback = (appState?: { returnTo?: string }) => {
    navigate(appState?.returnTo || window.location.pathname)
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        // Removed audience for now (only add if you create an API in Auth0)
      }}
      onRedirectCallback={onRedirectCallback}
      cacheLocation="memory"
      useRefreshTokens={true}
    >
      {children}
    </Auth0Provider>
  )
}
