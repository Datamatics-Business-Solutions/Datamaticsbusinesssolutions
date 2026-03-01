import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, Plus, Filter } from 'lucide-react';
import { mockCampaigns } from '../mockData';
import { ProgressBar } from '../components/ProgressBar';
import { TableRow } from '../components/TableRow';

export default function CampaignList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [dateRange, setDateRange] = useState<string>('All time');
  const [isNewCampaignModalOpen, setIsNewCampaignModalOpen] = useState(false);
  const [campaigns, setCampaigns] = useState(mockCampaigns);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const isDark = false; // Assuming dark mode is not used in this context

  const handleNewCampaignSubmit = (formData: CampaignFormData) => {
    // Create new campaign object
    const newCampaign = {
      id: `${campaigns.length + 1}`,
      name: formData.name,
      clientCompany: 'TechVentures Agency', // Would come from auth
      serviceType: formData.type as ServiceType,
      status: 'Under review' as CampaignStatus,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 90 days from now
      delivered: 0,
      target: 0, // Would be set later
      accepted: 0,
      lastUpdated: new Date().toISOString().split('T')[0],
      geo: `${formData.geography} (${formData.locations.slice(0, 3).join(', ')}${formData.locations.length > 3 ? '...' : ''})`,
      industry: 'TBD',
      revenueRange: formData.revenueSizeMin && formData.revenueSizeMax 
        ? `${formData.revenueSizeMin} - ${formData.revenueSizeMax}` 
        : 'TBD',
      employeeSize: `${formData.employeeSizeMin} - ${formData.employeeSizeMax}`,
      jobTitles: formData.titles.join(', '),
      pricingModel: `Per lead ($${formData.cpl}/lead)`,
      clientDetails: {
        name: 'TechVentures Agency',
        address: '123 Market Street, San Francisco, CA 94105',
        contact: 'John Smith, john.smith@techventures.com, +1 415-555-0123'
      },
      scopeOfWork: [
        `Campaign type: ${formData.type}`,
        `Target geography: ${formData.geography}`,
        `Locations: ${formData.locations.join(', ')}`,
        `Job titles: ${formData.titles.join(', ')}`,
        formData.additionalInfo || 'Additional requirements to be confirmed'
      ],
      terms: 'Campaign details under review. Job card will be sent for signature within 2 business days.'
    };

    setCampaigns([newCampaign, ...campaigns]);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 5000);
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <GlassNavigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with New Campaign Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <h1 className="text-3xl font-semibold text-gray-900">Your Campaigns</h1>
          <button
            onClick={() => setIsNewCampaignModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1E3A5F] to-[#1E3A5F]/80 text-white rounded-lg hover:from-[#1E3A5F]/90 hover:to-[#1E3A5F]/70 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
          >
            <Plus className="w-5 h-5" />
            Start a campaign
          </button>
        </div>

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <div className="flex-shrink-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
              ✓
            </div>
            <div>
              <h3 className="font-semibold text-green-900">Campaign Submitted Successfully!</h3>
              <p className="text-sm text-green-700 mt-1">
                Your campaign request is now under review. We'll send you a job card for signature within 2 business days.
              </p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="rounded-2xl p-5 mb-6 border" style={{
          background: '#FFFFFF',
          border: '1px solid rgba(0, 0, 0, 0.06)',
          boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.04)'
        }}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by campaign name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="All">All Statuses</option>
              <option value="Under review">Under review</option>
              <option value="Not started">Not started</option>
              <option value="In progress">In progress</option>
              <option value="Paused">Paused</option>
              <option value="Completed">Completed</option>
            </select>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="All time">All time</option>
              <option value="This month">This month</option>
              <option value="Last 3 months">Last 3 months</option>
              <option value="This year">This year</option>
            </select>
          </div>
        </div>

        {/* Campaign Table */}
        <div className="rounded-2xl overflow-hidden border" style={{
          background: '#FFFFFF',
          border: '1px solid rgba(0, 0, 0, 0.06)',
          boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.04)'
        }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Campaign Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    End Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delivered vs Target
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCampaigns.map((campaign, index) => (
                  <TableRow 
                    key={campaign.id}
                    showHoverEffect={true}
                    animationDelay={index * 30}
                    className={index % 2 === 1 ? 'bg-[#F8FCFD]/50' : ''}
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{campaign.serviceType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={campaign.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(campaign.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(campaign.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 whitespace-nowrap">
                          {campaign.delivered} / {campaign.target}
                        </span>
                        <div className="w-24">
                          <ProgressBar current={campaign.delivered} target={campaign.target} />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(campaign.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/campaigns/${campaign.id}`}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                      >
                        View details
                      </Link>
                    </td>
                  </TableRow>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredCampaigns.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No campaigns found matching your filters.
          </div>
        )}
      </div>

      {/* New Campaign Modal */}
      <NewCampaignModal
        isOpen={isNewCampaignModalOpen}
        onClose={() => setIsNewCampaignModalOpen(false)}
        onSubmit={handleNewCampaignSubmit}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}