import { AppLayout } from '../components/AppLayout';
import { TrendingUp, Users, Target, DollarSign } from 'lucide-react';
import { mockCampaigns } from '../mockData';
import { AnimatedCounter } from '../components/AnimatedCounter';

export default function InternalReports() {
  const monthlyData = [
    { month: 'Jan', leads: 1240, revenue: 58000, campaigns: 8 },
    { month: 'Feb', leads: 1580, revenue: 72000, campaigns: 10 },
    { month: 'Mar', leads: 1920, revenue: 89000, campaigns: 12 },
    { month: 'Apr', leads: 2150, revenue: 98000, campaigns: 13 },
    { month: 'May', leads: 2480, revenue: 112000, campaigns: 15 },
    { month: 'Jun', leads: 2890, revenue: 128000, campaigns: 16 },
  ];

  const totalLeads = monthlyData.reduce((sum, m) => sum + m.leads, 0);
  const totalRevenue = monthlyData.reduce((sum, m) => sum + m.revenue, 0);
  const totalCampaigns = mockCampaigns.length;

  return (
    <AppLayout>
      <div className="max-w-[1440px] mx-auto px-6 py-6">
        <div className="mb-6">
          <h1 style={{ color: 'var(--color-text-primary)' }} className="mb-2">Internal Reports</h1>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
            Company-wide performance metrics
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 stagger-children">
          <div className="kpi-card animate-slideInUp">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-primary-tint)' }}>
                <Target className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
              </div>
            </div>
            <div className="kpi-card__number"><AnimatedCounter value={totalLeads} /></div>
            <div className="kpi-card__label">Total Leads</div>
          </div>

          <div className="kpi-card animate-slideInUp">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-success-bg)' }}>
                <DollarSign className="w-5 h-5" style={{ color: 'var(--color-success)' }} />
              </div>
            </div>
            <div className="kpi-card__number">${(totalRevenue / 1000).toFixed(0)}K</div>
            <div className="kpi-card__label">Revenue</div>
          </div>

          <div className="kpi-card animate-slideInUp">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-info-bg)' }}>
                <Users className="w-5 h-5" style={{ color: 'var(--color-info)' }} />
              </div>
            </div>
            <div className="kpi-card__number"><AnimatedCounter value={totalCampaigns} /></div>
            <div className="kpi-card__label">Campaigns</div>
          </div>

          <div className="kpi-card animate-slideInUp">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-success-bg)' }}>
                <TrendingUp className="w-5 h-5" style={{ color: 'var(--color-success)' }} />
              </div>
            </div>
            <div className="kpi-card__number">+23%</div>
            <div className="kpi-card__label">Growth</div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }} className="mb-4">
            Monthly Performance
          </h2>

          <div className="space-y-4">
            {monthlyData.map((month, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg" style={{ background: 'var(--color-border-light)' }}>
                <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
                  {month.month}
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Leads</div>
                    <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
                      {month.leads}
                    </div>
                  </div>
                  <div className="text-right">
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Revenue</div>
                    <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
                      ${(month.revenue / 1000).toFixed(0)}K
                    </div>
                  </div>
                  <div className="text-right">
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Campaigns</div>
                    <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
                      {month.campaigns}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
