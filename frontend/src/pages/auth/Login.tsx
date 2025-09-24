import React, { useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheckIcon, FireIcon, StarIcon, SparklesIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from '../../contexts/LanguageContext';
import Button from '../../components/ui/Button';
import PageContainer from '../../components/layout/PageContainer';

const Login: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [pointerActive, setPointerActive] = useState(false);
  const rafRef = useRef<number | null>(null);

  const from = location.state?.from?.pathname || '/dashboard';

  const glowStyle = {
    '--auth-glow-x': `${glowPos.x}%`,
    '--auth-glow-y': `${glowPos.y}%`,
  } as React.CSSProperties;

  const scheduleGlowUpdate = (xPercent: number, yPercent: number) => {
    if (rafRef.current !== null) {
      return;
    }
    rafRef.current = requestAnimationFrame(() => {
      setGlowPos({ x: xPercent, y: yPercent });
      rafRef.current = null;
    });
  };

  const handlePointerMove: React.MouseEventHandler<HTMLDivElement> = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const xPercent = ((event.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((event.clientY - rect.top) / rect.height) * 100;
    setPointerActive(true);
    scheduleGlowUpdate(Math.min(Math.max(xPercent, 5), 95), Math.min(Math.max(yPercent, 10), 90));
  };

  const handlePointerLeave = () => {
    setPointerActive(false);
    scheduleGlowUpdate(50, 50);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);
    
    try {
      await login(email, password);
      toast.success(t('auth.loginSuccess'));
      navigate(from, { replace: true });
    } catch (error: any) {
      const message = error.message || t('auth.loginError');
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const inputClassName =
    'w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-slate-100 placeholder-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 transition-all';

  return (
    <PageContainer contentClassName="w-full max-w-5xl mx-auto">
      <div className="auth-grid grid gap-8 lg:grid-cols-[1.1fr_1fr] items-center">
        <div
          className="auth-hero-panel p-8 md:p-10 space-y-6"
          style={glowStyle}
          data-pointer={pointerActive}
          onMouseMove={handlePointerMove}
          onMouseLeave={handlePointerLeave}
        >
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur-lg">
              <ShieldCheckIcon className="h-4 w-4" />
              {t('auth.login')}
            </span>
            <span className="auth-success-chip">
              <SparklesIcon className="h-3.5 w-3.5" />
              12k learners active
            </span>
          </div>

          <h1 className="text-4xl font-semibold text-white">
            {t('dashboard.welcomeBack')}
          </h1>
          <p className="text-lg text-slate-200/80">
            {t('home.heroDescription')}
          </p>

          <div className="auth-divider" />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="auth-feature-card p-4">
              <div className="flex items-center justify-between text-sm text-white/80">
                <span className="flex items-center gap-2">
                  <StarIcon className="h-4 w-4 text-amber-300" />
                  XP Boost
                </span>
                <span className="text-amber-200">+10</span>
              </div>
              <p className="mt-2 text-sm text-slate-200/70">
                Complete lessons and watch your level rise faster.
              </p>
            </div>

            <div className="auth-feature-card p-4">
              <div className="flex items-center justify-between text-sm text-white/80">
                <span className="flex items-center gap-2">
                  <FireIcon className="h-4 w-4 text-orange-300" />
                  Daily Streaks
                </span>
                <span className="text-orange-200">🔥</span>
              </div>
              <p className="mt-2 text-sm text-slate-200/70">
                Keep the flame alive for exclusive streak rewards.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-primary-500/40 bg-primary-500/15 p-4 text-sm text-primary-100">
            <strong className="block text-sm font-semibold uppercase tracking-wide text-primary-100/90">
              New here?
            </strong>
            <p className="mt-2 text-slate-100/85">
              <Link
                to="/register"
                className="text-primary-200 underline decoration-primary-400/60 hover:decoration-primary-200"
              >
                {t('auth.noAccount')}
              </Link>
            </p>
          </div>
        </div>

        <div
          className="auth-form-panel p-8 md:p-10"
          style={glowStyle}
          onMouseMove={handlePointerMove}
          onMouseLeave={handlePointerLeave}
        >
          <div className="relative space-y-6">
            <div className="text-center space-y-2">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 shadow-lg shadow-primary-500/30">
                <span className="text-2xl">🇺🇦</span>
              </div>
              <h2 className="text-2xl font-semibold text-white">{t('auth.login')}</h2>
              <p className="text-sm text-slate-300">
                Enter your credentials to continue learning Ukrainian.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-200">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClassName}
                  placeholder="your@email.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-slate-200">
                  {t('auth.password')}
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClassName}
                  placeholder="••••••"
                />
              </div>

              <Button type="submit" fullWidth loading={loading} disabled={!email || !password}>
                {t('auth.login')}
              </Button>
            </form>

            <p className="text-center text-sm text-slate-400">
              {t('auth.noAccount')}{' '}
              <Link
                to="/register"
                className="font-medium text-primary-200 hover:text-primary-100"
              >
                {t('auth.register')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Login;
