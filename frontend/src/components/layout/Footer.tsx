import React from 'react';
import Emoji from '../ui/Emoji';

const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-white/10 bg-slate-950/85">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-10 text-center text-white/80">
        <div className="flex items-center justify-center gap-3">
          <Emoji symbol="🇺🇦" decorative className="text-xl drop-shadow-sm" />
          <span className="text-base font-semibold tracking-wide">UAlearn</span>
        </div>
        <p className="text-sm">
          © 2025 UAlearn. All rights reserved.
        </p>
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">
          React • NestJS • PostgreSQL
        </p>
      </div>
    </footer>
  );
};

export default Footer;

