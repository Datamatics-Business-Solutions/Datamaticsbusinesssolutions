// ============================================
// MOCK CLIENT DATA - Used across all roles
// ============================================

export interface Client {
  id: string;
  companyName: string;
  industry: string;
  status: 'active' | 'paused' | 'completed';
  totalLeads: number;
  leadsThisMonth: number;
  campaignManager: string;
  campaignManagerEmail: string;
  backupManager: string;
  backupManagerEmail: string;
  lastActivity: string; // ISO date string
  unreadNotifications: number;
  campaigns: Campaign[];
}

export interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed';
  totalLeads: number;
  leadsThisMonth: number;
  acceptanceRate: number;
  lastActivity: string;
}

// All 6 clients in the system
export const allClients: Client[] = [
  {
    id: 'client_1',
    companyName: 'Acme Corp',
    industry: 'Technology',
    status: 'active',
    totalLeads: 847,
    leadsThisMonth: 156,
    campaignManager: 'John Davies',
    campaignManagerEmail: 'john.davies@datamatics.com',
    backupManager: 'Lisa Park',
    backupManagerEmail: 'lisa.park@datamatics.com',
    lastActivity: '2026-02-28T14:30:00Z',
    unreadNotifications: 3,
    campaigns: [
      {
        id: 'camp_1',
        name: 'Q1 2026 Lead Generation',
        status: 'active',
        totalLeads: 847,
        leadsThisMonth: 156,
        acceptanceRate: 68,
        lastActivity: '2026-02-28T14:30:00Z',
      },
    ],
  },
  {
    id: 'client_2',
    companyName: 'TechCo Ltd',
    industry: 'SaaS',
    status: 'active',
    totalLeads: 1203,
    leadsThisMonth: 287,
    campaignManager: 'John Davies',
    campaignManagerEmail: 'john.davies@datamatics.com',
    backupManager: 'Lisa Park',
    backupManagerEmail: 'lisa.park@datamatics.com',
    lastActivity: '2026-02-28T09:15:00Z',
    unreadNotifications: 0,
    campaigns: [
      {
        id: 'camp_2',
        name: 'Enterprise Outreach Campaign',
        status: 'active',
        totalLeads: 1203,
        leadsThisMonth: 287,
        acceptanceRate: 72,
        lastActivity: '2026-02-28T09:15:00Z',
      },
    ],
  },
  {
    id: 'client_3',
    companyName: 'Meridian Group',
    industry: 'Financial Services',
    status: 'paused',
    totalLeads: 412,
    leadsThisMonth: 0,
    campaignManager: 'John Davies',
    campaignManagerEmail: 'john.davies@datamatics.com',
    backupManager: 'Lisa Park',
    backupManagerEmail: 'lisa.park@datamatics.com',
    lastActivity: '2026-02-15T16:45:00Z',
    unreadNotifications: 1,
    campaigns: [
      {
        id: 'camp_3',
        name: 'Financial Services Lead Gen',
        status: 'paused',
        totalLeads: 412,
        leadsThisMonth: 0,
        acceptanceRate: 65,
        lastActivity: '2026-02-15T16:45:00Z',
      },
    ],
  },
  {
    id: 'client_4',
    companyName: 'Global Innovations Inc',
    industry: 'Manufacturing',
    status: 'active',
    totalLeads: 623,
    leadsThisMonth: 142,
    campaignManager: 'Michael Chen',
    campaignManagerEmail: 'michael.chen@datamatics.com',
    backupManager: 'Emily Rodriguez',
    backupManagerEmail: 'emily.rodriguez@datamatics.com',
    lastActivity: '2026-02-27T11:20:00Z',
    unreadNotifications: 0,
    campaigns: [
      {
        id: 'camp_4',
        name: 'Manufacturing Leads Q1',
        status: 'active',
        totalLeads: 623,
        leadsThisMonth: 142,
        acceptanceRate: 70,
        lastActivity: '2026-02-27T11:20:00Z',
      },
    ],
  },
  {
    id: 'client_5',
    companyName: 'Nexus Enterprises',
    industry: 'Healthcare',
    status: 'completed',
    totalLeads: 892,
    leadsThisMonth: 0,
    campaignManager: 'Emily Rodriguez',
    campaignManagerEmail: 'emily.rodriguez@datamatics.com',
    backupManager: 'Michael Chen',
    backupManagerEmail: 'michael.chen@datamatics.com',
    lastActivity: '2026-01-31T23:59:00Z',
    unreadNotifications: 0,
    campaigns: [
      {
        id: 'camp_5',
        name: 'Healthcare Provider Campaign',
        status: 'completed',
        totalLeads: 892,
        leadsThisMonth: 0,
        acceptanceRate: 75,
        lastActivity: '2026-01-31T23:59:00Z',
      },
    ],
  },
  {
    id: 'client_6',
    companyName: 'Pinnacle Solutions',
    industry: 'Consulting',
    status: 'active',
    totalLeads: 534,
    leadsThisMonth: 98,
    campaignManager: 'Michael Chen',
    campaignManagerEmail: 'michael.chen@datamatics.com',
    backupManager: 'Emily Rodriguez',
    backupManagerEmail: 'emily.rodriguez@datamatics.com',
    lastActivity: '2026-02-28T08:45:00Z',
    unreadNotifications: 2,
    campaigns: [
      {
        id: 'camp_6',
        name: 'B2B Consulting Leads',
        status: 'active',
        totalLeads: 534,
        leadsThisMonth: 98,
        acceptanceRate: 69,
        lastActivity: '2026-02-28T08:45:00Z',
      },
    ],
  },
];

// Helper function: Get clients assigned to a specific user
export function getClientsForUser(userEmail: string): Client[] {
  return allClients.filter(
    (client) =>
      client.campaignManagerEmail === userEmail ||
      client.backupManagerEmail === userEmail
  );
}

// Helper function: Get clients assigned to a specific user by ID
export function getAssignedClients(userId: string): Array<{ id: string; name: string; status: string }> {
  // Map user IDs to their email addresses based on mock users
  const userEmailMap: Record<string, string> = {
    'manager_1': 'john.davies@datamatics.com',
    'manager_2': 'michael.chen@datamatics.com',
    'backup_1': 'lisa.park@datamatics.com',
    'backup_2': 'emily.rodriguez@datamatics.com',
  };

  const userEmail = userEmailMap[userId];
  if (!userEmail) return [];

  const clients = getClientsForUser(userEmail);
  return clients.map(client => ({
    id: client.id,
    name: client.companyName,
    status: client.status,
  }));
}

// Helper function: Get a single client by ID
export function getClientById(clientId: string): Client | undefined {
  return allClients.find((client) => client.id === clientId);
}

// Helper function: Get account team for a client
export function getAccountTeam(clientId: string) {
  const client = getClientById(clientId);
  if (!client) return null;

  return {
    manager: {
      name: client.campaignManager,
      email: client.campaignManagerEmail,
      role: 'Your Campaign Manager',
    },
    backup: {
      name: client.backupManager,
      email: client.backupManagerEmail,
      role: 'Your Campaign Backup',
    },
  };
}

// Aggregate stats for ops manager
export function getGlobalStats() {
  const totalClients = allClients.length;
  const activeCampaigns = allClients.filter((c) => c.status === 'active').length;
  const totalCampaigns = allClients.reduce((sum, client) => sum + client.campaigns.length, 0);
  const totalLeadsDelivered = allClients.reduce((sum, client) => sum + client.totalLeads, 0);
  const totalLeadsThisMonth = allClients.reduce(
    (sum, client) => sum + client.leadsThisMonth,
    0
  );
  const teamMembers = 5; // Fixed number based on business rules

  return {
    totalClients,
    activeCampaigns,
    totalCampaigns,
    totalLeadsDelivered,
    totalLeadsThisMonth,
    teamMembers,
  };
}

// Operations-focused lead upload tracking
export interface LeadUploadBatch {
  id: string;
  campaignId: string;
  campaignName: string;
  clientId: string;
  clientName: string;
  uploadedBy: string;
  uploadedAt: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  fileName: string;
  totalRows: number;
  processedRows: number;
  successCount: number;
  errorCount: number;
  errorDetails?: string[];
}

// Mock recent upload batches for operations tracking
export const recentUploadBatches: LeadUploadBatch[] = [
  {
    id: 'upload_001',
    campaignId: 'camp_1',
    campaignName: 'Q1 2026 Lead Generation',
    clientId: 'client_1',
    clientName: 'Acme Corp',
    uploadedBy: 'John Davies',
    uploadedAt: '2026-03-02T10:30:00Z',
    status: 'processing',
    fileName: 'acme_leads_march_batch1.csv',
    totalRows: 450,
    processedRows: 287,
    successCount: 285,
    errorCount: 2,
    errorDetails: ['Row 45: Invalid email format', 'Row 123: Missing required field'],
  },
  {
    id: 'upload_002',
    campaignId: 'camp_2',
    campaignName: 'Enterprise Outreach Campaign',
    clientId: 'client_2',
    clientName: 'TechCo Ltd',
    uploadedBy: 'Lisa Park',
    uploadedAt: '2026-03-02T09:15:00Z',
    status: 'completed',
    fileName: 'techco_batch_2.xlsx',
    totalRows: 823,
    processedRows: 823,
    successCount: 820,
    errorCount: 3,
  },
  {
    id: 'upload_003',
    campaignId: 'camp_4',
    campaignName: 'Manufacturing Leads Q1',
    clientId: 'client_4',
    clientName: 'Global Innovations Inc',
    uploadedBy: 'Michael Chen',
    uploadedAt: '2026-03-02T08:45:00Z',
    status: 'completed',
    fileName: 'global_innovations_leads.csv',
    totalRows: 234,
    processedRows: 234,
    successCount: 234,
    errorCount: 0,
  },
  {
    id: 'upload_004',
    campaignId: 'camp_6',
    campaignName: 'B2B Consulting Leads',
    clientId: 'client_6',
    clientName: 'Pinnacle Solutions',
    uploadedBy: 'Emily Rodriguez',
    uploadedAt: '2026-03-01T16:20:00Z',
    status: 'failed',
    fileName: 'pinnacle_january.csv',
    totalRows: 156,
    processedRows: 45,
    successCount: 0,
    errorCount: 45,
    errorDetails: ['File format error: Invalid CSV structure', 'Multiple duplicate emails detected'],
  },
  {
    id: 'upload_005',
    campaignId: 'camp_1',
    campaignName: 'Q1 2026 Lead Generation',
    clientId: 'client_1',
    clientName: 'Acme Corp',
    uploadedBy: 'John Davies',
    uploadedAt: '2026-03-01T14:00:00Z',
    status: 'completed',
    fileName: 'acme_feb_final.xlsx',
    totalRows: 567,
    processedRows: 567,
    successCount: 565,
    errorCount: 2,
  },
];

// Helper: Get pending uploads (for ops priority view)
export function getPendingUploads(): LeadUploadBatch[] {
  return recentUploadBatches.filter(u => u.status === 'pending' || u.status === 'processing');
}

// Helper: Get failed uploads (for ops to retry)
export function getFailedUploads(): LeadUploadBatch[] {
  return recentUploadBatches.filter(u => u.status === 'failed');
}