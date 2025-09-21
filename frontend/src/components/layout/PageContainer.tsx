import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({ children, className = '', contentClassName = '' }) => {
  return (
    <div className={`app-page ${className}`.trim()}>
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
