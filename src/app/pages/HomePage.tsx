import { useState, useMemo } from 'react';
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

// ─── Greeting helpers ────────────────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function getFormattedDate() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}
// ─────────────────────────────────────────────────────────────────────────────

export default function HomePage() {
  useDocumentTitle('Dashboard');

  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const accountTeam = getAccountTeam('client_1');

  const [leadsPeriod, setLeadsPeriod] = useState<'1d' | '1w' | '1m' | '1y'>('1m');

  const leadsDataByPeriod = {
    '1d': 42,
    '1w': 294,
    '1m': 1265,
    '1y': 15180,
  };

  const getPeriodLabel = (period: '1d' | '1w' | '1m' | '1y') =>
    period === '1d' ? 'TODAY' : period === '1w' ? 'THIS WEEK' : period === '1m' ? 'THIS MONTH' : 'THIS YEAR';

  const totalLeadsValue = leadsDataByPeriod[leadsPeriod];

  const greeting = useMemo(() => getGreeting(), []);
  const formattedDate = useMemo(() => getFormattedDate(), []);
  const initials = useMemo(() => getInitials(currentUser?.name ?? ''), [currentUser?.name]);

  const recentActivity = [
    {
      id: 1,
      icon: CheckCircle2,
      text: 'Sarah Chen accepted a lead from Healthcare Content Syndication',
      time: '2 minutes ago',
    },
    {
      id: 2,
      icon: FileText,
      text: 'Invoice INV-2026-001088 generated for $2,400',
      time: '1 hour ago',
    },
    {
      id: 3,
      icon: Target,
      text: 'SaaS Appointment Setting campaign reached 75% completion',
      time: '3 hours ago',
    },
    {
      id: 4,
      icon: Users,
      text: 'New lead delivered: David Kim - Director of IT',
      time: '5 hours ago',
    },
  ];

  const needsAttention = [
    {
      id: 1,
      type: 'error',
      icon: AlertCircle,
      text: 'INV-2026-001087 is overdue by 14 days — $3,600 due',
      buttonText: 'Pay Now',
      buttonAction: () => navigate('/payment/INV-2026-001087'),
    },
    {
      id: 2,
      type: 'warning',
      icon: Clock,
      text: 'David Kim lead has been pending review for 4 days',
      buttonText: 'Review',
      buttonAction: () => navigate('/leads'),
    },
    {
      id: 3,
      type: 'info',
      icon: Pause,
      text: 'SaaS Appointment Setting campaign is paused at 30%',
      buttonText: 'View',
      buttonAction: () => navigate('/campaigns/2'),
    },
  ];

  return (
    <AppLayout>
      <div className="max-w-[1400px] mx-auto page-content space-y-6">

        {/* ── Welcome Banner ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-2xl px-6 py-5"
          style={{
            background: 'rgba(255,255,255,0.78)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.65)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
          }}
        >
          {/* Subtle brand gradient mesh — top-right corner */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 55% 80% at 100% 0%, rgba(186,32,39,0.06) 0%, transparent 70%)',
            }}
          />
          {/* Dot-grid texture */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: 'radial-gradient(circle, #BA2027 1px, transparent 1px)',
              backgroundSize: '22px 22px',
            }}
          />

          {/* Content — avatar + greeting only */}
          <div className="relative z-10 flex items-center gap-4">
            {/* Initials avatar */}
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 select-none"
              style={{
                background: 'linear-gradient(135deg, #BA2027 0%, #D32F2F 100%)',
                boxShadow: '0 4px 14px rgba(186,32,39,0.28)',
                color: '#fff',
                fontSize: '15px',
                fontWeight: 700,
                letterSpacing: '-0.01em',
              }}
            >
              {initials}
            </div>

            {/* Greeting text */}
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span
                  style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#111',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.2,
                  }}
                >
                  {greeting}, {currentUser?.name?.split(' ')[0]}
                </span>
                {/* Live pulse dot */}
                <span className="relative flex h-2 w-2 mt-px">
                  <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
                    style={{ background: '#BA2027' }}
                  />
                  <span
                    className="relative inline-flex rounded-full h-2 w-2"
                    style={{ background: '#BA2027' }}
                  />
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: 400 }}>
                  {currentUser?.company ?? 'DatamaticsBPM'}
                </span>
                <span style={{ color: '#D1D5DB' }}>·</span>
                <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: 400 }}>
                  {formattedDate}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
        {/* ── End Welcome Banner ─────────────────────────────────────────── */}

        {/* KPI Cards — top row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Total Leads */}
          <motion.div
            key={`leads-${leadsPeriod}-${totalLeadsValue}`}
            className="relative overflow-hidden rounded-2xl p-6 bg-white/60 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.04)]"
            whileHover={{ y: -4, boxShadow: '0 16px 48px rgba(0,0,0,0.08)' }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/10 via-transparent to-transparent opacity-50" />
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">
                    Total Leads {getPeriodLabel(leadsPeriod)}
                  </p>
                  <div className="flex gap-1 mb-4 bg-white/80 p-1 rounded-lg" style={{ width: 'fit-content' }}>
                    {(['1d', '1w', '1m', '1y'] as const).map((period) => (
                      <button
                        key={period}
                        onClick={() => setLeadsPeriod(period)}
                        className={`px-2 py-1 rounded-md text-xs font-bold uppercase transition-all ${
                          leadsPeriod === period
                            ? 'bg-[#BA2027] text-white shadow-md'
                            : 'bg-transparent text-[#6B7280] hover:bg-[#BA2027] hover:text-white'
                        }`}
                        style={{ fontSize: '10px', minWidth: '42px' }}
                      >
                        {period === '1d' ? 'Day' : period === '1w' ? 'Week' : period === '1m' ? 'Month' : 'Year'}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-[#1F2937]">
                      <AnimatedNumber value={totalLeadsValue} />
                    </span>
                    <span className="text-sm font-medium text-[#10B981]">+12%</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#10B981]/20 to-[#34D399]/10 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-[#10B981]" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Active Campaigns */}
          <motion.div
            className="relative overflow-hidden rounded-2xl p-6 bg-white/60 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.04)]"
            whileHover={{ y: -4, boxShadow: '0 16px 48px rgba(0,0,0,0.08)' }}
            transition={{ duration: 0.2 }}
          >
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
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <div className="absolute inset-0 w-2 h-2 rounded-full bg-blue-500 animate-ping" />
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

          {/* Acceptance Rate */}
          <motion.div
            className="relative overflow-hidden rounded-2xl p-6 bg-white/60 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.04)]"
            whileHover={{ y: -4, boxShadow: '0 16px 48px rgba(0,0,0,0.08)' }}
            transition={{ duration: 0.2 }}
          >
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
                    <span className="text-sm font-medium text-[#10B981]">+1%</span>
                  </div>
                  <p className="text-xs text-[#6B7280] mt-1">1,175 accepted of 1,265</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#10B981]/20 to-[#34D399]/10 flex items-center justify-center">
                  <Target className="w-6 h-6 text-[#10B981]" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Secondary KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <p className="text-xs text-[#6B7280] mt-1">1 invoice awaiting payment</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-500" />
              </div>
            </div>
          </motion.div>

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
                <p className="text-xs text-[#6B7280] mt-1">$49.6K avg per month</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </motion.div>

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

          <div className="rounded-2xl p-6 bg-white/60 backdrop-blur-xl border border-white/20 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
            <h2 className="font-semibold text-[#1C1C1E] mb-4" style={{ fontSize: '18px', fontWeight: 600 }}>
              Needs Your Attention
            </h2>
            <div className="space-y-3">
              {needsAttention.map((item) => {
                const borderColor =
                  item.type === 'error' ? '#FF3B30' : item.type === 'warning' ? '#FF9F0A' : '#8E8E93';
                const bgTint =
                  item.type === 'error' ? 'rgba(255,59,48,0.05)' : item.type === 'warning' ? 'rgba(255,159,10,0.05)' : 'rgba(142,142,147,0.05)';
                const pillBg =
                  item.type === 'error' ? 'rgba(255,59,48,0.12)' : item.type === 'warning' ? 'rgba(255,159,10,0.12)' : 'rgba(142,142,147,0.12)';
                const pillText =
                  item.type === 'error' ? '#FF3B30' : item.type === 'warning' ? '#C47A00' : '#6E6E73';

                return (
                  <motion.div
                    key={item.id}
                    whileHover={{ x: 2, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
                    transition={{ duration: 0.18 }}
                    onClick={item.buttonAction}
                    className="flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all"
                    style={{ borderLeft: `3px solid ${borderColor}`, borderRadius: '12px', background: bgTint }}
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
            {[
              {
                id: 'camp_1',
                name: 'Enterprise IT Security Campaign Q1 2026',
                type: 'Leads',
                status: 'In Progress',
                statusClass: 'bg-blue-50 text-blue-600',
                progress: 64,
                done: '320/500',
              },
              {
                id: 'camp_3',
                name: 'Healthcare Content Syndication Feb 2026',
                type: 'Content Syndication',
                status: 'Completed',
                statusClass: 'bg-green-50 text-green-600',
                progress: 100,
                done: '850/800',
                completed: true,
              },
              {
                id: 'camp_4',
                name: 'Financial Services BANT Qualification',
                type: 'BANT',
                status: 'In Progress',
                statusClass: 'bg-blue-50 text-blue-600',
                progress: 43,
                done: '129/300',
              },
            ].map((c) => (
              <motion.div
                key={c.id}
                className="rounded-xl p-4 bg-white border border-[#E5E7EB] cursor-pointer transition-all"
                onClick={() => navigate(`/campaigns/${c.id}`)}
                whileHover={{ borderColor: 'rgba(0,122,255,0.4)', boxShadow: '0 4px 20px rgba(0,122,255,0.08)' }}
                transition={{ duration: 0.18 }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#1C1C1E] mb-1 leading-snug" style={{ fontSize: '14px' }}>
                      {c.name}
                    </h3>
                    <p className="text-[#6E6E73]" style={{ fontSize: '12px' }}>{c.type}</p>
                  </div>
                  <span
                    className={`ml-2 flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${c.statusClass}`}
                    style={{ fontSize: '12px', fontWeight: 600 }}
                  >
                    {c.status}
                  </span>
                </div>
                <div className="progress-bar mt-3">
                  <div
                    className={`progress-bar__fill${c.completed ? ' progress-bar__fill--completed' : ''}`}
                    style={{ width: `${c.progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[#6E6E73]" style={{ fontSize: '12px' }}>{c.done}</span>
                  <span className="text-[#6E6E73]" style={{ fontSize: '12px' }}>{c.progress}%</span>
                </div>
              </motion.div>
            ))}
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
                initials: accountTeam.manager.name.split(' ').map((n) => n[0]).join(''),
              }}
              backup={{
                name: accountTeam.backup.name,
                role: accountTeam.backup.role,
                email: accountTeam.backup.email,
                initials: accountTeam.backup.name.split(' ').map((n) => n[0]).join(''),
              }}
            />
          </div>
        )}
      </div>
    </AppLayout>
  );
}
