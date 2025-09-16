import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { HomeIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '../contexts/LanguageContext';

const NotFound: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <div className="text-6xl">🤔</div>
          <h1 className="text-4xl font-bold text-gray-900">
            404 - Page Not Found
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Looks like you're lost. This page doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-4">
          <Link to="/">
            <Button size="large" leftIcon={<HomeIcon className="w-5 h-5" />}>
              Back to Home
            </Button>
          </Link>
          
          <div className="text-sm text-gray-500">
            Or try:
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/lessons">
              <Button variant="outline">{t('nav.lessons')}</Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline">{t('dashboard.title')}</Button>
            </Link>
            <Link to="/leaderboard">
              <Button variant="outline">{t('nav.leaderboard')}</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
