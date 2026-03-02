import { useState, useEffect } from 'react';
import {
  Search, Plus, FileText, Filter, Grid3x3, List, Download, Trash2,
  Eye, Star, Calendar, User, Tag, FolderOpen, Upload, X, Check, File,
  FileSpreadsheet, Image as ImageIcon, Archive, ChevronDown, MoreVertical
} from 'lucide-react';
import { AppLayout } from '../components/AppLayout';
import { DocumentViewerModal } from '../components/DocumentViewerModal';
import { motion } from 'motion/react';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

interface Document {
  id: string;
  name: string;
  type: 'Contract' | 'SOW' | 'NDA' | 'Invoice' | 'Report' | 'Other';
  uploadedBy: string;
  uploadDate: string;
  size: string;
  status: 'Active' | 'Expired' | 'Pending' | 'Archived';
  campaign?: string;
  tags?: string[];
  recentlyViewed?: boolean;
}

const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Master Service Agreement - Q1 2026.pdf',
    type: 'Contract',
    uploadedBy: 'Sarah Johnson',
    uploadDate: '2026-01-15',
    size: '2.4 MB',
    status: 'Active',
    campaign: 'Enterprise IT Security Campaign Q1 2026',
    tags: ['Legal', 'Important'],
    recentlyViewed: true
  },
  {
    id: '2',
    name: 'Statement of Work - Healthcare Campaign.pdf',
    type: 'SOW',
    uploadedBy: 'Michael Chen',
    uploadDate: '2026-02-01',
    size: '1.8 MB',
    status: 'Active',
    campaign: 'Healthcare Content Syndication - Feb 2026',
    tags: ['Active', 'Q1'],
    recentlyViewed: true
  },
  {
    id: '3',
    name: 'Non-Disclosure Agreement.pdf',
    type: 'NDA',
    uploadedBy: 'Sarah Johnson',
    uploadDate: '2025-12-10',
    size: '980 KB',
    status: 'Active',
    tags: ['Legal'],
    recentlyViewed: false
  },
  {
    id: '4',
    name: 'Campaign Performance Report - Jan 2026.xlsx',
    type: 'Report',
    uploadedBy: 'Data Analytics Team',
    uploadDate: '2026-02-05',
    size: '4.2 MB',
    status: 'Active',
    campaign: 'Multiple Campaigns',
    tags: ['Report', 'Analytics'],
    recentlyViewed: true
  },
  {
    id: '5',
    name: 'Invoice #INV-2026-001.pdf',
    type: 'Invoice',
    uploadedBy: 'Billing Department',
    uploadDate: '2026-01-30',
    size: '320 KB',
    status: 'Active',
    tags: ['Billing', 'Q1'],
    recentlyViewed: false
  }
];

export default function Documents() {
  useDocumentTitle('Documents');
  
  const [pageLoaded, setPageLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [showViewer, setShowViewer] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [starred, setStarred] = useState<string[]>([]);

  useEffect(() => {
    setTimeout(() => setPageLoaded(true), 100);
  }, []);

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.campaign?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All' || doc.type === typeFilter;
    const matchesStatus = statusFilter === 'All' || doc.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'badge badge-active';
      case 'Expired':
        return 'badge badge-paused';
      case 'Pending':
        return 'badge badge-paused';
      case 'Archived':
        return 'badge badge-completed';
      default:
        return 'badge badge-completed';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <CheckCircle className="w-4 h-4" />;
      case 'Expired':
        return <AlertCircle className="w-4 h-4" />;
      case 'Pending':
        return <Clock className="w-4 h-4" />;
      case 'Archived':
        return <FolderOpen className="w-4 h-4" />;
      default:
        return <File className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    const iconProps = {
      className: "w-8 h-8",
      strokeWidth: 2,
      style: { color: '#6B7280' }
    };

    switch (type) {
      case 'Contract':
        return <FileCheck {...iconProps} />;
      case 'SOW':
        return <FileText {...iconProps} />;
      case 'NDA':
        return <Lock {...iconProps} />;
      case 'Invoice':
        return <DollarSign {...iconProps} />;
      case 'Report':
        return <BarChart3 {...iconProps} />;
      default:
        return <File {...iconProps} />;
    }
  };

  const handleViewDocument = (doc: Document) => {
    setSelectedDoc(doc);
    setShowViewer(true);
  };

  const toggleStar = (docId: string) => {
    if (starred.includes(docId)) {
      setStarred(starred.filter(id => id !== docId));
      toast.success('Removed from favorites');
    } else {
      setStarred([...starred, docId]);
      toast.success('Added to favorites');
    }
  };

  return (
    <AppLayout>
      <div className={`max-w-[1440px] mx-auto px-4 py-4 md:px-6 md:py-6 transition-opacity duration-700 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
          <div>
            <h1 style={{ color: 'var(--color-text-primary)' }} className="mb-2">Documents</h1>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
              {filteredDocuments.length} documents • Manage contracts, reports, and files
            </p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="btn-primary px-4 py-2 flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload Document
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 stagger-children">
          <div className="kpi-card animate-slideInUp">
            <div className="flex items-center justify-between">
              <FileText className="kpi-card__icon" />
            </div>
            <div className="kpi-card__number">5</div>
            <div className="kpi-card__label">Total Docs</div>
          </div>

          <div className="kpi-card animate-slideInUp">
            <div className="flex items-center justify-between">
              <CheckCircle className="kpi-card__icon" />
            </div>
            <div className="kpi-card__number">4</div>
            <div className="kpi-card__label">Active</div>
          </div>

          <div className="kpi-card animate-slideInUp">
            <div className="flex items-center justify-between">
              <Clock className="kpi-card__icon" />
            </div>
            <div className="kpi-card__number">1</div>
            <div className="kpi-card__label">Pending</div>
          </div>

          <div className="kpi-card animate-slideInUp">
            <div className="flex items-center justify-between">
              <Star className="kpi-card__icon" />
            </div>
            <div className="kpi-card__number">2</div>
            <div className="kpi-card__label">Favorites</div>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-5">
          <div className="lg:col-span-5 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-base w-full pl-10 pr-4 py-3"
            />
          </div>

          <div className="lg:col-span-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input-base w-full px-4 py-3"
            >
              <option value="All">All Types</option>
              <option value="Contract">Contracts</option>
              <option value="SOW">SOWs</option>
              <option value="NDA">NDAs</option>
              <option value="Invoice">Invoices</option>
              <option value="Report">Reports</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="lg:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-base w-full px-4 py-3"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Expired">Expired</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          <div className="lg:col-span-3 flex gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
              className="btn-outline flex-1 px-4 py-3 flex items-center justify-center gap-2"
            >
              {viewMode === 'list' ? <Grid3x3 className="w-4 h-4" /> : <List className="w-4 h-4" />}
              {viewMode === 'list' ? 'Grid' : 'List'}
            </button>
            {selectedDocs.length > 0 && (
              <button
                onClick={() => toast.success(`Downloading ${selectedDocs.length} documents`)}
                className="btn-primary px-4 py-3 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Documents Table/Grid */}
        {viewMode === 'list' ? (
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead style={{ background: 'var(--color-border-light)', borderBottom: '1px solid var(--color-border)' }}>
                  <tr>
                    <th className="text-left px-6 py-4" style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-wide)' }}>
                      <input
                        type="checkbox"
                        checked={selectedDocs.length === filteredDocuments.length && filteredDocuments.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedDocs(filteredDocuments.map(d => d.id));
                          } else {
                            setSelectedDocs([]);
                          }
                        }}
                      />
                    </th>
                    <th className="text-left px-6 py-4" style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-wide)' }}>
                      Document
                    </th>
                    <th className="text-left px-6 py-4" style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-wide)' }}>
                      Type
                    </th>
                    <th className="text-left px-6 py-4" style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-wide)' }}>
                      Uploaded
                    </th>
                    <th className="text-left px-6 py-4" style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-wide)' }}>
                      Status
                    </th>
                    <th className="text-left px-6 py-4" style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-wide)' }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.map((doc, index) => (
                    <TableRow
                      key={doc.id}
                      showHoverEffect={true}
                      animationDelay={index * 50}
                    >
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedDocs.includes(doc.id)}
                          onChange={() => {
                            if (selectedDocs.includes(doc.id)) {
                              setSelectedDocs(selectedDocs.filter(id => id !== doc.id));
                            } else {
                              setSelectedDocs([...selectedDocs, doc.id]);
                            }
                          }}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{getTypeIcon(doc.type)}</div>
                          <div>
                            <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
                              {doc.name}
                            </div>
                            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                              {doc.size}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="badge badge-completed">{doc.type}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>
                            {doc.uploadedBy}
                          </div>
                          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                            {new Date(doc.uploadDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={getStatusColor(doc.status)}>
                          {getStatusIcon(doc.status)}
                          <span>{doc.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleStar(doc.id)}
                            className="btn-ghost p-2"
                          >
                            <Star className={`w-4 h-4 ${starred.includes(doc.id) ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                          </button>
                          <button
                            onClick={() => handleViewDocument(doc)}
                            className="btn-ghost p-2"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toast.success(`Downloading ${doc.name}`)}
                            className="btn-ghost p-2"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </TableRow>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredDocuments.length === 0 && (
              <div className="text-center py-12" style={{ color: 'var(--color-text-secondary)' }}>
                No documents found
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredDocuments.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card p-5 cursor-pointer hover:scale-105 transition-transform"
                onClick={() => handleViewDocument(doc)}
              >
                <div className="text-center mb-4">
                  <div className="text-5xl mb-2">{getTypeIcon(doc.type)}</div>
                  <div className={getStatusColor(doc.status)}>
                    {getStatusIcon(doc.status)}
                    <span>{doc.status}</span>
                  </div>
                </div>
                <h3 className="font-semibold mb-2 line-clamp-2" style={{ color: 'var(--color-text-primary)', fontSize: 'var(--font-size-sm)' }}>
                  {doc.name}
                </h3>
                <div className="space-y-1 mb-4">
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                    {doc.size}
                  </div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                    {new Date(doc.uploadDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStar(doc.id);
                    }}
                    className="btn-ghost p-2 flex-1"
                  >
                    <Star className={`w-4 h-4 ${starred.includes(doc.id) ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.success(`Downloading ${doc.name}`);
                    }}
                    className="btn-primary p-2 flex-1"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <DocumentViewerModal
        isOpen={showViewer}
        onClose={() => setShowViewer(false)}
        document={selectedDoc}
      />
      <UploadZoneModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
      />
    </AppLayout>
  );
}