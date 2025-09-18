import React from 'react';

const Footer: React.FC = () => {

  return (
    <footer className="bg-white/5 text-white border-t border-white/10 backdrop-blur-xl transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">🇺🇦</span>
          </div>

          <p className="text-sm text-white/70">
            © 2025 UAlearn. All rights reserved.
          </p>

          <p className="text-sm text-white/60">
            Version 1.0.0 • Built with React, NestJS, PostgreSQL
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
