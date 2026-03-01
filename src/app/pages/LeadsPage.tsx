import { useState, useEffect } from 'react';
import { GlassNavigation } from '../components/GlassNavigation';
import { useTheme } from '../context/ThemeContext';
import { TableRow } from '../components/TableRow';
import { 
  Search, Filter, Download, Mail, Phone, Building2, CheckCircle, XCircle, 
  Clock, FileText, UserCheck, MoreVertical, Star, Tag, Plus, 
  TrendingUp, Users, Target, Award, Activity, Eye, AlertTriangle, X
} from 'lucide-react';
import { mockLeads, type Lead } from '../mockData';
import { LeadDetailDrawer } from '../components/LeadDetailDrawer';
import { LeadScoreRing } from '../components/LeadScoreRing';
import { LeadAvatar } from '../components/LeadAvatar';
import { LeadDistributionChart } from '../components/LeadDistributionChart';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { AdvancedFiltersPanel } from '../components/AdvancedFiltersPanel';
import { UnifiedKpiCard } from '../components/UnifiedKpiCard';
import { toast } from 'sonner';

type SortField = 'leadScore' | 'deliveryDate' | 'company' | 'status';
type SortDirection = 'asc' | 'desc';
type ViewMode = 'table' | 'grid';

export default function LeadsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const backgroundStyle = isDark
    ? { background: 'linear-gradient(135deg, #0F1117 0%, #1a1025 100%)', minHeight: '100vh' }
    : { background: '#F2F4F7', minHeight: '100vh' };
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [campaignFilter, setCampaignFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('leadScore');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [starred, setStarred] = useState<string[]>([]);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  
  const [advancedFilters, setAdvancedFilters] = useState({
    scoreRange: [0, 100] as [number, number],
    dateRange: 'all',
    industry: [] as string[],
    tags: [] as string[]
  });

  const leadsPerPage = viewMode === 'grid' ? 12 : 10;

  useEffect(() => {
    setTimeout(() => setPageLoaded(true), 100);
  }, []);

  // Filter and sort leads
  const filteredLeads = mockLeads.filter(lead => {
    const matchesSearch = 
      lead.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesCampaign = campaignFilter === 'all' || lead.campaignId === campaignFilter;
    const matchesScore = lead.leadScore >= advancedFilters.scoreRange[0] && 
                        lead.leadScore <= advancedFilters.scoreRange[1];
    const matchesIndustry = advancedFilters.industry.length === 0 || 
                           advancedFilters.industry.includes(lead.industry);
    
    return matchesSearch && matchesStatus && matchesCampaign && matchesScore && matchesIndustry;
  }).sort((a, b) => {
    let comparison = 0;
    
    switch (sortField) {
      case 'leadScore':
        comparison = a.leadScore - b.leadScore;
        break;
      case 'deliveryDate':
        comparison = new Date(a.deliveryDate).getTime() - new Date(b.deliveryDate).getTime();
        break;
      case 'company':
        comparison = a.company.localeCompare(b.company);
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Pagination
  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * leadsPerPage,
    currentPage * leadsPerPage
  );

  // Statistics
  const stats = {
    total: filteredLeads.length,
    pending: filteredLeads.filter(l => l.status === 'Pending Review').length,
    accepted: filteredLeads.filter(l => l.status === 'Accepted').length,
    contacted: filteredLeads.filter(l => l.status === 'Contacted').length,
    avgScore: Math.round(filteredLeads.reduce((sum, l) => sum + l.leadScore, 0) / filteredLeads.length) || 0,
    hotLeads: filteredLeads.filter(l => l.leadScore >= 90).length
  };

  // Distribution data for chart
  const distributionData = [
    { name: 'Pending', value: stats.pending, color: '#F4B400' },
    { name: 'Accepted', value: stats.accepted, color: '#0F9D58' },
    { name: 'Contacted', value: stats.contacted, color: '#4285F4' },
    { name: 'Rejected', value: filteredLeads.filter(l => l.status === 'Rejected').length, color: '#EA4335' }
  ];

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getStatusIcon = (status: Lead['status']) => {
    switch (status) {
      case 'Accepted':
        return <CheckCircle className="w-4 h-4" />;
      case 'Rejected':
        return <XCircle className="w-4 h-4" />;
      case 'Contacted':
        return <Mail className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'Accepted':
        return 'text-[#0F9D58] bg-[#0F9D58]/10 border-[#0F9D58]/20';
      case 'Rejected':
        return 'text-[#EA4335] bg-[#EA4335]/10 border-[#EA4335]/20';
      case 'Contacted':
        return 'text-[#4285F4] bg-[#4285F4]/10 border-[#4285F4]/20';
      default:
        return 'text-[#F4B400] bg-[#F4B400]/10 border-[#F4B400]/20';
    }
  };

  const uniqueCampaigns = Array.from(new Set(mockLeads.map(l => l.campaignId)));

  const handleLeadSelection = (leadId: string) => {
    if (selectedLeads.includes(leadId)) {
      setSelectedLeads(selectedLeads.filter(id => id !== leadId));
    } else {
      setSelectedLeads([...selectedLeads, leadId]);
    }
  };

  const handleLeadDetail = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDrawerOpen(true);
  };

  const toggleStar = (leadId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (starred.includes(leadId)) {
      setStarred(starred.filter(id => id !== leadId));
      toast.success('Removed from favorites');
    } else {
      setStarred([...starred, leadId]);
      toast.success('Added to favorites');
    }
  };

  const fabActions = [
    {
      icon: <Plus className="w-5 h-5 text-white" />,
      label: 'New Lead',
      onClick: () => toast.info('New Lead form coming soon'),
      color: isDark ? 'bg-[#E63946]' : 'bg-[#BA2027]'
    },
    {
      icon: <FileText className="w-5 h-5 text-white" />,
      label: 'Import CSV',
      onClick: () => toast.info('CSV import coming soon'),
      color: isDark ? 'bg-[#4285F4]' : 'bg-[#4285F4]'
    },
    {
      icon: <Download className="w-5 h-5 text-white" />,
      label: 'Export my leads',
      onClick: () => {
        if (selectedLeads.length > 0) {
          toast.success(`Exporting ${selectedLeads.length} leads`);
        } else {
          toast.error('Please select leads first');
        }
      },
      color: '#1E3A5F'
    }
  ];

  return (
    <div style={backgroundStyle} className={`transition-opacity duration-700 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <GlassNavigation />
      
      <div className="max-w-[1440px] mx-auto px-6 py-6">
        {/* Header with Stats */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
            <div>
              <h1 className={`${isDark ? 'text-white' : 'text-[#1E293B]'} mb-2`}>
                Lead Management
              </h1>
              <p className={`text-sm ${isDark ? 'text-[#B0AEBB]' : 'text-[#6B6B6B]'}`}>
                {stats.total} leads • {stats.pending} pending review • {stats.hotLeads} hot leads
              </p>
            </div>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <UnifiedKpiCard
              index={0}
              icon={Users}
              iconColor="text-[#4285F4]"
              iconBg={isDark ? 'bg-gradient-to-br from-[#4285F4]/20 to-[#4285F4]/10' : 'bg-gradient-to-br from-[#4285F4]/10 to-[#4285F4]/5'}
              value={stats.total}
              label="Total Leads"
            />
            <UnifiedKpiCard
              index={1}
              icon={Clock}
              iconColor="text-[#F4B400]"
              iconBg={isDark ? 'bg-gradient-to-br from-[#F4B400]/20 to-[#F4B400]/10' : 'bg-gradient-to-br from-[#F4B400]/10 to-[#F4B400]/5'}
              value={stats.pending}
              label="Pending"
            />
            <UnifiedKpiCard
              index={2}
              icon={TrendingUp}
              iconColor={isDark ? 'text-[#E63946]' : 'text-[#BA2027]'}
              iconBg={isDark ? 'bg-gradient-to-br from-[#E63946]/20 to-[#E63946]/10' : 'bg-gradient-to-br from-[#BA2027]/10 to-[#BA2027]/5'}
              value={stats.hotLeads}
              label="Hot Leads"
            />
            <UnifiedKpiCard
              index={3}
              icon={CheckCircle}
              iconColor="text-[#0F9D58]"
              iconBg={isDark ? 'bg-gradient-to-br from-[#0F9D58]/20 to-[#0F9D58]/10' : 'bg-gradient-to-br from-[#0F9D58]/10 to-[#0F9D58]/5'}
              value={stats.accepted}
              label="Accepted"
            />
            <UnifiedKpiCard
              index={4}
              icon={Award}
              iconColor="text-[#8E44AD]"
              iconBg={isDark ? 'bg-gradient-to-br from-[#8E44AD]/20 to-[#8E44AD]/10' : 'bg-gradient-to-br from-[#8E44AD]/10 to-[#8E44AD]/5'}
              value={stats.avgScore}
              label="Avg Score"
            />
          </div>
        </div>

        {/* Alert Banner */}
        {showAlert && (
          <div 
            className="mb-5 p-3 rounded-xl border flex items-center justify-between gap-4 animate-slideInUp"
            style={{
              backgroundColor: '#FFFBEB',
              borderColor: 'rgba(217,119,6,0.2)'
            }}
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="flex-shrink-0 p-2 rounded-lg" style={{ backgroundColor: 'rgba(217,119,6,0.1)' }}>
                <AlertTriangle className="w-5 h-5 text-orange-500" />
              </div>
              <p className="text-sm font-medium" style={{ color: '#92400e' }}>
                2 leads haven't been contacted in over 7 days. Follow up to maintain engagement.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setStatusFilter('Pending Review')}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-[#1E3A5F] to-[#162D47] text-white transition-all hover:scale-105 hover:shadow-lg active:scale-95"
              >
                View Leads
              </button>
              <button
                onClick={() => setShowAlert(false)}
                className="p-2 rounded-lg hover:bg-black/5 transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4 text-orange-600" />
              </button>
            </div>
          </div>
        )}

        {/* Filter Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-5">
          <div className="lg:col-span-4 relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`} />
            <input
              type="text"
              placeholder="Search leads by name, email, company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full h-[42px] pl-10 pr-4 rounded-lg border transition-all ${
                isDark 
                  ? 'bg-white/5 border-white/10 text-white placeholder-[#94A3B8] focus:border-[#E63946] focus:ring-2 focus:ring-[#E63946]/20' 
                  : 'bg-white border-gray-300 text-[#1E293B] placeholder-[#64748B] focus:border-[#BA2027] focus:ring-2 focus:ring-[#BA2027]/20'
              } outline-none`}
            />
          </div>

          <div className="lg:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`w-full h-[42px] px-4 rounded-lg border transition-all ${
                isDark 
                  ? 'bg-white/5 border-white/10 text-white focus:border-[#E63946]' 
                  : 'bg-white border-gray-300 text-[#1E293B] focus:border-[#BA2027]'
              } outline-none`}
            >
              <option value="all">All Status</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Accepted">Accepted</option>
              <option value="Contacted">Contacted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="lg:col-span-3">
            <select
              value={campaignFilter}
              onChange={(e) => setCampaignFilter(e.target.value)}
              className={`w-full h-[42px] px-4 rounded-lg border transition-all ${
                isDark 
                  ? 'bg-white/5 border-white/10 text-white focus:border-[#E63946]' 
                  : 'bg-white border-gray-300 text-[#1E293B] focus:border-[#BA2027]'
              } outline-none`}
            >
              <option value="all">All Campaigns</option>
              {uniqueCampaigns.map(campaignId => {
                const lead = mockLeads.find(l => l.campaignId === campaignId);
                return (
                  <option key={campaignId} value={campaignId}>
                    {lead?.campaignName}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="lg:col-span-3 flex gap-2">
            <button
              onClick={() => setShowFiltersPanel(true)}
              className={`flex-1 h-[42px] px-4 rounded-lg border transition-all flex items-center justify-center gap-2 ${
                isDark 
                  ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' 
                  : 'bg-white border-gray-300 text-[#1E293B] hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Advanced</span>
            </button>
            <button
              onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}
              className={`h-[42px] px-4 rounded-lg transition-all ${
                isDark 
                  ? 'bg-[#E63946] hover:bg-[#FF4D5A] text-white' 
                  : 'bg-[#BA2027] hover:bg-[#A01C22] text-white'
              }`}
            >
              {viewMode === 'table' ? 'Grid' : 'Table'}
            </button>
          </div>
        </div>

        {/* Table View */}
        {viewMode === 'table' && (
          <div className={`rounded-2xl overflow-hidden shadow-lg animate-fadeIn ${
            isDark ? 'bg-[#16151A]/90 border border-white/10 backdrop-blur-md' : 'bg-white border border-gray-200'
          }`}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead className="sticky top-0 z-10">
                  <tr className={`${isDark ? 'bg-white/5' : 'bg-gray-50'} border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                    <th className={`text-left px-6 py-4 text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <input
                        type="checkbox"
                        checked={selectedLeads.length === paginatedLeads.length && paginatedLeads.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedLeads(paginatedLeads.map(l => l.id));
                          } else {
                            setSelectedLeads([]);
                          }
                        }}
                        className={`w-4 h-4 rounded cursor-pointer transition-all appearance-none ${
                          isDark 
                            ? 'bg-white/10 border-2 border-white/20 hover:border-white/40' 
                            : 'bg-white border-2 border-gray-300 hover:border-gray-400'
                        } checked:bg-[#E63946] checked:border-[#E63946] focus:ring-2 focus:ring-offset-0 focus:ring-[#E63946]/50 relative`}
                        style={{
                          backgroundImage: selectedLeads.length === paginatedLeads.length && paginatedLeads.length > 0 
                            ? `url("data:image/svg+xml,%3Csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3E%3C/svg%3E")`
                            : 'none',
                          backgroundSize: '100% 100%',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat'
                        }}
                      />
                    </th>
                    <th className={`text-left px-6 py-4 text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Lead Info
                    </th>
                    <th className={`text-left px-6 py-4 text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Contact
                    </th>
                    <th className={`text-left px-6 py-4 text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Company
                    </th>
                    <th 
                      className={`text-left px-6 py-4 text-sm font-semibold cursor-pointer hover:text-[#E63946] transition-colors ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                      onClick={() => handleSort('leadScore')}
                    >
                      Score
                    </th>
                    <th 
                      className={`text-left px-6 py-4 text-sm font-semibold cursor-pointer hover:text-[#E63946] transition-colors ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                      onClick={() => handleSort('status')}
                    >
                      Status
                    </th>
                    <th className={`text-left px-6 py-4 text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedLeads.map((lead, index) => (
                    <TableRow
                      key={lead.id}
                      onClick={() => handleLeadDetail(lead)}
                      showHoverEffect={true}
                      animationDelay={index * 100}
                    >
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedLeads.includes(lead.id)}
                          onChange={() => handleLeadSelection(lead.id)}
                          className={`w-4 h-4 rounded cursor-pointer transition-all appearance-none ${
                            isDark 
                              ? 'bg-white/10 border-2 border-white/20 hover:border-white/40' 
                              : 'bg-white border-2 border-gray-300 hover:border-gray-400'
                          } checked:bg-[#E63946] checked:border-[#E63946] focus:ring-2 focus:ring-offset-0 focus:ring-[#E63946]/50 relative`}
                          style={{
                            backgroundImage: selectedLeads.includes(lead.id)
                              ? `url("data:image/svg+xml,%3Csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3E%3C/svg%3E")`
                              : 'none',
                            backgroundSize: '100% 100%',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                          }}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <LeadAvatar firstName={lead.firstName} lastName={lead.lastName} size="md" />
                          <div>
                            <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {lead.firstName} {lead.lastName}
                            </div>
                            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              {lead.title}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className={`text-sm flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            <Mail className="w-3.5 h-3.5" />
                            {lead.email}
                          </div>
                          <div className={`text-sm flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            <Phone className="w-3.5 h-3.5" />
                            {lead.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className={`text-sm font-medium flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            <Building2 className="w-4 h-4 text-gray-400" />
                            {lead.company}
                          </div>
                          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {lead.industry} • {lead.employeeSize}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <LeadScoreRing score={lead.leadScore} size={65} />
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${getStatusColor(lead.status)}`}>
                          {getStatusIcon(lead.status)}
                          <span className="text-sm font-medium">{lead.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => toggleStar(lead.id, e)}
                            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                          >
                            <Star 
                              className={`w-4 h-4 ${
                                starred.includes(lead.id) 
                                  ? 'fill-yellow-400 text-yellow-400' 
                                  : 'text-gray-400'
                              }`} 
                            />
                          </button>
                          <button 
                            onClick={() => handleLeadDetail(lead)}
                            className={`p-2 rounded-lg transition-colors ${
                              isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                            }`}
                          >
                            <Eye className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      </td>
                    </TableRow>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className={`flex flex-col sm:flex-row items-center justify-between px-6 py-4 gap-4 border-t ${
              isDark ? 'border-white/10' : 'border-gray-200'
            }`}>
              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Showing {((currentPage - 1) * leadsPerPage) + 1} to {Math.min(currentPage * leadsPerPage, filteredLeads.length)} of {filteredLeads.length} leads
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg border transition-all ${
                    currentPage === 1
                      ? 'opacity-50 cursor-not-allowed'
                      : isDark 
                        ? 'border-white/10 text-white hover:bg-white/5' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg transition-all ${
                        currentPage === page
                          ? isDark 
                            ? 'bg-[#E63946] text-white' 
                            : 'bg-[#BA2027] text-white'
                          : isDark 
                            ? 'text-gray-300 hover:bg-white/5' 
                            : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg border transition-all ${
                    currentPage === totalPages
                      ? 'opacity-50 cursor-not-allowed'
                      : isDark 
                        ? 'border-white/10 text-white hover:bg-white/5' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedLeads.map((lead, index) => (
              <div
                key={lead.id}
                onClick={() => handleLeadDetail(lead)}
                className={`rounded-xl p-5 border backdrop-blur-sm cursor-pointer transition-all hover:scale-105 animate-slideInUp ${
                  isDark 
                    ? 'bg-white/5 border-white/10 hover:shadow-[0_0_25px_rgba(230,57,70,0.2)]' 
                    : 'bg-white border-gray-200 hover:shadow-[0_0_25px_rgba(186,32,39,0.15)]'
                } ${lead.leadScore >= 90 ? 'animate-button-pulse' : ''}`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <LeadAvatar firstName={lead.firstName} lastName={lead.lastName} size="lg" />
                  <button
                    onClick={(e) => toggleStar(lead.id, e)}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <Star 
                      className={`w-4 h-4 ${
                        starred.includes(lead.id) 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-gray-400'
                      }`} 
                    />
                  </button>
                </div>

                <h3 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {lead.firstName} {lead.lastName}
                </h3>
                <p className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {lead.title}
                </p>

                <div className="flex items-center justify-center mb-4">
                  <LeadScoreRing score={lead.leadScore} size={80} />
                </div>

                <div className="space-y-2 mb-4">
                  <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <Building2 className="w-3.5 h-3.5 text-gray-400" />
                    <span className="truncate">{lead.company}</span>
                  </div>
                  <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    <span className="truncate">{lead.email}</span>
                  </div>
                </div>

                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border w-full justify-center ${getStatusColor(lead.status)}`}>
                  {getStatusIcon(lead.status)}
                  <span className="text-sm font-medium">{lead.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bulk Action Bar */}
      {selectedLeads.length > 0 && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40 animate-slideInUp">
          <div className={`rounded-2xl shadow-2xl px-6 py-4 flex items-center gap-4 backdrop-blur-md ${
            isDark ? 'bg-[#16151A]/95 border border-white/10' : 'bg-white/95 border border-gray-200'
          }`}>
            <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {selectedLeads.length} selected
            </span>
            <div className={`h-6 w-px ${isDark ? 'bg-white/10' : 'bg-gray-300'}`} />
            <button 
              onClick={() => toast.success(`Exporting ${selectedLeads.length} leads`)}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-sm font-medium ${
                isDark ? 'bg-[#E63946]/20 hover:bg-[#E63946]/30 text-[#E63946]' : 'bg-[#BA2027]/10 hover:bg-[#BA2027]/20 text-[#BA2027]'
              }`}
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button 
              onClick={() => toast.info('Status change modal coming soon')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-sm font-medium ${
                isDark ? 'bg-[#4285F4]/20 hover:bg-[#4285F4]/30 text-[#4285F4]' : 'bg-[#4285F4]/10 hover:bg-[#4285F4]/20 text-[#4285F4]'
              }`}
            >
              <FileText className="w-4 h-4" />
              Change Status
            </button>
            <button 
              onClick={() => toast.info('Assignment modal coming soon')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-sm font-medium ${
                isDark ? 'bg-[#0F9D58]/20 hover:bg-[#0F9D58]/30 text-[#0F9D58]' : 'bg-[#0F9D58]/10 hover:bg-[#0F9D58]/20 text-[#0F9D58]'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              Assign
            </button>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <FloatingActionButton actions={fabActions} />

      {/* Advanced Filters Panel */}
      <AdvancedFiltersPanel
        isOpen={showFiltersPanel}
        onClose={() => setShowFiltersPanel(false)}
        filters={advancedFilters}
        onFilterChange={setAdvancedFilters}
      />

      {/* Lead Detail Drawer */}
      <LeadDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        lead={selectedLead}
      />
    </div>
  );
}