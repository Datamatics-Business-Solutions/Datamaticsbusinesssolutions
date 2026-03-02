import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  TrendingUp,
  Target,
  DollarSign,
  Search,
  Circle,
  CheckCircle2,
  Pause,
  Clock,
  FolderOpen,
  Plus,
} from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { mockCampaigns } from '../mockData';
import { AppLayout } from '../components/AppLayout';
import { useCountUp } from '../hooks/useCountUp';
import { NewCampaignModal, CampaignFormData } from '../components/NewCampaignModal';
import { EmptyState } from '../components/EmptyState';
import { AccountTeam } from '../components/AccountTeam';
import { getAccountTeam } from '../data/mockClients';
import { useAuth } from '../context/AuthContext';

// Mock sparkline data for trend visualization
const generateSparklineData = (baseValue: number, trend: 'up' | 'down' = 'up') => {
  return Array.from({ length: 12 }, (_, i) => ({
    value: trend === 'up' 
      ? baseValue * (0.7 + (i * 0.025) + Math.random() * 0.1)
      : baseValue * (1.3 - (i * 0.025) + Math.random() * 0.1)
  }));
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isNewCampaignModalOpen, setIsNewCampaignModalOpen] = useState(false);

  const accountTeam = getAccountTeam('client_1');

  const activeCampaigns = mockCampaigns.filter((c) => c.status === 'In progress').length;
  const totalLeadsDelivered = mockCampaigns.reduce((sum, c) => sum + c.delivered, 0);
  const totalSpend = 24500;

  // Animated counters
  const animatedCampaigns = useCountUp(activeCampaigns, 1500);
  const animatedLeads = useCountUp(totalLeadsDelivered, 2000);
  const animatedSpend = useCountUp(totalSpend, 1800);

  // Sparkline data
  const campaignsData = generateSparklineData(activeCampaigns, 'up');
  const leadsData = generateSparklineData(totalLeadsDelivered / 12, 'up');
  const spendData = generateSparklineData(totalSpend / 12, 'down');

  const filteredCampaigns = mockCampaigns.filter((campaign) => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusPill = (status: string) => {
    const config = {
      'In progress': {
        classes: 'badge badge-active',
        icon: Circle,
        hasPulse: true,
      },
      Completed: {
        classes: 'badge badge-completed',
        icon: CheckCircle2,
        hasPulse: false,
      },
      Paused: {
        classes: 'badge badge-paused',
        icon: Pause,
        hasPulse: false,
      },
      'Not started': {
        classes: 'badge badge-paused',
        icon: Clock,
        hasPulse: false,
      },
    };

    const statusConfig = config[status as keyof typeof config] || config['Not started'];
    const Icon = statusConfig.icon;

    return (
      <span className={statusConfig.classes}>
        <Icon className={`w-3.5 h-3.5 ${statusConfig.hasPulse ? 'animate-pulse' : ''}`} />
        {status}
      </span>
    );
  };

  return (
    <AppLayout>
      <div className="max-w-[1400px] mx-auto px-4 py-4 md:px-6 md:py-6 lg:px-8 lg:py-8 space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div>
            <h1 style={{ color: 'var(--color-text-primary)' }} className="mb-2 text-2xl md:text-3xl lg:text-4xl">My Campaigns</h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
              Track and manage all your active campaigns
            </p>
          </div>
          <motion.button
            onClick={() => setIsNewCampaignModalOpen(true)}
            className="btn-primary flex items-center gap-2 px-6 py-3 w-full sm:w-auto justify-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-4 h-4" />
            Start a Campaign
          </motion.button>
        </div>

        {/* KPI Cards with Sparklines */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 stagger-children">
          {/* Active Campaigns */}
          <motion.div className="kpi-card animate-slideInUp">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/10 via-transparent to-transparent opacity-50" />
            
            <div className="relative z-10 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="kpi-card__label">Active Campaigns</p>
                  <div className="flex items-baseline gap-2">
                    <span className="kpi-card__number">{animatedCampaigns}</span>
                    <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-success)' }}>
                      +8%
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-primary-light)]/10 flex items-center justify-center">
                  <Target className="w-6 h-6" style={{ color: 'var(--color-primary)' }} />
                </div>
              </div>

              {/* Sparkline Chart */}
              <div className="h-12 -mx-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={campaignsData}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="var(--color-primary)"
                      strokeWidth={2}
                      dot={false}
                      animationDuration={1500}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          {/* Leads Delivered */}
          <motion.div className="kpi-card animate-slideInUp">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-success)]/10 via-transparent to-transparent opacity-50" />
            
            <div className="relative z-10 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="kpi-card__label">Leads Delivered</p>
                  <div className="flex items-baseline gap-2">
                    <span className="kpi-card__number">{animatedLeads.toLocaleString()}</span>
                    <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-success)' }}>
                      +12%
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-success-bg)' }}>
                  <TrendingUp className="w-6 h-6" style={{ color: 'var(--color-success)' }} />
                </div>
              </div>

              {/* Sparkline Chart */}
              <div className="h-12 -mx-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={leadsData}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="var(--color-success)"
                      strokeWidth={2}
                      dot={false}
                      animationDuration={1500}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          {/* Total Spend */}
          <motion.div className="kpi-card animate-slideInUp">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-warning)]/10 via-transparent to-transparent opacity-50" />
            
            <div className="relative z-10 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="kpi-card__label">Total Spend</p>
                  <div className="flex items-baseline gap-2">
                    <span className="kpi-card__number">${animatedSpend.toLocaleString()}</span>
                    <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-primary)' }}>
                      -3%
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-warning-bg)' }}>
                  <DollarSign className="w-6 h-6" style={{ color: 'var(--color-warning)' }} />
                </div>
              </div>

              {/* Sparkline Chart */}
              <div className="h-12 -mx-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={spendData}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="var(--color-warning)"
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

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-base w-full pl-12 pr-4 py-3"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-base px-4 py-3 appearance-none cursor-pointer"
          >
            <option value="All">All Status</option>
            <option value="In progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Paused">Paused</option>
            <option value="Not started">Not Started</option>
          </select>
        </div>

        {/* Campaign Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ background: 'var(--color-border-light)', borderBottom: '1px solid var(--color-border)' }}>
                <tr>
                  <th className="px-6 py-4 text-left" style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-wide)' }}>
                    Campaign
                  </th>
                  <th className="px-6 py-4 text-left" style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-wide)' }}>
                    Type
                  </th>
                  <th className="px-6 py-4 text-left" style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-wide)' }}>
                    Status
                  </th>
                  <th className="px-6 py-4 text-left" style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-wide)' }}>
                    Progress
                  </th>
                  <th className="px-6 py-4 text-left" style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-wide)' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody style={{ borderTop: '1px solid var(--color-border)' }}>
                {filteredCampaigns.map((campaign, index) => {
                  const progress = (campaign.delivered / campaign.target) * 100;
                  return (
                    <motion.tr
                      key={campaign.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-white/40 transition-colors cursor-pointer"
                      style={{ borderBottom: '1px solid var(--color-border-light)' }}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
                            {campaign.name}
                          </div>
                          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }} className="mt-1">
                            {campaign.clientCompany}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                          {campaign.serviceType}
                        </span>
                      </td>
                      <td className="px-6 py-4">{getStatusPill(campaign.status)}</td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <div className="progress-bar flex-1">
                              <div
                                className="progress-bar__fill"
                                style={{ '--progress-value': `${Math.min(progress, 100)}%` } as React.CSSProperties}
                              />
                            </div>
                            <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-secondary)' }}>
                              {Math.round(progress)}%
                            </span>
                          </div>
                          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                            {campaign.delivered.toLocaleString()} / {campaign.target.toLocaleString()} leads
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => navigate(`/campaigns/${campaign.id}`)}
                          className="btn-outline px-4 py-2"
                          style={{ fontSize: 'var(--font-size-sm)' }}
                        >
                          View Details
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredCampaigns.length === 0 && (
            <div className="py-16">
              <EmptyState
                icon={FolderOpen}
                title="No campaigns found"
                description="We couldn't find any campaigns matching your search criteria"
                actionLabel="Create Campaign"
                onAction={() => setIsNewCampaignModalOpen(true)}
              />
            </div>
          )}
        </div>

        {/* Account Team */}
        {accountTeam && (
          <div className="mt-8">
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

      {/* Modal */}
      <NewCampaignModal
        isOpen={isNewCampaignModalOpen}
        onClose={() => setIsNewCampaignModalOpen(false)}
        onSubmit={(formData: CampaignFormData) => {
          console.log('New Campaign Form Data:', formData);
          setIsNewCampaignModalOpen(false);
        }}
      />
    </AppLayout>
  );
}