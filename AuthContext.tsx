import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Employee, UserRole } from './types';

export const API_BASE_URL = 'https://neoback-end.vercel.app/api';

interface AuthState {
  isLoggedIn: boolean;
  user: Employee | null;
  token: string | null;
  login: (token: string, user: Employee) => void;
  logout: () => void;
  isInitializing: boolean;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<Employee | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const logout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('currentUser');
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);
  };

  const login = (newToken: string, newUser: Employee) => {
    localStorage.setItem('jwtToken', newToken);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    setIsLoggedIn(true);
  };

  useEffect(() => {
    const verifySession = async () => {
      const storedToken = localStorage.getItem('jwtToken');
      if (!storedToken) {
        setIsInitializing(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${storedToken}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setToken(storedToken);
          setUser(userData);
          setIsLoggedIn(true);
        } else {
          logout();
        }
      } catch (error) {
        console.error("Session verification failed:", error);
        // On network error, we might want to keep the local state if offline, 
        // but for a strict "proper login" we logout if the server is unreachable.
        logout();
      } finally {
        setIsInitializing(false);
      }
    };

    verifySession();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, token, login, logout, isInitializing }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
