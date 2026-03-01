import { ReactNode } from 'react';
import { GlassNavigation } from './GlassNavigation';
import { useTheme } from '../context/ThemeContext';

interface PageLayoutProps {
  children: ReactNode;
  showInternalBadge?: boolean;
}

export function PageLayout({ children, showInternalBadge = false }: PageLayoutProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // PROBLEM 1 FIX: Gradient backgrounds for glassmorphism visibility
  const backgroundStyle: React.CSSProperties = isDark
    ? {
        background: 'linear-gradient(135deg, #0F1117 0%, #1a1025 100%)',
        minHeight: '100vh'
      }
    : {
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