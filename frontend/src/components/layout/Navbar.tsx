import React, { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  BookOpenIcon,
  ChartBarIcon,
  TrophyIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from '../../contexts/LanguageContext';
import LanguageSwitcher from '../LanguageSwitcher';
import Button from '../ui/Button';

interface NavItem {
  key: string;
  labelKey: string;
  path: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  auth?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { key: 'home', labelKey: 'nav.home', path: '/', icon: HomeIcon },
  { key: 'dashboard', labelKey: 'dashboard.title', path: '/dashboard', icon: ChartBarIcon, auth: true },
  { key: 'lessons', labelKey: 'nav.lessons', path: '/lessons', icon: BookOpenIcon, auth: true },
  { key: 'leaderboard', labelKey: 'nav.leaderboard', path: '/leaderboard', icon: TrophyIcon },
];

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);

  const visibleItems = useMemo(
    () => NAV_ITEMS.filter((item) => (item.auth ? Boolean(user) : true)),
    [user],
  );

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const linkClasses = (active: boolean) =>
    `group relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
      active
        ? 'bg-white text-slate-900 shadow-[0_10px_30px_rgba(255,255,255,0.25)]'
        : 'text-white/70 hover:text-white hover:bg-white/10'
    }`;

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/');
  };

  const navigateToProfile = () => {
    setMobileOpen(false);
    navigate('/profile');
  };

  const renderAvatar = () => {
    if (user?.avatar) {
      return (
        <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/5">
          <img
            src={user.avatar}
            alt={user.name || user.email || 'User avatar'}
            className="h-full w-full object-cover"
          />
        </span>
      );
    }

    const fallback = (user?.name || user?.email || 'U')[0]?.toUpperCase();
    return (
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-base font-semibold text-white shadow-lg shadow-primary-500/40">
        {fallback}
      </span>
    );
  };

  return (
    <header className="fixed inset-x-0 top-3 sm:top-5 z-50 flex justify-center pointer-events-none">

      <div className="w-full max-w-6xl px-4 pointer-events-auto">
        <div className="flex items-center justify-between gap-4 rounded-full border border-white/10 bg-white/5 px-4 py-3 shadow-[0_24px_70px_rgba(15,23,42,0.55)] backdrop-blur-2xl md:px-6">
          <Link to="/" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 via-secondary-500 to-primary-600 text-xl font-semibold text-white shadow-lg shadow-primary-500/40">
              <span className="drop-shadow-sm">🇺🇦</span>
            </div>
            <div className="leading-tight text-white">
              <p className="text-xs uppercase tracking-[0.4em] text-white/70">UAlearn</p>
              <p className="text-sm font-semibold">Ukrainian Studio</p>
            </div>
            <span className="hidden items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-100 md:inline-flex">
              <SparklesIcon className="h-3.5 w-3.5" />
              Free
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-1">
            {visibleItems.map(({ key, labelKey, path, icon: Icon }) => (
              <Link key={key} to={path} className={linkClasses(isActive(path))}>
                <span className={`flex h-5 w-5 items-center justify-center rounded-full ${
                  isActive(path) ? 'bg-slate-900 text-white' : 'bg-white/10 text-white/70 group-hover:bg-white/20'
                }`}>
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <span>{t(labelKey)}</span>
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher variant="compact" showLabels={false} />
            {user ? (
              <>
                <button
                  type="button"
                  onClick={navigateToProfile}
                  className="group flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 pr-4 text-left text-sm text-white/80 transition hover:border-white/30 hover:bg-white/20"
                >
                  {renderAvatar()}
                  <span className="leading-tight">
                    <span className="block text-sm font-semibold text-white">{user.name || user.email}</span>
                    <span className="text-xs text-white/60">{user.level} • {user.xp} XP • 🔥 {user.streak}</span>
                  </span>
                </button>
                <Button variant="ghost" size="small" onClick={handleLogout} leftIcon={<ArrowRightOnRectangleIcon className="h-4 w-4" />}>
                  {t('nav.logout')}
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="small" onClick={() => navigate('/login')}>
                  {t('auth.login')}
                </Button>
                <Button variant="primary" size="small" onClick={() => navigate('/register')}>
                  {t('auth.register')}
                </Button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white hover:border-white/40 hover:bg-white/20 md:hidden"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="pointer-events-auto md:hidden">
          <div
            className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />

          <div className="fixed inset-x-0 top-0 z-50 overflow-hidden rounded-b-3xl border-b border-white/10 bg-slate-950 px-5 pb-8 pt-24 shadow-[0_40px_80px_rgba(15,23,42,0.65)]">
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <div className="flex items-center gap-3 text-white">
                {renderAvatar()}
                <div>
                  <p className="text-sm font-semibold">{user ? (user.name || user.email) : 'UAlearn'}</p>
                  <p className="text-xs text-white/60">
                    {user ? `${user.level} • ${user.xp} XP • 🔥 ${user.streak}` : t('home.heroBadge')}
                  </p>
                </div>
              </div>
              <LanguageSwitcher variant="compact" showLabels={false} />
            </div>

            <nav className="mt-6 space-y-3">
              {visibleItems.map(({ key, labelKey, path, icon: Icon }) => (
                <Link
                  key={key}
                  to={path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3 text-base font-medium text-white/80 transition ${
                    isActive(path) ? 'bg-white/15 shadow-[0_18px_45px_rgba(56,189,248,0.25)]' : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span>{t(labelKey)}</span>
                  </div>
                  <span className="text-xs uppercase tracking-[0.3em] text-white/40">Go</span>
                </Link>
              ))}
            </nav>

            <div className="mt-6 space-y-3">
              {user ? (
                <>
                  <Button fullWidth onClick={navigateToProfile} leftIcon={<UserIcon className="h-5 w-5" />}>
                    {t('nav.profile')}
                  </Button>
                  <Button
                    fullWidth
                    variant="outline"
                    onClick={handleLogout}
                    leftIcon={<ArrowRightOnRectangleIcon className="h-5 w-5" />}
                  >
                    {t('nav.logout')}
                  </Button>
                </>
              ) : (
                <>
                  <Button fullWidth onClick={() => { setMobileOpen(false); navigate('/login'); }}>
                    {t('auth.login')}
                  </Button>
                  <Button
                    fullWidth
                    variant="outline"
                    onClick={() => { setMobileOpen(false); navigate('/register'); }}
                    leftIcon={<ArrowRightOnRectangleIcon className="h-5 w-5" />}
                  >
                    {t('auth.register')}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
