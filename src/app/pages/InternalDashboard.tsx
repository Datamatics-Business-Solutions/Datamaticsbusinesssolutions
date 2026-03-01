import { TrendingUp, Users, Target, DollarSign, Activity, AlertCircle } from 'lucide-react';
import { GlassNavigation } from '../components/GlassNavigation';
import { mockCampaigns } from '../mockData';
import { useTheme } from '../context/ThemeContext';

export default function InternalDashboard() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Professional BPM gradient background
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
        border: '1px solid rgba(0, 0, 0, 0.06)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)'
      };
  
  const activeCampaigns = mockCampaigns.filter(c => c.status === 'In progress').length;
  const totalTarget = mockCampaigns.reduce((sum, c) => sum + c.target, 0);
  const totalDelivered = mockCampaigns.reduce((sum, c) => sum + c.delivered, 0);
  const totalRevenue = mockCampaigns.reduce((sum, c) => {
    const match = c.pricingModel.match(/\$(\d+)/);
    return sum + (match ? parseInt(match[1]) * c.delivered : 0);
  }, 0);

  const recentActivity = [
    { campaign: 'Enterprise IT Security Campaign Q1 2026', action: 'Delivered 50 leads', time: '2 hours ago', type: 'success' },
    { campaign: 'Financial Services BANT Qualification', action: 'Daily numbers updated', time: '3 hours ago', type: 'info' },
    { campaign: 'SaaS Appointment Setting - Q1', action: 'Campaign paused by client', time: '5 hours ago', type: 'warning' },
    { campaign: 'Healthcare Content Syndication', action: 'Campaign completed', time: '1 day ago', type: 'success' },
    { campaign: 'Retail Technology Appointments', action: 'Delivered 3 appointments', time: '1 day ago', type: 'success' }
  ];

  return (
    <div style={backgroundStyle}>
      <GlassNavigation showInternalBadge={true} />
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className={isDark ? 'text-white' : 'text-[#1E1E1E]'}>Operations Dashboard</h1>
          <div className={`text-sm font-medium ${isDark ? 'text-[#A0A0A0]' : 'text-[#6B6B6B]'}`}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="rounded-2xl p-6 border transition-all hover:shadow-2xl" style={cardStyle}>
            <div className="flex items-center justify-between mb-2">
              <div className={`text-sm font-medium ${isDark ? 'text-[#A0A0A0]' : 'text-[#6B6B6B]'}`}>Active Campaigns</div>
              <Activity className="w-5 h-5 text-[#0891B2]" />
            </div>
            <div className={`text-3xl font-semibold mb-1 ${isDark ? 'text-white' : 'text-[#1E1E1E]'}`}>{activeCampaigns}</div>
            <div className="text-xs text-[#0F9D58] font-medium">+2 this week</div>
          </div>

          <div className="rounded-2xl p-6 border transition-all hover:shadow-2xl" style={cardStyle}>
            <div className="flex items-center justify-between mb-2">
              <div className={`text-sm font-medium ${isDark ? 'text-[#A0A0A0]' : 'text-[#6B6B6B]'}`}>Total Revenue</div>
              <DollarSign className="w-5 h-5 text-[#0F9D58]" />
            </div>
            <div className={`text-3xl font-semibold mb-1 ${isDark ? 'text-white' : 'text-[#1E1E1E]'}`}>${(totalRevenue / 1000).toFixed(0)}k</div>
            <div className="text-xs text-[#0F9D58] font-medium">+12% from last month</div>
          </div>

          <div className="rounded-2xl p-6 border transition-all hover:shadow-2xl" style={cardStyle}>
            <div className="flex items-center justify-between mb-2">
              <div className={`text-sm font-medium ${isDark ? 'text-[#A0A0A0]' : 'text-[#6B6B6B]'}`}>Leads Delivered</div>
              <Target className={`w-5 h-5 ${isDark ? 'text-[#E63946]' : 'text-[#BA2027]'}`} />
            </div>
            <div className={`text-3xl font-semibold mb-1 ${isDark ? 'text-white' : 'text-[#1E1E1E]'}`}>{totalDelivered.toLocaleString()}</div>
            <div className={`text-xs font-medium ${isDark ? 'text-[#A0A0A0]' : 'text-[#6B6B6B]'}`}>{totalTarget.toLocaleString()} target</div>
          </div>

          <div className="rounded-2xl p-6 border transition-all hover:shadow-2xl" style={cardStyle}>
            <div className="flex items-center justify-between mb-2">
              <div className={`text-sm font-medium ${isDark ? 'text-[#A0A0A0]' : 'text-[#6B6B6B]'}`}>Active Clients</div>
              <Users className="w-5 h-5 text-[#F4B400]" />
            </div>
            <div className={`text-3xl font-semibold mb-1 ${isDark ? 'text-white' : 'text-[#1E1E1E]'}`}>{new Set(mockCampaigns.map(c => c.clientCompany)).size}</div>
            <div className="text-xs text-[#0F9D58] font-medium">3 new this month</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Campaign Performance */}
          <div className="lg:col-span-2 rounded-2xl p-6 border transition-all hover:shadow-2xl" style={cardStyle}>
            <h2 className={`text-lg font-normal mb-4 ${isDark ? 'text-white' : 'text-[#1E1E1E]'}`}>Campaign Performance</h2>
            <div className="space-y-4">
              {mockCampaigns.filter(c => c.status === 'In progress').map((campaign) => {
                const progress = (campaign.delivered / campaign.target) * 100;
                return (
                  <div key={campaign.id} className={`border-b pb-4 last:pb-0 last:border-b-0 ${isDark ? 'border-[#BA2027]/20' : 'border-[#BA2027]/10'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className={`text-sm font-normal ${isDark ? 'text-white' : 'text-[#1E1E1E]'}`}>{campaign.name}</div>
                        <div className={`text-xs font-light ${isDark ? 'text-[#B0B0B0]' : 'text-[#757575]'}`}>{campaign.clientCompany}</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-normal ${isDark ? 'text-white' : 'text-[#1E1E1E]'}`}>{progress.toFixed(0)}%</div>
                        <div className={`text-xs font-light ${isDark ? 'text-[#B0B0B0]' : 'text-[#757575]'}`}>{campaign.delivered}/{campaign.target}</div>
                      </div>
                    </div>
                    <div className={`w-full rounded-full h-2 ${isDark ? 'bg-[#BA2027]/20' : 'bg-[#BA2027]/10'}`}>
                      <div
                        className="bg-[#BA2027] h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-2xl p-6 border transition-all hover:shadow-2xl" style={cardStyle}>
            <h2 className={`text-lg font-normal mb-4 ${isDark ? 'text-white' : 'text-[#1E1E1E]'}`}>Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex gap-3">
                  <div className={`flex-shrink-0 w-2 h-2 mt-2 rounded-full ${
                    activity.type === 'success' ? 'bg-green-500' :
                    activity.type === 'warning' ? 'bg-orange-500' :
                    'bg-blue-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-900 font-medium truncate">{activity.campaign}</div>
                    <div className="text-xs text-gray-600">{activity.action}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alerts & Warnings */}
        <div className="mt-6 rounded-2xl p-6 border transition-all hover:shadow-2xl" style={cardStyle}>
          <h2 className={`text-lg font-normal mb-4 ${isDark ? 'text-white' : 'text-[#1E1E1E]'}`}>Alerts & Warnings</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-orange-900">SaaS Appointment Setting - Q1</div>
                <div className="text-xs text-orange-700 mt-1">Campaign is paused. Daily target may be impacted.</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-blue-900">Manufacturing Lead Generation Campaign</div>
                <div className="text-xs text-blue-700 mt-1">Campaign starts in 2 days. Job card pending signature.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
            <div className="text-sm text-purple-700 mb-2">Today's Leads Sourced</div>
            <div className="text-2xl font-semibold text-purple-900">245</div>
            <div className="text-xs text-purple-600 mt-1">+18% vs yesterday</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
            <div className="text-sm text-blue-700 mb-2">Acceptance Rate (This Week)</div>
            <div className="text-2xl font-semibold text-blue-900">89.2%</div>
            <div className="text-xs text-blue-600 mt-1">Above target (85%)</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
            <div className="text-sm text-green-700 mb-2">Appointments Set (This Week)</div>
            <div className="text-2xl font-semibold text-green-900">23</div>
            <div className="text-xs text-green-600 mt-1">On track for target</div>
          </div>
        </div>
      </div>
    </div>
  );
}