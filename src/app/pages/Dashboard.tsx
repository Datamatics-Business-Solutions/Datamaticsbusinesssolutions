import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, Target, DollarSign, Search, ArrowUpRight, ArrowDownRight, Circle, CheckCircle2, Pause, Clock, MoreVertical, FileText, Download, FolderOpen } from 'lucide-react';
import { mockCampaigns } from '../mockData';
import { GlassNavigation } from '../components/GlassNavigation';
import { Footer } from '../components/Footer';
import { useTheme } from '../context/ThemeContext';
import { useCountUp } from '../hooks/useCountUp';
import { NewCampaignModal, CampaignFormData } from '../components/NewCampaignModal';
import { EmptyState } from '../components/EmptyState';
import { EnhancedButton } from '../components/EnhancedButton';
import { AnimatedNumber } from '../components/AnimatedNumber';

export default function Dashboard() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isNewCampaignModalOpen, setIsNewCampaignModalOpen] = useState(false);

  const isDark = theme === 'dark';
  
  // iOS-inspired background
  const backgroundStyle = isDark
    ? { background: 'linear-gradient(135deg, #0F1117 0%, #1a1025 100%)', minHeight: '100vh' }
    : { background: '#F2F4F7', minHeight: '100vh' };
  
  const activeCampaigns = mockCampaigns.filter(c => c.status === 'In progress').length;
  const totalLeadsDelivered = mockCampaigns.reduce((sum, c) => sum + c.delivered, 0);
  const totalSpend = 24500;

  // Animated counters
  const animatedCampaigns = useCountUp(activeCampaigns, 1500);
  const animatedLeads = useCountUp(totalLeadsDelivered, 2000);
  const animatedSpend = useCountUp(totalSpend, 1800);

  const filteredCampaigns = mockCampaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusPill = (status: string) => {
    const config = {
      'In progress': { 
        bg: 'bg-[#EFF6FF]', 
        text: 'text-[#2563EB]', 
        border: 'border-[rgba(37,99,235,0.2)]',
        icon: Circle,
        hasPulse: true
      },
      'Completed': { 
        bg: 'bg-[#ECFDF5]', 
        text: 'text-[#059669]', 
        border: 'border-[rgba(5,150,105,0.2)]',
        icon: CheckCircle2,
        hasPulse: false
      },
      'Paused': { 
        bg: 'bg-[#F5F3FF]', 
        text: 'text-[#7C3AED]', 
        border: 'border-[rgba(124,58,237,0.2)]',
        icon: Pause,
        hasPulse: false
      },
      'Not started': { 
        bg: isDark ? 'bg-white/5' : 'bg-[#FFFBEB]', 
        text: isDark ? 'text-[#8B9CB0]' : 'text-[#D97706]', 
        border: isDark ? 'border-white/10' : 'border-[rgba(217,119,6,0.2)]',
        icon: Clock,
        hasPulse: false
      }
    };
    
    const statusConfig = config[status as keyof typeof config] || config['Not started'];
    const Icon = statusConfig.icon;
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border} transition-all duration-200 hover:scale-105 group/badge`}>
        <Icon className={`w-3 h-3 transition-transform duration-200 group-hover/badge:scale-110 ${statusConfig.hasPulse ? 'animate-pulse-dot' : ''}`} />
        {status}
      </span>
    );
  };

  // PROBLEM 2 FIX: Glassmorphism styling for KPI cards
  const glassCardStyle = isDark
    ? { 
        background: 'rgba(255, 255, 255, 0.05)', 
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.10)',
        borderRadius: '16px',
        boxShadow: '0 4px 32px rgba(0, 0, 0, 0.4)'
      }
    : { 
        background: 'rgba(255, 255, 255, 0.6)', 
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.8)',
        borderRadius: '16px',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)'
      };

  // PROBLEM 5 FIX: Card backgrounds with proper contrast and iOS shadows
  const cardStyle = isDark
    ? { 
        background: '#1C1F2E', 
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 4px 32px rgba(0, 0, 0, 0.4)'
      }
    : { 
        background: '#FFFFFF', 
        border: '1px solid rgba(0, 0, 0, 0.06)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)'
      };

  return (
    <div style={backgroundStyle}>
      <GlassNavigation />

      <div className="max-w-[1440px] mx-auto px-6 py-6">
        <div className="mb-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className={isDark ? 'text-[#F1F0F5]' : 'text-[#1E1E1E]'}>
              Acme Sales Inc.
            </h1>
            <p className={`text-sm mt-1 ${isDark ? 'text-[#6B6880]' : 'text-[#6B6B6B]'}`}>
              Campaign Overview & Performance Dashboard
            </p>
          </div>
          <button
            style={{
              background: '#1E3A5F'
            }}
            className="px-6 py-3.5 text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 flex items-center justify-center gap-2 whitespace-nowrap w-full sm:w-auto"
            onClick={() => setIsNewCampaignModalOpen(true)}
          >
            <span className="text-lg">+</span>
            Start a campaign
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {/* Active Campaigns */}
          <div 
            className="p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] overflow-hidden relative group" 
            style={glassCardStyle}
          >
            {/* Animated gradient background overlay */}
            <div 
              className="absolute inset-0 opacity-30 animate-gradient-shift pointer-events-none"
              style={{
                backgroundImage: isDark
                  ? 'radial-gradient(circle at 20% 50%, rgba(230, 57, 70, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255, 77, 90, 0.2) 0%, transparent 50%)'
                  : 'radial-gradient(circle at 20% 50%, rgba(186, 32, 39, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(211, 47, 47, 0.1) 0%, transparent 50%)',
                backgroundSize: '200% 200%'
              }}
            />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className={`${isDark ? 'text-[#8B9CB0]' : 'text-[#6B6B6B]'} text-sm mb-3 font-medium`}>Active Campaigns</div>
                  <div className={`text-5xl font-semibold ${isDark ? 'text-[#F0F4F8]' : 'text-[#1E1E1E]'} mb-2`} style={{ fontVariantNumeric: 'tabular-nums' }}>{animatedCampaigns}</div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-[#0F9D58] text-sm font-medium">
                      <ArrowUpRight className="w-4 h-4" />
                      <span>8%</span>
                    </div>
                    <span className={`text-xs ${isDark ? 'text-[#8B9CB0]' : 'text-[#9E9E9E]'}`}>vs last quarter</span>
                  </div>
                </div>
                <div 
                  className="w-16 h-16 rounded-xl flex items-center justify-center"
                  style={{
                    background: isDark 
                      ? 'linear-gradient(135deg, rgba(230, 57, 70, 0.25) 0%, rgba(255, 77, 90, 0.15) 100%)'
                      : 'linear-gradient(135deg, rgba(186, 32, 39, 0.15) 0%, rgba(211, 47, 47, 0.08) 100%)'
                  }}
                >
                  <Target className={`w-8 h-8 ${isDark ? 'text-[#E63946]' : 'text-[#BA2027]'}`} />
                </div>
              </div>
            </div>
            
            {isDark && <div className="absolute inset-0 rounded-2xl animate-glow-pulse pointer-events-none opacity-50" />}
          </div>

          {/* Leads Delivered */}
          <div 
            className="p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] overflow-hidden relative group" 
            style={glassCardStyle}
          >
            {/* Animated gradient background overlay */}
            <div 
              className="absolute inset-0 opacity-30 animate-gradient-shift pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(15, 157, 88, 0.25) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(52, 168, 83, 0.15) 0%, transparent 50%)',
                backgroundSize: '200% 200%'
              }}
            />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className={`${isDark ? 'text-[#8B9CB0]' : 'text-[#6B6B6B]'} text-sm mb-3 font-medium`}>Leads Delivered</div>
                  <div className={`text-5xl font-semibold ${isDark ? 'text-[#F0F4F8]' : 'text-[#1E1E1E]'} mb-2`} style={{ fontVariantNumeric: 'tabular-nums' }}>{animatedLeads.toLocaleString()}</div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-[#0F9D58] text-sm font-medium">
                      <ArrowUpRight className="w-4 h-4" />
                      <span>12%</span>
                    </div>
                    <span className={`text-xs ${isDark ? 'text-[#8B9CB0]' : 'text-[#9E9E9E]'}`}>vs last month</span>
                  </div>
                </div>
                <div 
                  className="w-16 h-16 rounded-xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(15, 157, 88, 0.15) 0%, rgba(52, 168, 83, 0.08) 100%)'
                  }}
                >
                  <TrendingUp className="w-8 h-8 text-[#0F9D58]" />
                </div>
              </div>
            </div>
            
            {isDark && <div className="absolute inset-0 rounded-2xl animate-glow-pulse pointer-events-none opacity-30" style={{ boxShadow: '0 0 20px rgba(15, 157, 88, 0.3), 0 0 40px rgba(15, 157, 88, 0.1)' }} />}
          </div>

          {/* Total Spend */}
          <div 
            className="p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] overflow-hidden relative group" 
            style={glassCardStyle}
          >
            {/* Animated gradient background overlay */}
            <div 
              className="absolute inset-0 opacity-30 animate-gradient-shift pointer-events-none"
              style={{
                backgroundImage: isDark
                  ? 'radial-gradient(circle at 20% 50%, rgba(230, 57, 70, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255, 77, 90, 0.2) 0%, transparent 50%)'
                  : 'radial-gradient(circle at 20% 50%, rgba(186, 32, 39, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(211, 47, 47, 0.1) 0%, transparent 50%)',
                backgroundSize: '200% 200%'
              }}
            />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className={`${isDark ? 'text-[#8B9CB0]' : 'text-[#6B6B6B]'} text-sm mb-3 font-medium`}>Total Spend</div>
                  <div className={`text-5xl font-semibold ${isDark ? 'text-[#F0F4F8]' : 'text-[#1E1E1E]'} mb-2`} style={{ fontVariantNumeric: 'tabular-nums' }}>${animatedSpend.toLocaleString()}</div>
                  <div className="flex items-center gap-2">
                    <div className={`flex items-center gap-1 text-sm font-medium ${isDark ? 'text-[#E63946]' : 'text-[#BA2027]'}`}>
                      <ArrowDownRight className="w-4 h-4" />
                      <span>3%</span>
                    </div>
                    <span className={`text-xs ${isDark ? 'text-[#8B9CB0]' : 'text-[#9E9E9E]'}`}>vs last quarter</span>
                  </div>
                </div>
                <div 
                  className="w-16 h-16 rounded-xl flex items-center justify-center"
                  style={{
                    background: isDark 
                      ? 'linear-gradient(135deg, rgba(230, 57, 70, 0.25) 0%, rgba(255, 77, 90, 0.15) 100%)'
                      : 'linear-gradient(135deg, rgba(186, 32, 39, 0.15) 0%, rgba(211, 47, 47, 0.08) 100%)'
                  }}
                >
                  <DollarSign className={`w-8 h-8 ${isDark ? 'text-[#E63946]' : 'text-[#BA2027]'}`} />
                </div>
              </div>
            </div>
            
            {isDark && <div className="absolute inset-0 rounded-2xl animate-glow-pulse pointer-events-none opacity-50" />}
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-5">
          <div className="relative flex-1">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-[#8B9CB0]' : 'text-[#64748B]'}`} />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full ${isDark ? 'bg-[#1C1F2E]' : 'bg-[#F8F8F8]'} border ${isDark ? 'border-white/[0.08]' : 'border-[#1E293B]/8'} ${!isDark && 'shadow-lg shadow-black/5'} rounded-xl px-12 py-3 ${isDark ? 'text-[#F1F0F5]' : 'text-[#1E293B]'} ${isDark ? 'placeholder-[#8B9CB0]' : 'placeholder-[#64748B]'} focus:outline-none focus:ring-2 focus:ring-[#E63946]/50 focus:border-[#E63946]/50 font-normal`}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`${isDark ? 'bg-[#1C1F2E]' : 'bg-white'} border ${isDark ? 'border-white/[0.08]' : 'border-[#1E293B]/8'} ${!isDark && 'shadow-lg shadow-black/5'} rounded-xl px-6 py-3 ${isDark ? 'text-[#F1F0F5]' : 'text-[#1E293B]'} focus:outline-none focus:ring-2 focus:ring-[#E63946]/50 focus:border-[#E63946]/50 font-normal w-full sm:w-auto`}
          >
            <option value="All" className={`${isDark ? 'bg-[#0F1117] text-[#F1F0F5]' : 'bg-white text-[#1E293B]'}`}>All Status</option>
            <option value="In progress" className={`${isDark ? 'bg-[#0F1117] text-[#F1F0F5]' : 'bg-white text-[#1E293B]'}`}>In Progress</option>
            <option value="Completed" className={`${isDark ? 'bg-[#0F1117] text-[#F1F0F5]' : 'bg-white text-[#1E293B]'}`}>Completed</option>
            <option value="Paused" className={`${isDark ? 'bg-[#0F1117] text-[#F1F0F5]' : 'bg-white text-[#1E293B]'}`}>Paused</option>
            <option value="Not started" className={`${isDark ? 'bg-[#0F1117] text-[#F1F0F5]' : 'bg-white text-[#1E293B]'}`}>Not Started</option>
          </select>
        </div>

        {/* Campaign Table */}
        <div 
          className={`${isDark ? 'bg-[#1C1F2E]' : 'bg-white'} rounded-2xl overflow-hidden`}
          style={isDark ? {
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 4px 32px rgba(0, 0, 0, 0.4)'
          } : {
            border: '1px solid rgba(0, 0, 0, 0.06)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)'
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className={`${isDark ? 'bg-[#161926]' : 'bg-[#F8F9FA]'}`}>
                <tr>
                  <th className={`px-6 py-4 text-left text-xs font-normal ${isDark ? 'text-[#8B9CB0]' : 'text-[#64748B]'} uppercase tracking-wider`}>
                    Campaign Name
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-normal ${isDark ? 'text-[#8B9CB0]' : 'text-[#64748B]'} uppercase tracking-wider`}>
                    Type
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-normal ${isDark ? 'text-[#8B9CB0]' : 'text-[#64748B]'} uppercase tracking-wider`}>
                    Status
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-normal ${isDark ? 'text-[#8B9CB0]' : 'text-[#64748B]'} uppercase tracking-wider`}>
                    Progress
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-normal ${isDark ? 'text-[#8B9CB0]' : 'text-[#64748B]'} uppercase tracking-wider`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.map((campaign, index) => {
                  const progress = (campaign.delivered / campaign.target) * 100;
                  const isInProgress = campaign.status === 'In progress';
                  return (
                    <motion.tr
                      key={campaign.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      whileHover={{ 
                        scale: 1.005,
                        backgroundColor: isDark ? 'rgba(30, 28, 36, 0.8)' : 'rgba(255, 245, 245, 0.8)',
                        transition: { duration: 0.2 }
                      }}
                      className={`group relative ${
                        index % 2 === 1 ? (isDark ? 'bg-white/[0.02]' : 'bg-[#F8FCFD]/50') : ''
                      } border-t ${isDark ? 'border-white/[0.04]' : 'border-[#F0F0F0]'} cursor-pointer`}
                      style={{
                        borderImage: isDark 
                          ? 'linear-gradient(90deg, rgba(230, 57, 70, 0.05) 0%, rgba(230, 57, 70, 0.15) 50%, rgba(230, 57, 70, 0.05) 100%) 1'
                          : 'linear-gradient(90deg, rgba(186, 32, 39, 0.03) 0%, rgba(186, 32, 39, 0.08) 50%, rgba(186, 32, 39, 0.03) 100%) 1'
                      }}
                    >
                      {/* Left accent border on hover - thicker and smoother */}
                      <td className="px-6 py-3 relative">
                        <div 
                          className="absolute left-0 top-0 bottom-0 w-0 group-hover:w-1.5 transition-all duration-300 ease-in-out rounded-r-md"
                          style={{
                            background: isDark
                              ? 'linear-gradient(180deg, #E63946 0%, #FF4D5A 100%)'
                              : 'linear-gradient(180deg, #BA2027 0%, #D32F2F 100%)'
                          }}
                        />
                        <div className={`text-sm font-normal ${isDark ? 'text-[#F1F0F5]' : 'text-[#1E1E1E]'}`}>{campaign.name}</div>
                        <div className={`text-xs ${isDark ? 'text-[#6B6880]' : 'text-[#9E9E9E]'} mt-1 font-normal`}>
                          {campaign.clientCompany} • {new Date(campaign.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - {new Date(campaign.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <div className={`text-sm font-normal ${isDark ? 'text-[#B0AEBB]' : 'text-[#4A4A4A]'}`}>{campaign.serviceType}</div>
                      </td>
                      <td className="px-6 py-3">
                        {getStatusPill(campaign.status)}
                      </td>
                      <td className="px-6 py-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 relative group/progress">
                              <div className={`h-3 ${isDark ? 'bg-white/5' : 'bg-[#1E293B]/5'} rounded-full overflow-hidden`}>
                                <div
                                  className={`h-full rounded-full transition-all duration-500 relative ${isInProgress ? 'animate-progress-stripe' : ''}`}
                                  style={{ 
                                    width: `${Math.min(progress, 100)}%`,
                                    backgroundImage: isInProgress
                                      ? (isDark 
                                          ? 'repeating-linear-gradient(45deg, #E63946, #E63946 10px, #FF4D5A 10px, #FF4D5A 20px)'
                                          : 'repeating-linear-gradient(45deg, #BA2027, #BA2027 10px, #D32F2F 10px, #D32F2F 20px)')
                                      : (isDark 
                                          ? 'linear-gradient(90deg, #E63946 0%, #FF4D5A 100%)'
                                          : 'linear-gradient(90deg, #BA2027 0%, #D32F2F 100%)'),
                                    backgroundSize: isInProgress ? '40px 100%' : 'auto',
                                    boxShadow: isInProgress 
                                      ? (isDark ? '0 0 12px rgba(230, 57, 70, 0.5)' : '0 0 12px rgba(186, 32, 39, 0.4)')
                                      : 'none'
                                  }}
                                />
                              </div>
                              {/* Tooltip on hover */}
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover/progress:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                {campaign.delivered.toLocaleString()} / {campaign.target.toLocaleString()} leads
                                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-black/90" />
                              </div>
                            </div>
                            <div className={`text-sm ${isDark ? 'text-[#B0AEBB]' : 'text-[#4A4A4A]'} min-w-[90px] text-right font-medium`} style={{ fontVariantNumeric: 'tabular-nums' }}>
                              {campaign.delivered.toLocaleString()}/{campaign.target.toLocaleString()}
                            </div>
                          </div>
                          <div className={`text-xs ${isDark ? 'text-[#6B6880]' : 'text-[#9E9E9E]'} font-normal`}>
                            {Math.round(progress)}% Complete
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/campaigns/${campaign.id}`)}
                            style={{
                              background: isDark 
                                ? 'linear-gradient(135deg, #E63946 0%, #FF4D5A 100%)'
                                : 'linear-gradient(135deg, #BA2027 0%, #D32F2F 100%)'
                            }}
                            className="px-4 py-2 text-white rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 hover:shadow-xl opacity-0 group-hover:opacity-100 animate-slide-in-right relative overflow-hidden"
                          >
                            {/* Ripple effect container */}
                            <span className="relative z-10">View Details</span>
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredCampaigns.length === 0 && (
            <EmptyState
              icon={FolderOpen}
              title="No campaigns found"
              description="We couldn't find any campaigns matching your search criteria. Try adjusting your filters or create a new campaign to get started."
              actionLabel="Create Campaign"
              onAction={() => setIsNewCampaignModalOpen(true)}
            />
          )}
        </div>
      </div>

      <Footer />

      <NewCampaignModal
        isOpen={isNewCampaignModalOpen}
        onClose={() => setIsNewCampaignModalOpen(false)}
        onSubmit={(formData: CampaignFormData) => {
          // Handle form submission
          console.log('New Campaign Form Data:', formData);
          setIsNewCampaignModalOpen(false);
        }}
      />
    </div>
  );
}