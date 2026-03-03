import { ReactNode } from 'react';
import { LeftSidebar } from './LeftSidebar';
import { MobileTabBar } from './MobileTabBar';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div
      className="flex h-screen w-screen overflow-hidden"
      style={{ background: 'var(--color-main-bg)' }}
    >
      {/* Desktop sidebar — hidden on mobile, replaced by MobileTabBar */}
      <LeftSidebar />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 overflow-y-auto h-screen">
        {children}
      </div>

      {/* Mobile Bottom Tab Bar — only visible below md breakpoint */}
      <MobileTabBar />
    </div>
  );
}
