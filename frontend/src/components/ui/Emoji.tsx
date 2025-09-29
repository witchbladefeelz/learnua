import React from 'react';

interface EmojiProps {
  symbol: string;
  label?: string;
  className?: string;
  decorative?: boolean;
}

const Emoji: React.FC<EmojiProps> = ({ symbol, label, className = '', decorative = false }) => {
  const ariaProps = decorative
    ? { 'aria-hidden': true }
    : { role: 'img' as const, 'aria-label': label ?? symbol };

  return (
    <span {...ariaProps} className={`emoji-font ${className}`.trim()}>
      {symbol}
    </span>
  );
};

export default Emoji;