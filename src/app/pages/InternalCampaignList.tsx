import { useState, useMemo } from 'react';
import { AppLayout } from '../components/AppLayout';
import { TableRow } from '../components/TableRow';
import { Search, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { useNavigate } from 'react-router';
import { allClients, type Campaign } from '../data/mockClients';

// Flatten all campaigns from allClients into a single array with clientName attached
type FlatCampaign = Campaign & { clientName: string; clientIndustry: string };

function getAllCampaigns(): FlatCampaign[] {
  const result: FlatCampaign[] = [];
  for (const client of allClients) {
    for (const campaign of client.campaigns) {
      result.push({ ...campaign, clientName: client.companyName, clientIndustry: client.industry });
    }
  }
  return result;
}

const ALL_CAMPAIGNS = getAllCampaigns();

function statusLabel(s: string) {
  switch (s) {
    case 'active':           return 'Active';
    case 'completed':        return 'Completed';
    case 'paused':           return 'Paused';
    case 'pending_approval': return 'Pending Approval';
    default:                 return s;
  }
}

function statusBadgeClass(s: string) {
  switch (s) {
    case 'active':           return 'badge badge-active';
    case 'completed':        return 'badge badge-completed';
    case 'paused':           return 'badge badge-paused';
    case 'pending_approval': return 'badge';
    default:                 return 'badge';
  }
}

export default function InternalCampaignList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sortField, setSortField] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const navigate = useNavigate();

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />;
  };

  const filteredCampaigns = useMemo(() => {
    return ALL_CAMPAIGNS
      .filter(campaign => {
        const matchesSearch =
          campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          campaign.clientName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' || campaign.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        let aVal: any, bVal: any;
        const aTarget = a.target ?? a.totalLeads ?? 0;
        const bTarget = b.target ?? b.totalLeads ?? 0;
        const aDelivered = a.delivered ?? a.deliveredLeads ?? 0;
        const bDelivered = b.delivered ?? b.deliveredLeads ?? 0;
        switch (sortField) {
          case 'name':     aVal = a.name;    bVal = b.name;    break;
          case 'client':   aVal = a.clientName; bVal = b.clientName; break;
          case 'progress': aVal = aTarget > 0 ? aDelivered / aTarget : 0; bVal = bTarget > 0 ? bDelivered / bTarget : 0; break;
          case 'status':   aVal = a.status;  bVal = b.status;  break;
          default:         return 0;
        }
        if (typeof aVal === 'string') {
          return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      });
  }, [searchQuery, statusFilter, sortField, sortOrder]);

  return (
    <AppLayout>
      <div className="max-w-[1440px] mx-auto page-content">
        <div className="mb-6">
          <h1 style={{ color: 'var(--color-text-primary)' }} className="mb-2">All Campaigns</h1>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
            {filteredCampaigns.length} campaign{filteredCampaigns.length !== 1 ? 's' : ''} found
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
          <div className="lg:col-span-8 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              placeholder="Search campaigns or clients…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-base w-full pl-10 pr-4 py-3"
            />
          </div>

          <div className="lg:col-span-4 relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-base w-full px-4 py-3"
            >
              <option value="All">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="paused">Paused</option>
              <option value="pending_approval">Pending Approval</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" style={{ color: 'var(--color-text-muted)' }} />
          </div>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="table-header">
                <tr>
                  <th
                    className="table-th cursor-pointer hover:text-[var(--color-primary)] transition-colors"
                    style={{ color: sortField === 'name' ? 'var(--color-primary)' : undefined }}
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1">Campaign <SortIcon field="name" /></div>
                  </th>
                  <th
                    className="table-th cursor-pointer hover:text-[var(--color-primary)] transition-colors"
                    style={{ color: sortField === 'client' ? 'var(--color-primary)' : undefined }}
                    onClick={() => handleSort('client')}
                  >
                    <div className="flex items-center gap-1">Client <SortIcon field="client" /></div>
                  </th>
                  <th
                    className="table-th cursor-pointer hover:text-[var(--color-primary)] transition-colors"
                    style={{ color: sortField === 'progress' ? 'var(--color-primary)' : undefined }}
                    onClick={() => handleSort('progress')}
                  >
                    <div className="flex items-center gap-1">Progress <SortIcon field="progress" /></div>
                  </th>
                  <th
                    className="table-th cursor-pointer hover:text-[var(--color-primary)] transition-colors"
                    style={{ color: sortField === 'status' ? 'var(--color-primary)' : undefined }}
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-1">Status <SortIcon field="status" /></div>
                  </th>
                  <th className="table-th">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.map((campaign, index) => {
                  const target = campaign.target ?? campaign.totalLeads ?? 0;
                  const delivered = campaign.delivered ?? campaign.deliveredLeads ?? 0;
                  const progress = target > 0
                    ? Math.min(Math.round((delivered / target) * 100), 100)
                    : 0;

                  return (
                    <TableRow
                      key={campaign.id}
                      showHoverEffect={true}
                      animationDelay={index * 40}
                      onClick={() => navigate(`/internal/campaigns/${campaign.id}`)}
                    >
                      <td className="table-td">
                        <div className="t1">{campaign.name}</div>
                        {campaign.startDate && campaign.endDate && (
                          <div className="t3 mt-0.5">{campaign.startDate} → {campaign.endDate}</div>
                        )}
                      </td>
                      <td className="table-td">
                        <div className="t2">{campaign.clientName}</div>
                        <div className="t3">{campaign.clientIndustry}</div>
                      </td>
                      <td className="table-td">
                        <div className="space-y-1.5" style={{ minWidth: '160px' }}>
                          <div className="flex items-center gap-3">
                            <div className="progress-bar flex-1">
                              <div
                                className={`progress-bar__fill ${campaign.status === 'completed' ? 'progress-bar__fill--completed' : ''}`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <span className="t2" style={{ minWidth: '30px' }}>{progress}%</span>
                          </div>
                          <div className="t3">
                            {delivered.toLocaleString()} / {target.toLocaleString()} leads
                          </div>
                        </div>
                      </td>
                      <td className="table-td">
                        <span className={statusBadgeClass(campaign.status)}>
                          {statusLabel(campaign.status)}
                        </span>
                      </td>
                      <td className="table-td" onClick={(e) => e.stopPropagation()}>
                        <button
                          className="btn-ghost p-2"
                          title="View campaign"
                          onClick={() => navigate(`/internal/campaigns/${campaign.id}`)}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </TableRow>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredCampaigns.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--color-text-muted)' }} />
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                No campaigns match your search criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
