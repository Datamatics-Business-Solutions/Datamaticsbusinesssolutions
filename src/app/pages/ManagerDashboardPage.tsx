import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Bell, Upload, ChevronRight, TrendingUp, TrendingDown, Clock, Users } from 'lucide-react';
import { AppLayout } from '../components/AppLayout';
import { useAuth } from '../context/AuthContext';
import { getClientsForUser, Client } from '../data/mockClients';
import { LeadUploadModal } from '../components/LeadUploadModal';

export default function ManagerDashboardPage() {
  const { currentUser, canUploadLeads } = useAuth();
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Get clients assigned to this user
  const myClients = useMemo(() => getClientsForUser(currentUser.email), [currentUser.email]);

  // Select first client by default
  const selectedClient = useMemo(() => {
    if (!selectedClientId && myClients.length > 0) {
      setSelectedClientId(myClients[0].id);
      return myClients[0];
    }
    return myClients.find((c) => c.id === selectedClientId) || myClients[0];
  }, [selectedClientId, myClients]);

  if (!selectedClient) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-screen">
          <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text-secondary)' }}>No clients assigned</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-[1440px] mx-auto px-6 py-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
          <div>
            <h1 style={{ color: 'var(--color-text-primary)' }} className="mb-2">
              Campaign Manager Dashboard
            </h1>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
              Managing {myClients.length} client{myClients.length !== 1 ? 's' : ''}
            </p>
          </div>
          {canUploadLeads() && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="btn-primary px-4 py-2 flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload Leads
            </button>
          )}
        </div>

        {/* Client Selector */}
        <div className="mb-6">
          <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }} className="block mb-2">
            Select Client
          </label>
          <select
            value={selectedClientId || ''}
            onChange={(e) => setSelectedClientId(e.target.value)}
            className="input-base px-4 py-3 max-w-md"
          >
            {myClients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.companyName}
              </option>
            ))}
          </select>
        </div>

        {/* Client Overview */}
        <div className="glass-card p-6 mb-6">
          <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }} className="mb-4">
            {selectedClient.companyName}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-wide)' }} className="mb-1">
                Primary Contact
              </div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>
                {selectedClient.primaryContact.name}
              </div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                {selectedClient.primaryContact.email}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-wide)' }} className="mb-1">
                Active Campaigns
              </div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>
                {selectedClient.campaigns.filter(c => c.status === 'active').length} active
              </div>
            </div>

            <div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-wide)' }} className="mb-1">
                Total Leads
              </div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>
                {selectedClient.campaigns.reduce((sum, c) => sum + c.delivered, 0)} delivered
              </div>
            </div>
          </div>
        </div>

        {/* Campaigns */}
        <div className="glass-card p-6">
          <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }} className="mb-4">
            Campaigns
          </h2>

          <div className="space-y-3">
            {selectedClient.campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="flex items-center justify-between p-4 rounded-lg hover:scale-[1.01] transition-transform cursor-pointer"
                style={{ background: 'var(--color-border-light)' }}
              >
                <div className="flex-1">
                  <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
                    {campaign.name}
                  </div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }} className="mt-1">
                    {campaign.startDate} - {campaign.endDate}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
                      {campaign.delivered} / {campaign.target}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                      Delivered
                    </div>
                  </div>

                  <span className={`badge ${
                    campaign.status === 'active' ? 'badge-active' :
                    campaign.status === 'completed' ? 'badge-completed' :
                    'badge-paused'
                  }`}>
                    {campaign.status}
                  </span>

                  <ChevronRight className="w-5 h-5" style={{ color: 'var(--color-text-muted)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lead Upload Modal */}
      {showUploadModal && (
        <LeadUploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          clientId={selectedClient.id}
        />
      )}
    </AppLayout>
  );
}
