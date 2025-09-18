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
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import LanguageSwitcher from '../LanguageSwitcher';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHome = location.pathname === '/';

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

  const filteredNavigation = navigation.filter(item => {
    if (item.public) return true;
    if (!user) return false;
    return Boolean(item.auth);
  });

  const getNavLinkClass = (active: boolean) => {
    if (isHome) {
      return `flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        active ? 'text-white bg-white/10' : 'text-slate-200 hover:text-white hover:bg-white/10'
      }`;
    }

    return `flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      active
        ? 'text-primary-600 bg-primary-50 dark:bg-primary-500/10 dark:text-primary-300'
        : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-300 hover:bg-gray-50 dark:hover:bg-gray-800'
    }`;
  };

  const navClass = isHome
    ? 'sticky top-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10 text-white transition-colors duration-300'
    : 'sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-lg dark:shadow-none transition-colors duration-300';

  const quickMenuClass = isHome
    ? 'flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-white shadow-sm backdrop-blur'
    : 'flex items-center gap-3 px-4 py-2 rounded-full bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700 shadow-sm backdrop-blur';

  const dividerClass = isHome ? 'h-6 w-px bg-white/20' : 'h-6 w-px bg-gray-200 dark:bg-gray-700';

  const secondaryButtonClass = isHome
    ? 'px-3 py-1.5 rounded-lg text-sm font-medium text-slate-200 hover:text-white hover:bg-white/10 transition-colors'
    : 'px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors';

  const primaryButtonClass = isHome
    ? 'px-3 py-1.5 rounded-lg text-sm font-medium bg-primary-500/80 hover:bg-primary-500 text-white transition-colors'
    : 'px-3 py-1.5 rounded-lg text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 transition-colors';

  const mobileContainerClass = isHome
    ? 'md:hidden bg-slate-900/95 border-t border-white/10 text-white backdrop-blur-xl'
    : 'md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800';

  const mobileLinkClass = (active: boolean) => {
    if (isHome) {
      return `flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
        active ? 'text-white bg-white/10' : 'text-slate-200 hover:text-white hover:bg-white/10'
      }`;
    }
    return `flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
      active
        ? 'text-primary-600 bg-primary-50 dark:bg-primary-500/10 dark:text-primary-300'
        : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-300 hover:bg-gray-50 dark:hover:bg-gray-800'
    }`;
  };

  const mobileSecondaryClass = isHome
    ? 'flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:text-white hover:bg-white/10'
    : 'flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-300 hover:bg-gray-50 dark:hover:bg-gray-800';

  const mobileLogoutClass = isHome
    ? 'w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:text-red-300 hover:bg-white/10'
    : 'w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-800';

  return (
    <nav className={navClass}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🇺🇦</span>
              </div>
              <span className={`text-xl font-bold ${isHome ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                UAlearn
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.href;
              return (
                <Link key={item.name} to={item.href} className={getNavLinkClass(active)}>
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center">
            <div className={quickMenuClass}>
              {user && (
                <>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${isHome ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                      {user.name || user.email}
                    </div>
                    <div className={`text-xs ${isHome ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'}`}>
                      {user.level} • {user.xp} XP • 🔥 {user.streak}
                    </div>
                  </div>
                  <span className={dividerClass} />
                </>
              )}

              <LanguageSwitcher variant="compact" showLabels={false} />

              <span className={dividerClass} />

              {user ? (
                <div className="flex items-center gap-2">
                  <Link to="/profile" className={secondaryButtonClass}>
                    <UserIcon className="w-4 h-4" />
                    <span>{t('nav.profile')}</span>
                  </Link>
                  <button onClick={handleLogout} className={secondaryButtonClass}>
                    <ArrowRightOnRectangleIcon className="w-4 h-4" />
                    <span>{t('nav.logout')}</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login" className={secondaryButtonClass}>
                    {t('auth.login')}
                  </Link>
                  <Link to="/register" className={primaryButtonClass}>
                    {t('auth.register')}
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`${
                isHome
                  ? 'text-slate-200 hover:text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              } focus:outline-none`}
            >
              {mobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className={mobileContainerClass}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={mobileLinkClass(active)}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {user ? (
              <div className={`border-t pt-4 mt-4 ${isHome ? 'border-white/10' : 'border-gray-200 dark:border-gray-800'}`}>
                <div className="px-3 py-2">
                  <div className={`text-base font-medium ${isHome ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                    {user.name || user.email}
                  </div>
                  <div className={`text-sm ${isHome ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'}`}>
                    {user.level} • {user.xp} XP • 🔥 {user.streak}
                  </div>
                </div>
                <div className="px-3 py-2 flex items-center gap-3">
                  <LanguageSwitcher variant="compact" showLabels={false} />
                </div>
                <Link
                  to="/profile"
                  className={mobileSecondaryClass}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <UserIcon className="w-5 h-5" />
                  <span>{t('nav.profile')}</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className={mobileLogoutClass}
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  <span>{t('nav.logout')}</span>
                </button>
              </div>
            ) : (
              <div className={`border-t pt-4 mt-4 space-y-3 ${isHome ? 'border-white/10' : 'border-gray-200 dark:border-gray-800'}`}>
                <Link
                  to="/login"
                  className={mobileSecondaryClass}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <UserIcon className="w-5 h-5" />
                  <span>{t('auth.login')}</span>
                </Link>
                <Link
                  to="/register"
                  className={`${
                    isHome
                      ? 'flex items-center justify-center gap-2 px-3 py-2 rounded-md text-base font-medium bg-primary-500/80 hover:bg-primary-500 text-white'
                      : 'flex items-center justify-center gap-2 px-3 py-2 rounded-md text-base font-medium bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  <span>{t('auth.register')}</span>
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
