import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from '../../contexts/LanguageContext';
import { 
  HomeIcon, 
  BookOpenIcon, 
  ChartBarIcon,
  UserIcon,
  TrophyIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import LanguageSwitcher from '../LanguageSwitcher';
import ThemeToggle from '../ThemeToggle';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navigation = [
    { name: t('nav.home'), href: '/', icon: HomeIcon, public: true },
    { name: t('dashboard.title'), href: '/dashboard', icon: ChartBarIcon, auth: true },
    { name: t('nav.lessons'), href: '/lessons', icon: BookOpenIcon, auth: true },
    { name: t('nav.leaderboard'), href: '/leaderboard', icon: TrophyIcon, public: true },
  ];

  const filteredNavigation = navigation.filter(item => 
    item.public || (item.auth && user)
  );

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-lg dark:shadow-none sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🇺🇦</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-gray-100">UAlearn</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-primary-600 bg-primary-50 dark:bg-primary-500/10 dark:text-primary-300'
                      : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* User menu */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <LanguageSwitcher />
            
            {user ? (
              <div className="flex items-center space-x-4">
                {/* User XP and level */}
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {user.name || user.email}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {user.level} • {user.xp} XP • 🔥 {user.streak}
                  </div>
                </div>
                
                <Link
                  to="/profile"
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>{t('nav.profile')}</span>
                </Link>
                
                <Button
                  variant="ghost"
                  size="small"
                  onClick={handleLogout}
                  leftIcon={<ArrowRightOnRectangleIcon className="w-4 h-4" />}
                  className="dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
                >
                  {t('nav.logout')}
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-300 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {t('auth.login')}
                </Link>
                <Link to="/register">
                  <Button size="small">{t('auth.register')}</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:text-gray-900"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? 'text-primary-600 bg-primary-50 dark:bg-primary-500/10 dark:text-primary-300'
                      : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {user ? (
              <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mt-4">
                <div className="px-3 py-2">
                  <div className="text-base font-medium text-gray-900 dark:text-gray-100">
                    {user.name || user.email}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {user.level} • {user.xp} XP • 🔥 {user.streak}
                  </div>
                </div>
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <UserIcon className="w-5 h-5" />
                  <span>{t('nav.profile')}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-300 hover:bg-gray-50 dark:hover:bg-gray-800 w-full text-left"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  <span>{t('nav.logout')}</span>
                </button>
              </div>
            ) : (
              <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mt-4 space-y-2">
                <div className="px-3 py-2">
                  <LanguageSwitcher showLabels={false} />
                </div>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('auth.login')}
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium bg-primary-600 text-white hover:bg-primary-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('auth.register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
