import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Employee, UserRole } from './types';

interface AuthState {
  isLoggedIn: boolean;
  user: Employee | null;
  token: string | null;
  login: (token: string, user: Employee) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<Employee | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true); // Track initial load

  useEffect(() => {
    const storedToken = localStorage.getItem('jwtToken');
    const storedUser = localStorage.getItem('currentUser');
    if (storedToken && storedUser) {
      try {
        const parsedUser: Employee = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Failed to parse stored user data:", error);
        logout();
      }
    }
    setIsInitializing(false);
  }, []);

  const login = (newToken: string, newUser: Employee) => {
    localStorage.setItem('jwtToken', newToken);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('currentUser');
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, token, login, logout }}>
      {isInitializing ? null : children} {/* Don't render children until auth state is checked */}
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