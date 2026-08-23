import React, { createContext, useContext, useState } from 'react';
import { AdminUser } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  admin: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'annapurna_admin_token';
const USER_KEY = 'annapurna_admin_user';

const DEFAULT_ADMIN: AdminUser = {
  id: 'admin-bande-omkar-1',
  name: 'Bande Omkar (Admin)',
  email: 'admin@annapurnaaahaar.in',
  role: 'ADMIN',
};
const DEFAULT_TOKEN = 'token_annapurna_omkar_admin_session_auth_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(TOKEN_KEY) || DEFAULT_TOKEN;
  });

  const [admin, setAdmin] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem(USER_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return DEFAULT_ADMIN;
  });

  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.adminLogin({ email, password });
      if (res.success && res.token) {
        setToken(res.token);
        setAdmin(res.admin);
        localStorage.setItem(TOKEN_KEY, res.token);
        localStorage.setItem(USER_KEY, JSON.stringify(res.admin));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        admin: admin || DEFAULT_ADMIN,
        token: token || DEFAULT_TOKEN,
        isAuthenticated: true,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
