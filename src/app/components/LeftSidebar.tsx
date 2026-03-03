import React, { useState, useEffect, useRef } from 'react';
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
  ChevronDown,
  ChevronRight,
  Plus,
  MessageSquare,
} from 'lucide-react';
import { Logo } from './Logo';
import { useAuth } from '../context/AuthContext';
import { getAssignedClients, recentUploadBatches, allClients } from '../data/mockClients';
import { LeadUploadModal } from './LeadUploadModal';

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: (collapsed: boolean) => void;
}

export function LeftSidebar({ collapsed: controlledCollapsed, onToggle }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  
  // Hover state management
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(() => {
    const savedPinned = localStorage.getItem('sidebar-pinned');
    return savedPinned !== null ? savedPinned === 'true' : true;
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  
  // Collapsible sections
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>(() => {
    const savedCollapsed = localStorage.getItem('sidebar-collapsed-sections');
    return savedCollapsed ? JSON.parse(savedCollapsed) : { ORGANIZATION: false };
  });

  // Upload modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  // Feedback jiggle animation — fires every 5s to attract attention
  const [feedbackJiggle, setFeedbackJiggle] = useState(false);

  const hoverTimeoutRef = useRef<NodeJS.Timeout>();
  const tooltipTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const interval = setInterval(() => {
      setFeedbackJiggle(true);
      setTimeout(() => setFeedbackJiggle(false), 700);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Save collapsed sections to localStorage when changed
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed-sections', JSON.stringify(collapsedSections));
  }, [collapsedSections]);

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

  // Toggle section collapse
  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Determine if sidebar should be expanded
  const isExpanded = isPinned || isHovered;

  // Get user initials
  const userInitials = currentUser?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'U';

  // Calculate badges dynamically
  const getBadgeCounts = () => {
    const processingUploads = recentUploadBatches.filter(u => u.status === 'processing').length;
    const failedUploads = recentUploadBatches.filter(u => u.status === 'failed').length;
    const activeCampaigns = allClients.reduce((sum, c) => sum + c.campaigns.filter(camp => camp.status === 'active').length, 0);
    const totalLeads = allClients.reduce((sum, c) => sum + c.totalLeads, 0);

    // For clients, count unpaid invoices (mock)
    const unpaidInvoices = 2;

    return {
      processingUploads,
      failedUploads,
      activeCampaigns,
      totalLeads,
      unpaidInvoices,
    };
  };

  const badges = getBadgeCounts();

  // Role-based navigation with badges and quick actions
  const getNavigationItems = () => {
    const role = currentUser?.role;

    if (role === 'ops_manager') {
      return [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/ops', section: 'PLATFORM' },
        { 
          name: 'All Campaigns', 
          icon: Layers, 
          path: '/internal/campaigns', 
          section: 'PLATFORM',
          badge: badges.activeCampaigns,
          badgeColor: 'bg-blue-500'
        },
        { 
          name: 'Upload Leads', 
          icon: Upload, 
          path: '/internal/leads', 
          section: 'PLATFORM',
          badge: badges.processingUploads > 0 ? badges.processingUploads : undefined,
          badgeColor: badges.failedUploads > 0 ? 'bg-red-500' : 'bg-yellow-500',
          hasQuickAction: true,
          quickActionIcon: Plus,
          quickActionHandler: () => setShowUploadModal(true)
        },
        { name: 'Client Assignments', icon: Building2, path: '/internal/client-assignment', section: 'PLATFORM' },
        { name: 'Team Management', icon: UsersRound, path: '/dashboard/ops/team', section: 'PLATFORM' },
        { name: 'Settings', icon: Settings, path: '/account', section: 'ORGANIZATION' },
        { name: 'Feedback', icon: MessageSquare, path: '/feedback', section: 'ORGANIZATION' },
      ];
    }

    if (role === 'campaign_manager' || role === 'campaign_backup') {
      return [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/manager', section: 'PLATFORM' },
        { 
          name: 'Campaigns', 
          icon: BarChart2, 
          path: '/internal/campaigns', 
          section: 'PLATFORM',
          badge: badges.activeCampaigns,
          badgeColor: 'bg-blue-500'
        },
        { 
          name: 'Upload Leads', 
          icon: Upload, 
          path: '/internal/leads', 
          section: 'PLATFORM',
          badge: badges.processingUploads > 0 ? badges.processingUploads : undefined,
          badgeColor: badges.failedUploads > 0 ? 'bg-red-500' : 'bg-yellow-500',
          hasQuickAction: true,
          quickActionIcon: Plus,
          quickActionHandler: () => setShowUploadModal(true)
        },
        { name: 'Reports', icon: FileBarChart, path: '/internal/reports', section: 'PLATFORM' },
        { name: 'Settings', icon: Settings, path: '/account', section: 'ORGANIZATION' },
        { name: 'Feedback', icon: MessageSquare, path: '/feedback', section: 'ORGANIZATION' },
      ];
    }

    // Client role
    return [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', section: 'PLATFORM' },
      { 
        name: 'Campaigns', 
        icon: BarChart2, 
        path: '/campaigns', 
        section: 'PLATFORM',
        badge: 3,
        badgeColor: 'bg-blue-500'
      },
      { 
        name: 'Leads', 
        icon: Users, 
        path: '/leads', 
        section: 'PLATFORM',
        badge: 1234,
        badgeColor: 'bg-green-500'
      },
      { name: 'Reports', icon: FileBarChart, path: '/reports', section: 'PLATFORM' },
      { 
        name: 'Invoices', 
        icon: Receipt, 
        path: '/invoices', 
        section: 'ORGANIZATION',
        badge: badges.unpaidInvoices,
        badgeColor: 'bg-red-500'
      },
      { name: 'Documents', icon: FolderOpen, path: '/documents', section: 'ORGANIZATION' },
      { name: 'Support', icon: MessageSquare, path: '/support', section: 'ORGANIZATION' },
      { name: 'Account', icon: UserCircle, path: '/account', section: 'ORGANIZATION' },
      { name: 'Feedback', icon: MessageCircle, path: '/feedback', section: 'ORGANIZATION' },
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
          isExpanded ? 'justify-start' : 'justify-center'
        }`}
      >
        <Logo className="h-10" collapsed={!isExpanded} />
      </div>

      {/* Pin Button */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="px-4 pt-4 flex justify-end"
          >
            <button
              onClick={togglePin}
              className="p-2 rounded-lg hover:bg-[#EEECEC] transition-colors group"
              title={isPinned ? 'Collapse sidebar' : 'Keep sidebar expanded'}
            >
              <Pin 
                className={`w-4 h-4 transition-all ${ 
                  isPinned ? 'text-[#BA2027]' : 'text-[#9CA3AF]'
                }`}
                style={{
                  transform: isPinned ? 'rotate(0deg)' : 'rotate(45deg)',
                  transition: 'transform 0.2s'
                }}
              />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {Object.entries(groupedNav).map(([section, items]) => {
          const isCollapsed = collapsedSections[section];
          const canCollapse = section === 'ORGANIZATION';

          return (
            <div key={section}>
              {/* Section Header - Collapsible for ORGANIZATION */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="px-3 mb-3"
                  >
                    <button
                      onClick={() => canCollapse && toggleSection(section)}
                      className={`flex items-center gap-2 w-full ${canCollapse ? 'cursor-pointer hover:text-[#6B7280]' : 'cursor-default'} transition-colors`}
                    >
                      <span 
                        className="text-[11px] text-[#9CA3AF] uppercase tracking-wider flex-1 text-left"
                        style={{ fontWeight: 600, letterSpacing: '0.08em' }}
                      >
                        {section}
                      </span>
                      {canCollapse && (
                        <motion.div
                          animate={{ rotate: isCollapsed ? -90 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="w-3.5 h-3.5 text-[#9CA3AF]" />
                        </motion.div>
                      )}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Section Items */}
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-1"
                  >
                    {items.map((item) => {
                      const isActive =
                        location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                      const Icon = item.icon;
                      const QuickActionIcon = item.quickActionIcon;

                      return (
                        <div key={item.name} className="relative">
                          <motion.button
                            onClick={() => {
                              navigate(item.path);
                              setMobileOpen(false);
                            }}
                            onMouseEnter={() => handleItemMouseEnter(item.name)}
                            onMouseLeave={handleItemMouseLeave}
                            className={`w-full flex items-center gap-3 rounded-xl relative group ${
                              isExpanded ? 'px-3 py-3' : 'px-0 py-3 justify-center'
                            } ${
                              isActive
                                ? item.name === 'Feedback'
                                  ? 'bg-gradient-to-r from-green-600/10 to-transparent text-green-700 border-l-[3px] border-green-600 shadow-sm'
                                  : 'bg-gradient-to-r from-[#BA2027]/10 to-transparent text-[#BA2027] border-l-[3px] border-[#BA2027] shadow-sm'
                                : item.name === 'Feedback'
                                ? 'text-green-700 bg-transparent hover:bg-gradient-to-r hover:from-green-600/5 hover:to-transparent hover:text-green-700 hover:border-l-[3px] hover:border-green-600/30'
                                : 'text-[#374151] bg-transparent hover:bg-gradient-to-r hover:from-[#BA2027]/5 hover:to-transparent hover:text-[#BA2027] hover:border-l-[3px] hover:border-[#BA2027]/30'
                            } transition-all duration-200`}
                            style={{
                              fontSize: '15px',
                              fontWeight: isActive ? 600 : 500,
                              letterSpacing: '-0.01em',
                            }}
                            whileHover={{ 
                              x: isExpanded ? 4 : 0,
                              transition: { duration: 0.2, ease: 'easeOut' }
                            }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                          >
                            <motion.div
                              animate={
                                item.name === 'Feedback' && feedbackJiggle
                                  ? { rotate: [0, -12, 12, -9, 9, -5, 5, 0], scale: [1, 1.15, 1.15, 1.1, 1.1, 1.05, 1.05, 1] }
                                  : { rotate: 0, scale: 1 }
                              }
                              transition={
                                item.name === 'Feedback' && feedbackJiggle
                                  ? { duration: 0.65, ease: 'easeInOut' }
                                  : { duration: 0.2, ease: 'easeOut' }
                              }
                              whileHover={
                                item.name !== 'Feedback'
                                  ? { scale: 1.1, rotate: isActive ? 0 : 2, transition: { duration: 0.2, ease: 'easeOut' } }
                                  : undefined
                              }
                            >
                              <Icon 
                                className={`w-6 h-6 flex-shrink-0 transition-colors duration-200 ${
                                  isActive 
                                    ? item.name === 'Feedback' 
                                      ? 'text-green-700' 
                                      : 'text-[#BA2027]' 
                                    : item.name === 'Feedback'
                                    ? 'text-green-600 group-hover:text-green-700'
                                    : 'text-[#6B7280] group-hover:text-[#BA2027]'
                                }`} 
                              />
                            </motion.div>
                            
                            <AnimatePresence mode="wait">
                              {isExpanded && (
                                <motion.span
                                  initial={{ opacity: 0, width: 0 }}
                                  animate={{ opacity: 1, width: 'auto' }}
                                  exit={{ opacity: 0, width: 0 }}
                                  transition={{ duration: 0.2, ease: 'easeOut' }}
                                  className="flex-1 text-left overflow-hidden whitespace-nowrap"
                                >
                                  {item.name}
                                </motion.span>
                              )}
                            </AnimatePresence>

                            {/* Badge */}
                            {isExpanded && item.badge && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className={`${item.badgeColor} text-white text-xs font-semibold px-2 py-0.5 rounded-full min-w-[20px] flex items-center justify-center`}
                                style={{ fontSize: '12px' }}
                              >
                                {item.badge}
                              </motion.span>
                            )}

                            {/* Quick Action Button */}
                            {isExpanded && item.hasQuickAction && QuickActionIcon && (
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  item.quickActionHandler?.();
                                }}
                                className="w-6 h-6 rounded-lg bg-[#BA2027] hover:bg-[#9A1A21] text-white flex items-center justify-center transition-colors ml-1 cursor-pointer"
                              >
                                <QuickActionIcon className="w-3.5 h-3.5" />
                              </motion.div>
                            )}
                          </motion.button>

                          {/* Tooltip for icon rail state */}
                          {!isExpanded && showTooltip === item.name && (
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.15 }}
                              className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-[#1A1A1A] text-white text-xs font-medium rounded-lg whitespace-nowrap z-50 pointer-events-none"
                            >
                              {item.name}
                              {item.badge && (
                                <span className="ml-2 bg-white/20 px-1.5 py-0.5 rounded-full">
                                  {item.badge}
                                </span>
                              )}
                            </motion.div>
                          )}
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

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
                  <span 
                    className="text-[11px] text-[#9CA3AF] uppercase tracking-wider"
                    style={{ fontWeight: 600, letterSpacing: '0.08em' }}
                  >
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
                    className={`w-full flex items-center gap-3 rounded-xl text-[14px] text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F5F5F5] transition-all duration-200 ${
                      isExpanded ? 'px-3 py-3' : 'px-0 py-3 justify-center'
                    }`}
                    style={{ fontWeight: 400 }}
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
                      className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-[#1A1A1A] text-white text-xs font-medium rounded-lg whitespace-nowrap z-50 pointer-events-none"
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

      {/* Bottom Section — Logout + User Profile */}
      <div className="border-t border-[#EEECEC] p-4 space-y-2">
        {/* Logout */}
        <div className="relative">
          <button
            onClick={() => {
              navigate('/');
              setMobileOpen(false);
            }}
            onMouseEnter={() => handleItemMouseEnter('Log Out')}
            onMouseLeave={handleItemMouseLeave}
            className={`w-full flex items-center gap-3 rounded-xl text-[15px] font-semibold text-[#C0392B] hover:bg-[#C0392B]/10 transition-all duration-200 ${
              isExpanded ? 'px-3 py-3' : 'px-0 py-3 justify-center'
            }`}
            style={{ fontWeight: 600 }}
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
          {!isExpanded && showTooltip === 'Log Out' && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-[#1A1A1A] text-white text-xs font-medium rounded-lg whitespace-nowrap z-50 pointer-events-none"
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
            className={`w-full flex items-center gap-3 rounded-xl hover:bg-[#F5F5F5] transition-all duration-200 border-t border-[#EEECEC] mt-2 pt-4 ${
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
                  <div className="text-[14px] font-semibold text-[#1F2937] truncate" style={{ fontWeight: 600 }}>
                    {currentUser?.name || 'User'}
                  </div>
                  <div className="text-[12px] text-[#6B7280] truncate" style={{ fontWeight: 400 }}>
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
          {!isExpanded && showTooltip === 'Account' && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-[#1A1A1A] text-white text-xs font-medium rounded-lg whitespace-nowrap z-50 pointer-events-none"
            >
              {currentUser?.name || 'Account'}
            </motion.div>
          )}
        </div>
      </div>

      {/* Footer — disclaimer + credit */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="px-5 pb-4 pt-2 border-t border-[#EEECEC] flex flex-col gap-1"
          >
            <p className="text-[10px] text-[#B0B0B0] leading-relaxed">
              © {new Date().getFullYear()} DatamaticsBPM. All rights reserved. This portal is for authorised users only. Unauthorised access is prohibited.
            </p>
            <a
              href="mailto:vishalpmehta@gmail.com?subject=DatamaticsBPM Client Portal"
              className="text-[10px] text-[#BA2027]/60 hover:text-[#BA2027] transition-colors duration-200 cursor-pointer"
            >
              Made with ♥ by Vishal
            </a>
          </motion.div>
        )}
      </AnimatePresence>
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
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="hidden md:flex flex-col h-screen overflow-hidden flex-shrink-0"
        style={{ 
          width: isPinned ? '260px' : (isHovered ? '260px' : '72px'),
          minWidth: isPinned ? '260px' : (isHovered ? '260px' : '72px'),
          transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          background: 'rgba(255, 255, 255, 0.72)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRight: '1px solid rgba(0, 0, 0, 0.06)',
          boxShadow: isExpanded ? '4px 0 24px rgba(0,0,0,0.06)' : '2px 0 8px rgba(0,0,0,0.03)',
          willChange: 'width',
          transform: 'translateZ(0)'
        }}
      >
        {sidebarContent}
      </div>

      {/* Sidebar - Mobile */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden fixed left-0 top-0 h-screen w-[260px] z-[60] overflow-hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderRight: '1px solid rgba(0, 0, 0, 0.06)',
              boxShadow: '4px 0 24px rgba(0,0,0,0.08)'
            }}
          >
            {sidebarContent}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lead Upload Modal */}
      <LeadUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
      />
    </>
  );
}