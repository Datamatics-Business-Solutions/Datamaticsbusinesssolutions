import { useState, useMemo } from 'react';
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
  X,
  ChevronUp,
  Eye,
} from 'lucide-react';
import { allClients, type Campaign } from '../data/mockClients';
import { AppLayout } from '../components/AppLayout';
import { TableRow } from '../components/TableRow';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { NewCampaignModal, CampaignFormData } from '../components/NewCampaignModal';
import { EmptyState } from '../components/EmptyState';
import { AccountTeam } from '../components/AccountTeam';
import { getAccountTeam } from '../data/mockClients';
import { useAuth } from '../context/AuthContext';
import { useDebounce } from '../hooks/useDebounce';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { TableSkeleton } from '../components/SkeletonLoader';

// Mock sparkline data for trend visualization
const generateSparklineData = (baseValue: number, trend: 'up' | 'down' = 'up') => {
  return Array.from({ length: 12 }, (_, i) => ({
    value: trend === 'up' 
      ? baseValue * (0.7 + (i * 0.025) + Math.random() * 0.1)
      : baseValue * (1.3 - (i * 0.025) + Math.random() * 0.1)
  }));
};

// Flatten all campaigns from all clients
const getAllCampaignsFlat = (): Array<Campaign & { clientName: string }> => {
  const campaigns: Array<Campaign & { clientName: string }> = [];
  allClients.forEach(client => {
    client.campaigns.forEach(campaign => {
      campaigns.push({
        ...campaign,
        clientName: client.companyName
      });
    });
  });
  return campaigns;
};

export default function Dashboard() {
  useDocumentTitle('My Campaigns');
  
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [statusFilter, setStatusFilter] = useState('All');
  const [isNewCampaignModalOpen, setIsNewCampaignModalOpen] = useState(false);
  
  // Individual time period states for each card
  const [campaignsPeriod, setCampaignsPeriod] = useState<'1d' | '1w' | '1m' | '1y'>('1m');
  const [leadsPeriod, setLeadsPeriod] = useState<'1d' | '1w' | '1m' | '1y'>('1m');
  const [spendPeriod, setSpendPeriod] = useState<'1d' | '1w' | '1m' | '1y'>('1m');

  const accountTeam = getAccountTeam('client_1');

  // Get all campaigns flattened
  const allCampaignsFlat = useMemo(() => getAllCampaignsFlat(), []);

  // Base data using allClients
  const baseCampaigns = allCampaignsFlat.filter((c) => c.status === 'active').length;
  const baseLeadsMonthly = allCampaignsFlat.reduce((sum, c) => sum + (c.delivered || 0), 0);
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

  // Sparkline data
  const campaignsData = generateSparklineData(activeCampaigns, 'up');
  const leadsData = generateSparklineData(totalLeadsDelivered / 12, 'up');
  const spendData = generateSparklineData(totalSpend / 12, 'down');

  const filteredCampaigns = allCampaignsFlat.filter((campaign) => {
    const matchesSearch = campaign.name.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesStatus = statusFilter === 'All' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusPill = (status: string) => {
    const config = {
      'active': {
        classes: 'badge badge-active',
        icon: Circle,
        hasPulse: true,
      },
      'completed': {
        classes: 'badge badge-completed',
        icon: CheckCircle2,
        hasPulse: false,
      },
      'paused': {
        classes: 'badge badge-paused',
        icon: Pause,
        hasPulse: false,
      },
    };

    const statusConfig = config[status as keyof typeof config] || config['paused'];
    const Icon = statusConfig.icon;

    return (
      <span className={statusConfig.classes}>
        <Icon className={`w-3.5 h-3.5 ${statusConfig.hasPulse ? 'animate-pulse' : ''}`} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <AppLayout>
      <div className="max-w-[1400px] mx-auto page-content space-y-6">
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
            className="glass-card p-6"
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
              <span className="text-[36px] font-bold text-[#1A1A1A] tracking-tight leading-none"><AnimatedCounter end={activeCampaigns} duration={1500} /></span>
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
            className="glass-card p-6"
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
              <span className="text-[36px] font-bold text-[#1A1A1A] tracking-tight leading-none"><AnimatedCounter end={totalLeadsDelivered} duration={2000} /></span>
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
            className="glass-card p-6"
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
              <span className="text-[36px] font-bold text-[#1A1A1A] tracking-tight leading-none">$<AnimatedCounter end={totalSpend} duration={1800} /></span>
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
              <option value="active">In Progress</option>
              <option value="completed">Completed</option>
              <option value="paused">Paused</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280] pointer-events-none" />
          </div>
        </div>

        {/* Campaign Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="table-header">
                <tr>
                  <th className="table-th">Campaign</th>
                  <th className="table-th">Type</th>
                  <th className="table-th">Status</th>
                  <th className="table-th">Progress</th>
                  <th className="table-th">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.map((campaign, index) => {
                  const progress = campaign.target && campaign.delivered 
                    ? ((campaign.delivered / campaign.target) * 100) 
                    : 0;
                  return (
                    <TableRow
                      key={campaign.id}
                      showHoverEffect={true}
                      animationDelay={index * 50}
                      onClick={() => navigate(`/campaigns/${campaign.id}`)}
                    >
                      <td className="table-td">
                        <div>
                          <div className="t1">{campaign.name}</div>
                          <div className="t3 mt-0.5">{campaign.clientName}</div>
                        </div>
                      </td>
                      <td className="table-td">
                        <span className="t2">Leads</span>
                      </td>
                      <td className="table-td">{getStatusPill(campaign.status)}</td>
                      <td className="table-td">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-3">
                            <div className="progress-bar flex-1">
                              <div
                                className="progress-bar__fill"
                                style={{ width: `${Math.min(progress, 100)}%` }}
                              />
                            </div>
                            <span className="t2" style={{ minWidth: '28px' }}>
                              {Math.round(progress)}%
                            </span>
                          </div>
                          <div className="t3">
                            {(campaign.delivered || 0).toLocaleString()} / {(campaign.target || 0).toLocaleString()} leads
                          </div>
                        </div>
                      </td>
                      <td className="table-td" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/campaigns/${campaign.id}`);
                          }}
                          className="btn-ghost p-2"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </TableRow>
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