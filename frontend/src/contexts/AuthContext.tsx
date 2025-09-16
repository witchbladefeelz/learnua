import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authAPI } from '../services/api';
import { useTheme } from './ThemeContext';
import { ThemePreference, User as AppUser } from '../types';

type User = AppUser;

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const { setTheme } = useTheme();

  const getStoredTheme = (userId?: string): ThemePreference | null => {
    if (typeof window === 'undefined') {
      return null;
    }
    if (userId) {
      const userTheme = window.localStorage.getItem(`theme-${userId}`) as ThemePreference | null;
      if (userTheme) {
        return userTheme;
      }
    }
    return window.localStorage.getItem('theme-preference') as ThemePreference | null;
  };

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        try {
          // Verify token and get user profile
          const response: any = await authAPI.getProfile();
          setUser(response.user);
          const storedTheme = getStoredTheme(response.user?.id);
          if (storedTheme) {
            setTheme(storedTheme);
          }
          setToken(savedToken);
        } catch (error) {
          // Token is invalid
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      } else {
        const storedTheme = getStoredTheme();
        if (storedTheme) {
          setTheme(storedTheme);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [setTheme]);

  const login = async (email: string, password: string) => {
    try {
      const response: any = await authAPI.login({ email, password });
      const { access_token, user: userData } = response;
      
      localStorage.setItem('token', access_token);
      setToken(access_token);
      setUser(userData);
      const storedTheme = getStoredTheme(userData?.id);
      if (storedTheme) {
        setTheme(storedTheme);
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (email: string, password: string, name?: string) => {
    try {
      const response: any = await authAPI.register({ email, password, name });
      const { access_token, user: userData } = response;
      
      localStorage.setItem('token', access_token);
      setToken(access_token);
      setUser(userData);
      const storedTheme = getStoredTheme(userData?.id);
      if (storedTheme) {
        setTheme(storedTheme);
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...userData };
      if (userData.theme) {
        setTheme(userData.theme as ThemePreference);
      }
      return updated;
    });
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
