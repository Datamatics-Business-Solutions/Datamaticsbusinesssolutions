import { useState } from 'react';
import { AppLayout } from '../components/AppLayout';
import { TableRow } from '../components/TableRow';
import { Search, ChevronDown, ChevronUp, Upload, Eye } from 'lucide-react';
import { useNavigate } from 'react-router';
import { mockCampaigns } from '../mockData';

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

  const filteredCampaigns = mockCampaigns
    .filter(campaign => {
      const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || campaign.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aVal: any, bVal: any;
      switch (sortField) {
        case 'name': aVal = a.name; bVal = b.name; break;
        case 'progress': aVal = a.delivered / a.target; bVal = b.delivered / b.target; break;
        case 'status': aVal = a.status; bVal = b.status; break;
        default: return 0;
      }
      if (typeof aVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });

  return (
    <AppLayout>
      <div className="max-w-[1440px] mx-auto page-content">
        <div className="mb-6">
          <h1 style={{ color: 'var(--color-text-primary)' }} className="mb-2">All Campaigns</h1>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
            {filteredCampaigns.length} campaigns found
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
          <div className="lg:col-span-8 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              placeholder="Search campaigns..."
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
              <option value="In progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Paused">Paused</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280] pointer-events-none" />
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
                  const progress = campaign.target > 0
                    ? Math.min(Math.round((campaign.delivered / campaign.target) * 100), 100)
                    : 0;
                  return (
                    <TableRow
                      key={campaign.id}
                      showHoverEffect={true}
                      animationDelay={index * 50}
                      onClick={() => navigate(`/internal/campaigns/${campaign.id}`)}
                    >
                      <td className="table-td">
                        <div className="t1">{campaign.name}</div>
                        <div className="t3 mt-0.5">{campaign.startDate} → {campaign.endDate}</div>
                      </td>
                      <td className="table-td">
                        <div className="space-y-1.5" style={{ minWidth: '160px' }}>
                          <div className="flex items-center gap-3">
                            <div className="progress-bar flex-1">
                              <div
                                className={`progress-bar__fill ${campaign.status === 'Completed' ? 'progress-bar__fill--completed' : ''}`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <span className="t2" style={{ minWidth: '30px' }}>{progress}%</span>
                          </div>
                          <div className="t3">
                            {campaign.delivered.toLocaleString()} / {campaign.target.toLocaleString()} leads
                          </div>
                        </div>
                      </td>
                      <td className="table-td">
                        <span className={`badge ${
                          campaign.status === 'In progress' ? 'badge-active' :
                          campaign.status === 'Completed' ? 'badge-completed' :
                          'badge-paused'
                        }`}>
                          {campaign.status}
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
            <div className="text-center py-12" style={{ color: 'var(--color-text-secondary)' }}>
              No campaigns found
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}