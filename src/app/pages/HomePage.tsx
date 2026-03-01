import { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Zap,
  Users,
  ArrowUpRight,
  BarChart3,
  Upload,
  Pause,
  Eye,
  CreditCard
} from 'lucide-react';
import { GlassNavigation } from '../components/GlassNavigation';
import { Footer } from '../components/Footer';
import { useTheme } from '../context/ThemeContext';
import { useCountUp } from '../hooks/useCountUp';
import { EnhancedButton } from '../components/EnhancedButton';

export default function HomePage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Animated counters for KPIs
  const totalLeads = useCountUp(1265, 1500);
  const activeCampaigns = useCountUp(3, 800);
  const acceptanceRate = useCountUp(93, 1200);
  const pendingInvoices = useCountUp(7800, 1500);
  const totalRevenue = useCountUp(198.3, 1800);
  const openTickets = useCountUp(0, 500);

  // iOS-inspired background gradient
  const backgroundStyle = isDark
    ? { 
        background: 'linear-gradient(135deg, #0F1117 0%, #1a1025 50%, #0F1117 100%)',
        minHeight: '100vh'
      }
    : { 
        background: 'linear-gradient(135deg, #F8F9FB 0%, #FAFBFC 50%, #F8F9FB 100%)',
        minHeight: '100vh'
      };

  // Glass card style with shadow
  const glassCardStyle = isDark
    ? 'bg-gradient-to-br from-[rgba(30,30,38,0.95)] to-[rgba(26,26,33,0.95)] backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
    : 'bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl border border-black/5 shadow-[0_8px_32px_rgba(0,0,0,0.08)]';

  const recentActivity = [
    { id: 1, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10', text: 'Sarah Chen accepted a lead from Healthcare Content Syndication', time: '2 minutes ago' },
    { id: 2, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10', text: 'Invoice INV-2026-001088 generated for $2,400', time: '1 hour ago' },
    { id: 3, icon: Target, color: 'text-purple-500', bg: 'bg-purple-500/10', text: 'SaaS Appointment Setting campaign reached 75% completion', time: '3 hours ago' },
    { id: 4, icon: Users, color: 'text-orange-500', bg: 'bg-orange-500/10', text: 'New lead delivered: David Kim - Director of IT', time: '5 hours ago' },
    { id: 5, icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-500/10', text: 'Healthcare Content Syndication campaign started', time: '1 day ago' },
  ];

  const needsAttention = [
    {
      id: 1,
      type: 'error',
      icon: AlertCircle,
      iconColor: 'text-[#C0392B]',
      bg: 'bg-red-50',
      bgDark: 'bg-red-900/10',
      border: 'border-red-200/50',
      borderDark: 'border-red-500/20',
      text: 'INV-2026-001087 is overdue by 14 days — $3,600 due',
      buttonText: 'Pay Now',
      buttonAction: () => navigate('/payment/INV-2026-001087'),
      buttonClass: 'bg-gradient-to-r from-[#C0392B] to-[#A93226] text-white'
    },
    {
      id: 2,
      type: 'warning',
      icon: Clock,
      iconColor: 'text-orange-500',
      bg: 'bg-orange-50',
      bgDark: 'bg-orange-900/10',
      border: 'border-orange-200/50',
      borderDark: 'border-orange-500/20',
      text: 'David Kim lead has been pending review for 4 days',
      buttonText: 'Review',
      buttonAction: () => navigate('/leads'),
      buttonClass: 'bg-gradient-to-r from-[#1E3A5F] to-[#162D47] text-white'
    },
    {
      id: 3,
      type: 'info',
      icon: Pause,
      iconColor: 'text-blue-500',
      bg: 'bg-blue-50',
      bgDark: 'bg-blue-900/10',
      border: 'border-blue-200/50',
      borderDark: 'border-blue-500/20',
      text: 'SaaS Appointment Setting campaign is paused at 30%',
      buttonText: 'View',
      buttonAction: () => navigate('/campaigns/2'),
      buttonClass: 'bg-gradient-to-r from-[#1E3A5F] to-[#162D47] text-white'
    },
  ];

  return (
    <div style={backgroundStyle}>
      <GlassNavigation />
      
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Header - Reduced spacing */}
        <div className="mb-5">
          <h1 className={`text-3xl font-semibold mb-1 ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}>
            Welcome back, John
          </h1>
          <p className={`text-base ${isDark ? 'text-[#A0A0A0]' : 'text-[#6B7280]'}`}>
            Here's what's happening with your campaigns today
          </p>
        </div>

        {/* KPI Cards - Compact design with reduced padding and height */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
          {/* Total Leads This Month */}
          <div 
            className={`${glassCardStyle} rounded-xl p-3.5 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:-translate-y-1 cursor-pointer active:scale-[0.98]`}
            style={{
              boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.04)'
            }}
            onClick={() => navigate('/leads')}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-1.5 rounded-lg ${isDark ? 'bg-green-500/10' : 'bg-green-50'}`}>
                <TrendingUp className="w-3.5 h-3.5 text-green-500" />
              </div>
              <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-green-500/10">
                <TrendingUp className="w-2.5 h-2.5 text-green-500" />
                <span className="text-[10px] font-semibold text-green-500">12%</span>
              </div>
            </div>
            <h3 className={`text-xs font-medium mb-1 ${isDark ? 'text-[#A0A0A0]' : 'text-[#6B7280]'}`}>
              Total Leads This Month
            </h3>
            <p className={`text-xl font-semibold mb-0.5 ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}>
              {totalLeads.toLocaleString()}
            </p>
            <p className={`text-[10px] ${isDark ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`}>
              12% from last month
            </p>
          </div>

          {/* Active Campaigns */}
          <div 
            className={`${glassCardStyle} rounded-xl p-3.5 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:-translate-y-1 cursor-pointer active:scale-[0.98]`}
            style={{
              boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.04)'
            }}
            onClick={() => navigate('/campaigns')}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-1.5 rounded-lg ${isDark ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
                <BarChart3 className="w-3.5 h-3.5 text-blue-500" />
              </div>
              <div className="flex items-center gap-1">
                <div className="relative">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></div>
                </div>
                <span className="text-[10px] font-semibold text-blue-500">Live</span>
              </div>
            </div>
            <h3 className={`text-xs font-medium mb-1 ${isDark ? 'text-[#A0A0A0]' : 'text-[#6B7280]'}`}>
              Active Campaigns
            </h3>
            <p className={`text-xl font-semibold mb-0.5 ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}>
              {activeCampaigns}
            </p>
            <p className={`text-[10px] ${isDark ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`}>
              Currently running
            </p>
          </div>

          {/* Acceptance Rate */}
          <div 
            className={`${glassCardStyle} rounded-xl p-3.5 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:-translate-y-1 cursor-pointer active:scale-[0.98]`}
            style={{
              boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.04)'
            }}
            onClick={() => navigate('/reports')}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-1.5 rounded-lg ${isDark ? 'bg-green-500/10' : 'bg-green-50'}`}>
                <Target className="w-3.5 h-3.5 text-green-500" />
              </div>
              <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-green-500/10">
                <TrendingUp className="w-2.5 h-2.5 text-green-500" />
                <span className="text-[10px] font-semibold text-green-500">+1%</span>
              </div>
            </div>
            <h3 className={`text-xs font-medium mb-1 ${isDark ? 'text-[#A0A0A0]' : 'text-[#6B7280]'}`}>
              Acceptance Rate
            </h3>
            <p className={`text-xl font-semibold mb-0.5 ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}>
              {acceptanceRate}%
            </p>
            <p className={`text-[10px] ${isDark ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`}>
              1,175 accepted of 1,265
            </p>
          </div>

          {/* Pending Invoices */}
          <div 
            className={`${glassCardStyle} rounded-xl p-3.5 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:-translate-y-1 cursor-pointer active:scale-[0.98]`}
            style={{
              boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.04)'
            }}
            onClick={() => navigate('/invoices')}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-1.5 rounded-lg ${isDark ? 'bg-orange-500/10' : 'bg-orange-50'}`}>
                <Clock className="w-3.5 h-3.5 text-orange-500" />
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-orange-500" />
              </div>
            </div>
            <h3 className={`text-xs font-medium mb-1 ${isDark ? 'text-[#A0A0A0]' : 'text-[#6B7280]'}`}>
              Pending Invoices
            </h3>
            <p className={`text-xl font-semibold mb-0.5 ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}>
              ${(pendingInvoices / 1000).toFixed(1)}K
            </p>
            <p className={`text-[10px] ${isDark ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`}>
              1 invoice awaiting payment
            </p>
          </div>

          {/* Total Revenue YTD */}
          <div 
            className={`${glassCardStyle} rounded-xl p-3.5 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:-translate-y-1 cursor-pointer active:scale-[0.98]`}
            style={{
              boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.04)'
            }}
            onClick={() => navigate('/reports')}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-1.5 rounded-lg ${isDark ? 'bg-green-500/10' : 'bg-green-50'}`}>
                <DollarSign className="w-3.5 h-3.5 text-green-500" />
              </div>
              <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-green-500/10">
                <TrendingUp className="w-2.5 h-2.5 text-green-500" />
                <span className="text-[10px] font-semibold text-green-500">15%</span>
              </div>
            </div>
            <h3 className={`text-xs font-medium mb-1 ${isDark ? 'text-[#A0A0A0]' : 'text-[#6B7280]'}`}>
              Total Revenue YTD
            </h3>
            <p className={`text-xl font-semibold mb-0.5 ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}>
              ${totalRevenue.toFixed(1)}K
            </p>
            <p className={`text-[10px] ${isDark ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`}>
              $49.6K avg per month
            </p>
          </div>

          {/* Open Support Tickets */}
          <div 
            className={`${glassCardStyle} rounded-xl p-3.5 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:-translate-y-1 cursor-pointer active:scale-[0.98]`}
            style={{
              boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.04)'
            }}
            onClick={() => navigate('/support')}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-1.5 rounded-lg ${isDark ? 'bg-green-500/10' : 'bg-green-50'}`}>
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-green-500" />
              </div>
            </div>
            <h3 className={`text-xs font-medium mb-1 ${isDark ? 'text-[#A0A0A0]' : 'text-[#6B7280]'}`}>
              Open Support Tickets
            </h3>
            <p className={`text-xl font-semibold mb-0.5 ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}>
              {openTickets}
            </p>
            <p className={`text-[10px] ${isDark ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`}>
              All clear
            </p>
          </div>
        </div>

        {/* Recent Activity & Needs Attention - Side by Side with reduced spacing */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Recent Activity - Compact single-line items, limited to 4 */}
          <div className={`${glassCardStyle} rounded-2xl p-5`}>
            <h2 className={`text-sm font-semibold mb-3 ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}>
              Recent Activity
            </h2>
            <div className="space-y-1.5">
              {recentActivity.slice(0, 4).map((activity, index) => (
                <div 
                  key={activity.id}
                  className={`flex items-center gap-2.5 p-2 rounded-lg transition-all duration-300 hover:scale-[1.01] cursor-pointer ${
                    isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'
                  }`}
                  style={{
                    animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                  }}
                >
                  <div className={`p-1.5 rounded-lg ${activity.bg} flex-shrink-0`}>
                    <activity.icon className={`w-3.5 h-3.5 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                    <p className={`text-sm ${isDark ? 'text-[#E0E0E0]' : 'text-[#374151]'} leading-tight truncate`}>
                      {activity.text}
                    </p>
                    <p className={`text-[11px] flex-shrink-0 ${isDark ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`}>
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Needs Your Attention - Compact single-line items with text links */}
          <div className={`${glassCardStyle} rounded-2xl p-5`}>
            <h2 className={`text-sm font-semibold mb-3 ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}>
              Needs Your Attention
            </h2>
            <div className="space-y-1.5">
              {needsAttention.map((item, index) => (
                <div 
                  key={item.id}
                  className={`flex items-center gap-2.5 p-2 rounded-lg border-l-2 transition-all duration-300 hover:scale-[1.01] cursor-pointer ${
                    item.type === 'error' 
                      ? (isDark ? 'border-l-[#C0392B] bg-red-900/5' : 'border-l-[#C0392B] bg-red-50/50')
                      : item.type === 'warning'
                      ? (isDark ? 'border-l-orange-500 bg-orange-900/5' : 'border-l-orange-500 bg-orange-50/50')
                      : (isDark ? 'border-l-blue-500 bg-blue-900/5' : 'border-l-blue-500 bg-blue-50/50')
                  }`}
                  style={{
                    animation: `fadeInUp 0.5s ease-out ${index * 0.15}s both`
                  }}
                  onClick={item.buttonAction}
                >
                  <item.icon className={`w-4 h-4 ${item.iconColor} flex-shrink-0`} />
                  <p className={`text-sm flex-1 leading-tight ${isDark ? 'text-[#E0E0E0]' : 'text-[#374151]'}`}>
                    {item.text}
                  </p>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <span className={`text-sm font-semibold ${
                      item.type === 'error' ? 'text-[#C0392B]' : 'text-[#1E3A5F]'
                    }`}>
                      {item.buttonText}
                    </span>
                    <ArrowUpRight className={`w-3.5 h-3.5 ${
                      item.type === 'error' ? 'text-[#C0392B]' : 'text-[#1E3A5F]'
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Campaign Snapshot - Full width section */}
        <div className={`${glassCardStyle} rounded-2xl p-5 mt-3`}>
          <div className="flex items-center justify-between mb-3">
            <h2 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}>
              Campaign Snapshot
            </h2>
            <button
              onClick={() => navigate('/campaigns')}
              className="flex items-center gap-1 text-sm font-semibold text-[#1E3A5F] hover:text-[#162D47] transition-colors"
            >
              View all campaigns
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {/* Campaign 1: Enterprise IT Security */}
            <div 
              className={`rounded-xl p-3.5 cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-lg ${
                isDark 
                  ? 'bg-gradient-to-br from-[rgba(30,30,38,0.95)] to-[rgba(26,26,33,0.95)] border border-white/10' 
                  : 'bg-white border border-black/[0.06]'
              }`}
              onClick={() => navigate('/campaigns/1')}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className={`text-sm font-semibold mb-0.5 ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}>
                    Enterprise IT Security Campaign Q1 2026
                  </h3>
                  <p className={`text-xs ${isDark ? 'text-[#A0A0A0]' : 'text-[#6B7280]'}`}>Leads</p>
                </div>
                <span className={`px-2 py-1 rounded-md text-xs font-semibold whitespace-nowrap ml-2 ${
                  isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600'
                }`}>
                  In Progress
                </span>
              </div>
              <div className="space-y-1">
                <div className={`w-full rounded-full h-1.5 overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div 
                    className="bg-blue-500 h-full rounded-full transition-all duration-500"
                    style={{ width: '64%' }}
                  ></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold ${isDark ? 'text-[#E0E0E0]' : 'text-[#374151]'}`}>320/500</span>
                  <span className={`text-xs font-semibold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>64%</span>
                </div>
              </div>
            </div>

            {/* Campaign 2: Healthcare Content Syndication */}
            <div 
              className={`rounded-xl p-3.5 cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-lg ${
                isDark 
                  ? 'bg-gradient-to-br from-[rgba(30,30,38,0.95)] to-[rgba(26,26,33,0.95)] border border-white/10' 
                  : 'bg-white border border-black/[0.06]'
              }`}
              onClick={() => navigate('/campaigns/3')}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className={`text-sm font-semibold mb-0.5 ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}>
                    Healthcare Content Syndication Feb 2026
                  </h3>
                  <p className={`text-xs ${isDark ? 'text-[#A0A0A0]' : 'text-[#6B7280]'}`}>Content Syndication</p>
                </div>
                <span className={`px-2 py-1 rounded-md text-xs font-semibold whitespace-nowrap ml-2 ${
                  isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-600'
                }`}>
                  Completed
                </span>
              </div>
              <div className="space-y-1">
                <div className={`w-full rounded-full h-1.5 overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div 
                    className="bg-green-500 h-full rounded-full transition-all duration-500"
                    style={{ width: '100%' }}
                  ></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold ${isDark ? 'text-[#E0E0E0]' : 'text-[#374151]'}`}>850/800</span>
                  <span className={`text-xs font-semibold ${isDark ? 'text-green-400' : 'text-green-600'}`}>106%</span>
                </div>
              </div>
            </div>

            {/* Campaign 3: Financial Services BANT */}
            <div 
              className={`rounded-xl p-3.5 cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-lg ${
                isDark 
                  ? 'bg-gradient-to-br from-[rgba(30,30,38,0.95)] to-[rgba(26,26,33,0.95)] border border-white/10' 
                  : 'bg-white border border-black/[0.06]'
              }`}
              onClick={() => navigate('/campaigns/4')}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className={`text-sm font-semibold mb-0.5 ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}>
                    Financial Services BANT Qualification
                  </h3>
                  <p className={`text-xs ${isDark ? 'text-[#A0A0A0]' : 'text-[#6B7280]'}`}>BANT</p>
                </div>
                <span className={`px-2 py-1 rounded-md text-xs font-semibold whitespace-nowrap ml-2 ${
                  isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600'
                }`}>
                  In Progress
                </span>
              </div>
              <div className="space-y-1">
                <div className={`w-full rounded-full h-1.5 overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div 
                    className="bg-blue-500 h-full rounded-full transition-all duration-500"
                    style={{ width: '43%' }}
                  ></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold ${isDark ? 'text-[#E0E0E0]' : 'text-[#374151]'}`}>65/150</span>
                  <span className={`text-xs font-semibold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>43%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Footer />
      </div>
    </div>
  );
}