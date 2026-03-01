import { BarChart3, TrendingUp, Download, Calendar } from 'lucide-react';
import { Navigation } from '../components/Navigation';
import { mockCampaigns } from '../mockData';

export default function InternalReports() {
  const monthlyData = [
    { month: 'Jan', leads: 1240, revenue: 58000, campaigns: 8 },
    { month: 'Feb', leads: 1580, revenue: 73500, campaigns: 9 },
    { month: 'Mar', leads: 850, revenue: 42000, campaigns: 6 }
  ];

  const topPerformers = mockCampaigns
    .filter(c => c.delivered > 0)
    .sort((a, b) => {
      const rateA = (a.accepted / a.delivered) * 100;
      const rateB = (b.accepted / b.delivered) * 100;
      return rateB - rateA;
    })
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation userType="internal" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">Reports & Analytics</h1>
          <div className="flex gap-3">
            <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>This quarter</option>
              <option>This year</option>
            </select>
            <button className="inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-all" style={{ background: '#1E3A5F' }}>
              <Download className="w-4 h-4" />
              Export my report
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Total Leads (Q1)</div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-semibold text-gray-900">3,670</div>
            <div className="text-xs text-green-600 mt-1">+23% vs Q4</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Avg Acceptance Rate</div>
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-semibold text-gray-900">87.4%</div>
            <div className="text-xs text-green-600 mt-1">+2.1% vs Q4</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Total Revenue (Q1)</div>
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-2xl font-semibold text-gray-900">$173.5k</div>
            <div className="text-xs text-green-600 mt-1">+28% vs Q4</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Campaigns Delivered</div>
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-2xl font-semibold text-gray-900">23</div>
            <div className="text-xs text-gray-600 mt-1">7 active campaigns</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Monthly Trends */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Monthly Trends</h2>
            <div className="space-y-6">
              {monthlyData.map((data) => {
                const maxLeads = Math.max(...monthlyData.map(d => d.leads));
                const leadsWidth = (data.leads / maxLeads) * 100;
                const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));
                const revenueWidth = (data.revenue / maxRevenue) * 100;

                return (
                  <div key={data.month}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm font-medium text-gray-900">{data.month} 2026</div>
                      <div className="text-xs text-gray-500">{data.campaigns} campaigns</div>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Leads</span>
                          <span className="font-medium">{data.leads.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-600 to-purple-500 h-2 rounded-full"
                            style={{ width: `${leadsWidth}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Revenue</span>
                          <span className="font-medium">${(data.revenue / 1000).toFixed(1)}k</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-600 to-blue-500 h-2 rounded-full"
                            style={{ width: `${revenueWidth}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Service Type Breakdown */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Service Type Breakdown</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Leads</span>
                  <span className="font-semibold text-gray-900">45%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '45%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">BANT</span>
                  <span className="font-semibold text-gray-900">25%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '25%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Appointments</span>
                  <span className="font-semibold text-gray-900">18%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '18%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Content Syndication</span>
                  <span className="font-semibold text-gray-900">12%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-600 h-2 rounded-full" style={{ width: '12%' }} />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Geography Split</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">North America</span>
                  <span className="font-medium text-gray-900">52%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">EMEA</span>
                  <span className="font-medium text-gray-900">28%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">APAC</span>
                  <span className="font-medium text-gray-900">20%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performing Campaigns */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Campaigns</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Campaign</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delivered</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Accepted</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acceptance Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {topPerformers.map((campaign) => {
                  const acceptanceRate = (campaign.accepted / campaign.delivered) * 100;
                  return (
                    <tr key={campaign.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {campaign.clientCompany}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {campaign.delivered}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {campaign.accepted}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-green-600">
                            {acceptanceRate.toFixed(1)}%
                          </span>
                          <div className="w-16 h-1.5 bg-gray-200 rounded-full">
                            <div
                              className="h-1.5 bg-green-600 rounded-full"
                              style={{ width: `${acceptanceRate}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {campaign.status}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}