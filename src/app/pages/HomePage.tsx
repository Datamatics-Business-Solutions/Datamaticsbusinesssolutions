import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  TrendingUp,
  Target,
  DollarSign,
  Users,
  BarChart3,
  CheckCircle2,
  Clock,
  AlertCircle,
  Pause,
  FileText,
  Zap,
  ArrowUpRight,
  Plus,
  Eye,
} from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { AppLayout } from '../components/AppLayout';
import { useCountUp } from '../hooks/useCountUp';
import { AnimatedNumber } from '../components/AnimatedNumber';
import { AccountTeam } from '../components/AccountTeam';
import { getAccountTeam } from '../data/mockClients';
import { useAuth } from '../context/AuthContext';

// Mock sparkline data for trend visualization
const generateSparklineData = (baseValue: number, trend: 'up' | 'down' = 'up') => {
  return Array.from({ length: 12 }, (_, i) => ({
    value:
      trend === 'up'
        ? baseValue * (0.7 + i * 0.025 + Math.random() * 0.1)
        : baseValue * (1.3 - i * 0.025 + Math.random() * 0.1),
  }));
};

export default function HomePage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const accountTeam = getAccountTeam('client_1');

  // Animated counters for KPIs
  const totalLeads = useCountUp(1265, 1500);
  const activeCampaigns = useCountUp(3, 800);
  const acceptanceRate = useCountUp(93, 1200);
  const pendingInvoices = useCountUp(7800, 1500);

  // Sparkline data
  const leadsData = generateSparklineData(totalLeads / 12, 'up');
  const campaignsData = generateSparklineData(activeCampaigns, 'up');
  const revenueData = generateSparklineData(16500, 'up');

  const recentActivity = [
    {
      id: 1,
      icon: CheckCircle2,
      color: 'text-[#6B7280]', // Changed from green - just informational
      bg: 'bg-[#6B7280]/10',
      text: 'Sarah Chen accepted a lead from Healthcare Content Syndication',
      time: '2 minutes ago',
    },
    {
      id: 2,
      icon: FileText,
      color: 'text-[#6B7280]', // Changed from blue - just informational
      bg: 'bg-[#6B7280]/10',
      text: 'Invoice INV-2026-001088 generated for $2,400',
      time: '1 hour ago',
    },
    {
      id: 3,
      icon: Target,
      color: 'text-[#6B7280]', // Changed from purple - just informational
      bg: 'bg-[#6B7280]/10',
      text: 'SaaS Appointment Setting campaign reached 75% completion',
      time: '3 hours ago',
    },
    {
      id: 4,
      icon: Users,
      color: 'text-[#6B7280]', // Changed from orange - just informational
      bg: 'bg-[#6B7280]/10',
      text: 'New lead delivered: David Kim - Director of IT',
      time: '5 hours ago',
    },
  ];

  const needsAttention = [
    {
      id: 1,
      type: 'error',
      icon: AlertCircle,
      iconColor: 'text-[#C0392B]', // Red for urgent
      text: 'INV-2026-001087 is overdue by 14 days — $3,600 due',
      buttonText: 'Pay Now',
      buttonAction: () => navigate('/payment/INV-2026-001087'),
    },
    {
      id: 2,
      type: 'warning',
      icon: Clock,
      iconColor: 'text-[#F59E0B]', // Amber for warning (changed from orange-500)
      text: 'David Kim lead has been pending review for 4 days',
      buttonText: 'Review',
      buttonAction: () => navigate('/leads'),
    },
    {
      id: 3,
      type: 'info',
      icon: Pause,
      iconColor: 'text-[#6B7280]', // Grey for info (changed from blue)
      text: 'SaaS Appointment Setting campaign is paused at 30%',
      buttonText: 'View',
      buttonAction: () => navigate('/campaigns/2'),
    },
  ];

  return (
    <AppLayout>
      <div className="max-w-[1400px] mx-auto px-4 py-4 md:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[#1F2937] mb-2 text-2xl md:text-3xl">Welcome back, {currentUser?.name}</h1>
            <p className="text-sm text-[#6B7280]">
              Here's what's happening with your campaigns today
            </p>
          </div>
        </div>

        {/* KPI Cards with Sparklines - Top Row (3 cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Total Leads */}
          <motion.div
            className="relative overflow-hidden rounded-2xl p-6 bg-white/60 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.04)]"
            whileHover={{ y: -4, boxShadow: '0 16px 48px rgba(0,0,0,0.08)' }}
            transition={{ duration: 0.2 }}
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/10 via-transparent to-transparent opacity-50" />

            <div className="relative z-10 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">
                    Total Leads This Month
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-[#1F2937]">
                      <AnimatedNumber value={totalLeads} />
                    </span>
                    <span className="text-sm font-medium text-[#10B981]">
                      +12%
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#10B981]/20 to-[#34D399]/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-[#10B981]" />
                </div>
              </div>

              {/* Sparkline Chart */}
              <div className="h-12 -mx-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={leadsData}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={false}
                      animationDuration={1500}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          {/* Active Campaigns */}
          <motion.div
            className="relative overflow-hidden rounded-2xl p-6 bg-white/60 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.04)]"
            whileHover={{ y: -4, boxShadow: '0 16px 48px rgba(0,0,0,0.08)' }}
            transition={{ duration: 0.2 }}
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/10 via-transparent to-transparent opacity-50" />

            <div className="relative z-10 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">
                    Active Campaigns
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-[#1F2937]">
                      <AnimatedNumber value={activeCampaigns} />
                    </span>
                    <div className="flex items-center gap-1">
                      <div className="relative">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <div className="absolute inset-0 w-2 h-2 rounded-full bg-blue-500 animate-ping"></div>
                      </div>
                      <span className="text-sm font-medium text-blue-500">Live</span>
                    </div>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3B82F6]/20 to-[#60A5FA]/10 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-[#3B82F6]" />
                </div>
              </div>

              {/* Sparkline Chart */}
              <div className="h-12 -mx-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={campaignsData}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      dot={false}
                      animationDuration={1500}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          {/* Acceptance Rate */}
          <motion.div
            className="relative overflow-hidden rounded-2xl p-6 bg-white/60 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.04)]"
            whileHover={{ y: -4, boxShadow: '0 16px 48px rgba(0,0,0,0.08)' }}
            transition={{ duration: 0.2 }}
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/10 via-transparent to-transparent opacity-50" />

            <div className="relative z-10 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">
                    Acceptance Rate
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-[#1F2937]">
                      {acceptanceRate}%
                    </span>
                    <span className="text-sm font-medium text-[#10B981]">
                      +1%
                    </span>
                  </div>
                  <p className="text-xs text-[#6B7280] mt-1">
                    1,175 accepted of 1,265
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#10B981]/20 to-[#34D399]/10 flex items-center justify-center">
                  <Target className="w-6 h-6 text-[#10B981]" />
                </div>
              </div>

              {/* Sparkline Chart */}
              <div className="h-12 -mx-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={false}
                      animationDuration={1500}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Secondary KPI Cards - Bottom Row (3 smaller cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pending Invoices */}
          <motion.div
            className="rounded-xl p-5 bg-white/60 backdrop-blur-xl border border-white/20 shadow-[0_4px_16px_rgba(0,0,0,0.04)] cursor-pointer"
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate('/invoices')}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1">
                  Pending Invoices
                </p>
                <p className="text-2xl font-bold text-[#1F2937]">
                  ${(pendingInvoices / 1000).toFixed(1)}K
                </p>
                <p className="text-xs text-[#6B7280] mt-1">
                  1 invoice awaiting payment
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-500" />
              </div>
            </div>
          </motion.div>

          {/* Total Revenue YTD */}
          <motion.div
            className="rounded-xl p-5 bg-white/60 backdrop-blur-xl border border-white/20 shadow-[0_4px_16px_rgba(0,0,0,0.04)] cursor-pointer"
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate('/reports')}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1">
                  Total Revenue YTD
                </p>
                <p className="text-2xl font-bold text-[#1F2937]">$198.3K</p>
                <p className="text-xs text-[#6B7280] mt-1">
                  $49.6K avg per month
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </motion.div>

          {/* Open Support Tickets */}
          <motion.div
            className="rounded-xl p-5 bg-white/60 backdrop-blur-xl border border-white/20 shadow-[0_4px_16px_rgba(0,0,0,0.04)] cursor-pointer"
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate('/support')}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1">
                  Open Support Tickets
                </p>
                <p className="text-2xl font-bold text-[#1F2937]">0</p>
                <p className="text-xs text-[#6B7280] mt-1">All clear</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Activity & Needs Attention */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="rounded-2xl p-6 bg-white/60 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
            <h2 className="text-sm font-semibold text-[#1F2937] mb-4">
              Recent Activity
            </h2>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/40 transition-colors cursor-pointer"
                >
                  <div className={`p-2 rounded-lg ${activity.bg}`}>
                    <activity.icon className={`w-4 h-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#374151] leading-tight">
                      {activity.text}
                    </p>
                    <p className="text-xs text-[#9CA3AF] mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Needs Your Attention */}
          <div className="rounded-2xl p-6 bg-white/60 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
            <h2 className="text-sm font-semibold text-[#1F2937] mb-4">
              Needs Your Attention
            </h2>
            <div className="space-y-3">
              {needsAttention.map((item) => (
                <motion.div
                  key={item.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border-l-2 cursor-pointer ${
                    item.type === 'error'
                      ? 'border-l-[#C0392B] bg-red-50/30'
                      : item.type === 'warning'
                      ? 'border-l-[#F59E0B] bg-amber-50/30'
                      : 'border-l-[#6B7280] bg-gray-50/30'
                  }`}
                  whileHover={{ scale: 1.01 }}
                  onClick={item.buttonAction}
                >
                  <item.icon className={`w-5 h-5 ${item.iconColor} flex-shrink-0 mt-0.5`} />
                  <div className="flex-1">
                    <p className="text-sm text-[#374151] leading-tight">
                      {item.text}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <span
                        className={`text-sm font-semibold ${
                          item.type === 'error' ? 'text-[#C0392B]' : 'text-[#1E3A5F]'
                        }`}
                      >
                        {item.buttonText}
                      </span>
                      <ArrowUpRight
                        className={`w-3.5 h-3.5 ${
                          item.type === 'error' ? 'text-[#C0392B]' : 'text-[#1E3A5F]'
                        }`}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Campaign Snapshot */}
        <div className="rounded-2xl p-6 bg-white/60 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[#1F2937]">
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Campaign 1 */}
            <div
              className="rounded-xl p-4 bg-white border border-[#E5E7EB] cursor-pointer hover:shadow-lg transition-all"
              onClick={() => navigate('/campaigns/1')}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-[#1F2937] mb-1">
                    Enterprise IT Security Campaign Q1 2026
                  </h3>
                  <p className="text-xs text-[#6B7280]">Leads</p>
                </div>
                <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-600 whitespace-nowrap ml-2">
                  In Progress
                </span>
              </div>
              <div className="space-y-2">
                <div className="w-full rounded-full h-2 bg-[#E5E7EB] overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all duration-500"
                    style={{ width: '64%' }}
                  ></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#374151]">
                    320/500
                  </span>
                  <span className="text-xs font-semibold text-blue-600">
                    64%
                  </span>
                </div>
              </div>
            </div>

            {/* Campaign 2 */}
            <div
              className="rounded-xl p-4 bg-white border border-[#E5E7EB] cursor-pointer hover:shadow-lg transition-all"
              onClick={() => navigate('/campaigns/3')}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-[#1F2937] mb-1">
                    Healthcare Content Syndication Feb 2026
                  </h3>
                  <p className="text-xs text-[#6B7280]">
                    Content Syndication
                  </p>
                </div>
                <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-green-50 text-green-600 whitespace-nowrap ml-2">
                  Completed
                </span>
              </div>
              <div className="space-y-2">
                <div className="w-full rounded-full h-2 bg-[#E5E7EB] overflow-hidden">
                  <div
                    className="bg-green-500 h-full rounded-full transition-all duration-500"
                    style={{ width: '100%' }}
                  ></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#374151]">
                    850/800
                  </span>
                  <span className="text-xs font-semibold text-green-600">
                    106%
                  </span>
                </div>
              </div>
            </div>

            {/* Campaign 3 */}
            <div
              className="rounded-xl p-4 bg-white border border-[#E5E7EB] cursor-pointer hover:shadow-lg transition-all"
              onClick={() => navigate('/campaigns/4')}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-[#1F2937] mb-1">
                    Financial Services BANT Qualification
                  </h3>
                  <p className="text-xs text-[#6B7280]">BANT</p>
                </div>
                <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-600 whitespace-nowrap ml-2">
                  In Progress
                </span>
              </div>
              <div className="space-y-2">
                <div className="w-full rounded-full h-2 bg-[#E5E7EB] overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all duration-500"
                    style={{ width: '43%' }}
                  ></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#374151]">
                    129/300
                  </span>
                  <span className="text-xs font-semibold text-blue-600">
                    43%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Team */}
        {accountTeam && (
          <div className="mt-4">
            <AccountTeam
              manager={{
                name: accountTeam.manager.name,
                role: accountTeam.manager.role,
                email: accountTeam.manager.email,
                initials: accountTeam.manager.name
                  .split(' ')
                  .map((n) => n[0])
                  .join(''),
              }}
              backup={{
                name: accountTeam.backup.name,
                role: accountTeam.backup.role,
                email: accountTeam.backup.email,
                initials: accountTeam.backup.name
                  .split(' ')
                  .map((n) => n[0])
                  .join(''),
              }}
            />
          </div>
        )}
      </div>
    </AppLayout>
  );
}