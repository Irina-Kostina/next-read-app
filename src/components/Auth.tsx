import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

// Auth context type
type AuthContextType = {
  user: string | null;
  login: (username: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);

  const login = (username: string) => {
    setUser(username);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}

// Optional: AuthButton for login/logout UI
export const AuthButton: React.FC = () => {
  const { loginWithRedirect, logout, isAuthenticated, user, isLoading } = useAuth0();

  if (isLoading) return <span>Loading...</span>;

  if (isAuthenticated && user) {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: '.95em' }}>Welcome, {user.name || user.email}</span>
        <button
          className="btn"
          onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
          style={{ marginLeft: 8 }}
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <button className="btn" onClick={() => loginWithRedirect()} style={{ marginLeft: 8 }}>
      Login
    </button>
  );
};
