import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white/5 text-white border-t border-white/10 backdrop-blur-xl">
      <div className="px-6 py-10 sm:py-12 flex flex-col items-center text-center space-y-4">
        <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
          <span className="text-white font-bold text-lg">🇺🇦</span>
        </div>

        <p className="text-sm text-white/70">
          © 2025 UAlearn. All rights reserved.
        </p>

        <p className="text-sm text-white/60">
          Version 1.0.0 • Built with React, NestJS, PostgreSQL
        </p>
      </div>
    </footer>
  );
};

export default Footer;
