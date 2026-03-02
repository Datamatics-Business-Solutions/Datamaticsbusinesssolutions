import { ReactNode } from 'react';
import { GlassNavigation } from './GlassNavigation';

interface PageLayoutProps {
  children: ReactNode;
  showInternalBadge?: boolean;
}

export function PageLayout({ children, showInternalBadge = false }: PageLayoutProps) {
  const backgroundStyle: React.CSSProperties = {
    background: '#F2F4F7',
    minHeight: '100vh'
  };

  return (
    <div style={backgroundStyle}>
      <GlassNavigation showInternalBadge={showInternalBadge} />
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </div>
    </div>
  );
}