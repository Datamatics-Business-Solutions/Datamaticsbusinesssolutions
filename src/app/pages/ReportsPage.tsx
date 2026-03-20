import { useState } from 'react';
import { AppLayout } from '../components/AppLayout';
import { useAuth } from '../context/AuthContext';
import {
  TrendingUp, TrendingDown, DollarSign, Users, Target, CheckCircle, Download,
  Share2, Bookmark, BookmarkCheck, BarChart3, Activity, Zap, Filter
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

const CHART_COLORS = ['#BA2027', '#D32F2F', '#E57373', '#0891B2', '#0F9D58', '#F4B400'];

const TOOLTIP_STYLE = {
  backgroundColor: '#FFFFFF',
  border: '1px solid var(--color-border)',
  borderRadius: '8px',
  fontSize: '12px',
  color: 'var(--color-text-primary)',
  boxShadow: 'var(--shadow-md)',
  padding: '8px'
};

// Compact Chart Card
function ChartCard({ title, children, actions }: any) {
  return (
    <div className="glass-card p-4 transition-all hover:shadow-lg animate-fadeIn">
      <div className="flex items-center justify-between mb-3">
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
  const { currentUser } = useAuth();
  const [dateRange, setDateRange] = useState('30days');
  const [showExportModal, setShowExportModal] = useState(false);
  const [savedReports, setSavedReports] = useState<string[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<string>('all');

  // Campaign-specific data
  const campaignMetrics: Record<string, any> = {
    'all': {
      totalLeads: 1265,
      acceptance: 93,
      conversions: 168,
      revenue: 198250,
      activeCampaigns: 3,
      completedCampaigns: 1,
      monthlyData: [
        { month: 'Jan', revenue: 18000, leads: 350, conversions: 65 },
        { month: 'Feb', revenue: 24500, leads: 520, conversions: 95 },
        { month: 'Mar', revenue: 29000, leads: 680, conversions: 115 },
        { month: 'Apr', revenue: 36500, leads: 820, conversions: 142 },
        { month: 'May', revenue: 42000, leads: 1050, conversions: 185 },
        { month: 'Jun', revenue: 48250, leads: 1280, conversions: 224 },
      ],
      titleDistribution: [
        { title: 'C-Level', percentage: 18 },
        { title: 'VP/Director', percentage: 30 },
        { title: 'Manager', percentage: 24 },
        { title: 'Senior Specialist', percentage: 18 },
        { title: 'Other', percentage: 10 }
      ],
      companySizeData: [
        { size: 'Enterprise (10K+)', percentage: 24 },
        { size: 'Large (1K-10K)', percentage: 30 },
        { size: 'Mid-Market', percentage: 30 },
        { size: 'SMB (<100)', percentage: 16 }
      ]
    },
    'IT Security': {
      totalLeads: 320,
      acceptance: 88,
      conversions: 45,
      revenue: 52000,
      activeCampaigns: 1,
      completedCampaigns: 0,
      monthlyData: [
        { month: 'Jan', revenue: 5000, leads: 80, conversions: 12 },
        { month: 'Feb', revenue: 7200, leads: 105, conversions: 18 },
        { month: 'Mar', revenue: 9500, leads: 135, conversions: 24 },
        { month: 'Apr', revenue: 10800, leads: 160, conversions: 28 },
        { month: 'May', revenue: 11500, leads: 185, conversions: 32 },
        { month: 'Jun', revenue: 8000, leads: 95, conversions: 16 },
      ],
      titleDistribution: [
        { title: 'C-Level', percentage: 35 },
        { title: 'VP/Director', percentage: 30 },
        { title: 'Manager', percentage: 20 },
        { title: 'Senior Specialist', percentage: 10 },
        { title: 'Other', percentage: 5 }
      ],
      companySizeData: [
        { size: 'Enterprise (10K+)', percentage: 45 },
        { size: 'Large (1K-10K)', percentage: 35 },
        { size: 'Mid-Market', percentage: 15 },
        { size: 'SMB (<100)', percentage: 5 }
      ]
    },
    'Healthcare Synd.': {
      totalLeads: 850,
      acceptance: 95,
      conversions: 95,
      revenue: 128000,
      activeCampaigns: 1,
      completedCampaigns: 0,
      monthlyData: [
        { month: 'Jan', revenue: 12000, leads: 240, conversions: 42 },
        { month: 'Feb', revenue: 15800, leads: 350, conversions: 62 },
        { month: 'Mar', revenue: 17200, leads: 480, conversions: 78 },
        { month: 'Apr', revenue: 22500, leads: 580, conversions: 98 },
        { month: 'May', revenue: 28000, leads: 780, conversions: 135 },
        { month: 'Jun', revenue: 32500, leads: 1050, conversions: 178 },
      ],
      titleDistribution: [
        { title: 'C-Level', percentage: 12 },
        { title: 'VP/Director', percentage: 28 },
        { title: 'Manager', percentage: 35 },
        { title: 'Senior Specialist', percentage: 20 },
        { title: 'Other', percentage: 5 }
      ],
      companySizeData: [
        { size: 'Enterprise (10K+)', percentage: 70 },
        { size: 'Large (1K-10K)', percentage: 20 },
        { size: 'Mid-Market', percentage: 8 },
        { size: 'SMB (<100)', percentage: 2 }
      ]
    },
    'Financial BANT': {
      totalLeads: 65,
      acceptance: 92,
      conversions: 18,
      revenue: 12500,
      activeCampaigns: 1,
      completedCampaigns: 0,
      monthlyData: [
        { month: 'Jan', revenue: 800, leads: 15, conversions: 5 },
        { month: 'Feb', revenue: 1200, leads: 28, conversions: 8 },
        { month: 'Mar', revenue: 2000, leads: 35, conversions: 10 },
        { month: 'Apr', revenue: 2500, leads: 42, conversions: 12 },
        { month: 'May', revenue: 3000, leads: 52, conversions: 15 },
        { month: 'Jun', revenue: 3000, leads: 65, conversions: 18 },
      ],
      titleDistribution: [
        { title: 'C-Level', percentage: 69 },
        { title: 'VP/Director', percentage: 20 },
        { title: 'Manager', percentage: 8 },
        { title: 'Senior Specialist', percentage: 2 },
        { title: 'Other', percentage: 1 }
      ],
      companySizeData: [
        { size: 'Enterprise (10K+)', percentage: 85 },
        { size: 'Large (1K-10K)', percentage: 12 },
        { size: 'Mid-Market', percentage: 3 },
        { size: 'SMB (<100)', percentage: 0 }
      ]
    },
    'SaaS Appts': {
      totalLeads: 30,
      acceptance: 89,
      conversions: 10,
      revenue: 5750,
      activeCampaigns: 0,
      completedCampaigns: 1,
      monthlyData: [
        { month: 'Jan', revenue: 200, leads: 5, conversions: 1 },
        { month: 'Feb', revenue: 300, leads: 8, conversions: 2 },
        { month: 'Mar', revenue: 300, leads: 10, conversions: 3 },
        { month: 'Apr', revenue: 700, leads: 12, conversions: 4 },
        { month: 'May', revenue: 2500, leads: 18, conversions: 6 },
        { month: 'Jun', revenue: 1750, leads: 30, conversions: 10 },
      ],
      titleDistribution: [
        { title: 'C-Level', percentage: 72 },
        { title: 'VP/Director', percentage: 22 },
        { title: 'Manager', percentage: 6 },
        { title: 'Senior Specialist', percentage: 0 },
        { title: 'Other', percentage: 0 }
      ],
      companySizeData: [
        { size: 'Enterprise (10K+)', percentage: 50 },
        { size: 'Large (1K-10K)', percentage: 30 },
        { size: 'Mid-Market', percentage: 15 },
        { size: 'SMB (<100)', percentage: 5 }
      ]
    }
  };

  const currentMetrics = campaignMetrics[selectedCampaign] || campaignMetrics['all'];
  const isSaved = savedReports.includes(dateRange);

  // Get active and completed counts
  const activeCampaigns = currentMetrics.activeCampaigns;
  const completedCount = currentMetrics.completedCampaigns;
  const totalCampaigns = activeCampaigns + completedCount;
  const pausedCampaigns = 0;

  return (
    <AppLayout>
      <div className={`max-w-[1440px] mx-auto page-content animate-fadeIn`}>
        {/* Compact Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 gap-3">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 style={{ color: 'var(--color-text-primary)' }}>Reports & Analytics</h1>
              {currentUser?.logo && (
                <img src={currentUser.logo} alt={currentUser.company || ''} className="h-5 object-contain opacity-80" style={{ maxWidth: '120px' }} />
              )}
            </div>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
              Performance insights and data visualizations
            </p>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
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
              className="btn-outline px-3 py-2 flex items-center gap-2"
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              {isSaved ? 'Saved' : 'Save'}
            </button>
            <button
              onClick={() => setShowExportModal(true)}
              className="btn-primary px-3 py-2 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Campaign Filter Section - Prominent */}
        <div className="glass-card p-4 mb-4">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-[#BA2027]" />
              <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
                Filter by Campaign:
              </span>
            </div>
            <div className="flex-1 max-w-md">
              <select
                value={selectedCampaign}
                onChange={(e) => setSelectedCampaign(e.target.value)}
                className="input-base w-full px-4 py-2.5"
                style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}
              >
                <option value="all">All Campaigns</option>
                <option value="IT Security">IT Security</option>
                <option value="Healthcare Synd.">Healthcare Synd.</option>
                <option value="Financial BANT">Financial BANT</option>
                <option value="SaaS Appts">SaaS Appts</option>
              </select>
            </div>
            
            {/* Campaign Status Indicator */}
            <div className="flex items-center gap-2">
              {selectedCampaign === 'all' ? (
                // Show breakdown when all campaigns selected
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 border border-green-200">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span style={{ fontSize: '13px', fontWeight: 'var(--font-weight-semibold)', color: '#059669' }}>
                      {activeCampaigns} Active
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200">
                    <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                    <span style={{ fontSize: '13px', fontWeight: 'var(--font-weight-semibold)', color: '#6B7280' }}>
                      {completedCount} Completed
                    </span>
                  </div>
                  {pausedCampaigns > 0 && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-50 border border-yellow-200">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <span style={{ fontSize: '13px', fontWeight: 'var(--font-weight-semibold)', color: '#D97706' }}>
                        {pausedCampaigns} Paused
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                // Show single status badge for specific campaign
                <>
                  {currentMetrics.activeCampaigns > 0 && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 border border-green-200">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span style={{ fontSize: '13px', fontWeight: 'var(--font-weight-semibold)', color: '#059669' }}>
                        Active
                      </span>
                    </div>
                  )}
                  {currentMetrics.completedCampaigns > 0 && currentMetrics.activeCampaigns === 0 && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200">
                      <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                      <span style={{ fontSize: '13px', fontWeight: 'var(--font-weight-semibold)', color: '#6B7280' }}>
                        Completed
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
            
            {selectedCampaign !== 'all' && (
              <button
                onClick={() => setSelectedCampaign('all')}
                className="btn-outline px-3 py-2 text-sm whitespace-nowrap"
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>

        {/* Compact KPI Cards - 6 cards in 2 rows on mobile, 6 across on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4 stagger-children">
          <div className="kpi-card animate-slideInUp" style={{ padding: '12px' }}>
            <div className="flex items-center justify-between mb-1">
              <Target className="kpi-card__icon" style={{ width: '16px', height: '16px' }} />
            </div>
            <div className="kpi-card__number" style={{ fontSize: '20px', marginBottom: '2px' }}>{currentMetrics.totalLeads.toLocaleString()}</div>
            <div className="kpi-card__label" style={{ fontSize: '11px' }}>Total Leads</div>
          </div>

          <div className="kpi-card animate-slideInUp" style={{ padding: '12px' }}>
            <div className="flex items-center justify-between mb-1">
              <CheckCircle className="kpi-card__icon" style={{ width: '16px', height: '16px' }} />
            </div>
            <div className="kpi-card__number" style={{ fontSize: '20px', marginBottom: '2px' }}>{currentMetrics.acceptance}%</div>
            <div className="kpi-card__label" style={{ fontSize: '11px' }}>Acceptance</div>
          </div>

          <div className="kpi-card animate-slideInUp" style={{ padding: '12px' }}>
            <div className="flex items-center justify-between mb-1">
              <TrendingUp className="kpi-card__icon" style={{ width: '16px', height: '16px' }} />
            </div>
            <div className="kpi-card__number" style={{ fontSize: '20px', marginBottom: '2px' }}>{currentMetrics.conversions}</div>
            <div className="kpi-card__label" style={{ fontSize: '11px' }}>Conversions</div>
          </div>

          <div className="kpi-card animate-slideInUp" style={{ padding: '12px' }}>
            <div className="flex items-center justify-between mb-1">
              <DollarSign className="kpi-card__icon" style={{ width: '16px', height: '16px' }} />
            </div>
            <div className="kpi-card__number" style={{ fontSize: '20px', marginBottom: '2px' }}>${(currentMetrics.revenue / 1000).toFixed(0)}K</div>
            <div className="kpi-card__label" style={{ fontSize: '11px' }}>Revenue</div>
          </div>

          <div className="kpi-card animate-slideInUp" style={{ padding: '12px' }}>
            <div className="flex items-center justify-between mb-1">
              <Activity className="kpi-card__icon" style={{ width: '16px', height: '16px' }} />
            </div>
            <div className="kpi-card__number" style={{ fontSize: '20px', marginBottom: '2px' }}>{activeCampaigns}</div>
            <div className="kpi-card__label" style={{ fontSize: '11px' }}>Active</div>
          </div>

          <div className="kpi-card animate-slideInUp" style={{ padding: '12px' }}>
            <div className="flex items-center justify-between mb-1">
              <CheckCircle className="kpi-card__icon" style={{ width: '16px', height: '16px' }} />
            </div>
            <div className="kpi-card__number" style={{ fontSize: '20px', marginBottom: '2px' }}>{completedCount}</div>
            <div className="kpi-card__label" style={{ fontSize: '11px' }}>Completed</div>
          </div>
        </div>

        {/* Lead Performance & Revenue Charts - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Lead Performance Trend */}
          <ChartCard title="Lead Performance Trend">
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={currentMetrics.monthlyData}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgba(186,32,39,0.08)" stopOpacity={1} />
                    <stop offset="95%" stopColor="rgba(186,32,39,0.08)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="0" stroke="#F5F5F5" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  style={{ fontSize: 10, fill: '#9CA3AF' }} 
                  stroke="none"
                  tickLine={false}
                />
                <YAxis 
                  style={{ fontSize: 10, fill: '#9CA3AF' }} 
                  stroke="none"
                  tickLine={false}
                />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Area 
                  type="monotone" 
                  dataKey="leads" 
                  stroke="#BA2027" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorLeads)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Monthly Revenue Trend */}
          <ChartCard title="Monthly Revenue Trend">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={currentMetrics.monthlyData} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="0" stroke="#F5F5F5" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  style={{ fontSize: 10, fill: '#9CA3AF' }} 
                  stroke="none"
                  tickLine={false}
                />
                <YAxis 
                  style={{ fontSize: 10, fill: '#9CA3AF' }} 
                  stroke="none"
                  tickLine={false}
                />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Bar 
                  dataKey="revenue" 
                  fill="rgba(186,32,39,0.85)" 
                  radius={[6, 6, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Demographics Section - 3 columns */}
        <div>
          <h2 style={{ color: 'var(--color-text-primary)', fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-semibold)' }} className="mb-3">
            Lead Demographics
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Title Distribution */}
            <div className="glass-card p-4">
              <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)' }} className="mb-4">
                Title Distribution
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={currentMetrics.titleDistribution}
                    dataKey="percentage"
                    nameKey="title"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    label={({ percentage }) => `${percentage}%`}
                    labelLine={true}
                  >
                    {currentMetrics.titleDistribution.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Legend 
                    verticalAlign="bottom" 
                    align="center" 
                    layout="horizontal"
                    iconType="circle"
                    wrapperStyle={{ fontSize: '10px', paddingTop: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Company Size Distribution */}
            <div className="glass-card p-4">
              <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)' }} className="mb-4">
                Company Size
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={currentMetrics.companySizeData}
                    dataKey="percentage"
                    nameKey="size"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    label={({ percentage }) => `${percentage}%`}
                    labelLine={true}
                  >
                    {currentMetrics.companySizeData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Legend 
                    verticalAlign="bottom" 
                    align="center" 
                    layout="horizontal"
                    iconType="circle"
                    wrapperStyle={{ fontSize: '10px', paddingTop: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Conversion Rate Trend */}
            <div className="glass-card p-4">
              <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)' }} className="mb-4">
                Conversion Trend
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={currentMetrics.monthlyData}>
                  <defs>
                    <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="rgba(186,32,39,0.2)" stopOpacity={1} />
                      <stop offset="95%" stopColor="rgba(186,32,39,0.2)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="0" stroke="#F5F5F5" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    style={{ fontSize: 9, fill: '#9CA3AF' }} 
                    stroke="none"
                    tickLine={false}
                  />
                  <YAxis 
                    style={{ fontSize: 9, fill: '#9CA3AF' }} 
                    stroke="none"
                    tickLine={false}
                  />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Area 
                    type="monotone" 
                    dataKey="conversions" 
                    stroke="#BA2027" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorConversions)"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
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