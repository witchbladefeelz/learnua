import React from 'react';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';

import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { ThemePreference } from '../types';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { user, updateUser } = useAuth();

  const handleToggle = async () => {
    const nextTheme: ThemePreference = theme === 'DARK' ? 'LIGHT' : 'DARK';
    setTheme(nextTheme);

    if (!user) {
      window.localStorage.setItem('theme-preference', nextTheme);
      return;
    }

    window.localStorage.setItem(`theme-${user.id}`, nextTheme);
    window.localStorage.setItem('theme-preference', nextTheme);
    updateUser({ theme: nextTheme });
  };

  const isDark = theme === 'DARK';

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      className={`
        flex items-center justify-center w-10 h-10 rounded-full border transition-colors duration-200
        ${isDark ? 'bg-gray-800 border-gray-700 text-yellow-300' : 'bg-white border-gray-200 text-gray-700'}
        hover:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2
        dark:bg-gray-800 dark:border-gray-700 dark:text-yellow-300
      `}
    >
      {isDark ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
    </button>
  );
};

export default ThemeToggle;
