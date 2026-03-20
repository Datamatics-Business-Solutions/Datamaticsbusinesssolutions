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
      <div className="flex-1 min-w-0 overflow-y-auto h-screen flex flex-col">
        <div className="flex-1">
          {children}
        </div>
        {/* Footer watermark + disclaimer */}
        <div className="flex flex-col items-center justify-center py-3 gap-1 flex-shrink-0" style={{ borderTop: '1px solid var(--color-border-light)' }}>
          <div className="flex items-center gap-1.5">
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', letterSpacing: '0.02em' }}>Powered by</span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#BA2027', letterSpacing: '0.04em' }}>Datamatics</span>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', letterSpacing: '0.02em' }}>Business Solutions</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>
              © {new Date().getFullYear()} DatamaticsBPM. All rights reserved. Authorised users only.
            </span>
            <span style={{ fontSize: '10px', color: 'var(--color-border)' }}>·</span>
            <a
              href="mailto:vishalpmehta@gmail.com?subject=DatamaticsBPM Client Portal"
              style={{ fontSize: '10px', color: '#BA2027', opacity: 0.6, textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0.6')}
            >
              Made with ♥ by Vishal
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Tab Bar — only visible below md breakpoint */}
      <MobileTabBar />
    </div>
  );
}
