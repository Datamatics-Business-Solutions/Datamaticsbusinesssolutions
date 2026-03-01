import { useState, useEffect } from 'react';
import { GlassNavigation } from '../components/GlassNavigation';
import { useTheme } from '../context/ThemeContext';
import {
  TrendingUp, TrendingDown, DollarSign, Users, Target, CheckCircle, Download,
  Share2, Bookmark, BookmarkCheck, BarChart3, Activity, Zap
} from 'lucide-react';
import {
  AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { mockAnalytics, mockCampaigns } from '../mockData';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { UnifiedKpiCard } from '../components/UnifiedKpiCard';
import { DateRangePicker } from '../components/DateRangePicker';
import { ExportModal } from '../components/ExportModal';
import { ProgressBar } from '../components/ProgressBar';
import { toast } from 'sonner';

const CHART_COLORS = ['#BA2027', '#5A555D', '#0891B2', '#0F9D58', '#F4B400', '#8E44AD'];
const GRID_STROKE = { light: '#E2E8F0', dark: '#1E293B' };
const AXIS_STROKE = { light: '#94A3B8', dark: '#475569' };

const TOOLTIP_STYLE = (isDark: boolean) => ({
  backgroundColor: isDark ? '#1A1820' : '#FFFFFF',
  border: `1px solid ${isDark ? '#2A2831' : '#E5E7EB'}`,
  borderRadius: '12px',
  fontSize: '13px',
  color: isDark ? '#F1F5F9' : '#1E293B',
  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
  padding: '12px'
});

// Chart Card with enhanced styling
function ChartCard({ title, children, actions }: any) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <div className={`rounded-xl p-6 border transition-all hover:shadow-2xl animate-fadeIn ${
      isDark
        ? 'bg-gradient-to-br from-[#1A1820]/90 to-[#16151A]/90 border-[#E63946]/15 backdrop-blur-md'
        : 'bg-gradient-to-br from-white to-gray-50/50 border-[#BA2027]/10 shadow-lg'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-sm font-bold flex items-center gap-2 ${
          isDark ? 'text-white' : 'text-[#1E293B]'
        }`}>
          <BarChart3 className="w-4 h-4" />
          {title}
        </h3>
        {actions}
      </div>
      {children}
    </div>
  );
}

export default function ReportsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [pageLoaded, setPageLoaded] = useState(false);
  const [dateRange, setDateRange] = useState('30days');
  const [showExportModal, setShowExportModal] = useState(false);
  const [savedReports, setSavedReports] = useState<string[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'overview' | 'demographics' | 'distribution' | 'campaign-detail'>('overview');
  const [legendVisibility, setLegendVisibility] = useState<Record<string, boolean>>({
    leads: true,
    conversions: true,
    campaigns: true
  });

  useEffect(() => {
    setTimeout(() => setPageLoaded(true), 100);
  }, []);

  const backgroundStyle = isDark
    ? { background: 'linear-gradient(135deg, #0F1117 0%, #1a1025 100%)', minHeight: '100vh' }
    : { background: '#F2F4F7', minHeight: '100vh' };

  // iOS-style card styling
  const cardStyle = isDark
    ? { 
        background: '#1C1F2E', 
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }
    : { 
        background: '#FFFFFF', 
        border: '1px solid rgba(186, 32, 39, 0.08)',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)'
      };

  // Monthly performance data with target, delivered, accepted
  const monthlyData = [
    { month: 'Jan', target: 400, delivered: 350, accepted: 280, leads: 350, conversions: 65, campaigns: 4, revenue: 18000 },
    { month: 'Feb', target: 600, delivered: 520, accepted: 425, leads: 520, conversions: 95, campaigns: 6, revenue: 24500 },
    { month: 'Mar', target: 750, delivered: 680, accepted: 570, leads: 680, conversions: 115, campaigns: 8, revenue: 29000 },
    { month: 'Apr', target: 900, delivered: 820, accepted: 695, leads: 820, conversions: 142, campaigns: 9, revenue: 36500 },
    { month: 'May', target: 1100, delivered: 1050, accepted: 920, leads: 1050, conversions: 185, campaigns: 11, revenue: 42000 },
    { month: 'Jun', target: 1300, delivered: 1280, accepted: 1100, leads: 1280, conversions: 224, campaigns: 13, revenue: 48250 },
  ];

  // Industry distribution by campaign
  const campaignIndustryData = {
    'IT Security': [
      { industry: 'Information Technology', count: 112, percentage: 35 },
      { industry: 'Healthcare', count: 96, percentage: 30 },
      { industry: 'Financial Services', count: 64, percentage: 20 },
      { industry: 'Manufacturing', count: 48, percentage: 15 }
    ],
    'Healthcare Synd.': [
      { industry: 'Healthcare', count: 595, percentage: 70 },
      { industry: 'Pharmaceuticals', count: 170, percentage: 20 },
      { industry: 'Medical Devices', count: 85, percentage: 10 }
    ],
    'Financial BANT': [
      { industry: 'Financial Services', count: 45, percentage: 69 },
      { industry: 'Insurance', count: 13, percentage: 20 },
      { industry: 'Banking', count: 7, percentage: 11 }
    ],
    'SaaS Appts': [
      { industry: 'Information Technology', count: 13, percentage: 72 },
      { industry: 'Software', count: 4, percentage: 22 },
      { industry: 'Consulting', count: 1, percentage: 6 }
    ]
  };

  // Title distribution
  const titleDistribution = [
    { title: 'C-Level Executive', count: 285, percentage: 18 },
    { title: 'VP/Director', count: 475, percentage: 30 },
    { title: 'Manager', count: 380, percentage: 24 },
    { title: 'Senior Specialist', count: 285, percentage: 18 },
    { title: 'Other', count: 158, percentage: 10 }
  ];

  // Company size distribution
  const companySizeData = [
    { size: 'Enterprise (10K+)', count: 380, percentage: 24 },
    { size: 'Large (1K-10K)', count: 475, percentage: 30 },
    { size: 'Mid-Market (100-1K)', count: 475, percentage: 30 },
    { size: 'SMB (<100)', count: 253, percentage: 16 }
  ];

  // Lead source distribution
  const leadSourceData = [
    { source: 'Content Syndication', count: 633, percentage: 40 },
    { source: 'Webinar Registration', count: 475, percentage: 30 },
    { source: 'Email Campaign', count: 316, percentage: 20 },
    { source: 'Direct Outreach', count: 158, percentage: 10 }
  ];

  // Calculate KPI values
  const totalDelivered = mockCampaigns.reduce((sum, c) => sum + c.delivered, 0);
  const totalTarget = mockCampaigns.reduce((sum, c) => sum + c.target, 0);
  const totalAccepted = mockAnalytics.campaignPerformance.reduce((sum, c) => sum + Math.round((c.leads * c.acceptance) / 100), 0);
  const avgAcceptance = Math.round((totalAccepted / totalDelivered) * 100);
  const totalRevenue = monthlyData.reduce((sum, m) => sum + m.revenue, 0);
  const revenueGrowth = Math.round(((monthlyData[monthlyData.length - 1].revenue - monthlyData[0].revenue) / monthlyData[0].revenue) * 100);
  const activeCampaigns = mockCampaigns.filter(c => c.status === 'In progress').length;
  const completedCount = mockCampaigns.filter(c => c.status === 'Completed').length;
  const leadsMax = Math.max(...mockAnalytics.campaignPerformance.map(c => c.leads));

  const axisProps = {
    stroke: isDark ? AXIS_STROKE.dark : AXIS_STROKE.light,
    style: { fontSize: 12 }
  };

  const isSaved = savedReports.includes(dateRange);

  const toggleLegend = (key: string) => {
    setLegendVisibility(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={backgroundStyle} className={`transition-opacity duration-700 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <GlassNavigation />

      <div className="max-w-[1440px] mx-auto px-6 py-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
          <div>
            <h1 className={`${isDark ? 'text-white' : 'text-[#1E1E1E]'} mb-2`}>
              Reports & Analytics
            </h1>
            <p className={`text-sm ${isDark ? 'text-[#6B6880]' : 'text-[#6B6B6B]'}`}>
              Performance insights and data visualizations • Updated in real-time
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => {
                if (isSaved) {
                  setSavedReports(savedReports.filter(r => r !== dateRange));
                  toast.success('Report removed from saved');
                } else {
                  setSavedReports([...savedReports, dateRange]);
                  toast.success('Report saved successfully');
                }
              }}
              className={`px-4 py-2.5 rounded-lg border transition-all flex items-center gap-2 text-sm font-medium ${
                isDark
                  ? 'border-white/10 text-gray-300 hover:bg-white/5'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
            </button>
            <button
              onClick={() => toast.info('Share link copied to clipboard!')}
              className={`px-4 py-2.5 rounded-lg border transition-all flex items-center gap-2 text-sm font-medium ${
                isDark
                  ? 'border-white/10 text-gray-300 hover:bg-white/5'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
            <DateRangePicker value={dateRange} onChange={setDateRange} />
            <button
              onClick={() => setShowExportModal(true)}
              className="px-4 py-2.5 rounded-lg text-white bg-gradient-to-r from-[#1E3A5F] to-[#1E3A5F]/80 transition-all flex items-center gap-2 text-sm font-medium shadow-lg hover:scale-105"
            >
              <Download className="w-4 h-4" />
              Export my report
            </button>
          </div>
        </div>

        {/* KPI Cards with animated counters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <UnifiedKpiCard
            index={0}
            icon={Target}
            iconColor="text-[#0891B2]"
            iconBg={isDark ? 'bg-gradient-to-br from-[#0891B2]/20 to-[#0891B2]/10' : 'bg-gradient-to-br from-[#0891B2]/10 to-[#0891B2]/5'}
            value={totalDelivered}
            label="Total Leads Delivered"
            trendValue={12}
            footer={`Target: ${totalTarget.toLocaleString()} · ${Math.round((totalDelivered / totalTarget) * 100)}% achieved`}
          />
          <UnifiedKpiCard
            index={1}
            icon={CheckCircle}
            iconColor="text-[#0F9D58]"
            iconBg={isDark ? 'bg-gradient-to-br from-[#0F9D58]/20 to-[#0F9D58]/10' : 'bg-gradient-to-br from-[#0F9D58]/10 to-[#0F9D58]/5'}
            value={`${avgAcceptance}%`}
            label="Avg Acceptance Rate"
            trendValue={3}
            footer={`${totalAccepted.toLocaleString()} accepted of ${totalDelivered.toLocaleString()}`}
          />
          <UnifiedKpiCard
            index={2}
            icon={DollarSign}
            iconColor={isDark ? 'text-[#E63946]' : 'text-[#BA2027]'}
            iconBg={isDark ? 'bg-gradient-to-br from-[#E63946]/20 to-[#E63946]/10' : 'bg-gradient-to-br from-[#BA2027]/10 to-[#BA2027]/5'}
            value={`$${(totalRevenue / 1000).toFixed(1)}K`}
            label="Total Revenue (YTD)"
            trendValue={revenueGrowth}
            footer={`$${(totalRevenue / 6 / 1000).toFixed(1)}K avg per month`}
          />
          <UnifiedKpiCard
            index={3}
            icon={Activity}
            iconColor={isDark ? 'text-[#F4B400]' : 'text-[#5A555D]'}
            iconBg={isDark ? 'bg-gradient-to-br from-[#F4B400]/20 to-[#F4B400]/10' : 'bg-gradient-to-br from-[#5A555D]/10 to-[#5A555D]/5'}
            value={activeCampaigns}
            label="Active Campaigns"
            trend="live"
            footer={`${mockCampaigns.length} total · ${completedCount} completed`}
          />
        </div>

        {/* Tab Navigation */}
        <div className={`flex gap-2 mb-6 p-2 rounded-xl border overflow-x-auto ${
          isDark
            ? 'bg-gradient-to-br from-[#1A1820]/50 to-[#16151A]/50 border-[#E63946]/10'
            : 'bg-gradient-to-br from-white/50 to-gray-50/50 border-[#BA2027]/10'
        }`}>
          {[
            { id: 'overview', label: 'Performance Overview', icon: Activity },
            { id: 'demographics', label: 'Lead Demographics', icon: Users },
            { id: 'distribution', label: 'Industry & Sources', icon: Target },
            { id: 'campaign-detail', label: 'Campaign Deep Dive', icon: Zap }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all text-sm font-semibold whitespace-nowrap ${
                  isActive
                    ? isDark
                      ? 'bg-gradient-to-r from-[#E63946] to-[#FF4D5A] text-white shadow-lg'
                      : 'bg-gradient-to-r from-[#BA2027] to-[#D32F2F] text-white shadow-lg'
                    : isDark
                    ? 'text-gray-400 hover:bg-white/5'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content - Performance Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Lead Performance */}
            <ChartCard 
              title="Monthly Lead Performance"
              actions={
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleLegend('leads')}
                    className={`text-xs px-2 py-1 rounded transition-all ${
                      legendVisibility.leads
                        ? isDark ? 'bg-[#E63946]/20 text-[#E63946]' : 'bg-[#BA2027]/10 text-[#BA2027]'
                        : isDark ? 'bg-white/5 text-gray-500' : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    Leads
                  </button>
                  <button
                    onClick={() => toggleLegend('conversions')}
                    className={`text-xs px-2 py-1 rounded transition-all ${
                      legendVisibility.conversions
                        ? isDark ? 'bg-[#0F9D58]/20 text-[#0F9D58]' : 'bg-[#0F9D58]/10 text-[#0F9D58]'
                        : isDark ? 'bg-white/5 text-gray-500' : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    Conversions
                  </button>
                </div>
              }
            >
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#BA2027" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#BA2027" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0F9D58" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0F9D58" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? GRID_STROKE.dark : GRID_STROKE.light} />
                  <XAxis dataKey="month" {...axisProps} />
                  <YAxis {...axisProps} />
                  <Tooltip contentStyle={TOOLTIP_STYLE(isDark)} />
                  <Legend />
                  {legendVisibility.leads && (
                    <Area
                      type="monotone"
                      dataKey="leads"
                      stroke="#BA2027"
                      strokeWidth={2}
                      fill="url(#colorLeads)"
                      name="Leads"
                      animationDuration={1000}
                    />
                  )}
                  {legendVisibility.conversions && (
                    <Area
                      type="monotone"
                      dataKey="conversions"
                      stroke="#0F9D58"
                      strokeWidth={2}
                      fill="url(#colorConversions)"
                      name="Conversions"
                      animationDuration={1000}
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Campaign Performance */}
            <ChartCard title="Campaign Performance">
              <div className="space-y-4">
                {mockAnalytics.campaignPerformance.map((item, index) => {
                  const shortName = item.campaign
                    .replace('Enterprise IT Security', 'IT Security')
                    .replace('Healthcare Content Syndication', 'Healthcare Synd.')
                    .replace('Financial Services BANT', 'Financial BANT')
                    .replace('SaaS Appointment Setting', 'SaaS Appts')
                    .replace(' Q1 2026', '')
                    .replace(' - Feb 2026', '');

                  const leadsPct = Math.round((item.leads / leadsMax) * 100);

                  return (
                    <ProgressBar
                      key={item.campaign}
                      label={shortName}
                      value={item.leads.toLocaleString()}
                      percentage={item.acceptance}
                      maxPercentage={100}
                      showBadge={true}
                      animationDelay={index * 100}
                      badgeColorThresholds={{ high: 90, medium: 70 }}
                      valueColor="text-[#0891B2]"
                    />
                  );
                })}
              </div>
            </ChartCard>
          </div>
        )}

        {/* Tab Content - Lead Demographics */}
        {activeTab === 'demographics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Title Distribution */}
            <ChartCard title="Title Distribution Across All Campaigns">
              <div className="space-y-4">
                {titleDistribution.map((item, index) => (
                  <ProgressBar
                    key={item.title}
                    label={item.title}
                    value={item.count}
                    percentage={item.percentage}
                    maxPercentage={30}
                    showBadge={true}
                    animationDelay={index * 100}
                    badgeColorThresholds={undefined}
                  />
                ))}
              </div>
            </ChartCard>

            {/* Company Size Distribution */}
            <ChartCard title="Company Size Distribution">
              <div className="space-y-4">
                {companySizeData.map((item, index) => (
                  <ProgressBar
                    key={item.size}
                    label={item.size}
                    value={item.count}
                    percentage={item.percentage}
                    maxPercentage={30}
                    showBadge={true}
                    animationDelay={index * 100}
                    badgeColorThresholds={undefined}
                  />
                ))}
              </div>
            </ChartCard>
          </div>
        )}

        {/* Tab Content - Industry & Sources */}
        {activeTab === 'distribution' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Industry Distribution */}
            <ChartCard title="Industry Distribution">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div style={{ width: 200, height: 200 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={mockAnalytics.industryBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        dataKey="count"
                        strokeWidth={0}
                        animationDuration={1000}
                      >
                        {mockAnalytics.industryBreakdown.map((_, i) => (
                          <Cell
                            key={i}
                            fill={CHART_COLORS[i % CHART_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={TOOLTIP_STYLE(isDark)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-3">
                  {mockAnalytics.industryBreakdown.map((item, i) => (
                    <div 
                      key={item.industry} 
                      className="flex items-center justify-between animate-slideInRight"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                        />
                        <span className={`text-sm ${
                          isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'
                        }`}>
                          {item.industry}
                        </span>
                      </div>
                      <span className={`text-sm font-bold ${
                        isDark ? 'text-white' : 'text-[#1E293B]'
                      }`}>
                        {item.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </ChartCard>

            {/* Lead Source Distribution */}
            <ChartCard title="Lead Source Distribution">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div style={{ width: 200, height: 200 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={leadSourceData}
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        dataKey="count"
                        strokeWidth={0}
                        animationDuration={1000}
                        label={({ percentage }) => `${percentage}%`}
                      >
                        {leadSourceData.map((_, i) => (
                          <Cell
                            key={i}
                            fill={CHART_COLORS[i % CHART_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={TOOLTIP_STYLE(isDark)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-3">
                  {leadSourceData.map((item, i) => (
                    <div 
                      key={item.source} 
                      className="flex items-center justify-between animate-slideInRight"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                        />
                        <span className={`text-sm ${
                          isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'
                        }`}>
                          {item.source}
                        </span>
                      </div>
                      <span className={`text-sm font-bold ${
                        isDark ? 'text-white' : 'text-[#1E293B]'
                      }`}>
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </ChartCard>
          </div>
        )}

        {/* Tab Content - Campaign Deep Dive */}
        {activeTab === 'campaign-detail' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Lead Conversion Funnel */}
            <ChartCard title="Lead Conversion Funnel">
              <div className="space-y-4">
                {mockAnalytics.conversionFunnel.map((stage, index) => (
                  <ProgressBar
                    key={stage.stage}
                    label={stage.stage}
                    value={stage.count.toLocaleString()}
                    percentage={stage.percentage}
                    showBadge={true}
                    animationDelay={index * 100}
                    badgeColorThresholds={{ high: 80, medium: 60 }}
                    valueColor={isDark ? 'text-white' : 'text-[#1E293B]'}
                  />
                ))}
              </div>
            </ChartCard>

            {/* Per-Campaign Industry Breakdown */}
            <ChartCard 
              title="Campaign Industry Breakdown"
              actions={
                <select
                  value={selectedCampaign}
                  onChange={(e) => setSelectedCampaign(e.target.value)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-white'
                      : 'bg-white border-gray-300 text-gray-700'
                  } outline-none`}
                >
                  <option value="all">Select a campaign</option>
                  {Object.keys(campaignIndustryData).map((campaign) => (
                    <option key={campaign} value={campaign}>{campaign}</option>
                  ))}
                </select>
              }
            >
              <div className="space-y-4">
                {selectedCampaign === 'all' ? (
                  <div className={`text-center py-16 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm mb-2 font-medium">Select a campaign to view detailed industry breakdown</p>
                    <p className="text-xs">This view shows how leads are distributed across industries for each specific campaign</p>
                  </div>
                ) : (
                  campaignIndustryData[selectedCampaign as keyof typeof campaignIndustryData]?.map((item, index) => (
                    <ProgressBar
                      key={item.industry}
                      label={item.industry}
                      value={item.count}
                      percentage={item.percentage}
                      showBadge={true}
                      animationDelay={index * 100}
                      badgeColorThresholds={{ high: 70, medium: 40 }}
                      valueColor="text-[#0891B2]"
                    />
                  ))
                )}
              </div>
            </ChartCard>
          </div>
        )}
      </div>

      {/* Export Modal */}
      <ExportModal 
        isOpen={showExportModal} 
        onClose={() => setShowExportModal(false)} 
      />
    </div>
  );
}