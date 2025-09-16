import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../contexts/LanguageContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { 
  BookOpenIcon, 
  TrophyIcon, 
  ChartBarIcon,
  DevicePhoneMobileIcon,
  SparklesIcon,
  HeartIcon
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
    { name: 'Привітання', icon: '👋', color: 'from-pink-500 to-rose-500' },
    { name: 'Їжа', icon: '🍎', color: 'from-green-500 to-emerald-500' },
    { name: 'Сім’я', icon: '👨‍👩‍👧‍👦', color: 'from-blue-500 to-cyan-500' },
    { name: 'Подорожі', icon: '✈️', color: 'from-purple-500 to-violet-500' },
    { name: 'Числа', icon: '🔢', color: 'from-orange-500 to-amber-500' },
    { name: 'Кольори', icon: '🎨', color: 'from-red-500 to-pink-500' },
  ];

  return (
    <div className="space-y-16 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Hero Section */}
      <section className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-100">
            Learn{' '}
            <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Ukrainian language
            </span>
            {' '}easy and fun
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Free web application with interactive lessons, achievement system 
            and progress tracking. Start learning today!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {user ? (
            <Link to="/dashboard">
              <Button size="large" className="px-8 py-4">
                Continue Learning
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/register">
                <Button size="large" className="px-8 py-4">
                  Start Learning
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="large" className="px-8 py-4">
                  Login
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Demo video or screenshot placeholder */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-2xl p-8 h-64 flex items-center justify-center animate-float transition-colors duration-300">
            <div className="text-center space-y-4">
              <div className="text-6xl">🇺🇦</div>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Interactive interface for learning Ukrainian language
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
            Why choose us
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Modern approach to language learning using best gamification practices
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center space-y-4 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center mx-auto">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
            Thematic categories
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Learn language by topics: from basic greetings to complex conversational situations
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <Card 
              key={index} 
              className="text-center p-4 animate-bounce-in" 
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm` }>
                <span className="text-2xl">{category.icon}</span>
              </div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100">{category.name}</h3>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-br from-primary-600 to-secondary-600 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 rounded-2xl p-8 md:p-12 text-white text-center transition-colors duration-300">
        <div className="space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            Join the community
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold">50+</div>
              <div className="text-primary-100">Interactive lessons</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold">5</div>
              <div className="text-primary-100">Difficulty levels</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold">100%</div>
              <div className="text-primary-100">Free forever</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-8">
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
            Ready to start learning?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Create a free account and start learning Ukrainian language today
          </p>
        </div>

        {!user && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/register">
              <Button size="large" className="px-8 py-4">
                Sign Up
              </Button>
            </Link>
            <Link to="/leaderboard">
              <Button variant="outline" size="large" className="px-8 py-4">
                View Leaderboard
              </Button>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
