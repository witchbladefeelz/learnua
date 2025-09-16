import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type Theme = 'LIGHT' | 'DARK';

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'theme-preference';

const getSystemTheme = (): Theme => {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return 'LIGHT';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'DARK' : 'LIGHT';
};

const applyThemeToDocument = (theme: Theme) => {
  const root = document.documentElement;
  if (theme === 'DARK') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') {
      return 'LIGHT';
    }
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    return stored || getSystemTheme();
  });

  useEffect(() => {
    applyThemeToDocument(theme);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  }, [theme]);

  const setTheme = useCallback((nextTheme: Theme) => {
    setThemeState(nextTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState(prev => (prev === 'DARK' ? 'LIGHT' : 'DARK'));
  }, []);

  const value = useMemo<ThemeContextType>(() => ({ theme, toggleTheme, setTheme }), [theme, toggleTheme, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export type { Theme };
