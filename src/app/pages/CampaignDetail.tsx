import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { ChevronRight, Calendar, FileText, Download, HelpCircle, Check, Pause, Play } from 'lucide-react';
import { Navigation } from '../components/Navigation';
import { StatusBadge } from '../components/StatusBadge';
import { ProgressBar } from '../components/ProgressBar';
import { JobCardModal } from '../components/JobCardModal';
import { mockCampaigns, mockActivityUpdates } from '../mockData';

export default function CampaignDetail() {
  const { id } = useParams();
  const campaign = mockCampaigns.find(c => c.id === id);
  const [showJobCard, setShowJobCard] = useState(false);

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation userType="client" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900">Campaign not found</h2>
            <Link to="/campaigns" className="text-purple-600 hover:text-purple-700 mt-4 inline-block">
              Back to campaigns
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation userType="client" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <Link to="/campaigns" className="hover:text-gray-700">Campaigns</Link>
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
            <StatusBadge status={campaign.status} />
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
                          <Check className="w-4 h-4 text-white" />
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
            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
              <div className="space-y-3">
                <button className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <Pause className="w-4 h-4" />
                  Request Pause
                </button>
                <button className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <Play className="w-4 h-4" />
                  Request Resume
                </button>
                <button className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <HelpCircle className="w-4 h-4" />
                  Contact Support
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
                      <div className="text-xs text-gray-500">View or download</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>

                {campaign.status === 'Completed' && (
                  <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group">
                    <div className="flex items-center gap-3">
                      <Download className="w-5 h-5 text-gray-400 group-hover:text-purple-600" />
                      <div className="text-left">
                        <div className="text-sm font-medium text-gray-900">Lead File</div>
                        <div className="text-xs text-gray-500">Download completed leads</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                )}

                {campaign.status !== 'Completed' && campaign.status !== 'Not started' && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-xs text-blue-700">
                      Lead files will be available for download once the campaign is completed.
                    </div>
                  </div>
                )}
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