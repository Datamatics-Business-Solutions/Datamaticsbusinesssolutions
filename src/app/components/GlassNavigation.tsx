import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Sun, Moon, Menu, X, BarChart3, Users, FileText, CreditCard, UserCircle, FolderOpen, HelpCircle, Home } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { mockNotifications } from '../mockData';
import { Logo } from './Logo';

interface GlassNavigationProps {
  showInternalBadge?: boolean;
}

export function GlassNavigation({ showInternalBadge = false }: GlassNavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    if (path === '/campaigns') {
      return location.pathname === '/campaigns' || location.pathname.startsWith('/campaigns/');
    }
    if (path === '/leads') {
      return location.pathname === '/leads' || location.pathname.startsWith('/leads/');
    }
    if (path === '/reports') {
      return location.pathname === '/reports' || location.pathname.startsWith('/reports/');
    }
    if (path === '/invoices') {
      return location.pathname === '/invoices' || location.pathname.startsWith('/invoices/');
    }
    if (path === '/documents') {
      return location.pathname === '/documents' || location.pathname.startsWith('/documents/');
    }
    if (path === '/support') {
      return location.pathname === '/support' || location.pathname.startsWith('/support/');
    }
    if (path === '/account') {
      return location.pathname === '/account' || location.pathname.startsWith('/account/');
    }
    return false;
  };

  const isDark = theme === 'dark';
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    navigate('/');
    setShowUserMenu(false);
  };

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/campaigns', label: 'Campaigns', icon: BarChart3 },
    { path: '/leads', label: 'Leads', icon: Users },
    { path: '/reports', label: 'Reports', icon: FileText },
    { path: '/invoices', label: 'Invoices', icon: CreditCard },
    { path: '/documents', label: 'Documents', icon: FolderOpen },
    { path: '/support', label: 'Support', icon: HelpCircle },
    { path: '/account', label: 'Account', icon: UserCircle },
  ];

  // Navigation background with glassmorphism
  const navStyle: React.CSSProperties = isDark
    ? {
        background: 'rgba(22, 21, 26, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }
    : {
        background: 'rgba(242, 244, 247, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)'
      };

  return (
    <nav className="sticky top-0 z-50" style={navStyle}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavigation('/')}>
            <Logo 
              className="h-7 sm:h-8 lg:h-10"
              style={isDark ? {
                filter: 'brightness(0) saturate(100%) invert(96%) sepia(3%) saturate(383%) hue-rotate(201deg) brightness(103%) contrast(94%)'
              } : undefined}
            />
          </div>

          {/* Right Side Navigation */}
          <div className="flex items-center gap-4">
            {/* Desktop Navigation Links - Always Fully Visible */}
            <div className="hidden lg:flex items-center gap-0.5">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <button
                    key={link.path}
                    onClick={() => handleNavigation(link.path)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
                      active
                        ? `${isDark ? 'bg-[#E63946]/20 text-[#E63946]' : 'bg-[#BA2027]/15 text-[#BA2027]'}`
                        : `${isDark ? 'text-[#B0AEBB] hover:bg-[#E63946]/10 hover:text-[#E63946]' : 'text-[#4A4A4A] hover:bg-[#BA2027]/8 hover:text-[#BA2027]'}`
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="whitespace-nowrap text-sm font-medium">
                      {link.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-all ${
                isDark
                  ? 'bg-[#E63946]/20 hover:bg-[#E63946]/30 text-[#E63946]'
                  : 'bg-[#BA2027]/10 hover:bg-[#BA2027]/20 text-[#BA2027]'
              }`}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Icons - Fixed Spacing and Size */}
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all ${
                isDark 
                  ? 'bg-[#E63946]/20 hover:bg-[#E63946]/30 text-[#E63946]' 
                  : 'bg-[#BA2027]/10 hover:bg-[#BA2027]/20 text-[#BA2027]'
              }`}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun className="w-5 h-5 stroke-[2.5]" /> : <Moon className="w-5 h-5 stroke-[2.5]" />}
            </button>

            <button 
              className={`p-2 rounded-lg relative transition-all ${
                isDark 
                  ? 'hover:bg-[#E63946]/10 text-[#B0AEBB] hover:text-[#E63946]' 
                  : 'hover:bg-[#BA2027]/8 text-[#4A4A4A] hover:text-[#BA2027]'
              }`}
            >
              <Bell className="w-6 h-6 stroke-[2]" />
              {unreadCount > 0 && (
                <span className={`absolute top-0.5 right-0.5 w-4 h-4 ${isDark ? 'bg-[#E63946]' : 'bg-[#BA2027]'} rounded-full text-[10px] text-white flex items-center justify-center font-normal`}>
                  {unreadCount}
                </span>
              )}
            </button>

            <div 
              className={`w-9 h-9 ${isDark ? 'bg-[#E63946]' : 'bg-[#BA2027]'} rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-all hover:scale-105`}
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <span className="text-sm font-normal text-white">JS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div 
          className={`lg:hidden border-t ${
            isDark ? 'border-[#E63946]/20' : 'border-[#BA2027]/10'
          }`}
        >
          <div className="max-w-[1440px] mx-auto px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNavigation(link.path)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-normal transition-all ${
                  isActive(link.path)
                    ? `${isDark ? 'bg-[#BA2027]/20 text-white' : 'bg-[#BA2027]/10 text-[#BA2027]'} font-medium`
                    : `${isDark ? 'text-[#E0E0E0] hover:bg-white/5' : 'text-[#4A4A4A] hover:bg-[#F8F9FA]'}`
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* User Menu Dropdown */}
      {showUserMenu && (
        <div className={`absolute right-4 top-16 ${isDark ? 'bg-[#16151A]' : 'bg-white'} shadow-xl rounded-lg z-50 border ${isDark ? 'border-[#E63946]/20' : 'border-[#BA2027]/10'} min-w-[160px]`}>
          <div className="py-2">
            <button
              onClick={() => handleNavigation('/account')}
              className={`w-full text-left px-4 py-2.5 text-sm ${isDark ? 'text-[#B0AEBB] hover:bg-[#E63946]/10 hover:text-[#E63946]' : 'text-[#4A4A4A] hover:bg-[#BA2027]/8 hover:text-[#BA2027]'} transition-colors`}
            >
              Account Settings
            </button>
            <div className={`border-t ${isDark ? 'border-[#E63946]/10' : 'border-[#BA2027]/5'} my-1`}></div>
            <button
              onClick={handleLogout}
              className={`w-full text-left px-4 py-2.5 text-sm ${isDark ? 'text-[#B0AEBB] hover:bg-[#E63946]/10 hover:text-[#E63946]' : 'text-[#4A4A4A] hover:bg-[#BA2027]/8 hover:text-[#BA2027]'} transition-colors`}
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Internal View Badge */}
      {showInternalBadge && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2">
          <span className={`${
            isDark 
              ? 'bg-orange-500/20 text-orange-400 border-orange-500/40' 
              : 'bg-orange-50 text-orange-600 border-orange-200'
          } border px-4 py-1 rounded-full text-xs font-normal uppercase shadow-sm`}>
            Internal View
          </span>
        </div>
      )}
    </nav>
  );
}