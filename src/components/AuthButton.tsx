import { useAuth0 } from '@auth0/auth0-react'
import React from 'react'

export const AuthButton: React.FC = () => {
  const { loginWithRedirect, logout, isAuthenticated, user, isLoading } = useAuth0()

  if (isLoading) return <span>Loading...</span>

  if (isAuthenticated && user) {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
        {user.picture && (
          <img
            src={user.picture}
            alt="avatar"
            style={{ width: 32, height: 32, borderRadius: '50%' }}
          />
        )}
        <span style={{ fontSize: '.95em' }}>
          Welcome, {user.name || user.nickname || user.email || 'user'}
        </span>
        <button
          className="btn"
          onClick={() =>
            logout({ logoutParams: { returnTo: window.location.origin } })
          }
          style={{ marginLeft: 8 }}
        >
          Logout
        </button>
      </div>
    )
  }

  return (
    <button
      className="btn"
      onClick={() => loginWithRedirect()}
      style={{ marginLeft: 8 }}
    >
      Login
    </button>
  )
}
