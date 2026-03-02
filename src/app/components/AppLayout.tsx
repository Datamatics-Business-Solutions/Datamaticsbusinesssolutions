import { ReactNode, useState, useEffect } from 'react';
import { LeftSidebar } from './LeftSidebar';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Listen for pinned state changes from localStorage
  useEffect(() => {
    const checkPinned = () => {
      const savedPinned = localStorage.getItem('sidebar-pinned');
      setIsPinned(savedPinned === 'true');
    };

    checkPinned();

    // Listen for storage changes (if needed across tabs)
    const handleStorageChange = () => {
      checkPinned();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically (simple solution for same-tab updates)
    const interval = setInterval(checkPinned, 100);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <div 
      className="flex h-screen overflow-hidden" 
      style={{ background: 'var(--color-main-bg)' }}
    >
      <LeftSidebar />
      
      {/* Main Content Area */}
      <div 
        className="flex-1 overflow-y-auto transition-all duration-220"
        style={{ 
          marginLeft: !isMobile ? (isPinned ? '240px' : '64px') : '0px',
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {children}
      </div>
    </div>
  );
}
