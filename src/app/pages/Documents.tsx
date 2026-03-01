import { useState, useEffect } from 'react';
import { GlassNavigation } from '../components/GlassNavigation';
import { useTheme } from '../context/ThemeContext';
import { 
  Download, Search, Filter, FileText, File, Eye, Share2, Trash2, 
  CheckCircle, Clock, AlertCircle, Star, Upload, User, Calendar, 
  Paperclip, FolderOpen, Pen, List, Grid3x3 
} from 'lucide-react';
import { TableRow } from '../components/TableRow';
import { DocumentViewerModal } from '../components/DocumentViewerModal';
import { UploadZoneModal } from '../components/UploadZoneModal';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { toast } from 'sonner';

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
    name: 'Non-Disclosure Agreement - TechVentures.pdf',
    type: 'NDA',
    uploadedBy: 'Emily Rodriguez',
    uploadDate: '2025-12-10',
    size: '856 KB',
    status: 'Active',
    tags: ['Legal', 'Confidential']
  },
  {
    id: '4',
    name: 'Monthly Performance Report - January 2026.pdf',
    type: 'Report',
    uploadedBy: 'John Smith',
    uploadDate: '2026-02-05',
    size: '3.2 MB',
    status: 'Active',
    tags: ['Performance', 'Monthly']
  },
  {
    id: '5',
    name: 'Invoice #2024-12-456.pdf',
    type: 'Invoice',
    uploadedBy: 'Accounting Team',
    uploadDate: '2025-12-31',
    size: '124 KB',
    status: 'Archived',
    tags: ['Finance', 'Paid']
  },
  {
    id: '6',
    name: 'SOW Amendment - Financial Services BANT.pdf',
    type: 'SOW',
    uploadedBy: 'Sarah Johnson',
    uploadDate: '2026-02-20',
    size: '1.1 MB',
    status: 'Pending',
    campaign: 'Financial Services BANT Qualification',
    tags: ['Pending Review']
  },
];

const folders = [
  { id: 'contracts', name: 'Contracts', count: 1, icon: FileText },
  { id: 'sows', name: 'SOWs', count: 2, icon: FileText },
  { id: 'ndas', name: 'NDAs', count: 1, icon: FileText },
  { id: 'reports', name: 'Reports', count: 1, icon: FileText },
  { id: 'invoices', name: 'Invoices', count: 1, icon: FileText }
];

export default function Documents() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [pageLoaded, setPageLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [starredDocs, setStarredDocs] = useState<string[]>(['1', '2']);
  const [viewerDoc, setViewerDoc] = useState<Document | null>(null);
  const [showViewer, setShowViewer] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  useEffect(() => {
    setTimeout(() => setPageLoaded(true), 100);
  }, []);

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

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      doc.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = typeFilter === 'All' || doc.type === typeFilter;
    const matchesStatus = statusFilter === 'All' || doc.status === statusFilter;
    const matchesFolder = !selectedFolder || doc.type.toLowerCase() === selectedFolder.replace('s', '');
    return matchesSearch && matchesType && matchesStatus && matchesFolder;
  });

  // Calculate storage
  const totalStorage = 10 * 1024; // 10GB in MB
  const usedStorage = mockDocuments.reduce((sum, doc) => {
    const size = parseFloat(doc.size);
    const unit = doc.size.includes('MB') ? 1 : 0.001;
    return sum + (size * unit);
  }, 0);
  const storagePercent = Math.round((usedStorage / totalStorage) * 100);

  // Get all unique tags
  const allTags = Array.from(new Set(mockDocuments.flatMap(doc => doc.tags || [])));

  const getTypeColor = (type: Document['type']) => {
    switch (type) {
      case 'Contract':
        return 'bg-[#E63946]/10 text-[#E63946] border-[#E63946]/20';
      case 'SOW':
        return 'bg-[#0891B2]/10 text-[#0891B2] border-[#0891B2]/20';
      case 'NDA':
        return 'bg-[#F4B400]/10 text-[#F4B400] border-[#F4B400]/20';
      case 'Invoice':
        return 'bg-[#0F9D58]/10 text-[#0F9D58] border-[#0F9D58]/20';
      case 'Report':
        return 'bg-[#4285F4]/10 text-[#4285F4] border-[#4285F4]/20';
      default:
        return isDark ? 'bg-white/10 text-[#B0AEBB] border-white/20' : 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-[#0F9D58]/10 text-[#0F9D58] border-[#0F9D58]/20';
      case 'Pending':
        return 'bg-[#F4B400]/10 text-[#F4B400] border-[#F4B400]/20';
      case 'Expired':
        return 'bg-[#EA4335]/10 text-[#EA4335] border-[#EA4335]/20';
      case 'Archived':
        return isDark ? 'bg-white/10 text-[#B0AEBB] border-white/20' : 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getFileIcon = (type: string) => {
    return <FileText className="w-6 h-6" />;
  };

  const handleViewDocument = (doc: Document) => {
    setViewerDoc(doc);
    setShowViewer(true);
  };

  const toggleStar = (docId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (starredDocs.includes(docId)) {
      setStarredDocs(starredDocs.filter(id => id !== docId));
      toast.success('Removed from favorites');
    } else {
      setStarredDocs([...starredDocs, docId]);
      toast.success('Added to favorites');
    }
  };

  const handleBulkDownload = () => {
    if (selectedDocs.length === 0) {
      toast.error('Please select documents first');
      return;
    }
    toast.success(`Downloading ${selectedDocs.length} documents...`);
  };

  const handleShare = (doc: Document, e?: React.MouseEvent) => {
    e?.stopPropagation();
    toast.info('Share link copied to clipboard!');
  };

  const expiringDocs = mockDocuments.filter(doc => doc.status === 'Pending' || doc.status === 'Expired');

  return (
    <div style={backgroundStyle} className={`transition-opacity duration-700 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <GlassNavigation />
      
      <div className="max-w-[1440px] mx-auto px-6 py-6">
        {/* Header with Inline Stats */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
          <div>
            <h1 className={`${isDark ? 'text-white' : 'text-[#1E293B]'} mb-2`}>
              Documents & Contracts
            </h1>
            <div className="flex items-center gap-4 flex-wrap">
              <p className={`text-sm ${isDark ? 'text-[#B0AEBB]' : 'text-[#6B6B6B]'} flex items-center gap-1.5`}>
                <FileText className="w-4 h-4" />
                {mockDocuments.length} documents
              </p>
              <p className={`text-sm ${isDark ? 'text-[#B0AEBB]' : 'text-[#6B6B6B]'} flex items-center gap-1.5`}>
                <Star className="w-4 h-4 text-[#F4B400]" />
                {starredDocs.length} starred
              </p>
              {expiringDocs.length > 0 && (
                <p className={`text-sm flex items-center gap-1.5 text-[#EA4335]`}>
                  <AlertCircle className="w-4 h-4" />
                  {expiringDocs.length} need attention
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => setShowUpload(true)}
            className="px-5 py-2.5 rounded-lg text-white transition-all flex items-center gap-2 w-fit shadow-lg hover:scale-105"
            style={{ background: '#1E3A5F' }}
          >
            <Upload className="w-4 h-4" />
            Upload my document
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder="Search documents, tags, or people..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full h-11 pl-10 pr-4 rounded-lg border transition-all ${
                isDark
                  ? 'bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-[#E63946]'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#BA2027]'
              } outline-none`}
            />
          </div>
          <div className="flex gap-3">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className={`h-11 px-4 rounded-lg border transition-all ${
                isDark
                  ? 'bg-white/5 border-white/10 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } outline-none min-w-[140px]`}
            >
              <option value="All">All Types</option>
              <option value="Contract">Contracts</option>
              <option value="SOW">SOWs</option>
              <option value="NDA">NDAs</option>
              <option value="Report">Reports</option>
              <option value="Invoice">Invoices</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`h-11 px-4 rounded-lg border transition-all ${
                isDark
                  ? 'bg-white/5 border-white/10 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } outline-none min-w-[140px]`}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Archived">Archived</option>
            </select>
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className={`h-11 px-4 rounded-lg border transition-all ${
                isDark
                  ? 'bg-white/5 border-white/10 hover:bg-white/10'
                  : 'bg-white border-gray-300 hover:bg-gray-50'
              }`}
              title={`Switch to ${viewMode === 'grid' ? 'list' : 'grid'} view`}
            >
              {viewMode === 'grid' ? (
                <List className={`w-5 h-5 ${isDark ? 'text-white' : 'text-gray-700'}`} />
              ) : (
                <Grid3x3 className={`w-5 h-5 ${isDark ? 'text-white' : 'text-gray-700'}`} />
              )}
            </button>
          </div>
        </div>

        {/* Documents Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredDocuments.map((doc, index) => (
              <div
                key={doc.id}
                onClick={() => handleViewDocument(doc)}
                className={`rounded-xl p-6 border backdrop-blur-md transition-all hover:scale-[1.02] cursor-pointer animate-slideInUp ${
                  isDark
                    ? 'bg-gradient-to-br from-white/5 to-white/10 border-white/10 hover:shadow-[0_0_30px_rgba(230,57,70,0.2)]'
                    : 'bg-gradient-to-br from-white to-gray-50/50 border-gray-200 hover:shadow-[0_0_30px_rgba(186,32,39,0.15)]'
                } ${doc.recentlyViewed ? 'ring-2 ring-[#E63946]/30' : ''}`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isDark ? 'bg-[#E63946]/20' : 'bg-[#BA2027]/10'
                  }`}>
                    {getFileIcon(doc.type)}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => toggleStar(doc.id, e)}
                      className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <Star 
                        className={`w-4 h-4 ${
                          starredDocs.includes(doc.id)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-400'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`px-2 py-1 rounded-md border text-xs font-medium ${getTypeColor(doc.type)}`}>
                    {doc.type}
                  </span>
                  <span className={`px-2 py-1 rounded-md border text-xs font-medium ${getStatusColor(doc.status)}`}>
                    {doc.status}
                  </span>
                </div>

                <h3 className={`text-sm font-medium mb-2 line-clamp-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {doc.name}
                </h3>

                {doc.campaign && (
                  <div className={`flex items-center gap-2 mb-3 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <FolderOpen className="w-3 h-3" />
                    <span className="line-clamp-1">{doc.campaign}</span>
                  </div>
                )}

                {doc.tags && doc.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {doc.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`px-2 py-0.5 rounded text-xs ${
                          isDark ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className={`space-y-1 mb-4 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3" />
                    <span>{doc.uploadedBy}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Paperclip className="w-3 h-3" />
                    <span>{doc.size}</span>
                  </div>
                </div>

                <div className={`flex items-center gap-2 pt-3 border-t ${
                  isDark ? 'border-white/5' : 'border-gray-200'
                }`}>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleViewDocument(doc); }}
                    className={`flex-1 px-3 py-2 rounded-lg transition-all text-xs font-medium flex items-center justify-center gap-2 ${
                      isDark ? 'bg-[#E63946]/20 hover:bg-[#E63946]/30 text-[#E63946]' : 'bg-[#BA2027]/10 hover:bg-[#BA2027]/20 text-[#BA2027]'
                    }`}
                  >
                    <Eye className="w-3 h-3" />
                    View
                  </button>
                  <button
                    onClick={(e) => handleShare(doc, e)}
                    className={`flex-1 px-3 py-2 rounded-lg transition-all text-xs font-medium flex items-center justify-center gap-2 ${
                      isDark ? 'bg-[#0891B2]/20 hover:bg-[#0891B2]/30 text-[#0891B2]' : 'bg-[#0891B2]/10 hover:bg-[#0891B2]/20 text-[#0891B2]'
                    }`}
                  >
                    <Share2 className="w-3 h-3" />
                    Share
                  </button>
                </div>

                {(doc.type === 'SOW' || doc.type === 'Contract') && doc.status === 'Pending' && (
                  <button
                    onClick={(e) => { e.stopPropagation(); toast.info('DocuSign integration coming soon'); }}
                    className={`w-full mt-2 px-3 py-2 rounded-lg transition-all text-xs font-medium flex items-center justify-center gap-2 text-white ${
                      isDark
                        ? 'bg-gradient-to-r from-[#E63946] to-[#FF4D5A]'
                        : 'bg-gradient-to-r from-[#BA2027] to-[#D32F2F]'
                    }`}
                  >
                    <Pen className="w-3 h-3" />
                    Sign with DocuSign
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className={`rounded-xl overflow-hidden border backdrop-blur-md ${
            isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
          }`}>
            <table className="w-full">
              <thead className={`${isDark ? 'bg-white/5' : 'bg-gray-50'} border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                <tr>
                  <th className={`text-left px-6 py-4 text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <input 
                      type="checkbox" 
                      className={`w-4 h-4 rounded cursor-pointer transition-all appearance-none ${
                        isDark 
                          ? 'bg-white/10 border-2 border-white/20 hover:border-white/40' 
                          : 'bg-white border-2 border-gray-300 hover:border-gray-400'
                      } checked:bg-[#E63946] checked:border-[#E63946] focus:ring-2 focus:ring-offset-0 focus:ring-[#E63946]/50 relative`}
                      style={{
                        backgroundImage: 'none',
                        backgroundSize: '100% 100%',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                      }}
                    />
                  </th>
                  <th className={`text-left px-6 py-4 text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Document
                  </th>
                  <th className={`text-left px-6 py-4 text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Type
                  </th>
                  <th className={`text-left px-6 py-4 text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Status
                  </th>
                  <th className={`text-left px-6 py-4 text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Uploaded
                  </th>
                  <th className={`text-left px-6 py-4 text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.map((doc, index) => (
                  <TableRow
                    key={doc.id}
                    onClick={() => handleViewDocument(doc)}
                    animationDelay={index * 30}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div onClick={(e) => e.stopPropagation()}>
                          <input 
                            type="checkbox" 
                            className={`w-4 h-4 rounded cursor-pointer transition-all appearance-none ${
                              isDark 
                                ? 'bg-white/10 border-2 border-white/20 hover:border-white/40' 
                                : 'bg-white border-2 border-gray-300 hover:border-gray-400'
                            } checked:bg-[#E63946] checked:border-[#E63946] focus:ring-2 focus:ring-offset-0 focus:ring-[#E63946]/50 relative`}
                            style={{
                              backgroundImage: 'none',
                              backgroundSize: '100% 100%',
                              backgroundPosition: 'center',
                              backgroundRepeat: 'no-repeat'
                            }}
                          />
                        </div>
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isDark ? 'bg-[#E63946]/20' : 'bg-[#BA2027]/10'
                        }`}>
                          {getFileIcon(doc.type)}
                        </div>
                        <div>
                          <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {doc.name}
                          </div>
                          <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                            {doc.size}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-1 rounded-md border text-xs font-medium ${getTypeColor(doc.type)}`}>
                        {doc.type}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-1 rounded-md border text-xs font-medium ${getStatusColor(doc.status)}`}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {new Date(doc.uploadDate).toLocaleDateString()}
                      </div>
                      <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                        by {doc.uploadedBy}
                      </div>
                    </td>
                    <td className="px-6 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => toggleStar(doc.id, e)}
                          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <Star 
                            className={`w-4 h-4 ${
                              starredDocs.includes(doc.id)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-400'
                            }`}
                          />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                          <Download className="w-4 h-4 text-gray-400" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                          <Share2 className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </td>
                  </TableRow>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredDocuments.length === 0 && (
          <div className={`rounded-xl p-12 text-center border backdrop-blur-md ${
            isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
          }`}>
            <FileText className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              No documents found matching your criteria
            </p>
          </div>
        )}
      </div>

      {/* Document Viewer Modal */}
      <DocumentViewerModal
        isOpen={showViewer}
        onClose={() => setShowViewer(false)}
        document={viewerDoc}
      />

      {/* Upload Modal */}
      <UploadZoneModal
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
      />
    </div>
  );
}