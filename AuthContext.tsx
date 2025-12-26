/// <reference types="vite/client" />
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Employee, UserRole } from './types';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://neoback-end.vercel.app/api';

interface AuthState {
  isLoggedIn: boolean;
  user: Employee | null;
  token: string | null;
  entitlements: Record<string, any> | null;
  plan: any | null;
  login: (token: string, user: Employee) => void;
  logout: () => void;
  refreshEntitlements: () => Promise<void>;
  isInitializing: boolean;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<Employee | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [entitlements, setEntitlements] = useState<Record<string, any> | null>(null);
  const [plan, setPlan] = useState<any | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const logout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('currentUser');
    setToken(null);
    setUser(null);
    setEntitlements(null);
    setPlan(null);
    setIsLoggedIn(false);
  };

  const fetchEntitlements = async (authToken: string) => {
    try {
      const entRes = await fetch(`${API_BASE_URL}/tenant/entitlements`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (entRes.ok) {
        const entData = await entRes.json();
        setEntitlements(entData.features);
        setPlan(entData.plan);
      }
    } catch (e) { console.error("Failed to fetch entitlements", e); }
  };

  const login = (newToken: string, newUser: Employee) => {
    localStorage.setItem('jwtToken', newToken);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    setIsLoggedIn(true);
    if (newUser.role !== UserRole.SuperAdmin) {
      fetchEntitlements(newToken);
    }
  };

  const refreshEntitlements = async () => {
    if (token) await fetchEntitlements(token);
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

          if (userData.role !== 'SuperAdmin') {
            await fetchEntitlements(storedToken);
          }
        } else {
          logout();
        }
      } catch (error) {
        console.error("Session verification failed:", error);
        logout();
      } finally {
        setIsInitializing(false);
      }
    };

    verifySession();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, token, entitlements, plan, login, logout, refreshEntitlements, isInitializing }}>
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
