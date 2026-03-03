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
  ArrowUpRight,
} from 'lucide-react';
import { AppLayout } from '../components/AppLayout';
import { AnimatedNumber } from '../components/AnimatedNumber';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { AccountTeam } from '../components/AccountTeam';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { getAccountTeam } from '../data/mockClients';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  useDocumentTitle('Dashboard');
  
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const accountTeam = getAccountTeam('client_1');

  // Time period states for interactive cards
  const [leadsPeriod, setLeadsPeriod] = useState<'1d' | '1w' | '1m' | '1y'>('1m');

  // Define actual realistic numbers for each period
  const leadsDataByPeriod = {
    '1d': 42,      // Daily average
    '1w': 294,     // Weekly total (42 × 7)
    '1m': 1265,    // Monthly total
    '1y': 15180    // Yearly total (1265 × 12)
  };

  const getPeriodLabel = (period: '1d' | '1w' | '1m' | '1y') => {
    return period === '1d' ? 'TODAY' : period === '1w' ? 'THIS WEEK' : period === '1m' ? 'THIS MONTH' : 'THIS YEAR';
  };

  // Get value based on selected period
  const totalLeadsValue = leadsDataByPeriod[leadsPeriod];

  // No useCountUp here — AnimatedNumber and AnimatedCounter handle animation
  // directly via imperative DOM updates (no React re-renders per frame)

  const recentActivity = [
    {
      id: 1,
      icon: CheckCircle2,
      color: 'text-[#6B7280]',
      bg: 'bg-[#6B7280]/10',
      text: 'Sarah Chen accepted a lead from Healthcare Content Syndication',
      time: '2 minutes ago',
    },
    {
      id: 2,
      icon: FileText,
      color: 'text-[#6B7280]',
      bg: 'bg-[#6B7280]/10',
      text: 'Invoice INV-2026-001088 generated for $2,400',
      time: '1 hour ago',
    },
    {
      id: 3,
      icon: Target,
      color: 'text-[#6B7280]',
      bg: 'bg-[#6B7280]/10',
      text: 'SaaS Appointment Setting campaign reached 75% completion',
      time: '3 hours ago',
    },
    {
      id: 4,
      icon: Users,
      color: 'text-[#6B7280]',
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
      iconColor: 'text-[#C0392B]',
      text: 'INV-2026-001087 is overdue by 14 days — $3,600 due',
      buttonText: 'Pay Now',
      buttonAction: () => navigate('/payment/INV-2026-001087'),
    },
    {
      id: 2,
      type: 'warning',
      icon: Clock,
      iconColor: 'text-[#F59E0B]',
      text: 'David Kim lead has been pending review for 4 days',
      buttonText: 'Review',
      buttonAction: () => navigate('/leads'),
    },
    {
      id: 3,
      type: 'info',
      icon: Pause,
      iconColor: 'text-[#6B7280]',
      text: 'SaaS Appointment Setting campaign is paused at 30%',
      buttonText: 'View',
      buttonAction: () => navigate('/campaigns/2'),
    },
  ];

  return (
    <AppLayout>
      <div className="max-w-[1400px] mx-auto page-content space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[#1F2937] mb-2 text-2xl md:text-3xl">Welcome back, {currentUser?.name}</h1>
            <p className="text-sm text-[#6B7280]">
              Here's what's happening with your campaigns today
            </p>
          </div>
        </div>

        {/* KPI Cards - Top Row (3 cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Total Leads - WITH INTERACTIVE BUTTONS */}
          <motion.div
            key={`leads-${leadsPeriod}-${totalLeadsValue}`}
            className="relative overflow-hidden rounded-2xl p-6 bg-white/60 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.04)]"
            whileHover={{ y: -4, boxShadow: '0 16px 48px rgba(0,0,0,0.08)' }}
            transition={{ duration: 0.2 }}
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/10 via-transparent to-transparent opacity-50" />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">
                    Total Leads {getPeriodLabel(leadsPeriod)}
                  </p>

                  {/* INTERACTIVE TIME PERIOD BUTTONS */}
                  <div className="flex gap-1 mb-4 bg-white/80 p-1 rounded-lg" style={{ width: 'fit-content' }}>
                    {(['1d', '1w', '1m', '1y'] as const).map((period) => (
                      <button
                        key={period}
                        onClick={() => {
                          setLeadsPeriod(period);
                        }}
                        className={`px-2 py-1 rounded-md text-xs font-bold uppercase transition-all ${ leadsPeriod === period
                            ? 'bg-[#BA2027] text-white shadow-md'
                            : 'bg-transparent text-[#6B7280] hover:bg-[#BA2027] hover:text-white'
                        }`}
                        style={{
                          fontSize: '10px',
                          minWidth: '42px'
                        }}
                      >
                        {period === '1d' ? 'Day' : period === '1w' ? 'Week' : period === '1m' ? 'Month' : 'Year'}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-[#1F2937]">
                      <AnimatedNumber value={totalLeadsValue} />
                    </span>
                    <span className="text-sm font-medium text-[#10B981]">
                      +12%
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#10B981]/20 to-[#34D399]/10 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-[#10B981]" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Active Campaigns - NO SPARKLINE */}
          <motion.div
            className="relative overflow-hidden rounded-2xl p-6 bg-white/60 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.04)]"
            whileHover={{ y: -4, boxShadow: '0 16px 48px rgba(0,0,0,0.08)' }}
            transition={{ duration: 0.2 }}
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/10 via-transparent to-transparent opacity-50" />

            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">
                    Active Campaigns
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-[#1F2937]">
                      <AnimatedNumber value={3} />
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
            </div>
          </motion.div>

          {/* Acceptance Rate - NO SPARKLINE */}
          <motion.div
            className="relative overflow-hidden rounded-2xl p-6 bg-white/60 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.04)]"
            whileHover={{ y: -4, boxShadow: '0 16px 48px rgba(0,0,0,0.08)' }}
            transition={{ duration: 0.2 }}
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/10 via-transparent to-transparent opacity-50" />

            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">
                    Acceptance Rate
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-[#1F2937]">
                      <AnimatedCounter end={93} duration={1200} suffix="%" />
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
                  $<AnimatedCounter end={7.8} decimals={1} duration={1500} suffix="K" />
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
          <div className="rounded-2xl p-6 bg-white/60 backdrop-blur-xl border border-white/20 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
            <h2 className="font-semibold text-[#1C1C1E] mb-4" style={{ fontSize: '18px', fontWeight: 600 }}>
              Recent Activity
            </h2>
            <div className="divide-y divide-black/[0.04]">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 py-3 first:pt-0 last:pb-0 hover:bg-white/40 rounded-xl px-2 transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <activity.icon className="w-4 h-4 text-[#6E6E73]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#1C1C1E]" style={{ fontSize: '14px', fontWeight: 400 }}>
                      {activity.text}
                    </p>
                    <p className="text-[#6E6E73] mt-0.5" style={{ fontSize: '12px' }}>
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Needs Your Attention */}
          <div className="rounded-2xl p-6 bg-white/60 backdrop-blur-xl border border-white/20 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
            <h2 className="font-semibold text-[#1C1C1E] mb-4" style={{ fontSize: '18px', fontWeight: 600 }}>
              Needs Your Attention
            </h2>
            <div className="space-y-3">
              {needsAttention.map((item) => {
                const borderColor =
                  item.type === 'error' ? '#FF3B30' :
                  item.type === 'warning' ? '#FF9F0A' : '#8E8E93';

                const bgTint =
                  item.type === 'error' ? 'rgba(255,59,48,0.05)' :
                  item.type === 'warning' ? 'rgba(255,159,10,0.05)' : 'rgba(142,142,147,0.05)';

                const pillBg =
                  item.type === 'error' ? 'rgba(255,59,48,0.12)' :
                  item.type === 'warning' ? 'rgba(255,159,10,0.12)' : 'rgba(142,142,147,0.12)';

                const pillText =
                  item.type === 'error' ? '#FF3B30' :
                  item.type === 'warning' ? '#C47A00' : '#6E6E73';

                return (
                  <motion.div
                    key={item.id}
                    whileHover={{ x: 2, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
                    transition={{ duration: 0.18 }}
                    onClick={item.buttonAction}
                    className="flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all"
                    style={{
                      borderLeft: `3px solid ${borderColor}`,
                      borderRadius: '12px',
                      background: bgTint,
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: pillBg }}
                    >
                      <item.icon className="w-4 h-4" style={{ color: borderColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#1C1C1E] leading-snug" style={{ fontSize: '14px', fontWeight: 400 }}>
                        {item.text}
                      </p>
                      <div className="mt-2">
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                          style={{ background: pillBg, color: pillText, fontSize: '12px', fontWeight: 600 }}
                        >
                          {item.buttonText} ↗
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Campaign Snapshot */}
        <div className="rounded-2xl p-6 bg-white/60 backdrop-blur-xl border border-white/20 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-[#1C1C1E]" style={{ fontSize: '18px', fontWeight: 600 }}>
              Campaign Snapshot
            </h2>
            <button
              onClick={() => navigate('/campaigns')}
              className="flex items-center gap-1 text-[#BA2027] hover:text-[#9A1A21] transition-colors font-semibold"
              style={{ fontSize: '14px', fontWeight: 600 }}
            >
              View all campaigns
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Campaign 1 — In Progress */}
            <motion.div
              className="rounded-xl p-4 bg-white border border-[#E5E7EB] cursor-pointer transition-all"
              onClick={() => navigate('/campaigns/camp_1')}
              whileHover={{
                borderColor: 'rgba(0,122,255,0.4)',
                boxShadow: '0 4px 20px rgba(0,122,255,0.08)',
              }}
              transition={{ duration: 0.18 }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[#1C1C1E] mb-1 leading-snug" style={{ fontSize: '14px' }}>
                    Enterprise IT Security Campaign Q1 2026
                  </h3>
                  <p className="text-[#6E6E73]" style={{ fontSize: '12px' }}>Leads</p>
                </div>
                <span className="ml-2 flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600" style={{ fontSize: '12px', fontWeight: 600 }}>
                  In Progress
                </span>
              </div>
              <div className="progress-bar mt-3">
                <div className="progress-bar__fill" style={{ width: '64%' }} />
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[#6E6E73]" style={{ fontSize: '12px' }}>320/500</span>
                <span className="text-[#6E6E73]" style={{ fontSize: '12px' }}>64%</span>
              </div>
            </motion.div>

            {/* Campaign 2 — Completed */}
            <motion.div
              className="rounded-xl p-4 bg-white border border-[#E5E7EB] cursor-pointer transition-all"
              onClick={() => navigate('/campaigns/camp_3')}
              whileHover={{
                borderColor: 'rgba(0,122,255,0.4)',
                boxShadow: '0 4px 20px rgba(0,122,255,0.08)',
              }}
              transition={{ duration: 0.18 }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[#1C1C1E] mb-1 leading-snug" style={{ fontSize: '14px' }}>
                    Healthcare Content Syndication Feb 2026
                  </h3>
                  <p className="text-[#6E6E73]" style={{ fontSize: '12px' }}>Content Syndication</p>
                </div>
                <span className="ml-2 flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-600" style={{ fontSize: '12px', fontWeight: 600 }}>
                  Completed
                </span>
              </div>
              <div className="progress-bar mt-3">
                <div className="progress-bar__fill progress-bar__fill--completed" style={{ width: '100%' }} />
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[#6E6E73]" style={{ fontSize: '12px' }}>850/800</span>
                <span className="text-[#6E6E73]" style={{ fontSize: '12px' }}>106%</span>
              </div>
            </motion.div>

            {/* Campaign 3 — In Progress */}
            <motion.div
              className="rounded-xl p-4 bg-white border border-[#E5E7EB] cursor-pointer transition-all"
              onClick={() => navigate('/campaigns/camp_4')}
              whileHover={{
                borderColor: 'rgba(0,122,255,0.4)',
                boxShadow: '0 4px 20px rgba(0,122,255,0.08)',
              }}
              transition={{ duration: 0.18 }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[#1C1C1E] mb-1 leading-snug" style={{ fontSize: '14px' }}>
                    Financial Services BANT Qualification
                  </h3>
                  <p className="text-[#6E6E73]" style={{ fontSize: '12px' }}>BANT</p>
                </div>
                <span className="ml-2 flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600" style={{ fontSize: '12px', fontWeight: 600 }}>
                  In Progress
                </span>
              </div>
              <div className="progress-bar mt-3">
                <div className="progress-bar__fill" style={{ width: '43%' }} />
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[#6E6E73]" style={{ fontSize: '12px' }}>129/300</span>
                <span className="text-[#6E6E73]" style={{ fontSize: '12px' }}>43%</span>
              </div>
            </motion.div>
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