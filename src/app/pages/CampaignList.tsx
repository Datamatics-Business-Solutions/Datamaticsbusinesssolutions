import { mockCampaigns, mockCampaignSubmissions } from '../mockData';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Plus, ChevronDown,
  Clock, CheckCircle2, AlertTriangle, MessageSquareDiff,
} from 'lucide-react';
import type { Campaign, CampaignStatus, CampaignSubmission, ServiceType } from '../types';
import { ProgressBar } from '../components/ProgressBar';
import { TableRow } from '../components/TableRow';
import { AppLayout } from '../components/AppLayout';
import { StatusBadge } from '../components/StatusBadge';
import { NewCampaignModal, type CampaignFormData } from '../components/NewCampaignModal';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

// ─── Submission status timeline helper ───────────────────────────────────────
function SubmissionTracker({ submissions }: { submissions: CampaignSubmission[] }) {
  if (submissions.length === 0) return null;

  return (
    <div
      className="mb-6 rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.82)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.6)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#BA2027]/10 flex items-center justify-center">
            <Clock className="w-4 h-4 text-[#BA2027]" />
          </div>
          <div>
            <p className="font-semibold text-[#111]" style={{ fontSize: '15px' }}>
              Submitted for Approval
            </p>
            <p className="text-[#6B7280]" style={{ fontSize: '12px' }}>
              {submissions.length} campaign{submissions.length > 1 ? 's' : ''} awaiting or pending your team's review
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {submissions.some(s => s.status === 'Pending Approval') && (
            <span className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-[#BA2027] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#BA2027]" />
            </span>
          )}
        </div>
      </div>

      {/* Submission rows */}
      <div className="divide-y divide-black/[0.04]">
        {submissions.map(sub => {
          const isPending = sub.status === 'Pending Approval';
          const isChanges = sub.status === 'Changes Requested';

          // 3-step timeline
          const steps = [
            { label: 'Submitted', done: true },
            {
              label: isPending ? 'Under Review' : isChanges ? 'Changes Needed' : 'Reviewed',
              done: !isPending,
              active: isPending,
              warning: isChanges,
            },
            { label: 'Goes Live', done: false },
          ];

          return (
            <div key={sub.id} className="px-6 py-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Campaign info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <StatusBadge status={sub.status} />
                    <span className="text-xs text-[#9CA3AF]">
                      {sub.serviceType} · Submitted {new Date(sub.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <p className="font-semibold text-[#1F2937] truncate" style={{ fontSize: '14px' }}>
                    {sub.campaignName}
                  </p>
                  <p className="text-[#6B7280] mt-0.5" style={{ fontSize: '12px' }}>
                    Assigned to {sub.assignedManager}
                  </p>
                </div>

                {/* Timeline */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {steps.map((step, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <div className="flex flex-col items-center gap-1">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{
                            background: step.done
                              ? '#059669'
                              : step.active
                              ? '#BA2027'
                              : step.warning
                              ? '#F59E0B'
                              : 'rgba(0,0,0,0.08)',
                            boxShadow: (step.active || step.warning)
                              ? `0 0 0 3px ${step.warning ? 'rgba(245,158,11,0.15)' : 'rgba(186,32,39,0.15)'}`
                              : 'none',
                          }}
                        >
                          {step.done ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                          ) : step.warning ? (
                            <AlertTriangle className="w-3 h-3 text-white" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-white/60" />
                          )}
                        </div>
                        <span
                          className="text-center whitespace-nowrap"
                          style={{
                            fontSize: '10px',
                            fontWeight: 600,
                            color: step.done ? '#059669' : step.active ? '#BA2027' : step.warning ? '#B45309' : '#9CA3AF',
                          }}
                        >
                          {step.label}
                        </span>
                      </div>
                      {i < steps.length - 1 && (
                        <div
                          className="w-8 h-px mb-4"
                          style={{ background: step.done ? '#059669' : 'rgba(0,0,0,0.1)' }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Changes Requested feedback callout */}
              {isChanges && sub.managerNotes && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 rounded-xl p-3 flex items-start gap-2.5"
                  style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)' }}
                >
                  <MessageSquareDiff className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-800 mb-0.5" style={{ fontSize: '12px' }}>
                      Feedback from {sub.reviewedBy || sub.assignedManager}
                    </p>
                    <p className="text-amber-900 leading-relaxed" style={{ fontSize: '12px' }}>
                      {sub.managerNotes}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

export default function CampaignList() {
  useDocumentTitle('Campaigns');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [dateRange, setDateRange] = useState<string>('All time');
  const [isNewCampaignModalOpen, setIsNewCampaignModalOpen] = useState(false);
  const [campaigns, setCampaigns] = useState(mockCampaigns);
  const [clientSubmissions, setClientSubmissions] = useState<CampaignSubmission[]>(
    // Show only submissions from the logged-in client (Acme Corp / client_1 for demo)
    mockCampaignSubmissions.filter(s => s.clientId === 'client_1')
  );
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleNewCampaignSubmit = (formData: CampaignFormData) => {
    const newCampaign = {
      id: `${campaigns.length + 1}`,
      name: formData.name,
      clientCompany: 'Acme Corp',
      serviceType: formData.type as ServiceType,
      status: 'Pending Approval' as CampaignStatus,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      delivered: 0,
      target: 0,
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
        name: 'Acme Corp',
        address: '123 Market Street, San Francisco, CA 94105',
        contact: 'Sarah Mitchell, sarah.mitchell@acmecorp.com, +1 415-555-0123',
      },
      scopeOfWork: [
        `Campaign type: ${formData.type}`,
        `Target geography: ${formData.geography}`,
        `Locations: ${formData.locations.join(', ')}`,
        `Job titles: ${formData.titles.join(', ')}`,
        formData.additionalInfo || 'Additional requirements to be confirmed',
      ],
      terms: 'Campaign pending approval. Job card will be sent for signature upon campaign manager approval.',
    };

    // Add to local campaign list
    setCampaigns([newCampaign, ...campaigns]);

    // Add to submissions tracker
    const newSubmission: CampaignSubmission = {
      id: `sub_new_${Date.now()}`,
      campaignName: formData.name,
      clientId: 'client_1',
      clientCompany: 'Acme Corp',
      submittedBy: 'Sarah Mitchell',
      submittedAt: new Date().toISOString(),
      assignedManager: 'Anish Akkoat',
      assignedManagerEmail: 'anish.akkoat@datamaticsbpm.com',
      status: 'Pending Approval',
      serviceType: formData.type,
      geography: formData.geography,
      locations: formData.locations,
      targetLeads: 0,
      cpl: Number(formData.cpl) || 0,
      jobTitles: formData.titles,
      employeeSize: `${formData.employeeSizeMin} - ${formData.employeeSizeMax}`,
      industry: 'TBD',
      additionalInfo: formData.additionalInfo,
    };
    setClientSubmissions(prev => [newSubmission, ...prev]);

    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 5000);
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Only show submissions that are still actionable (not yet approved/declined)
  const activeSubmissions = clientSubmissions.filter(
    s => s.status === 'Pending Approval' || s.status === 'Changes Requested'
  );

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto page-content">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 md:mb-8 gap-4">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Your Campaigns</h1>
          <button
            onClick={() => setIsNewCampaignModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#BA2027] text-white rounded-xl hover:bg-[#9A1A21] active:bg-[#7A1419] transition-all shadow-md hover:shadow-lg font-semibold w-full sm:w-auto"
          >
            <Plus className="w-5 h-5" />
            Submit a Campaign
          </button>
        </div>

        {/* Submissions Tracker — shown when there are pending/changes-requested submissions */}
        <SubmissionTracker submissions={activeSubmissions} />

        {/* Success Message */}
        <AnimatePresence>
          {showSuccessMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-6 rounded-xl p-4 flex items-start gap-3"
              style={{ background: 'rgba(5,150,105,0.07)', border: '1px solid rgba(5,150,105,0.2)' }}
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-emerald-900" style={{ fontSize: '14px' }}>
                  Campaign Submitted for Approval
                </p>
                <p className="text-emerald-800 mt-0.5" style={{ fontSize: '13px' }}>
                  Your campaign request has been sent to your campaign manager for review. You can track its status in the "Submitted for Approval" section above.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters */}
        <div className="glass-card p-5 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by campaign name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-base w-full pl-10 pr-4 py-2"
              />
            </div>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-base px-4 py-2 pr-10 appearance-none cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Pending Approval">Pending Approval</option>
                <option value="Changes Requested">Changes Requested</option>
                <option value="Not started">Not started</option>
                <option value="In progress">In progress</option>
                <option value="Paused">Paused</option>
                <option value="Completed">Completed</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280] pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="input-base px-4 py-2 pr-10 appearance-none cursor-pointer"
              >
                <option value="All time">All time</option>
                <option value="This month">This month</option>
                <option value="Last 3 months">Last 3 months</option>
                <option value="This year">This year</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Campaign Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ background: 'var(--color-border-light)', borderBottom: '1px solid var(--color-border)' }}>
                <tr>
                  {['Campaign Name', 'Service Type', 'Status', 'Start Date', 'End Date', 'Delivered vs Target', 'Last Updated', 'Action'].map(col => (
                    <th key={col} className="text-left px-6 py-4 table-th">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.map((campaign, index) => (
                  <TableRow
                    key={campaign.id}
                    showHoverEffect={true}
                    animationDelay={index * 100}
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-[#1F2937]" style={{ fontSize: '14px' }}>{campaign.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap table-td">{campaign.serviceType}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={campaign.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap table-td">
                      {new Date(campaign.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap table-td">
                      {new Date(campaign.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="whitespace-nowrap table-td">{campaign.delivered} / {campaign.target}</span>
                        <div className="w-24">
                          <ProgressBar current={campaign.delivered} target={campaign.target} />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap table-td">
                      {new Date(campaign.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/campaigns/${campaign.id}`}
                        className="btn-outline px-3 py-1.5"
                        style={{ fontSize: '13px' }}
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
          <div className="glass-card py-16 text-center">
            <p className="text-[#6B7280]">No campaigns found matching your filters.</p>
          </div>
        )}
      </div>

      <NewCampaignModal
        isOpen={isNewCampaignModalOpen}
        onClose={() => setIsNewCampaignModalOpen(false)}
        onSubmit={handleNewCampaignSubmit}
      />
    </AppLayout>
  );
}