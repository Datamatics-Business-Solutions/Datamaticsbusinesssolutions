import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { ChevronRight, Calendar, FileText, Download, HelpCircle, Save, CheckCircle } from 'lucide-react';
import { Navigation } from '../components/Navigation';
import { StatusBadge } from '../components/StatusBadge';
import { ProgressBar } from '../components/ProgressBar';
import { JobCardModal } from '../components/JobCardModal';
import { mockCampaigns, mockActivityUpdates, mockDailyProgress } from '../mockData';
import { CampaignStatus } from '../types';

export default function InternalCampaignDetail() {
  const { id } = useParams();
  const campaign = mockCampaigns.find(c => c.id === id);
  const [showJobCard, setShowJobCard] = useState(false);
  const [status, setStatus] = useState<CampaignStatus>(campaign?.status || 'Not started');
  
  const [dailyData, setDailyData] = useState({
    leadsSourced: 50,
    leadsValidated: 43,
    leadsRejected: 7,
    bantQualified: 37,
    appointmentsSet: 3
  });

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation userType="internal" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900">Campaign not found</h2>
            <Link to="/internal/campaigns" className="text-purple-600 hover:text-purple-700 mt-4 inline-block">
              Back to campaigns
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (field: string, value: string) => {
    setDailyData(prev => ({
      ...prev,
      [field]: parseInt(value) || 0
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation userType="internal" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <Link to="/internal/campaigns" className="hover:text-gray-700">Campaigns</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-gray-900">{campaign.name}</span>
        </div>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">{campaign.name}</h1>
              <p className="text-gray-600">{campaign.clientCompany}</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as CampaignStatus)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="Not started">Not started</option>
                <option value="In progress">In progress</option>
                <option value="Paused">Paused</option>
                <option value="Completed">Completed</option>
              </select>
              <StatusBadge status={status} />
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
              <div className="text-sm text-purple-700 mb-1">Target Leads</div>
              <div className="text-2xl font-semibold text-purple-900">{campaign.target}</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <div className="text-sm text-blue-700 mb-1">Delivered Leads</div>
              <div className="text-2xl font-semibold text-blue-900">{campaign.delivered}</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div className="text-sm text-green-700 mb-1">Accepted Leads</div>
              <div className="text-2xl font-semibold text-green-900">{campaign.accepted}</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
              <div className="text-sm text-orange-700 mb-1">End Date</div>
              <div className="text-lg font-semibold text-orange-900">
                {new Date(campaign.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Daily Numbers Input */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Numbers Entry</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Leads Sourced
                  </label>
                  <input
                    type="number"
                    value={dailyData.leadsSourced}
                    onChange={(e) => handleInputChange('leadsSourced', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Leads Validated
                  </label>
                  <input
                    type="number"
                    value={dailyData.leadsValidated}
                    onChange={(e) => handleInputChange('leadsValidated', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Leads Rejected
                  </label>
                  <input
                    type="number"
                    value={dailyData.leadsRejected}
                    onChange={(e) => handleInputChange('leadsRejected', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    BANT Qualified
                  </label>
                  <input
                    type="number"
                    value={dailyData.bantQualified}
                    onChange={(e) => handleInputChange('bantQualified', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Appointments Set
                  </label>
                  <input
                    type="number"
                    value={dailyData.appointmentsSet}
                    onChange={(e) => handleInputChange('appointmentsSet', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-blue-700 transition-colors">
                  <Save className="w-4 h-4" />
                  Save Today's Data
                </button>
              </div>
            </div>

            {/* Daily Progress Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Daily Progress (Last 4 Days)</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">Date</th>
                      <th className="px-4 py-2 text-center font-medium text-gray-700">Sourced</th>
                      <th className="px-4 py-2 text-center font-medium text-gray-700">Validated</th>
                      <th className="px-4 py-2 text-center font-medium text-gray-700">Rejected</th>
                      <th className="px-4 py-2 text-center font-medium text-gray-700">BANT</th>
                      <th className="px-4 py-2 text-center font-medium text-gray-700">Appointments</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {mockDailyProgress.map((day, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-4 text-gray-900">
                          {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </td>
                        <td className="px-4 py-4 text-center text-gray-600">{day.leadsSourced}</td>
                        <td className="px-4 py-4 text-center text-gray-600">{day.leadsValidated}</td>
                        <td className="px-4 py-4 text-center text-gray-600">{day.leadsRejected}</td>
                        <td className="px-4 py-4 text-center text-gray-600">{day.bantQualified}</td>
                        <td className="px-4 py-4 text-center text-gray-600">{day.appointmentsSet}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Progress */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Campaign Progress</h2>
              <div className="mb-6">
                <div className="text-sm text-gray-600 mb-2">Accepted leads vs target</div>
                <ProgressBar current={campaign.accepted} target={campaign.target} showLabel size="lg" />
              </div>
            </div>

            {/* Campaign Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Campaign Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Service Type</div>
                  <div className="text-sm text-gray-900">{campaign.serviceType}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Geography</div>
                  <div className="text-sm text-gray-900">{campaign.geo}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Industry</div>
                  <div className="text-sm text-gray-900">{campaign.industry}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Revenue Range</div>
                  <div className="text-sm text-gray-900">{campaign.revenueRange}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Employee Size</div>
                  <div className="text-sm text-gray-900">{campaign.employeeSize}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Job Titles</div>
                  <div className="text-sm text-gray-900">{campaign.jobTitles}</div>
                </div>
                <div className="md:col-span-2">
                  <div className="text-sm text-gray-500 mb-1">Pricing Model</div>
                  <div className="text-sm text-gray-900">{campaign.pricingModel}</div>
                </div>
              </div>
            </div>

            {/* Activity & Updates */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Activity & Updates</h2>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                <div className="space-y-6">
                  {mockActivityUpdates.map((update, index) => (
                    <div key={index} className="relative flex items-start gap-4">
                      <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                        update.completed 
                          ? 'bg-purple-600 border-purple-600' 
                          : 'bg-white border-gray-300'
                      }`}>
                        {update.completed && (
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 pt-0.5">
                        <div className={`text-sm font-medium ${update.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                          {update.title}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {new Date(update.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Ops Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Operations Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => setShowJobCard(true)}
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Generate Job Card
                </button>
                <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Mark Campaign Completed
                </button>
                <button className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-all" style={{ background: '#1E3A5F' }}>
                  Export my report
                </button>
                <button className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  Send Client Update
                </button>
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Documents</h2>
              <div className="space-y-3">
                <button
                  onClick={() => setShowJobCard(true)}
                  className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400 group-hover:text-purple-600" />
                    <div className="text-left">
                      <div className="text-sm font-medium text-gray-900">Job Card</div>
                      <div className="text-xs text-gray-500">View or generate</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>

                <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <Download className="w-5 h-5 text-gray-400 group-hover:text-purple-600" />
                    <div className="text-left">
                      <div className="text-sm font-medium text-gray-900">Lead Database</div>
                      <div className="text-xs text-gray-500">Export all leads</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>

                <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400 group-hover:text-purple-600" />
                    <div className="text-left">
                      <div className="text-sm font-medium text-gray-900">Performance Report</div>
                      <div className="text-xs text-gray-500">Weekly summary</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Campaign Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Acceptance Rate</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {((campaign.accepted / campaign.delivered) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Days Remaining</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {Math.ceil((new Date(campaign.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Daily Target</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {Math.ceil((campaign.target - campaign.delivered) / Math.ceil((new Date(campaign.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} leads/day
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showJobCard && campaign && (
        <JobCardModal
          campaign={campaign}
          onClose={() => setShowJobCard(false)}
        />
      )}
    </div>
  );
}