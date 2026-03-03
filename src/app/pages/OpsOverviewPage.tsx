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
import { TableRow } from '../components/TableRow';
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
    uploadedBy: 'Anish Akkoat',
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
    uploadedBy: 'Arjun Patel',
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

  // Time period for Total Leads card
  const [leadsPeriod, setLeadsPeriod] = useState<'1d' | '1w' | '1m' | '1y'>('1d');
  
  // Leads data by time period (realistic progressive numbers)
  const leadsDataByPeriod = {
    '1d': 1339,    // Today
    '1w': 8543,    // This week (1339 × ~6.4 days)
    '1m': 35280,   // This month (1339 × ~26.3 days)
    '1y': 488535   // This year (yearly total)
  };
  
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
      <div className="max-w-[1600px] mx-auto page-content">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div
              className="w-1 h-6 rounded-full"
              style={{ background: '#BA2027' }}
            />
            <h1
              style={{
                color: 'var(--color-text-primary)',
                fontSize: '22px',
                fontWeight: 700,
                letterSpacing: '-0.01em',
              }}
            >
              Operations Dashboard
            </h1>
          </div>
          <p
            style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-secondary)',
              paddingLeft: '16px',
            }}
          >
            Lead upload management and client oversight
          </p>
        </div>

        {/* Upload Metrics - Priority KPIs */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#BA2027', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Lead Upload Status
            </span>
            <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
          </div>
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

            {/* Total Leads with Time Period Selector */}
            <div className="kpi-card animate-slideInUp col-span-2 md:col-span-1">
              <div className="flex items-center justify-between mb-2">
                <div style={{ 
                  fontSize: '11px', 
                  fontWeight: '600', 
                  color: '#6B7280', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.05em' 
                }}>
                  Total Leads {leadsPeriod === '1d' ? 'Today' : leadsPeriod === '1w' ? 'This Week' : leadsPeriod === '1m' ? 'This Month' : 'This Year'}
                </div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-primary-tint)' }}>
                  <TrendingUp className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                </div>
              </div>

              {/* Time Period Selector Buttons */}
              <div className="flex gap-1 mb-3 bg-white/80 p-0.5 rounded-lg" style={{ width: 'fit-content' }}>
                {(['1d', '1w', '1m', '1y'] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setLeadsPeriod(period)}
                    className={`px-2 py-1 rounded-md text-xs font-bold uppercase transition-all duration-200 ${
                      leadsPeriod === period
                        ? 'bg-[#BA2027] text-white shadow-md'
                        : 'bg-transparent text-[#6B7280] hover:bg-[#BA2027] hover:text-white'
                    }`}
                    style={{
                      fontSize: '10px',
                      minWidth: '42px',
                      border: leadsPeriod === period ? 'none' : '1px solid #E5E7EB'
                    }}
                  >
                    {period === '1d' ? 'Day' : period === '1w' ? 'Week' : period === '1m' ? 'Month' : 'Year'}
                  </button>
                ))}
              </div>

              <div className="flex items-baseline gap-2">
                <div style={{ fontSize: '28px', fontWeight: '700', color: '#1F2937', lineHeight: '1' }}>
                  <AnimatedCounter value={leadsDataByPeriod[leadsPeriod]} />
                </div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#10B981' }}>
                  +{leadsPeriod === '1d' ? '12' : leadsPeriod === '1w' ? '18' : leadsPeriod === '1m' ? '15' : '24'}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Upload Activity */}
        <div className="glass-card overflow-hidden mb-6">
          <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex items-center justify-between">
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                Recent Uploads
              </span>
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
            <table className="w-full min-w-[1000px] table-responsive">
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
                  <TableRow
                    key={upload.id}
                    showHoverEffect={true}
                    animationDelay={index * 30}
                  >
                    <td className="px-6 py-4" data-label="File">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
                        <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
                          {upload.fileName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4" data-label="Client">
                      <div>
                        <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
                          {upload.clientName}
                        </div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                          {upload.campaignName}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4" data-label="Progress">
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
                    <td className="px-6 py-4" data-label="Results">
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
                    <td className="px-6 py-4" data-label="Status">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 ${getStatusBadge(upload.status)}`}>
                        {getStatusIcon(upload.status)}
                        {upload.status.charAt(0).toUpperCase() + upload.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4" data-label="Uploaded By">
                      <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>
                        {upload.uploadedBy}
                      </div>
                    </td>
                    <td className="px-6 py-4" data-label="Time">
                      <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
                        {formatTimeAgo(upload.uploadedAt)}
                      </div>
                    </td>
                  </TableRow>
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
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
              Clients & Campaigns
            </span>
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
                  <TableRow
                    key={client.id}
                    showHoverEffect={true}
                    animationDelay={index * 30}
                    onClick={() => navigate(`/internal/campaigns/${client.campaigns[0]?.id}`)}
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
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
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
                  </TableRow>
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