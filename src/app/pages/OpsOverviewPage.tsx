import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import {
  Search,
  Filter,
  X,
  ChevronUp,
  ChevronDown,
  Eye,
  ExternalLink,
  Calendar,
  Users,
  TrendingUp,
  Briefcase,
  BarChart3,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppLayout } from '../components/AppLayout';
import { allClients, getGlobalStats, Client } from '../data/mockClients';
import { AnimatedCounter } from '../components/AnimatedCounter';

export default function OpsOverviewPage() {
  const navigate = useNavigate();
  const globalStats = getGlobalStats();

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [managerFilter, setManagerFilter] = useState<string>('All');
  
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
        client.primaryContact.name.toLowerCase().includes(searchQuery.toLowerCase())
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

  const handleSort = (field: keyof Client | 'campaignName') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <AppLayout>
      <div className="max-w-[1600px] mx-auto px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 style={{ color: 'var(--color-text-primary)' }} className="mb-2">
            Operations Overview
          </h1>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
            Global view of all clients and campaigns
          </p>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 stagger-children">
          <div className="kpi-card animate-slideInUp">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-info-bg)' }}>
                <Briefcase className="w-5 h-5" style={{ color: 'var(--color-info)' }} />
              </div>
            </div>
            <div className="kpi-card__number"><AnimatedCounter value={globalStats.totalClients} /></div>
            <div className="kpi-card__label">Total Clients</div>
          </div>

          <div className="kpi-card animate-slideInUp">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-success-bg)' }}>
                <BarChart3 className="w-5 h-5" style={{ color: 'var(--color-success)' }} />
              </div>
            </div>
            <div className="kpi-card__number"><AnimatedCounter value={globalStats.totalCampaigns} /></div>
            <div className="kpi-card__label">Total Campaigns</div>
          </div>

          <div className="kpi-card animate-slideInUp">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-primary-tint)' }}>
                <TrendingUp className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
              </div>
            </div>
            <div className="kpi-card__number"><AnimatedCounter value={globalStats.totalLeadsDelivered} /></div>
            <div className="kpi-card__label">Leads Delivered</div>
          </div>

          <div className="kpi-card animate-slideInUp">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-warning-bg)' }}>
                <Users className="w-5 h-5" style={{ color: 'var(--color-warning)' }} />
              </div>
            </div>
            <div className="kpi-card__number"><AnimatedCounter value={globalStats.activeCampaigns} /></div>
            <div className="kpi-card__label">Active Campaigns</div>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
          <div className="lg:col-span-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-base w-full pl-10 pr-4 py-3"
            />
          </div>

          <div className="lg:col-span-3">
            <select
              value={managerFilter}
              onChange={(e) => setManagerFilter(e.target.value)}
              className="input-base w-full px-4 py-3"
            >
              <option value="All">All Managers</option>
              {uniqueManagers.map((manager) => (
                <option key={manager} value={manager}>
                  {manager}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-3">
            <button
              onClick={() => {
                setSearchQuery('');
                setManagerFilter('All');
              }}
              className="btn-outline w-full px-4 py-3 flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </button>
          </div>
        </div>

        {/* Clients Table */}
        <div className="glass-card overflow-hidden">
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
                    Contact
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
                      <div>
                        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>
                          {client.primaryContact.name}
                        </div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                          {client.primaryContact.email}
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
                        {client.campaigns.reduce((sum, c) => sum + c.delivered, 0)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="badge badge-completed">
                        {client.campaignManager}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/internal/clients/${client.id}`)}
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
    </AppLayout>
  );
}
