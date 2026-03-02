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
  BarChart2,
  ChevronDown,
} from 'lucide-react';
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
  
  // Individual time period states for each card
  const [campaignsPeriod, setCampaignsPeriod] = useState<'1d' | '1w' | '1m' | '1y'>('1m');
  const [leadsPeriod, setLeadsPeriod] = useState<'1d' | '1w' | '1m' | '1y'>('1m');
  const [spendPeriod, setSpendPeriod] = useState<'1d' | '1w' | '1m' | '1y'>('1m');

  const accountTeam = getAccountTeam('client_1');

  // Base data
  const baseCampaigns = mockCampaigns.filter((c) => c.status === 'In progress').length;
  const baseLeadsMonthly = mockCampaigns.reduce((sum, c) => sum + c.delivered, 0);
  const baseSpendMonthly = 24500;

  // Calculate metrics based on period
  const getMultiplier = (period: '1d' | '1w' | '1m' | '1y') => {
    return period === '1d' ? 0.033 : period === '1w' ? 0.25 : period === '1m' ? 1 : 12;
  };
  
  const getPeriodLabel = (period: '1d' | '1w' | '1m' | '1y') => {
    return period === '1d' ? 'TODAY' : period === '1w' ? 'THIS WEEK' : period === '1m' ? 'THIS MONTH' : 'THIS YEAR';
  };

  const activeCampaigns = Math.round(baseCampaigns * getMultiplier(campaignsPeriod));
  const totalLeadsDelivered = Math.round(baseLeadsMonthly * getMultiplier(leadsPeriod));
  const totalSpend = Math.round(baseSpendMonthly * getMultiplier(spendPeriod));

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
            <h1 className="mb-2">My Campaigns</h1>
            <p className="text-sm text-[#6B7280]">
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

        {/* KPI Cards - REDESIGNED WITH INTERACTIVITY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 stagger-children">
          {/* Active Campaigns Card */}
          <motion.div 
            key={`campaigns-${campaignsPeriod}`}
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl border border-[#EEECEC] p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">ACTIVE CAMPAIGNS</h5>
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <BarChart2 className="w-5 h-5 text-blue-500" />
              </div>
            </div>

            {/* PROMINENT TIME SELECTOR */}
            <div className="flex items-center gap-1.5 mb-6 p-1.5 bg-[#F3F4F6] rounded-lg">
              {(['1d', '1w', '1m', '1y'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => {
                    setCampaignsPeriod(period);
                  }}
                  className={`px-2 py-1 rounded-md text-xs font-bold uppercase transition-all ${ campaignsPeriod === period ? 'bg-[#BA2027] text-white shadow-md' : 'bg-transparent text-[#6B7280] hover:bg-[#BA2027] hover:text-white' }`}
                  style={{
                    fontSize: '10px',
                    minWidth: '42px'
                  }}
                >
                  {period === '1d' ? 'Day' : period === '1w' ? 'Week' : period === '1m' ? 'Month' : 'Year'}
                </button>
              ))}
            </div>
            
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-[36px] font-bold text-[#1A1A1A] tracking-tight leading-none">{animatedCampaigns}</span>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#059669]">
                <TrendingUp className="w-4 h-4" />
                +8%
              </span>
            </div>
            <p className="text-xs text-[#6B7280]">vs previous period</p>
          </motion.div>

          {/* Total Leads Card - WITH INTERACTIVE BUTTONS */}
          <motion.div 
            key={`leads-${leadsPeriod}`}
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl border border-[#EEECEC] p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">
                TOTAL LEADS {getPeriodLabel(leadsPeriod)}
              </h5>
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
            </div>

            {/* PROMINENT TIME SELECTOR */}
            <div className="flex items-center gap-1.5 mb-6 p-1.5 bg-[#F3F4F6] rounded-lg">
              {(['1d', '1w', '1m', '1y'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => {
                    setLeadsPeriod(period);
                  }}
                  className={`px-2 py-1 rounded-md text-xs font-bold uppercase transition-all ${ leadsPeriod === period ? 'bg-[#BA2027] text-white shadow-md' : 'bg-transparent text-[#6B7280] hover:bg-[#BA2027] hover:text-white' }`}
                  style={{
                    fontSize: '10px',
                    minWidth: '42px'
                  }}
                >
                  {period === '1d' ? 'Day' : period === '1w' ? 'Week' : period === '1m' ? 'Month' : 'Year'}
                </button>
              ))}
            </div>
            
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-[36px] font-bold text-[#1A1A1A] tracking-tight leading-none">{animatedLeads.toLocaleString()}</span>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#059669]">
                <TrendingUp className="w-4 h-4" />
                +12%
              </span>
            </div>
            <p className="text-xs text-[#6B7280]">vs previous period</p>
          </motion.div>

          {/* Total Spend Card */}
          <motion.div 
            key={`spend-${spendPeriod}`}
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl border border-[#EEECEC] p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">TOTAL SPEND</h5>
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-amber-500" />
              </div>
            </div>

            {/* PROMINENT TIME SELECTOR */}
            <div className="flex items-center gap-1.5 mb-6 p-1.5 bg-[#F3F4F6] rounded-lg">
              {(['1d', '1w', '1m', '1y'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => {
                    setSpendPeriod(period);
                  }}
                  className={`px-2 py-1 rounded-md text-xs font-bold uppercase transition-all ${ spendPeriod === period ? 'bg-[#BA2027] text-white shadow-md' : 'bg-transparent text-[#6B7280] hover:bg-[#BA2027] hover:text-white' }`}
                  style={{
                    fontSize: '10px',
                    minWidth: '42px'
                  }}
                >
                  {period === '1d' ? 'Day' : period === '1w' ? 'Week' : period === '1m' ? 'Month' : 'Year'}
                </button>
              ))}
            </div>
            
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-[36px] font-bold text-[#1A1A1A] tracking-tight leading-none">${animatedSpend.toLocaleString()}</span>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#BA2027]">
                <TrendingUp className="w-4 h-4 rotate-180" />
                -3%
              </span>
            </div>
            <p className="text-xs text-[#6B7280]">vs previous period</p>
          </motion.div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-base w-full pl-12 pr-4 py-3"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-base px-4 py-3 pr-10 appearance-none cursor-pointer w-full sm:w-auto"
            >
              <option value="All">All Status</option>
              <option value="In progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Paused">Paused</option>
              <option value="Not started">Not Started</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280] pointer-events-none" />
          </div>
        </div>

        {/* Campaign Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F9F9F9] border-b border-[#EEECEC]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                    Campaign
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="border-t border-[#EEECEC]">
                {filteredCampaigns.map((campaign, index) => {
                  const progress = (campaign.delivered / campaign.target) * 100;
                  return (
                    <motion.tr
                      key={campaign.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-white/40 transition-colors cursor-pointer border-b border-[#F5F5F5]"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-semibold text-[#1F2937]">
                            {campaign.name}
                          </div>
                          <div className="text-xs text-[#6B7280] mt-1">
                            {campaign.clientCompany}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-[#6B7280]">
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
                                style={{ width: `${Math.min(progress, 100)}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-[#6B7280]">
                              {Math.round(progress)}%
                            </span>
                          </div>
                          <div className="text-xs text-[#9CA3AF]">
                            {campaign.delivered.toLocaleString()} / {campaign.target.toLocaleString()} leads
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => navigate(`/campaigns/${campaign.id}`)}
                          className="btn-outline px-4 py-2 text-sm"
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
          setIsNewCampaignModalOpen(false);
        }}
      />
    </AppLayout>
  );
}