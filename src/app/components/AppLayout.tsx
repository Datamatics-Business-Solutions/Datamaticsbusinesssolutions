import { ReactNode } from 'react';
import { LeftSidebar } from './LeftSidebar';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div 
      className="flex h-screen w-screen overflow-hidden" 
      style={{ background: 'var(--color-main-bg)' }}
    >
      <LeftSidebar />
      
      {/* Main Content Area */}
      <div 
        className="flex-1 min-w-0 overflow-y-auto h-screen"
      >
        {children}
      </div>
    </div>
  );
}