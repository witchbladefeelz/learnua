import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SparklesIcon, BookOpenIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from '../../contexts/LanguageContext';
import Button from '../../components/ui/Button';
import PageContainer from '../../components/layout/PageContainer';

const Register: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      toast.error('Please fill all required fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    
    try {
      const message = await register(email, password, name);
      toast.success(t('auth.registerSuccess'));
      if (message) {
        toast(t('auth.registerCheckEmail'), { icon: '📬' });
        navigate('/login');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || t('auth.registerError'));
    } finally {
      setLoading(false);
    }
  };

  const inputClassName =
    'w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-slate-100 placeholder-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 transition-all';
  const requiredLabel = t('auth.requiredFields');
  const resolvedRequiredLabel = requiredLabel === 'auth.requiredFields' ? 'Required fields' : requiredLabel;

  return (
    <PageContainer contentClassName="w-full max-w-5xl mx-auto">
      <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_1fr]">
        <div className="surface-panel space-y-6 overflow-hidden">
          <div className="relative">
            <div className="absolute -top-24 -left-10 h-40 w-40 rounded-full bg-secondary-400/30 blur-3xl" />
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white/80">
              <SparklesIcon className="h-4 w-4" />
              {t('auth.register')}
            </span>
          </div>
          <h1 className="text-4xl font-semibold text-white">
            {t('home.getStarted')}
          </h1>
          <p className="text-lg text-slate-300">
            Join a growing community of learners and track your Ukrainian progress every day.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <BookOpenIcon className="h-4 w-4 text-primary-200" />
                Interactive lessons
              </div>
              <p className="mt-2 text-sm text-slate-400">
                Practice vocabulary, grammar and listening with bite-sized exercises.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <ShieldCheckIcon className="h-4 w-4 text-emerald-200" />
                Safe & free
              </div>
              <p className="mt-2 text-sm text-slate-400">
                Secure authentication and no hidden costs — just pure learning.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
            <p>
              {t('auth.hasAccount')}{' '}
              <Link to="/login" className="text-primary-200 underline decoration-primary-400/60 hover:decoration-primary-100">
                {t('auth.login')}
              </Link>
            </p>
          </div>
        </div>

        <div className="surface-panel relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-secondary-500/10 to-transparent" />
          <div className="relative space-y-6">
            <div className="text-center space-y-2">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 shadow-lg shadow-primary-500/30">
                <span className="text-2xl">🇺🇦</span>
              </div>
              <h2 className="text-2xl font-semibold text-white">{t('auth.register')}</h2>
              <p className="text-sm text-slate-300">
                Create an account to save your progress and unlock achievements.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-slate-200">
                  {t('auth.name')}
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClassName}
                  placeholder={t('auth.name') === 'auth.name' ? 'Your name' : t('auth.name')}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-200">
                  Email *
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
                  {t('auth.password')} *
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClassName}
                  placeholder="••••••"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-200">
                  {t('auth.confirmPassword')} *
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputClassName}
                  placeholder="••••••"
                />
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-slate-400">
                * {resolvedRequiredLabel}
              </div>

              <Button
                type="submit"
                fullWidth
                loading={loading}
                disabled={!email || !password || !confirmPassword}
              >
                {t('auth.register')}
              </Button>
            </form>

            <p className="text-center text-xs text-slate-400">
              By creating an account you agree to our educational use policy and free-of-charge experience.
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Register;
