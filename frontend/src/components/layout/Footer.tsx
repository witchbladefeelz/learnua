import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🇺🇦</span>
              </div>
              <span className="text-xl font-bold">UAlearn</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Free web application for learning Ukrainian language. 
              Learn the language through simple and engaging lessons.
            </p>
            <div className="flex space-x-4">
              <span className="text-sm text-gray-400">Made with ❤️ for education</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/lessons" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t('nav.lessons')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/leaderboard" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t('nav.leaderboard')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/profile" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t('nav.profile')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Features</h3>
            <ul className="space-y-2 text-gray-300">
              <li>🎯 Interactive exercises</li>
              <li>🎮 Gamification</li>
              <li>📱 PWA support</li>
              <li>🏆 Achievement system</li>
              <li>📊 Progress tracking</li>
              <li>🔥 Streak system</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 dark:border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © 2025 UAlearn. All rights reserved.
            </div>
            <div className="text-gray-400 text-sm mt-4 md:mt-0">
              Version 1.0.0 • 
              <span className="ml-2">
                Built with React, NestJS, PostgreSQL
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
