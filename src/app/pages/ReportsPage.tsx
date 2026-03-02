import { useState, useEffect } from 'react';
import { AppLayout } from '../components/AppLayout';
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

const TOOLTIP_STYLE = {
  backgroundColor: '#FFFFFF',
  border: '1px solid var(--color-border)',
  borderRadius: '12px',
  fontSize: '13px',
  color: 'var(--color-text-primary)',
  boxShadow: 'var(--shadow-md)',
  padding: '12px'
};

// Chart Card with enhanced styling
function ChartCard({ title, children, actions }: any) {
  return (
    <div className="glass-card p-6 transition-all hover:shadow-2xl animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <h3 className="flex items-center gap-2" style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)' }}>
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

  const isSaved = savedReports.includes(dateRange);

  const toggleLegend = (key: string) => {
    setLegendVisibility(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <AppLayout>
      <div className={`max-w-[1440px] mx-auto px-6 py-6 transition-opacity duration-700 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
          <div>
            <h1 style={{ color: 'var(--color-text-primary)' }} className="mb-2">
              Reports & Analytics
            </h1>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
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
              className="btn-outline px-4 py-2 flex items-center gap-2"
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              {isSaved ? 'Saved' : 'Save Report'}
            </button>
            <button
              onClick={() => setShowExportModal(true)}
              className="btn-primary px-4 py-2 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Data
            </button>
          </div>
        </div>

        {/* KPI Cards - Only 4 cards as per design requirements */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 stagger-children">
          <div className="kpi-card animate-slideInUp">
            <div className="flex items-center justify-between">
              <Target className="kpi-card__icon" />
            </div>
            <div className="kpi-card__number">1,265</div>
            <div className="kpi-card__label">Total Leads</div>
          </div>

          <div className="kpi-card animate-slideInUp">
            <div className="flex items-center justify-between">
              <CheckCircle className="kpi-card__icon" />
            </div>
            <div className="kpi-card__number">93%</div>
            <div className="kpi-card__label">Acceptance Rate</div>
          </div>

          <div className="kpi-card animate-slideInUp">
            <div className="flex items-center justify-between">
              <Activity className="kpi-card__icon" />
            </div>
            <div className="kpi-card__number">{activeCampaigns}</div>
            <div className="kpi-card__label">Active Campaigns</div>
          </div>

          <div className="kpi-card animate-slideInUp">
            <div className="flex items-center justify-between">
              <DollarSign className="kpi-card__icon" />
            </div>
            <div className="kpi-card__number">$198.3K</div>
            <div className="kpi-card__label">Revenue YTD</div>
          </div>
        </div>

        {/* Charts Grid - 60/40 split */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
          {/* Lead Performance Trend - 60% width */}
          <div className="lg:col-span-3">
            <ChartCard title="Lead Performance Trend">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="rgba(186,32,39,0.06)" stopOpacity={1} />
                      <stop offset="95%" stopColor="rgba(186,32,39,0.06)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="0" stroke="#F5F5F5" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    style={{ fontSize: 11, fill: '#9CA3AF' }} 
                    stroke="none"
                    tickLine={false}
                  />
                  <YAxis 
                    style={{ fontSize: 11, fill: '#9CA3AF' }} 
                    stroke="none"
                    tickLine={false}
                  />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Area 
                    type="monotone" 
                    dataKey="delivered" 
                    stroke="#BA2027" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorLeads)"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Campaign Status Summary Card - 40% width */}
          <div className="lg:col-span-2">
            <div className="glass-card p-6 h-full">
              <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)' }} className="mb-4">
                Campaign Status
              </h3>
              <div className="space-y-4">
                {/* Active */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: '#059669' }}></div>
                      <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>Active</span>
                    </div>
                    <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>{activeCampaigns}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#059669] rounded-full" style={{ width: '50%' }}></div>
                    </div>
                    <span className="progress-percentage">50%</span>
                  </div>
                </div>

                {/* Paused */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: '#D97706' }}></div>
                      <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>Paused</span>
                    </div>
                    <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>2</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#D97706] rounded-full" style={{ width: '33%' }}></div>
                    </div>
                    <span className="progress-percentage">33%</span>
                  </div>
                </div>

                {/* Completed */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: '#6B7280' }}></div>
                      <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>Completed</span>
                    </div>
                    <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>{completedCount}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#6B7280] rounded-full" style={{ width: '17%' }}></div>
                    </div>
                    <span className="progress-percentage">17%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Revenue Trend */}
        <ChartCard title="Monthly Revenue Trend" actions={null}>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={monthlyData} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="0" stroke="#F5F5F5" vertical={false} />
              <XAxis 
                dataKey="month" 
                style={{ fontSize: 11, fill: '#9CA3AF' }} 
                stroke="none"
                tickLine={false}
              />
              <YAxis 
                style={{ fontSize: 11, fill: '#9CA3AF' }} 
                stroke="none"
                tickLine={false}
              />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar 
                dataKey="revenue" 
                fill="rgba(186,32,39,0.85)" 
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Demographics Section */}
        <div className="mt-6">
          <h2 style={{ color: 'var(--color-text-primary)', fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)' }} className="mb-4">
            Lead Demographics
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title Distribution */}
            <div className="glass-card p-6">
              <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)' }} className="mb-4">
                Title Distribution
              </h3>
              <div className="space-y-3">
                {titleDistribution.map((item, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2">
                      <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>{item.title}</span>
                      <span className="progress-percentage">{item.percentage}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-bar__fill" style={{ width: `${item.percentage}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Company Size Distribution */}
            <div className="glass-card p-6">
              <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)' }} className="mb-4">
                Company Size Distribution
              </h3>
              <div className="space-y-3">
                {companySizeData.map((item, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2">
                      <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>{item.size}</span>
                      <span className="progress-percentage">{item.percentage}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-bar__fill" style={{ width: `${item.percentage}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={(format) => {
          toast.success(`Exporting report as ${format.toUpperCase()}`);
          setShowExportModal(false);
        }}
      />
    </AppLayout>
  );
}