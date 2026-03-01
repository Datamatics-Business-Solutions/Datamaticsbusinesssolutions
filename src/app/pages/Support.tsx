import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { GlassNavigation } from '../components/GlassNavigation';
import { useTheme } from '../context/ThemeContext';
import { TableRow } from '../components/TableRow';
import { 
  Search, MessageSquare, AlertCircle, CheckCircle, Clock, Plus, User, Calendar, Tag,
  Send, Paperclip, Star, X, Activity, TrendingUp, BarChart3, Filter, Grid3x3, List
} from 'lucide-react';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { toast } from 'sonner';

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Waiting' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  category: 'Technical' | 'Billing' | 'Campaign' | 'Lead Quality' | 'General';
  createdBy: string;
  createdDate: string;
  lastUpdated: string;
  assignedTo?: string;
  campaign?: string;
  messages?: number;
}

const mockTickets: Ticket[] = [
  {
    id: 'TKT-001',
    title: 'Lead verification issue for Healthcare Campaign',
    description: 'Several leads from the Healthcare Campaign Feb 2026 are bouncing back with invalid email addresses.',
    status: 'In Progress',
    priority: 'High',
    category: 'Lead Quality',
    createdBy: 'John Smith',
    createdDate: '2026-02-27',
    lastUpdated: '2026-02-28',
    assignedTo: 'Support Team',
    campaign: 'Healthcare Content Syndication - Feb 2026',
    messages: 5
  },
  {
    id: 'TKT-002',
    title: 'Invoice discrepancy for January billing',
    description: 'The invoice #2026-01-234 shows incorrect lead count. Expected 320 but invoice shows 310.',
    status: 'Waiting',
    priority: 'Medium',
    category: 'Billing',
    createdBy: 'Sarah Johnson',
    createdDate: '2026-02-26',
    lastUpdated: '2026-02-27',
    assignedTo: 'Billing Department',
    messages: 3
  },
  {
    id: 'TKT-003',
    title: 'Request campaign pause for CloudScale Ventures',
    description: 'Client requested to pause the SaaS Appointment Setting campaign until further notice.',
    status: 'Resolved',
    priority: 'Urgent',
    category: 'Campaign',
    createdBy: 'Emily Rodriguez',
    createdDate: '2026-02-20',
    lastUpdated: '2026-02-21',
    assignedTo: 'Campaign Manager',
    campaign: 'SaaS Appointment Setting - Q1',
    messages: 8
  },
  {
    id: 'TKT-004',
    title: 'Unable to access campaign reports',
    description: 'Getting a 404 error when trying to download the monthly performance report for Q1 campaigns.',
    status: 'Open',
    priority: 'Low',
    category: 'Technical',
    createdBy: 'Michael Chen',
    createdDate: '2026-02-28',
    lastUpdated: '2026-02-28',
    messages: 1
  },
  {
    id: 'TKT-005',
    title: 'Lead score methodology clarification',
    description: 'Need detailed explanation of how lead scores are calculated for BANT qualified leads.',
    status: 'Closed',
    priority: 'Low',
    category: 'General',
    createdBy: 'David Lee',
    createdDate: '2026-02-24',
    lastUpdated: '2026-02-25',
    assignedTo: 'Account Manager',
    campaign: 'Financial Services BANT Qualification',
    messages: 4
  },
  {
    id: 'TKT-006',
    title: 'Campaign performance below target',
    description: 'Enterprise IT Security Campaign is tracking 25% below target. Need strategy discussion.',
    status: 'In Progress',
    priority: 'High',
    category: 'Campaign',
    createdBy: 'John Smith',
    createdDate: '2026-02-25',
    lastUpdated: '2026-02-28',
    assignedTo: 'Account Manager',
    campaign: 'Enterprise IT Security Campaign Q1 2026',
    messages: 12
  }
];

export default function Support() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [pageLoaded, setPageLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

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
        border: '1px solid rgba(186, 32, 39, 0.08)',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)'
      };

  const filteredTickets = mockTickets.filter(ticket => {
    const matchesSearch = 
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || ticket.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'All' || ticket.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  // Stats
  const stats = {
    total: mockTickets.length,
    open: mockTickets.filter(t => t.status === 'Open').length,
    inProgress: mockTickets.filter(t => t.status === 'In Progress').length,
    resolved: mockTickets.filter(t => t.status === 'Resolved').length,
    avgResponseTime: 2.5
  };

  // Group by status for Kanban
  const columns = {
    'Open': filteredTickets.filter(t => t.status === 'Open'),
    'In Progress': filteredTickets.filter(t => t.status === 'In Progress'),
    'Waiting': filteredTickets.filter(t => t.status === 'Waiting'),
    'Resolved': filteredTickets.filter(t => t.status === 'Resolved'),
    'Closed': filteredTickets.filter(t => t.status === 'Closed')
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return { bg: isDark ? 'bg-[#0891B2]/20' : 'bg-[#0891B2]/10', text: 'text-[#0891B2]', border: 'border-[#0891B2]/20' };
      case 'In Progress':
        return { bg: isDark ? 'bg-[#F4B400]/20' : 'bg-[#F4B400]/10', text: 'text-[#F4B400]', border: 'border-[#F4B400]/20' };
      case 'Waiting':
        return { bg: isDark ? 'bg-[#EA4335]/20' : 'bg-[#EA4335]/10', text: 'text-[#EA4335]', border: 'border-[#EA4335]/20' };
      case 'Resolved':
        return { bg: isDark ? 'bg-[#0F9D58]/20' : 'bg-[#0F9D58]/10', text: 'text-[#0F9D58]', border: 'border-[#0F9D58]/20' };
      default:
        return { bg: isDark ? 'bg-white/10' : 'bg-gray-100', text: isDark ? 'text-gray-400' : 'text-gray-600', border: isDark ? 'border-white/20' : 'border-gray-200' };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return 'text-[#EA4335] bg-[#EA4335]/10 border-[#EA4335]/20 animate-button-pulse';
      case 'High':
        return 'text-[#F4B400] bg-[#F4B400]/10 border-[#F4B400]/20';
      case 'Medium':
        return 'text-[#0891B2] bg-[#0891B2]/10 border-[#0891B2]/20';
      default:
        return isDark ? 'text-gray-400 bg-white/10 border-white/20' : 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  return (
    <div style={backgroundStyle} className={`transition-opacity duration-700 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <GlassNavigation />
      
      <div className="max-w-[1440px] mx-auto px-6 py-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
          <div>
            <h1 className={`${isDark ? 'text-white' : 'text-[#1E1E1E]'} mb-2`}>
              Support & Help Desk
            </h1>
            <p className={`text-sm ${isDark ? 'text-[#B0AEBB]' : 'text-[#6B6B6B]'}`}>
              {stats.total} tickets • {stats.open} open • Avg response: {stats.avgResponseTime}h
            </p>
          </div>
          <button
            onClick={() => setShowNewTicket(true)}
            className={`px-5 py-2.5 rounded-lg text-white transition-all flex items-center gap-2 w-fit shadow-lg hover:scale-105 ${
              isDark ? 'bg-gradient-to-r from-[#E63946] to-[#FF4D5A]' : 'bg-gradient-to-r from-[#BA2027] to-[#D32F2F]'
            }`}
          >
            <Plus className="w-4 h-4" />
            New Ticket
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {[
            { label: 'Total Tickets', value: stats.total, icon: MessageSquare, color: '#4285F4', index: 0 },
            { label: 'Open', value: stats.open, icon: AlertCircle, color: '#0891B2', index: 1 },
            { label: 'In Progress', value: stats.inProgress, icon: Activity, color: '#F4B400', index: 2 },
            { label: 'Resolved', value: stats.resolved, icon: CheckCircle, color: '#0F9D58', index: 3 },
            { label: 'Avg Response', value: `${stats.avgResponseTime}h`, icon: Clock, color: '#8E44AD', index: 4 }
          ].map((stat) => (
            <div
              key={stat.label}
              className={`rounded-xl p-4 border backdrop-blur-md transition-all hover:scale-105 animate-slideInUp ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
              }`}
              style={{ animationDelay: `${stat.index * 50}ms` }}
            >
              <div className="flex items-center justify-between mb-1">
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                {typeof stat.value === 'number' && stat.label === 'Resolved' && (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                )}
              </div>
              <div className={`text-4xl font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {typeof stat.value === 'number' ? <AnimatedCounter end={stat.value} /> : stat.value}
              </div>
              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className={`rounded-xl p-5 mb-6 border backdrop-blur-md ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-4 relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full h-[42px] pl-10 pr-4 rounded-lg border transition-all ${
                  isDark
                    ? 'bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-[#E63946]'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#BA2027]'
                } outline-none`}
              />
            </div>

            <div className="md:col-span-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`w-full h-[42px] px-4 rounded-lg border transition-all ${
                  isDark
                    ? 'bg-white/5 border-white/10 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } outline-none`}
              >
                <option value="All">All Status</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Waiting">Waiting</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className={`w-full h-[42px] px-4 rounded-lg border transition-all ${
                  isDark
                    ? 'bg-white/5 border-white/10 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } outline-none`}
              >
                <option value="All">All Priority</option>
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className={`w-full h-[42px] px-4 rounded-lg border transition-all ${
                  isDark
                    ? 'bg-white/5 border-white/10 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } outline-none`}
              >
                <option value="All">All Categories</option>
                <option value="Technical">Technical</option>
                <option value="Billing">Billing</option>
                <option value="Campaign">Campaign</option>
                <option value="Lead Quality">Lead Quality</option>
                <option value="General">General</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <button
                onClick={() => setViewMode(viewMode === 'kanban' ? 'list' : 'kanban')}
                className={`w-full h-[42px] px-4 rounded-lg transition-all flex items-center justify-center gap-2 ${
                  isDark
                    ? 'bg-[#E63946] hover:bg-[#FF4D5A] text-white'
                    : 'bg-[#BA2027] hover:bg-[#A01C22] text-white'
                }`}
              >
                {viewMode === 'kanban' ? <List className="w-4 h-4" /> : <Grid3x3 className="w-4 h-4" />}
                <span>{viewMode === 'kanban' ? 'List' : 'Board'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Kanban Board View */}
        {viewMode === 'kanban' && (
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4 min-w-max">
              {Object.entries(columns).map(([status, tickets]) => {
                const colors = getStatusColor(status);
                return (
                  <div
                    key={status}
                    className={`w-80 rounded-xl border backdrop-blur-md animate-fadeIn ${
                      isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
                    }`}
                  >
                    {/* Column Header */}
                    <div className={`p-4 border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${colors.bg}`} />
                          <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {status}
                          </h3>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                          {tickets.length}
                        </span>
                      </div>
                    </div>

                    {/* Tickets */}
                    <motion.div 
                      className="p-3 space-y-3 max-h-[600px] overflow-y-auto"
                      initial="hidden"
                      animate="visible"
                      variants={{
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: { staggerChildren: 0.08 }
                        }
                      }}
                    >
                      {tickets.map((ticket, index) => (
                        <motion.div
                          key={ticket.id}
                          variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 }
                          }}
                          whileHover={{ scale: 1.03, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedTicket(ticket)}
                          className={`p-4 rounded-lg border cursor-pointer transition-all ${
                            isDark
                              ? 'bg-white/5 border-white/10 hover:bg-white/10'
                              : 'bg-white border-gray-200 hover:shadow-lg'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <span className={`text-xs font-mono ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              {ticket.id}
                            </span>
                            <motion.span 
                              className={`px-2 py-0.5 rounded-md border text-xs font-medium ${getPriorityColor(ticket.priority)}`}
                              animate={ticket.priority === 'High' || ticket.priority === 'Urgent' ? {
                                boxShadow: [
                                  "0 0 0px rgba(244, 180, 0, 0)",
                                  "0 0 10px rgba(244, 180, 0, 0.5)",
                                  "0 0 0px rgba(244, 180, 0, 0)"
                                ]
                              } : {}}
                              transition={ticket.priority === 'High' || ticket.priority === 'Urgent' ? { 
                                duration: 2, 
                                repeat: Infinity 
                              } : {}}
                            >
                              {ticket.priority}
                            </motion.span>
                          </div>

                          <h4 className={`font-medium text-sm mb-2 line-clamp-2 ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}>
                            {ticket.title}
                          </h4>

                          <p className={`text-xs mb-3 line-clamp-2 ${
                            isDark ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {ticket.description}
                          </p>

                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <MessageSquare className="w-3 h-3 text-gray-400" />
                              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                {ticket.messages || 0}
                              </span>
                            </div>
                            <span className={isDark ? 'text-gray-500' : 'text-gray-500'}>
                              {new Date(ticket.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className={`rounded-xl overflow-hidden border backdrop-blur-md ${
            isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
          }`}>
            <table className="w-full">
              <thead className={`${isDark ? 'bg-white/5' : 'bg-gray-50'} border-b ${
                isDark ? 'border-white/10' : 'border-gray-200'
              }`}>
                <tr>
                  <th className={`text-left px-6 py-4 text-sm font-semibold ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    ID
                  </th>
                  <th className={`text-left px-6 py-4 text-sm font-semibold ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Title
                  </th>
                  <th className={`text-left px-6 py-4 text-sm font-semibold ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Priority
                  </th>
                  <th className={`text-left px-6 py-4 text-sm font-semibold ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Status
                  </th>
                  <th className={`text-left px-6 py-4 text-sm font-semibold ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Category
                  </th>
                  <th className={`text-left px-6 py-4 text-sm font-semibold ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Updated
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket, index) => (
                  <TableRow
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    showHoverEffect={true}
                    animationDelay={index * 100}
                  >
                    <td className="px-6 py-3">
                      <span className={`font-mono text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {ticket.id}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {ticket.title}
                      </div>
                      <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                        {ticket.category}
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-1 rounded-md border text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-1 rounded-md border text-xs font-medium ${getStatusColor(ticket.status).bg} ${getStatusColor(ticket.status).text} ${getStatusColor(ticket.status).border}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {ticket.category}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {new Date(ticket.lastUpdated).toLocaleDateString()}
                      </span>
                    </td>
                  </TableRow>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {filteredTickets.length === 0 && (
          <div className={`rounded-xl p-12 text-center border backdrop-blur-md ${
            isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
          }`}>
            <MessageSquare className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              No tickets found matching your criteria
            </p>
          </div>
        )}
      </div>

      {/* New Ticket Modal */}
      {showNewTicket && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fadeIn"
            onClick={() => setShowNewTicket(false)}
          />
          <div 
            className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl rounded-2xl shadow-2xl border z-50 animate-scaleIn ${
              isDark ? 'bg-[#16151A] border-white/10' : 'bg-white border-gray-200'
            }`}
          >
            <div className={`flex items-center justify-between p-6 border-b ${
              isDark ? 'border-white/10' : 'border-gray-200'
            }`}>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Create New Ticket
              </h3>
              <button
                onClick={() => setShowNewTicket(false)}
                className={`p-2 rounded-lg transition-colors ${
                  isDark ? 'hover:bg-white/5' : 'hover:bg-gray-100'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Brief description of the issue"
                  className={`w-full px-4 py-2.5 rounded-lg border transition-all ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } outline-none`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Priority
                  </label>
                  <select
                    className={`w-full px-4 py-2.5 rounded-lg border transition-all ${
                      isDark
                        ? 'bg-white/5 border-white/10 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    } outline-none`}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Category
                  </label>
                  <select
                    className={`w-full px-4 py-2.5 rounded-lg border transition-all ${
                      isDark
                        ? 'bg-white/5 border-white/10 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    } outline-none`}
                  >
                    <option value="Technical">Technical</option>
                    <option value="Billing">Billing</option>
                    <option value="Campaign">Campaign</option>
                    <option value="Lead Quality">Lead Quality</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Description
                </label>
                <textarea
                  rows={5}
                  placeholder="Provide detailed information about your issue..."
                  className={`w-full px-4 py-2.5 rounded-lg border transition-all ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } outline-none resize-none`}
                />
              </div>
            </div>

            <div className={`flex gap-3 p-6 border-t ${
              isDark ? 'border-white/10' : 'border-gray-200'
            }`}>
              <button
                onClick={() => setShowNewTicket(false)}
                className={`flex-1 px-4 py-2.5 rounded-lg border transition-all ${
                  isDark
                    ? 'border-white/10 text-gray-300 hover:bg-white/5'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toast.success('Ticket created successfully!');
                  setShowNewTicket(false);
                }}
                className={`flex-1 px-4 py-2.5 rounded-lg text-white transition-all flex items-center justify-center gap-2 ${
                  isDark
                    ? 'bg-gradient-to-r from-[#E63946] to-[#FF4D5A]'
                    : 'bg-gradient-to-r from-[#BA2027] to-[#D32F2F]'
                }`}
              >
                <Send className="w-4 h-4" />
                Create Ticket
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}