import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from 'react-router';
import {
  LayoutDashboard,
  BarChart2,
  Users,
  FileBarChart,
  MessageCircle,
  Settings,
  Receipt,
  FolderOpen,
  LogOut,
  Upload,
  UsersRound,
  Menu,
  X,
  Pin,
  UserCircle,
  Building2,
  Layers,
} from 'lucide-react';
import { Logo } from './Logo';
import { useAuth } from '../context/AuthContext';
import { getAssignedClients } from '../data/mockClients';

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: (collapsed: boolean) => void;
}

export function LeftSidebar({ collapsed: controlledCollapsed, onToggle }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  
  // Hover state management
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  
  const hoverTimeoutRef = useRef<NodeJS.Timeout>();
  const tooltipTimeoutRef = useRef<NodeJS.Timeout>();

  // Load pinned state from localStorage
  useEffect(() => {
    const savedPinned = localStorage.getItem('sidebar-pinned');
    if (savedPinned === 'true') {
      setIsPinned(true);
    }
  }, []);

  // Handle hover with delay for collapse
  const handleMouseEnter = () => {
    if (!isPinned) {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isPinned) {
      hoverTimeoutRef.current = setTimeout(() => {
        setIsHovered(false);
      }, 350);
    }
  };

  // Pin toggle
  const togglePin = () => {
    const newPinned = !isPinned;
    setIsPinned(newPinned);
    localStorage.setItem('sidebar-pinned', String(newPinned));
    if (newPinned) {
      setIsHovered(false);
    }
  };

  // Determine if sidebar should be expanded
  const isExpanded = isPinned || isHovered;

  // Get user initials
  const userInitials = currentUser?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'U';

  // Role-based navigation
  const getNavigationItems = () => {
    const role = currentUser?.role;

    if (role === 'ops_manager') {
      return [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/ops', section: 'PLATFORM' },
        { name: 'All Clients', icon: Building2, path: '/dashboard/ops', section: 'PLATFORM' },
        { name: 'All Campaigns', icon: Layers, path: '/internal/campaigns', section: 'PLATFORM' },
        { name: 'Lead Uploads', icon: Upload, path: '/internal/leads', section: 'PLATFORM' },
        { name: 'Team Management', icon: UsersRound, path: '/dashboard/ops/team', section: 'PLATFORM' },
        { name: 'Settings', icon: Settings, path: '/account', section: 'ORGANIZATION' },
      ];
    }

    if (role === 'campaign_manager' || role === 'campaign_backup') {
      return [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/manager', section: 'PLATFORM' },
        { name: 'Campaigns', icon: BarChart2, path: '/internal/campaigns', section: 'PLATFORM' },
        { name: 'Leads', icon: Users, path: '/internal/leads', section: 'PLATFORM' },
        { name: 'Reports', icon: FileBarChart, path: '/internal/reports', section: 'PLATFORM' },
        { name: 'Settings', icon: Settings, path: '/account', section: 'ORGANIZATION' },
      ];
    }

    // Client role
    return [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', section: 'PLATFORM' },
      { name: 'Campaigns', icon: BarChart2, path: '/campaigns', section: 'PLATFORM' },
      { name: 'Leads', icon: Users, path: '/leads', section: 'PLATFORM' },
      { name: 'Reports', icon: FileBarChart, path: '/reports', section: 'PLATFORM' },
      { name: 'Invoices', icon: Receipt, path: '/invoices', section: 'ORGANIZATION' },
      { name: 'Documents', icon: FolderOpen, path: '/documents', section: 'ORGANIZATION' },
      { name: 'Support', icon: MessageCircle, path: '/support', section: 'ORGANIZATION' },
      { name: 'Account', icon: UserCircle, path: '/account', section: 'ORGANIZATION' },
    ];
  };

  const navigation = getNavigationItems();
  const groupedNav = navigation.reduce((acc, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, typeof navigation>);

  // Get assigned clients for managers
  const assignedClients =
    currentUser?.role === 'campaign_manager' || currentUser?.role === 'campaign_backup'
      ? getAssignedClients(currentUser.id)
      : [];

  // Tooltip handlers
  const handleItemMouseEnter = (itemName: string) => {
    setHoveredItem(itemName);
    if (!isExpanded) {
      tooltipTimeoutRef.current = setTimeout(() => {
        setShowTooltip(itemName);
      }, 400);
    }
  };

  const handleItemMouseLeave = () => {
    setHoveredItem(null);
    setShowTooltip(null);
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo Section */}
      <div 
        className={`px-6 py-6 border-b border-[#EEECEC] flex items-center ${
          isExpanded ? 'justify-between' : 'justify-center'
        }`}
      >
        <div className={isExpanded ? '' : 'flex justify-center'}>
          <Logo className="h-8" collapsed={!isExpanded} />
        </div>
        
        {/* Pin button - only show when expanded (hover or pinned) */}
        <AnimatePresence>
          {isExpanded && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={togglePin}
              className="p-1.5 rounded hover:bg-[#EEECEC] transition-colors"
              title={isPinned ? 'Unpin sidebar' : 'Pin sidebar'}
            >
              <Pin 
                className={`w-4 h-4 transition-colors ${
                  isPinned ? 'text-[#BA2027]' : 'text-[#9CA3AF]'
                }`}
                style={{
                  transform: isPinned ? 'rotate(0deg)' : 'rotate(45deg)',
                  transition: 'transform 0.2s'
                }}
              />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
        {Object.entries(groupedNav).map(([section, items]) => (
          <div key={section}>
            {/* Section Header */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="px-3 mb-3"
                >
                  <span className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">
                    {section}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Section Items */}
            <div className="space-y-1">
              {items.map((item) => {
                const isActive =
                  location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                const Icon = item.icon;

                return (
                  <div key={item.name} className="relative">
                    <motion.button
                      onClick={() => {
                        navigate(item.path);
                        setMobileOpen(false);
                      }}
                      onMouseEnter={() => handleItemMouseEnter(item.name)}
                      onMouseLeave={handleItemMouseLeave}
                      className={`w-full flex items-center gap-3 rounded-xl text-sm font-semibold transition-all duration-200 relative ${
                        isExpanded ? 'px-3 py-2.5' : 'px-0 py-2.5 justify-center'
                      } ${
                        isActive
                          ? 'text-white bg-[#BA2027]'
                          : 'text-[#9CA3AF] hover:text-[#1F2937] hover:bg-[#FFF5F5]'
                      }`}
                      whileHover={{ x: isExpanded ? 4 : 0 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Active indicator - left border */}
                      {isActive && isExpanded && (
                        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#BA2027] rounded-r" />
                      )}
                      
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.22 }}
                            className="flex-1 text-left"
                          >
                            {item.name}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>

                    {/* Tooltip for icon rail state */}
                    {!isExpanded && showTooltip === item.name && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-[10px] py-[6px] bg-[#1A1A1A] text-white text-xs font-medium rounded-lg whitespace-nowrap z-50 pointer-events-none"
                      >
                        {item.name}
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* My Clients Section (for Campaign Managers) */}
        {assignedClients.length > 0 && (
          <div>
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="px-3 mb-3"
                >
                  <span className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">
                    MY CLIENTS
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="space-y-1">
              {assignedClients.map((client) => (
                <div key={client.id} className="relative">
                  <motion.button
                    onClick={() => {
                      navigate(`/client/${client.id}`);
                      setMobileOpen(false);
                    }}
                    onMouseEnter={() => handleItemMouseEnter(client.name)}
                    onMouseLeave={handleItemMouseLeave}
                    className={`w-full flex items-center gap-3 rounded-xl text-sm font-medium text-[#6B7280] hover:text-[#1F2937] hover:bg-[#FFF5F5] transition-all duration-200 ${
                      isExpanded ? 'px-3 py-2.5' : 'px-0 py-2.5 justify-center'
                    }`}
                    whileHover={{ x: isExpanded ? 4 : 0 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                    
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.22 }}
                          className="flex-1 text-left truncate"
                        >
                          {client.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>

                  {/* Tooltip for icon rail state */}
                  {!isExpanded && showTooltip === client.name && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-[10px] py-[6px] bg-[#1A1A1A] text-white text-xs font-medium rounded-lg whitespace-nowrap z-50 pointer-events-none"
                    >
                      {client.name}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Section */}
      <div className="border-t border-[#EEECEC] p-4 space-y-2">
        {/* Settings */}
        <div className="relative">
          <button
            onClick={() => {
              navigate('/account');
              setMobileOpen(false);
            }}
            onMouseEnter={() => handleItemMouseEnter('Settings')}
            onMouseLeave={handleItemMouseLeave}
            className={`w-full flex items-center gap-3 rounded-xl text-sm font-medium text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F0EEEE] transition-all duration-200 ${
              isExpanded ? 'px-3 py-2.5' : 'px-0 py-2.5 justify-center'
            }`}
          >
            <Settings className="w-5 h-5" />
            <AnimatePresence>
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22 }}
                >
                  Settings
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Tooltip */}
          {!isExpanded && showTooltip === 'Settings' && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-[10px] py-[6px] bg-[#1A1A1A] text-white text-xs font-medium rounded-lg whitespace-nowrap z-50 pointer-events-none"
            >
              Settings
            </motion.div>
          )}
        </div>

        {/* Logout */}
        <div className="relative">
          <button
            onClick={() => {
              logout();
              navigate('/');
              setMobileOpen(false);
            }}
            onMouseEnter={() => handleItemMouseEnter('Log Out')}
            onMouseLeave={handleItemMouseLeave}
            className={`w-full flex items-center gap-3 rounded-xl text-sm font-semibold text-[#C0392B] hover:bg-[#C0392B]/10 transition-all duration-200 ${
              isExpanded ? 'px-3 py-2.5' : 'px-0 py-2.5 justify-center'
            }`}
          >
            <LogOut className="w-5 h-5" />
            <AnimatePresence>
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22 }}
                >
                  Log Out
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Tooltip */}
          {!isExpanded && showTooltip === 'Log Out' && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-[10px] py-[6px] bg-[#1A1A1A] text-white text-xs font-medium rounded-lg whitespace-nowrap z-50 pointer-events-none"
            >
              Log Out
            </motion.div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => {
              navigate('/account');
              setMobileOpen(false);
            }}
            onMouseEnter={() => handleItemMouseEnter('Account')}
            onMouseLeave={handleItemMouseLeave}
            className={`w-full flex items-center gap-3 rounded-xl hover:bg-[#F0EEEE] transition-all duration-200 border-t border-[#EEECEC] mt-2 pt-4 ${
              isExpanded ? 'px-3 py-3' : 'px-0 py-3 justify-center'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-[#BA2027] flex items-center justify-center text-white font-semibold flex-shrink-0">
              {userInitials}
            </div>
            
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="flex-1 text-left min-w-0"
                >
                  <div className="text-sm font-semibold text-[#1F2937] truncate">
                    {currentUser?.name || 'User'}
                  </div>
                  <div className="text-xs text-[#6B7280] truncate">
                    {currentUser?.role === 'client'
                      ? 'Client'
                      : currentUser?.role === 'campaign_manager'
                      ? 'Campaign Manager'
                      : currentUser?.role === 'campaign_backup'
                      ? 'Campaign Backup'
                      : 'Operations Manager'}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {/* Tooltip */}
          {!isExpanded && showTooltip === 'Account' && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-[10px] py-[6px] bg-[#1A1A1A] text-white text-xs font-medium rounded-lg whitespace-nowrap z-50 pointer-events-none"
            >
              {currentUser?.name || 'Account'}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-[60] md:hidden p-2 rounded-lg bg-white shadow-lg text-[#1F2937]"
      >
        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/40 z-[55] md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Desktop */}
      <motion.div
        animate={{ 
          width: isPinned ? 240 : (isHovered ? 240 : 64)
        }}
        transition={{ 
          duration: 0.22, 
          ease: [0.4, 0, 0.2, 1]
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="hidden md:block fixed left-0 top-0 h-screen bg-[#F8F7F7] border-r border-[#EEECEC] z-50 overflow-hidden"
        style={{ 
          boxShadow: isExpanded ? '4px 0 24px rgba(0,0,0,0.12)' : '2px 0 8px rgba(0,0,0,0.04)',
          transition: 'box-shadow 0.22s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {sidebarContent}
      </motion.div>

      {/* Sidebar - Mobile */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: -240 }}
            animate={{ x: 0 }}
            exit={{ x: -240 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden fixed left-0 top-0 h-screen w-[240px] bg-[#F8F7F7] border-r border-[#EEECEC] z-[60] overflow-hidden"
            style={{ boxShadow: '2px 0 8px rgba(0,0,0,0.04)' }}
          >
            {sidebarContent}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}