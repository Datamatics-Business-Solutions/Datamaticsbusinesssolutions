import { useState } from 'react';
import { useParams } from 'react-router';
import { AppLayout } from '../components/AppLayout';
import { Target, TrendingUp, CheckCircle, DollarSign, Download, FileText, Calendar } from 'lucide-react';
import { mockCampaigns } from '../mockData';
import { AnimatedDonutChart } from '../components/AnimatedDonutChart';
import { CampaignStatus } from '../types';

export default function InternalCampaignDetail() {
  const { id } = useParams();
  const campaign = mockCampaigns.find(c => c.id === id);

  if (!campaign) {
    return (
      <AppLayout>
        <div className="max-w-[1440px] mx-auto px-6 py-6">
          <div className="text-center py-12">
            <h2 style={{ color: 'var(--color-text-primary)' }}>Campaign not found</h2>
          </div>
        </div>
      </AppLayout>
    );
  }

  const progressPercentage = Math.round((campaign.delivered / campaign.target) * 100);

  return (
    <AppLayout>
      <div className="max-w-[1440px] mx-auto page-content">
        <div className="mb-6">
          <h1 style={{ color: 'var(--color-text-primary)' }} className="mb-2">{campaign.name}</h1>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
            {campaign.startDate} - {campaign.endDate}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 stagger-children">
          <div className="kpi-card animate-slideInUp">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-primary-tint)' }}>
                <Target className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
              </div>
            </div>
            <div className="kpi-card__number">{campaign.target}</div>
            <div className="kpi-card__label">Target</div>
          </div>

          <div className="kpi-card animate-slideInUp">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-info-bg)' }}>
                <TrendingUp className="w-5 h-5" style={{ color: 'var(--color-info)' }} />
              </div>
            </div>
            <div className="kpi-card__number">{campaign.delivered}</div>
            <div className="kpi-card__label">Delivered</div>
          </div>

          <div className="kpi-card animate-slideInUp">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-success-bg)' }}>
                <CheckCircle className="w-5 h-5" style={{ color: 'var(--color-success)' }} />
              </div>
            </div>
            <div className="kpi-card__number">{progressPercentage}%</div>
            <div className="kpi-card__label">Progress</div>
          </div>

          <div className="kpi-card animate-slideInUp">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-success-bg)' }}>
                <DollarSign className="w-5 h-5" style={{ color: 'var(--color-success)' }} />
              </div>
            </div>
            <div className="kpi-card__number">${(campaign.budget / 1000).toFixed(0)}K</div>
            <div className="kpi-card__label">Budget</div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-center">
            <AnimatedDonutChart
              percentage={progressPercentage}
              size={200}
              strokeWidth={20}
              color="var(--color-primary)"
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}