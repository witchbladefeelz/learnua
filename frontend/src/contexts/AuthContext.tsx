import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authAPI } from '../services/api';
import { User as AppUser, UserRole } from '../types';

type User = AppUser;

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<string | null>;
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
  const DEFAULT_AVATAR = 'https://cdn.jsdelivr.net/gh/identicons/jasonlong/png/128/default.png';

  const normalizeUser = (userData: Partial<User> | null): User | null => {
    if (!userData) return null;
    return {
      ...userData,
      emailVerified: Boolean(userData.emailVerified),
      role: (userData.role as UserRole) || UserRole.USER,
      avatar: userData.avatar || DEFAULT_AVATAR,
      name: userData.name || userData.email || '',
    } as User;
  };

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        try {
          const response = await authAPI.getProfile();
          setUser(normalizeUser(response.user));
          setToken(savedToken);
        } catch (error) {
          // Token is invalid
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      } else {
        setToken(null);
        setUser(null);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password }) as any;
      const { access_token, user: userData } = response;
      
      localStorage.setItem('token', access_token);
      setToken(access_token);
      setUser(normalizeUser(userData));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (email: string, password: string, name?: string) => {
    try {
      const response = await authAPI.register({ email, password, name });

      if ('access_token' in response) {
        localStorage.setItem('token', response.access_token);
        setToken(response.access_token);
        setUser(normalizeUser(response.user));
        return null;
      }

      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      return response.message;
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
      const updated = normalizeUser({ ...prev, ...userData });
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
