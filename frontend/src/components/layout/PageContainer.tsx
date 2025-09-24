import React, { useRef, useState } from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({ children, className = '', contentClassName = '' }) => {
  const [glow, setGlow] = useState({ x: 50, y: 50 });
  const rafRef = useRef<number | null>(null);

  const scheduleGlowUpdate = (x: number, y: number) => {
    if (rafRef.current !== null) {
      return;
    }
    rafRef.current = requestAnimationFrame(() => {
      setGlow({ x, y });
      rafRef.current = null;
    });
  };

  const handlePointerMove: React.MouseEventHandler<HTMLDivElement> = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const xPercent = ((event.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((event.clientY - rect.top) / rect.height) * 100;
    scheduleGlowUpdate(
      Math.min(Math.max(xPercent, 5), 95),
      Math.min(Math.max(yPercent, 8), 92),
    );
  };

  const handlePointerLeave = () => {
    scheduleGlowUpdate(50, 50);
  };

  const style: React.CSSProperties = {
    ['--page-glow-x' as any]: `${glow.x}%`,
    ['--page-glow-y' as any]: `${glow.y}%`,
  };

  return (
    <div
      className={`app-page ${className}`.trim()}
      style={style}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
    >
      <div className="app-page-background">
        <div className="app-page-gradient" />
        <div className="app-page-overlay" />
        <div className="app-page-grid" />
      </div>
      <div className={`app-page-content ${contentClassName}`.trim()}>
        {children}
      </div>
    </div>
  );
};

export default PageContainer;
