import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import {
  Search,
  X,
  ChevronUp,
  ChevronDown,
  Eye,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppLayout } from '../components/AppLayout';
import { allClients, getGlobalStats, Client } from '../data/mockClients';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { LeadUploadModal } from '../components/LeadUploadModal';

// Mock upload status data
interface UploadStatus {
  id: string;
  fileName: string;
  clientName: string;
  campaignName: string;
  uploadedBy: string;
  uploadedAt: string;
  status: 'processing' | 'completed' | 'failed' | 'pending';
  totalRows: number;
  processedRows: number;
  successCount: number;
  errorCount: number;
}

const mockUploads: UploadStatus[] = [
  {
    id: 'up_1',
    fileName: 'acme_leads_march.csv',
    clientName: 'Acme Corp',
    campaignName: 'Q1 2026 Lead Generation',
    uploadedBy: 'John Davies',
    uploadedAt: '2026-03-02T10:30:00Z',
    status: 'processing',
    totalRows: 450,
    processedRows: 287,
    successCount: 285,
    errorCount: 2,
  },
  {
    id: 'up_2',
    fileName: 'techco_batch_2.xlsx',
    clientName: 'TechCo Ltd',
    campaignName: 'Enterprise Outreach Campaign',
    uploadedBy: 'Lisa Park',
    uploadedAt: '2026-03-02T09:15:00Z',
    status: 'completed',
    totalRows: 823,
    processedRows: 823,
    successCount: 820,
    errorCount: 3,
  },
  {
    id: 'up_3',
    fileName: 'global_innovations_leads.csv',
    clientName: 'Global Innovations Inc',
    campaignName: 'Manufacturing Leads Q1',
    uploadedBy: 'Michael Chen',
    uploadedAt: '2026-03-02T08:45:00Z',
    status: 'completed',
    totalRows: 234,
    processedRows: 234,
    successCount: 234,
    errorCount: 0,
  },
  {
    id: 'up_4',
    fileName: 'pinnacle_january.csv',
    clientName: 'Pinnacle Solutions',
    campaignName: 'B2B Consulting Leads',
    uploadedBy: 'Emily Rodriguez',
    uploadedAt: '2026-03-01T16:20:00Z',
    status: 'failed',
    totalRows: 156,
    processedRows: 45,
    successCount: 0,
    errorCount: 45,
  },
];

export default function OpsOverviewPage() {
  const navigate = useNavigate();
  const globalStats = getGlobalStats();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedClientForUpload, setSelectedClientForUpload] = useState<Client | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [managerFilter, setManagerFilter] = useState<string>('All');
  const [uploadStatusFilter, setUploadStatusFilter] = useState<'all' | 'processing' | 'completed' | 'failed' | 'pending'>('all');
  
  // Sort states
  const [sortField, setSortField] = useState<keyof Client | 'campaignName'>('companyName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Get unique campaign managers for filter dropdown
  const uniqueManagers = useMemo(() => {
    const managers = new Set<string>();
    allClients.forEach((client) => {
      managers.add(client.campaignManager);
    });
    return Array.from(managers).sort();
  }, []);

  // Filter and sort clients
  const filteredAndSortedClients = useMemo(() => {
    let filtered = [...allClients];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((client) =>
        client.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.campaignManager.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.industry.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply manager filter
    if (managerFilter !== 'All') {
      filtered = filtered.filter((client) => client.campaignManager === managerFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal: any = a[sortField as keyof Client];
      let bVal: any = b[sortField as keyof Client];

      if (typeof aVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }

      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return filtered;
  }, [allClients, searchQuery, managerFilter, sortField, sortOrder]);

  // Filter uploads
  const filteredUploads = useMemo(() => {
    if (uploadStatusFilter === 'all') return mockUploads;
    return mockUploads.filter(u => u.status === uploadStatusFilter);
  }, [uploadStatusFilter]);

  const handleSort = (field: keyof Client | 'campaignName') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleQuickUpload = (client: Client) => {
    setSelectedClientForUpload(client);
    setShowUploadModal(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Clock className="w-4 h-4" style={{ color: 'var(--color-warning)' }} />;
      case 'completed':
        return <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--color-success)' }} />;
      case 'failed':
        return <AlertCircle className="w-4 h-4" style={{ color: 'var(--color-error)' }} />;
      default:
        return <FileText className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      processing: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      pending: 'bg-gray-100 text-gray-800',
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  // Calculate upload metrics
  const uploadMetrics = useMemo(() => {
    const processing = mockUploads.filter(u => u.status === 'processing').length;
    const completed = mockUploads.filter(u => u.status === 'completed').length;
    const failed = mockUploads.filter(u => u.status === 'failed').length;
    const totalLeadsToday = mockUploads.reduce((sum, u) => sum + u.successCount, 0);
    
    return { processing, completed, failed, totalLeadsToday };
  }, []);

  return (
    <AppLayout>
      <div className="max-w-[1600px] mx-auto px-4 py-4 md:px-6 md:py-6">
        {/* Header with Primary CTA */}
        <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 style={{ color: 'var(--color-text-primary)' }} className="mb-2">
              Operations Dashboard
            </h1>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
              Lead upload management and client oversight
            </p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="btn-primary px-6 py-3 flex items-center justify-center gap-2 w-full lg:w-auto"
            style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-semibold)' }}
          >
            <Upload className="w-5 h-5" />
            Upload Leads
          </button>
        </div>

        {/* Upload Metrics - Priority KPIs */}
        <div className="mb-6">
          <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }} className="mb-3">
            Lead Upload Status
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger-children">
            <div className="kpi-card animate-slideInUp">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-warning-bg)' }}>
                  <Clock className="w-5 h-5" style={{ color: 'var(--color-warning)' }} />
                </div>
              </div>
              <div className="kpi-card__number"><AnimatedCounter value={uploadMetrics.processing} /></div>
              <div className="kpi-card__label">Processing</div>
            </div>

            <div className="kpi-card animate-slideInUp">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-success-bg)' }}>
                  <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--color-success)' }} />
                </div>
              </div>
              <div className="kpi-card__number"><AnimatedCounter value={uploadMetrics.completed} /></div>
              <div className="kpi-card__label">Completed Today</div>
            </div>

            <div className="kpi-card animate-slideInUp">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-error-bg)' }}>
                  <AlertCircle className="w-5 h-5" style={{ color: 'var(--color-error)' }} />
                </div>
              </div>
              <div className="kpi-card__number"><AnimatedCounter value={uploadMetrics.failed} /></div>
              <div className="kpi-card__label">Failed</div>
            </div>

            <div className="kpi-card animate-slideInUp">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-primary-tint)' }}>
                  <TrendingUp className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                </div>
              </div>
              <div className="kpi-card__number"><AnimatedCounter value={uploadMetrics.totalLeadsToday} /></div>
              <div className="kpi-card__label">Leads Today</div>
            </div>
          </div>
        </div>

        {/* Recent Upload Activity */}
        <div className="glass-card overflow-hidden mb-6">
          <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex items-center justify-between">
              <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
                Recent Uploads
              </h2>
              <div className="flex items-center gap-2">
                <select
                  value={uploadStatusFilter}
                  onChange={(e) => setUploadStatusFilter(e.target.value as any)}
                  className="input-base px-3 py-2 text-sm"
                  style={{ fontSize: 'var(--font-size-sm)' }}
                >
                  <option value="all">All Status</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead style={{ background: 'var(--color-border-light)', borderBottom: '1px solid var(--color-border)' }}>
                <tr>
                  <th
                    className="text-left px-6 py-4"
                    style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-wide)' }}
                  >
                    File Name
                  </th>
                  <th
                    className="text-left px-6 py-4"
                    style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-wide)' }}
                  >
                    Client / Campaign
                  </th>
                  <th
                    className="text-left px-6 py-4"
                    style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-wide)' }}
                  >
                    Progress
                  </th>
                  <th
                    className="text-left px-6 py-4"
                    style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-wide)' }}
                  >
                    Success / Errors
                  </th>
                  <th
                    className="text-left px-6 py-4"
                    style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-wide)' }}
                  >
                    Status
                  </th>
                  <th
                    className="text-left px-6 py-4"
                    style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-wide)' }}
                  >
                    Uploaded By
                  </th>
                  <th
                    className="text-left px-6 py-4"
                    style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-wide)' }}
                  >
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUploads.map((upload, index) => (
                  <motion.tr
                    key={upload.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className="hover:bg-[var(--color-border-light)] transition-colors"
                    style={{ borderBottom: '1px solid var(--color-border)' }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
                        <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
                          {upload.fileName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
                          {upload.clientName}
                        </div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                          {upload.campaignName}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>
                          {upload.processedRows} / {upload.totalRows}
                        </div>
                        <div className="w-full bg-[var(--color-border-light)] rounded-full h-1.5 mt-1">
                          <div
                            className="h-1.5 rounded-full"
                            style={{
                              width: `${(upload.processedRows / upload.totalRows) * 100}%`,
                              background: upload.status === 'failed' ? 'var(--color-error)' : 
                                         upload.status === 'completed' ? 'var(--color-success)' : 
                                         'var(--color-warning)'
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>
                        <span style={{ color: 'var(--color-success)', fontWeight: 'var(--font-weight-semibold)' }}>
                          {upload.successCount}
                        </span>
                        {' / '}
                        <span style={{ color: 'var(--color-error)', fontWeight: 'var(--font-weight-semibold)' }}>
                          {upload.errorCount}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 ${getStatusBadge(upload.status)}`}>
                        {getStatusIcon(upload.status)}
                        {upload.status.charAt(0).toUpperCase() + upload.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>
                        {upload.uploadedBy}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
                        {formatTimeAgo(upload.uploadedAt)}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUploads.length === 0 && (
            <div className="text-center py-12" style={{ color: 'var(--color-text-secondary)' }}>
              No uploads found
            </div>
          )}
        </div>

        {/* Clients Table with Quick Upload */}
        <div className="glass-card overflow-hidden">
          <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
            <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
              Clients & Campaigns
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px]">
              <thead style={{ background: 'var(--color-border-light)', borderBottom: '1px solid var(--color-border)' }}>
                <tr>
                  <th
                    className="text-left px-6 py-4 cursor-pointer hover:text-[var(--color-primary)]"
                    style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-wide)' }}
                    onClick={() => handleSort('companyName')}
                  >
                    <div className="flex items-center gap-2">
                      Client
                      {sortField === 'companyName' && (
                        sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th
                    className="text-left px-6 py-4"
                    style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-wide)' }}
                  >
                    Campaigns
                  </th>
                  <th
                    className="text-left px-6 py-4"
                    style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-wide)' }}
                  >
                    Leads Delivered
                  </th>
                  <th
                    className="text-left px-6 py-4"
                    style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-wide)' }}
                  >
                    This Month
                  </th>
                  <th
                    className="text-left px-6 py-4"
                    style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-wide)' }}
                  >
                    Manager
                  </th>
                  <th
                    className="text-left px-6 py-4"
                    style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-wide)' }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedClients.map((client, index) => (
                  <motion.tr
                    key={client.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className="hover:bg-[var(--color-border-light)] transition-colors"
                    style={{ borderBottom: '1px solid var(--color-border)' }}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
                          {client.companyName}
                        </div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                          {client.industry}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>
                        {client.campaigns.length} total
                      </div>
                      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                        {client.campaigns.filter(c => c.status === 'active').length} active
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
                        {client.totalLeads.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-success)' }}>
                        +{client.leadsThisMonth.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>
                          {client.campaignManager}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleQuickUpload(client)}
                          className="btn-primary px-4 py-2 flex items-center justify-center gap-2"
                          style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)' }}
                        >
                          <Upload className="w-4 h-4" />
                          Upload
                        </button>
                        <button
                          onClick={() => navigate(`/internal/campaigns/${client.campaigns[0]?.id}`)}
                          className="btn-ghost p-2"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAndSortedClients.length === 0 && (
            <div className="text-center py-12" style={{ color: 'var(--color-text-secondary)' }}>
              No clients found
            </div>
          )}
        </div>
      </div>

      {/* Lead Upload Modal */}
      <LeadUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        clientId={selectedClientForUpload?.id}
        clientName={selectedClientForUpload?.companyName}
      />
    </AppLayout>
  );
}
