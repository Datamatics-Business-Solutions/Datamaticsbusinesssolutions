import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Upload,
  Settings,
  Edit,
  ChevronDown,
  Mail,
  Phone,
} from 'lucide-react';
import { motion } from 'motion/react';
import { AppLayout } from '../components/AppLayout';
import { mockTeamMembers } from '../mockData';
import { StatusBadge } from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { AnimatedCounter } from '../components/AnimatedCounter';

export default function TeamManagementPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedTeam = [...mockTeamMembers].sort((a, b) => {
    const aVal = a[sortField as keyof typeof a];
    const bVal = b[sortField as keyof typeof b];
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    
    return 0;
  });

  return (
    <AppLayout>
      <div className="max-w-[1440px] mx-auto px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 style={{ color: 'var(--color-text-primary)' }} className="mb-2">
            Team Management
          </h1>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
            Manage team members and permissions
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 stagger-children">
          <div className="kpi-card animate-slideInUp">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-info-bg)' }}>
                <Users className="w-5 h-5" style={{ color: 'var(--color-info)' }} />
              </div>
            </div>
            <div className="kpi-card__number"><AnimatedCounter value={mockTeamMembers.length} /></div>
            <div className="kpi-card__label">Team Members</div>
          </div>

          <div className="kpi-card animate-slideInUp">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-success-bg)' }}>
                <BarChart3 className="w-5 h-5" style={{ color: 'var(--color-success)' }} />
              </div>
            </div>
            <div className="kpi-card__number">
              <AnimatedCounter value={mockTeamMembers.filter(m => m.role === 'Campaign Manager').length} />
            </div>
            <div className="kpi-card__label">Managers</div>
          </div>

          <div className="kpi-card animate-slideInUp">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-primary-tint)' }}>
                <Upload className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
              </div>
            </div>
            <div className="kpi-card__number">
              <AnimatedCounter value={mockTeamMembers.filter(m => m.role === 'Campaign Backup').length} />
            </div>
            <div className="kpi-card__label">Backups</div>
          </div>

          <div className="kpi-card animate-slideInUp">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-warning-bg)' }}>
                <Settings className="w-5 h-5" style={{ color: 'var(--color-warning)' }} />
              </div>
            </div>
            <div className="kpi-card__number">
              <AnimatedCounter value={mockTeamMembers.filter(m => m.role === 'Operations Manager').length} />
            </div>
            <div className="kpi-card__label">Ops</div>
          </div>
        </div>

        {/* Team Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead style={{ background: 'var(--color-border-light)', borderBottom: '1px solid var(--color-border)' }}>
                <tr>
                  <th
                    className="text-left px-6 py-4 cursor-pointer hover:text-[var(--color-primary)]"
                    style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-wide)' }}
                    onClick={() => handleSort('name')}
                  >
                    Name
                  </th>
                  <th
                    className="text-left px-6 py-4"
                    style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-wide)' }}
                  >
                    Contact
                  </th>
                  <th
                    className="text-left px-6 py-4 cursor-pointer hover:text-[var(--color-primary)]"
                    style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-wide)' }}
                    onClick={() => handleSort('role')}
                  >
                    Role
                  </th>
                  <th
                    className="text-left px-6 py-4"
                    style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-wide)' }}
                  >
                    Clients
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
                {sortedTeam.map((member, index) => (
                  <motion.tr
                    key={member.email}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-[var(--color-border-light)] transition-colors"
                    style={{ borderBottom: '1px solid var(--color-border)' }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--color-primary)', color: 'white', fontWeight: 'var(--font-weight-semibold)' }}>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
                            {member.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                          <Mail className="w-3 h-3" />
                          {member.email}
                        </div>
                        <div className="flex items-center gap-2" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                          <Phone className="w-3 h-3" />
                          {member.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="badge badge-completed">{member.role}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>
                        {member.clientsAssigned} assigned
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button className="btn-ghost p-2">
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
