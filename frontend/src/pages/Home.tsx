import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../contexts/LanguageContext';
import Button from '../components/ui/Button';
import {
  BookOpenIcon,
  TrophyIcon,
  ChartBarIcon,
  DevicePhoneMobileIcon,
  SparklesIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';

const Home: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  const features = [
    {
      icon: BookOpenIcon,
      title: t('home.features.interactive.title'),
      description: t('home.features.interactive.description'),
    },
    {
      icon: TrophyIcon,
      title: t('home.features.gamification.title'),
      description: t('home.features.gamification.description'),
    },
    {
      icon: ChartBarIcon,
      title: t('home.features.progress.title'),
      description: t('home.features.progress.description'),
    },
    {
      icon: DevicePhoneMobileIcon,
      title: t('home.features.adaptive.title'),
      description: t('home.features.adaptive.description'),
    },
    {
      icon: SparklesIcon,
      title: t('home.features.community.title'),
      description: t('home.features.community.description'),
    },
    {
      icon: HeartIcon,
      title: t('home.features.free.title'),
      description: t('home.features.free.description'),
    },
  ];

  const categories = [
    { name: t('home.categories.greetings.title'), icon: '👋', color: 'from-pink-500 to-rose-500' },
    { name: t('home.categories.food.title'), icon: '🍎', color: 'from-green-500 to-emerald-500' },
    { name: t('home.categories.family.title'), icon: '👨‍👩‍👧‍👦', color: 'from-blue-500 to-cyan-500' },
    { name: t('home.categories.travel.title'), icon: '✈️', color: 'from-purple-500 to-violet-500' },
    { name: t('home.categories.numbers.title'), icon: '🔢', color: 'from-orange-500 to-amber-500' },
    { name: t('home.categories.colors.title'), icon: '🎨', color: 'from-red-500 to-pink-500' },
  ];


  return (
    <div className="home-root text-slate-100">
      <div className="home-gradient" aria-hidden="true" />
      <div className="home-gradient-overlay" aria-hidden="true" />
      <div className="home-grid-lines" aria-hidden="true" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 py-24 space-y-24 md:space-y-28">
        {/* Hero Section */}
        <section className="home-hero grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center home-fade" style={{ animationDelay: '0.05s' }}>
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-sm font-medium text-primary-200 backdrop-blur">
              <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
              {t('home.heroBadge')}
            </div>
            <h1 className="text-4xl md:text-6xl font-semibold leading-tight text-white">
              {t('home.heroTitle')}
            </h1>
            <p className="max-w-xl text-lg text-slate-300">
              {t('home.heroDescription')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              {user ? (
                <Link to="/dashboard">
                  <Button size="large" className="px-8 py-4">
                    {t('dashboard.continueStudying')}
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <Button size="large" className="px-8 py-4">
                      {t('home.getStarted')}
                    </Button>
                  </Link>
                  <Link to="/login" className="sm:ml-2">
                    <Button variant="outline" size="large" className="px-8 py-4 border-white/40 text-white hover:bg-white/10">
                      {t('auth.login')}
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="relative h-[360px] sm:h-[420px] md:h-[480px] home-fade" style={{ animationDelay: '0.15s' }}>
            <div className="abstract-orb" aria-hidden="true" />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/20 to-secondary-500/10 rounded-[36px] border border-white/10 backdrop-blur-xl flex items-center justify-center">
              <div className="text-center space-y-4 px-6">
                <span className="text-6xl md:text-7xl block">🇺🇦</span>
                <p className="text-slate-300 text-lg max-w-sm mx-auto">
                  {t('home.heroOrbCaption')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="home-panel space-y-12 home-fade" style={{ animationDelay: '0.25s' }}>
          <div className="home-section-heading">
            <span className="home-section-label text-primary-200">{t('home.featuresTitle')}</span>
            <h2 className="home-section-title">{t('home.featuresHeadline')}</h2>
            <p className="home-section-description">{t('home.featuresDescription')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="home-feature home-fade"
                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/80 to-secondary-500/80 flex items-center justify-center text-white">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                <p className="text-slate-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="home-panel space-y-12 home-fade" style={{ animationDelay: '0.4s' }}>
          <div className="home-section-heading">
            <span className="home-section-label text-secondary-200">{t('home.categoriesTitle')}</span>
            <h2 className="home-section-title">{t('home.categoriesHeadline')}</h2>
            <p className="home-section-description">{t('home.categoriesDescription')}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <div
                key={category.name}
                className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 px-4 py-6 text-center backdrop-blur-xl transition-all duration-300 hover:bg-white/10 home-fade"
                style={{ animationDelay: `${0.45 + index * 0.08}s` }}
              >
                <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br ${category.color} text-2xl`}>{category.icon}</div>
                <h3 className="font-medium text-white">{category.name}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="home-panel text-center space-y-6 home-fade" style={{ animationDelay: '0.55s' }}>
          <h2 className="home-section-title">{t('home.ctaTitle')}</h2>
          <p className="home-section-description max-w-2xl mx-auto">{t('home.ctaDescription')}</p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to={user ? '/dashboard' : '/register'}>
              <Button size="large" className="px-8 py-4">
                {user ? t('dashboard.continueStudying') : t('home.getStarted')}
              </Button>
            </Link>
            {!user && (
              <Link to="/login">
                <Button variant="outline" size="large" className="px-8 py-4 border-white/40 text-white hover:bg-white/10">
                  {t('auth.login')}
                </Button>
              </Link>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
