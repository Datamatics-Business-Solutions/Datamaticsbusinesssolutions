import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Menu, X, BarChart3, Users, FileText, CreditCard, UserCircle, FolderOpen, HelpCircle, Home } from 'lucide-react';
import { mockNotifications } from '../mockData';
import { Logo } from './Logo';

interface GlassNavigationProps {
  showInternalBadge?: boolean;
}

export function GlassNavigation({ showInternalBadge = false }: GlassNavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();
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

  // Navigation background with glassmorphism (light mode only)
  const navStyle: React.CSSProperties = {
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
            <Logo className="h-7 sm:h-8 lg:h-10" />
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
                        ? 'bg-[#BA2027]/15 text-[#BA2027]'
                        : 'text-[#4A4A4A] hover:bg-[#BA2027]/8 hover:text-[#BA2027]'
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
              className="lg:hidden p-2 rounded-lg transition-all bg-[#BA2027]/10 hover:bg-[#BA2027]/20 text-[#BA2027]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Notification Bell */}
            <motion.button 
              animate={unreadCount > 0 ? {
                rotate: [0, -10, 10, -10, 10, 0],
                scale: [1, 1.1, 1.1, 1.1, 1.1, 1]
              } : {}}
              transition={{
                duration: 0.6,
                ease: "easeInOut",
                repeat: unreadCount > 0 ? Infinity : 0,
                repeatDelay: 3
              }}
              className="p-2 rounded-lg relative transition-all hover:bg-[#BA2027]/8 text-[#4A4A4A] hover:text-[#BA2027]"
            >
              <Bell className="w-6 h-6 stroke-[2]" />
              {unreadCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#BA2027] rounded-full text-[10px] text-white flex items-center justify-center font-normal"
                >
                  {unreadCount}
                </motion.span>
              )}
            </motion.button>

            {/* User Avatar */}
            <div 
              className="w-9 h-9 bg-[#BA2027] rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-all hover:scale-105"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <span className="text-sm font-normal text-white">JS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ 
              duration: 0.3,
              ease: [0.4, 0.0, 0.2, 1]
            }}
            className="lg:hidden border-t overflow-hidden border-[#BA2027]/10"
          >
            <motion.div 
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              exit={{ y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-[1440px] mx-auto px-4 py-3 space-y-1"
            >
              {navLinks.map((link, index) => (
                <motion.button
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    delay: index * 0.05,
                    duration: 0.3
                  }}
                  onClick={() => handleNavigation(link.path)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-normal transition-all ${
                    isActive(link.path)
                      ? 'bg-[#BA2027]/10 text-[#BA2027] font-medium'
                      : 'text-[#4A4A4A] hover:bg-[#F8F9FA]'
                  }`}
                >
                  {link.label}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Menu Dropdown */}
      {showUserMenu && (
        <div className="absolute right-4 top-16 bg-white shadow-xl rounded-lg z-50 border border-[#BA2027]/10 min-w-[160px]">
          <div className="py-2">
            <button
              onClick={() => handleNavigation('/account')}
              className="w-full text-left px-4 py-2.5 text-sm text-[#4A4A4A] hover:bg-[#BA2027]/8 hover:text-[#BA2027] transition-colors"
            >
              Account Settings
            </button>
            <div className="border-t border-[#BA2027]/5 my-1"></div>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2.5 text-sm text-[#4A4A4A] hover:bg-[#BA2027]/8 hover:text-[#BA2027] transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Internal View Badge */}
      {showInternalBadge && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2">
          <span className="bg-orange-50 text-orange-600 border-orange-200 border px-4 py-1 rounded-full text-xs font-normal uppercase shadow-sm">
            Internal View
          </span>
        </div>
      )}
    </nav>
  );
}