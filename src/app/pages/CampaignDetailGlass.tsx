import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { 
  ChevronRight, 
  Target, 
  TrendingUp, 
  CheckCircle, 
  FileText,
  Download,
  DollarSign,
  ArrowLeft,
  Activity,
  Package
} from 'lucide-react';
import { AppLayout } from '../components/AppLayout';
import { JobCardModal } from '../components/JobCardModalGlass';
import { AnimatedDonutChart } from '../components/AnimatedDonutChart';
import { DeliveryScheduleSection } from '../components/DeliveryScheduleSection';
import { allClients } from '../data/mockClients';
import { mockActivityUpdates } from '../mockData';

export default function CampaignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showJobCard, setShowJobCard] = useState(false);
  
  // Find the campaign across all clients
  let campaign = null;
  let client = null;
  
  for (const c of allClients) {
    const foundCampaign = c.campaigns.find(camp => camp.id === id);
    if (foundCampaign) {
      campaign = foundCampaign;
      client = c;
      break;
    }
  }

  if (!campaign) {
    return (
      <AppLayout>
        <div className="max-w-[1440px] mx-auto px-6 py-6">
          <div className="text-center py-12">
            <h2 style={{ color: 'var(--color-text-primary)', fontSize: 'var(--font-size-xl)' }}>Campaign not found</h2>
            <button onClick={() => navigate('/dashboard')} className="btn-primary mt-4 px-6 py-3">
              Back to Dashboard
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  const acceptanceRate = campaign.acceptanceRate || 0;
  
  // Use goalLeads/deliveredLeads if available, otherwise fall back to target/delivered
  const targetLeads = campaign.goalLeads || campaign.target || campaign.totalLeads || 0;
  const deliveredLeads = campaign.deliveredLeads || campaign.delivered || campaign.totalLeads || 0;
  
  const progressPercentage = targetLeads > 0
    ? Math.round((deliveredLeads / targetLeads) * 100)
    : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'badge badge-active';
      case 'completed':
        return 'badge badge-completed';
      case 'paused':
        return 'badge badge-paused';
      default:
        return 'badge badge-active';
    }
  };

  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <AppLayout>
      <div className="max-w-[1440px] mx-auto px-6 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
          <button onClick={() => navigate('/dashboard')} className="hover:text-[var(--color-primary)] transition-colors">
            Dashboard
          </button>
          <ChevronRight className="w-4 h-4" />
          <span style={{ color: 'var(--color-text-primary)' }}>{campaign.name}</span>
        </div>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-ghost p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 style={{ color: 'var(--color-text-primary)' }}>{campaign.name}</h1>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className={getStatusColor(campaign.status)}>{formatStatus(campaign.status)}</span>
              {campaign.startDate && campaign.endDate && (
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                  {campaign.startDate} - {campaign.endDate}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowJobCard(true)}
              className="btn-outline px-4 py-2 flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              View Job Card
            </button>
            <button className="btn-primary px-4 py-2 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 stagger-children">
          <div className="kpi-card animate-slideInUp">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-primary-tint)' }}>
                <Target className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
              </div>
            </div>
            <div className="kpi-card__number">{campaign.target || campaign.totalLeads}</div>
            <div className="kpi-card__label">Target</div>
          </div>

          <div className="kpi-card animate-slideInUp">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-info-bg)' }}>
                <TrendingUp className="w-5 h-5" style={{ color: 'var(--color-info)' }} />
              </div>
            </div>
            <div className="kpi-card__number">{campaign.delivered || campaign.totalLeads}</div>
            <div className="kpi-card__label">Delivered</div>
          </div>

          <div className="kpi-card animate-slideInUp">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-success-bg)' }}>
                <CheckCircle className="w-5 h-5" style={{ color: 'var(--color-success)' }} />
              </div>
            </div>
            <div className="kpi-card__number">{acceptanceRate}%</div>
            <div className="kpi-card__label">Acceptance</div>
          </div>

          <div className="kpi-card animate-slideInUp">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-success-bg)' }}>
                <DollarSign className="w-5 h-5" style={{ color: 'var(--color-success)' }} />
              </div>
            </div>
            <div className="kpi-card__number">${campaign.budget ? (campaign.budget / 1000).toFixed(0) : '0'}K</div>
            <div className="kpi-card__label">Budget</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Progress Chart */}
          <div className="lg:col-span-2 glass-card p-6">
            <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }} className="mb-6">
              Campaign Progress
            </h2>
            <div className="flex items-center justify-center">
              <AnimatedDonutChart
                percentage={progressPercentage}
                size={200}
                strokeWidth={20}
                color="var(--color-primary)"
              />
            </div>
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="text-center">
                <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)' }}>
                  {campaign.target || campaign.totalLeads}
                </div>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Target</div>
              </div>
              <div className="text-center">
                <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary)' }}>
                  {campaign.delivered || campaign.totalLeads}
                </div>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Delivered</div>
              </div>
              <div className="text-center">
                <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)' }}>
                  {(campaign.target || campaign.totalLeads) - (campaign.delivered || campaign.totalLeads)}
                </div>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Remaining</div>
              </div>
            </div>
          </div>

          {/* Campaign Details */}
          <div className="glass-card p-6">
            <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }} className="mb-4">
              Campaign Details
            </h2>
            <div className="space-y-4">
              <div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-wide)' }} className="mb-1">
                  Status
                </div>
                <span className={getStatusColor(campaign.status)}>{formatStatus(campaign.status)}</span>
              </div>
              {campaign.startDate && campaign.endDate && (
                <div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-wide)' }} className="mb-1">
                    Duration
                  </div>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>
                    {campaign.startDate} - {campaign.endDate}
                  </div>
                </div>
              )}
              {campaign.budget && (
                <div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-wide)' }} className="mb-1">
                    Budget
                  </div>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>
                    ${campaign.budget.toLocaleString()}
                  </div>
                </div>
              )}
              <div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-wide)' }} className="mb-1">
                  Account Manager
                </div>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>
                  Sarah Johnson
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card p-6 mt-6">
          <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }} className="mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {mockActivityUpdates.slice(0, 5).map((activity, index) => (
              <div key={index} className="flex items-start gap-3 pb-4" style={{ borderBottom: index < 4 ? '1px solid var(--color-border)' : 'none' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--color-primary-tint)' }}>
                  <Activity className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                </div>
                <div className="flex-1">
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>
                    {activity.message}
                  </div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }} className="mt-1">
                    {activity.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Schedule Section */}
        <DeliveryScheduleSection campaign={campaign} />
      </div>

      {/* Job Card Modal */}
      <JobCardModal
        isOpen={showJobCard}
        onClose={() => setShowJobCard(false)}
        campaign={campaign}
      />
    </AppLayout>
  );
}