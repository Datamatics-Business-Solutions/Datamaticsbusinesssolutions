// ============================================
// MOCK CLIENT DATA - Used across all roles
// ============================================

export type LeadAcceptanceMethod = 'convertr' | 'csv_manual' | 'portal_review';

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
  leadAcceptanceMethod: LeadAcceptanceMethod;
  campaigns: Campaign[];
}

export interface DeliverySchedule {
  date: string; // ISO date string
  leadsDelivered: number;
  status: 'completed' | 'upcoming';
  dayOfWeek: string;
}

export interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed' | 'pending_approval';
  totalLeads: number;
  leadsThisMonth: number;
  acceptanceRate: number;
  lastActivity: string;
  target?: number;
  delivered?: number;
  startDate?: string;
  endDate?: string;
  budget?: number;
  goalLeads?: number;
  deliveredLeads?: number;
  deliverySchedule?: DeliverySchedule[];
  deliveryDays?: string[];
  leadsPerDelivery?: number;
  outreachMetrics?: {
    emailsSent: number;
    emailsOpened: number;
    emailsClicked: number;
    openRate: number;
    clickRate: number;
  };
  convertrMetrics?: {
    uploadedLeads: number;
    acceptedLeads: number;
  };
}

// ─── 5 Clients with multiple campaigns each ───────────────────────────────────
export const allClients: Client[] = [
  // ── Client 1: Intentsify (Technology) ─────────────────────────────────────
  {
    id: 'client_1',
    companyName: 'Intentsify',
    industry: 'Technology',
    status: 'active',
    totalLeads: 1920,
    leadsThisMonth: 830,
    campaignManager: 'Anish Akkoat',
    campaignManagerEmail: 'anish.akkoat@datamaticsbpm.com',
    backupManager: 'Arjun Patel',
    backupManagerEmail: 'arjun.patel@datamaticsbpm.com',
    lastActivity: '2026-05-22T14:30:00Z',
    unreadNotifications: 4,
    leadAcceptanceMethod: 'convertr',
    campaigns: [
      {
        id: 'camp_1a',
        name: 'Enterprise IT Security – US Q2 2026',
        status: 'active',
        totalLeads: 680,
        leadsThisMonth: 380,
        acceptanceRate: 89,
        lastActivity: '2026-05-22T14:30:00Z',
        target: 1000,
        delivered: 680,
        startDate: 'Apr 15, 2026',
        endDate: 'Jul 15, 2026',
        budget: 85000,
        goalLeads: 1000,
        deliveredLeads: 680,
        deliverySchedule: [
          { date: '2026-04-20T00:00:00Z', leadsDelivered: 150, status: 'completed', dayOfWeek: 'Monday' },
          { date: '2026-04-23T00:00:00Z', leadsDelivered: 150, status: 'completed', dayOfWeek: 'Thursday' },
          { date: '2026-05-04T00:00:00Z', leadsDelivered: 150, status: 'completed', dayOfWeek: 'Monday' },
          { date: '2026-05-11T00:00:00Z', leadsDelivered: 130, status: 'completed', dayOfWeek: 'Monday' },
          { date: '2026-05-18T00:00:00Z', leadsDelivered: 100, status: 'completed', dayOfWeek: 'Monday' },
          { date: '2026-05-21T00:00:00Z', leadsDelivered: 150, status: 'upcoming', dayOfWeek: 'Thursday' },
          { date: '2026-05-25T00:00:00Z', leadsDelivered: 150, status: 'upcoming', dayOfWeek: 'Monday' },
          { date: '2026-06-01T00:00:00Z', leadsDelivered: 120, status: 'upcoming', dayOfWeek: 'Monday' },
        ],
        deliveryDays: ['Monday', 'Thursday'],
        leadsPerDelivery: 150,
        outreachMetrics: {
          emailsSent: 24350,
          emailsOpened: 6939,
          emailsClicked: 1022,
          openRate: 28.5,
          clickRate: 4.2,
        },
      },
      {
        id: 'camp_1b',
        name: 'APAC Cloud Migration Leads – Q2 2026',
        status: 'active',
        totalLeads: 500,
        leadsThisMonth: 250,
        acceptanceRate: 82,
        lastActivity: '2026-05-21T09:00:00Z',
        target: 600,
        delivered: 500,
        startDate: 'Apr 1, 2026',
        endDate: 'Jul 31, 2026',
        budget: 48000,
        goalLeads: 600,
        deliveredLeads: 500,
        deliverySchedule: [
          { date: '2026-04-07T00:00:00Z', leadsDelivered: 125, status: 'completed', dayOfWeek: 'Tuesday' },
          { date: '2026-04-21T00:00:00Z', leadsDelivered: 125, status: 'completed', dayOfWeek: 'Tuesday' },
          { date: '2026-05-05T00:00:00Z', leadsDelivered: 125, status: 'completed', dayOfWeek: 'Tuesday' },
          { date: '2026-05-19T00:00:00Z', leadsDelivered: 125, status: 'completed', dayOfWeek: 'Tuesday' },
          { date: '2026-05-26T00:00:00Z', leadsDelivered: 100, status: 'upcoming', dayOfWeek: 'Tuesday' },
        ],
        deliveryDays: ['Tuesday'],
        leadsPerDelivery: 125,
        outreachMetrics: {
          emailsSent: 14500,
          emailsOpened: 3480,
          emailsClicked: 507,
          openRate: 24.0,
          clickRate: 3.5,
        },
      },
      {
        id: 'camp_1c',
        name: 'Q4 2025 Cybersecurity Awareness Campaign',
        status: 'completed',
        totalLeads: 540,
        leadsThisMonth: 0,
        acceptanceRate: 91,
        lastActivity: '2025-12-31T23:59:00Z',
        target: 500,
        delivered: 540,
        startDate: 'Oct 1, 2025',
        endDate: 'Dec 31, 2025',
        budget: 45000,
        goalLeads: 500,
        deliveredLeads: 540,
        deliverySchedule: [
          { date: '2025-10-15T00:00:00Z', leadsDelivered: 180, status: 'completed', dayOfWeek: 'Wednesday' },
          { date: '2025-11-15T00:00:00Z', leadsDelivered: 180, status: 'completed', dayOfWeek: 'Saturday' },
          { date: '2025-12-15T00:00:00Z', leadsDelivered: 180, status: 'completed', dayOfWeek: 'Monday' },
        ],
        deliveryDays: ['Wednesday'],
        leadsPerDelivery: 180,
      },
      {
        id: 'camp_1d',
        name: 'AI-Powered SaaS Lead Generation Q2 2026',
        status: 'pending_approval',
        totalLeads: 0,
        leadsThisMonth: 0,
        acceptanceRate: 0,
        lastActivity: '2026-05-21T10:00:00Z',
        target: 400,
        delivered: 0,
        startDate: 'May 1, 2026',
        endDate: 'Jul 31, 2026',
        budget: 22000,
        goalLeads: 400,
        deliveredLeads: 0,
        deliverySchedule: [],
        deliveryDays: ['Monday'],
        leadsPerDelivery: 100,
      },
      {
        id: 'camp_1e',
        name: 'Enterprise Cyber Threat Intelligence – US Q2 2026',
        status: 'active',
        totalLeads: 200,
        leadsThisMonth: 200,
        acceptanceRate: 92,
        lastActivity: '2026-05-22T08:00:00Z',
        target: 500,
        delivered: 200,
        startDate: 'May 1, 2026',
        endDate: 'Aug 31, 2026',
        budget: 35000,
        goalLeads: 500,
        deliveredLeads: 200,
        deliverySchedule: [
          { date: '2026-05-07T00:00:00Z', leadsDelivered: 100, status: 'completed', dayOfWeek: 'Thursday' },
          { date: '2026-05-14T00:00:00Z', leadsDelivered: 100, status: 'completed', dayOfWeek: 'Thursday' },
          { date: '2026-05-21T00:00:00Z', leadsDelivered: 100, status: 'upcoming', dayOfWeek: 'Thursday' },
          { date: '2026-05-28T00:00:00Z', leadsDelivered: 100, status: 'upcoming', dayOfWeek: 'Thursday' },
          { date: '2026-06-04T00:00:00Z', leadsDelivered: 100, status: 'upcoming', dayOfWeek: 'Thursday' },
        ],
        deliveryDays: ['Thursday'],
        leadsPerDelivery: 100,
        outreachMetrics: {
          emailsSent: 8200,
          emailsOpened: 2460,
          emailsClicked: 380,
          openRate: 30.0,
          clickRate: 4.6,
        },
      },
    ],
  },

  // ── Client 2: TechCo Ltd (SaaS) ──────────────────────────────────────────
  {
    id: 'client_2',
    companyName: 'TechCo Ltd',
    industry: 'SaaS',
    status: 'active',
    totalLeads: 2338,
    leadsThisMonth: 833,
    campaignManager: 'Anish Akkoat',
    campaignManagerEmail: 'anish.akkoat@datamaticsbpm.com',
    backupManager: 'Arjun Patel',
    backupManagerEmail: 'arjun.patel@datamaticsbpm.com',
    lastActivity: '2026-05-22T09:15:00Z',
    unreadNotifications: 2,
    leadAcceptanceMethod: 'csv_manual',
    campaigns: [
      {
        id: 'camp_2a',
        name: 'Enterprise Outreach – North America Q2 2026',
        status: 'active',
        totalLeads: 1203,
        leadsThisMonth: 603,
        acceptanceRate: 76,
        lastActivity: '2026-05-22T09:15:00Z',
        target: 1500,
        delivered: 1203,
        startDate: 'Apr 8, 2026',
        endDate: 'Jul 15, 2026',
        budget: 120000,
        goalLeads: 1500,
        deliveredLeads: 1203,
        deliverySchedule: [
          { date: '2026-04-13T00:00:00Z', leadsDelivered: 300, status: 'completed', dayOfWeek: 'Monday' },
          { date: '2026-04-27T00:00:00Z', leadsDelivered: 300, status: 'completed', dayOfWeek: 'Monday' },
          { date: '2026-05-11T00:00:00Z', leadsDelivered: 300, status: 'completed', dayOfWeek: 'Monday' },
          { date: '2026-05-18T00:00:00Z', leadsDelivered: 303, status: 'completed', dayOfWeek: 'Monday' },
          { date: '2026-05-25T00:00:00Z', leadsDelivered: 297, status: 'upcoming', dayOfWeek: 'Monday' },
        ],
        deliveryDays: ['Monday'],
        leadsPerDelivery: 300,
        outreachMetrics: {
          emailsSent: 38200,
          emailsOpened: 11842,
          emailsClicked: 1719,
          openRate: 31.0,
          clickRate: 4.5,
        },
      },
      {
        id: 'camp_2b',
        name: 'SMB SaaS Decision Makers – EMEA 2026',
        status: 'active',
        totalLeads: 905,
        leadsThisMonth: 0,
        acceptanceRate: 69,
        lastActivity: '2026-02-20T11:00:00Z',
        target: 800,
        delivered: 905,
        startDate: 'Nov 1, 2025',
        endDate: 'Feb 28, 2026',
        budget: 72000,
        goalLeads: 800,
        deliveredLeads: 905,
        deliverySchedule: [
          { date: '2025-11-15T00:00:00Z', leadsDelivered: 220, status: 'completed', dayOfWeek: 'Saturday' },
          { date: '2025-12-15T00:00:00Z', leadsDelivered: 220, status: 'completed', dayOfWeek: 'Monday' },
          { date: '2026-01-15T00:00:00Z', leadsDelivered: 230, status: 'completed', dayOfWeek: 'Thursday' },
          { date: '2026-02-15T00:00:00Z', leadsDelivered: 235, status: 'completed', dayOfWeek: 'Sunday' },
        ],
        deliveryDays: ['Friday'],
        leadsPerDelivery: 220,
      },
      {
        id: 'camp_2c',
        name: 'APAC SaaS Appointment Setting – Q2 2026',
        status: 'active',
        totalLeads: 80,
        leadsThisMonth: 80,
        acceptanceRate: 85,
        lastActivity: '2026-05-20T08:00:00Z',
        target: 80,
        delivered: 80,
        startDate: 'Apr 1, 2026',
        endDate: 'Jun 30, 2026',
        budget: 16000,
        goalLeads: 80,
        deliveredLeads: 80,
        deliverySchedule: [
          { date: '2026-05-13T00:00:00Z', leadsDelivered: 40, status: 'completed', dayOfWeek: 'Wednesday' },
          { date: '2026-05-20T00:00:00Z', leadsDelivered: 40, status: 'completed', dayOfWeek: 'Wednesday' },
          { date: '2026-05-27T00:00:00Z', leadsDelivered: 40, status: 'upcoming', dayOfWeek: 'Wednesday' },
        ],
        deliveryDays: ['Wednesday'],
        leadsPerDelivery: 40,
      },
      {
        id: 'camp_2d',
        name: 'Enterprise HR SaaS Pilot – North America 2026',
        status: 'active',
        totalLeads: 150,
        leadsThisMonth: 150,
        acceptanceRate: 80,
        lastActivity: '2026-05-22T09:00:00Z',
        target: 300,
        delivered: 150,
        startDate: 'May 1, 2026',
        endDate: 'Aug 31, 2026',
        budget: 45000,
        goalLeads: 300,
        deliveredLeads: 150,
        deliverySchedule: [
          { date: '2026-05-08T00:00:00Z', leadsDelivered: 75, status: 'completed', dayOfWeek: 'Friday' },
          { date: '2026-05-15T00:00:00Z', leadsDelivered: 75, status: 'completed', dayOfWeek: 'Friday' },
          { date: '2026-05-22T00:00:00Z', leadsDelivered: 75, status: 'upcoming', dayOfWeek: 'Friday' },
          { date: '2026-05-29T00:00:00Z', leadsDelivered: 75, status: 'upcoming', dayOfWeek: 'Friday' },
        ],
        deliveryDays: ['Friday'],
        leadsPerDelivery: 75,
      },
    ],
  },

  // ── Client 3: Meridian Group (Financial Services) ─────────────────────────
  {
    id: 'client_3',
    companyName: 'Meridian Group',
    industry: 'Financial Services',
    status: 'active',
    totalLeads: 815,
    leadsThisMonth: 310,
    campaignManager: 'Anish Akkoat',
    campaignManagerEmail: 'anish.akkoat@datamaticsbpm.com',
    backupManager: 'Arjun Patel',
    backupManagerEmail: 'arjun.patel@datamaticsbpm.com',
    lastActivity: '2026-05-21T16:45:00Z',
    unreadNotifications: 1,
    leadAcceptanceMethod: 'portal_review',
    campaigns: [
      {
        id: 'camp_3a',
        name: 'UK Banking Sector BANT Qualification – Q1 2026',
        status: 'active',
        totalLeads: 412,
        leadsThisMonth: 172,
        acceptanceRate: 74,
        lastActivity: '2026-05-11T16:45:00Z',
        target: 500,
        delivered: 412,
        startDate: 'Apr 1, 2026',
        endDate: 'Jul 31, 2026',
        budget: 60000,
        goalLeads: 500,
        deliveredLeads: 412,
        deliverySchedule: [
          { date: '2026-04-13T00:00:00Z', leadsDelivered: 120, status: 'completed', dayOfWeek: 'Monday' },
          { date: '2026-04-27T00:00:00Z', leadsDelivered: 120, status: 'completed', dayOfWeek: 'Monday' },
          { date: '2026-05-11T00:00:00Z', leadsDelivered: 172, status: 'completed', dayOfWeek: 'Monday' },
          { date: '2026-05-25T00:00:00Z', leadsDelivered: 88, status: 'upcoming', dayOfWeek: 'Monday' },
        ],
        deliveryDays: ['Monday'],
        leadsPerDelivery: 120,
      },
      {
        id: 'camp_3b',
        name: 'FinTech Decision Makers – DACH Region',
        status: 'paused',
        totalLeads: 245,
        leadsThisMonth: 0,
        acceptanceRate: 66,
        lastActivity: '2026-02-10T12:00:00Z',
        target: 400,
        delivered: 245,
        startDate: 'Jan 15, 2026',
        endDate: 'Apr 30, 2026',
        budget: 52000,
        goalLeads: 400,
        deliveredLeads: 245,
        deliverySchedule: [
          { date: '2026-01-19T00:00:00Z', leadsDelivered: 125, status: 'completed', dayOfWeek: 'Monday' },
          { date: '2026-02-02T00:00:00Z', leadsDelivered: 120, status: 'completed', dayOfWeek: 'Monday' },
          { date: '2026-03-02T00:00:00Z', leadsDelivered: 155, status: 'upcoming', dayOfWeek: 'Monday' },
        ],
        deliveryDays: ['Monday'],
        leadsPerDelivery: 125,
      },
      {
        id: 'camp_3c',
        name: 'APAC Appointment Setting – CloudTech Program',
        status: 'active',
        totalLeads: 58,
        leadsThisMonth: 38,
        acceptanceRate: 83,
        lastActivity: '2026-05-20T10:00:00Z',
        target: 60,
        delivered: 58,
        startDate: 'Mar 1, 2026',
        endDate: 'May 31, 2026',
        budget: 12000,
        goalLeads: 60,
        deliveredLeads: 58,
        deliverySchedule: [
          { date: '2026-04-15T00:00:00Z', leadsDelivered: 20, status: 'completed', dayOfWeek: 'Wednesday' },
          { date: '2026-05-13T00:00:00Z', leadsDelivered: 20, status: 'completed', dayOfWeek: 'Wednesday' },
          { date: '2026-05-20T00:00:00Z', leadsDelivered: 18, status: 'completed', dayOfWeek: 'Wednesday' },
          { date: '2026-05-27T00:00:00Z', leadsDelivered: 20, status: 'upcoming', dayOfWeek: 'Wednesday' },
        ],
        deliveryDays: ['Wednesday'],
        leadsPerDelivery: 20,
      },
      {
        id: 'camp_3d',
        name: 'EMEA FinTech Wealth Management – Q2 2026',
        status: 'active',
        totalLeads: 100,
        leadsThisMonth: 100,
        acceptanceRate: 88,
        lastActivity: '2026-05-21T08:00:00Z',
        target: 200,
        delivered: 100,
        startDate: 'May 1, 2026',
        endDate: 'Aug 31, 2026',
        budget: 38000,
        goalLeads: 200,
        deliveredLeads: 100,
        deliverySchedule: [
          { date: '2026-05-07T00:00:00Z', leadsDelivered: 50, status: 'completed', dayOfWeek: 'Thursday' },
          { date: '2026-05-14T00:00:00Z', leadsDelivered: 50, status: 'completed', dayOfWeek: 'Thursday' },
          { date: '2026-05-21T00:00:00Z', leadsDelivered: 50, status: 'upcoming', dayOfWeek: 'Thursday' },
          { date: '2026-05-28T00:00:00Z', leadsDelivered: 50, status: 'upcoming', dayOfWeek: 'Thursday' },
        ],
        deliveryDays: ['Thursday'],
        leadsPerDelivery: 50,
      },
    ],
  },

  // ── Client 4: Global Innovations Inc (Manufacturing) ─────────────────────
  {
    id: 'client_4',
    companyName: 'Global Innovations Inc',
    industry: 'Manufacturing',
    status: 'active',
    totalLeads: 1046,
    leadsThisMonth: 571,
    campaignManager: 'Michael Chen',
    campaignManagerEmail: 'michael.chen@datamaticsbpm.com',
    backupManager: 'Emily Rodriguez',
    backupManagerEmail: 'emily.rodriguez@datamaticsbpm.com',
    lastActivity: '2026-05-22T11:20:00Z',
    unreadNotifications: 3,
    leadAcceptanceMethod: 'convertr',
    campaigns: [
      {
        id: 'camp_4a',
        name: 'Manufacturing Leads – North America Q1 2026',
        status: 'active',
        totalLeads: 623,
        leadsThisMonth: 273,
        acceptanceRate: 78,
        lastActivity: '2026-05-18T11:20:00Z',
        target: 700,
        delivered: 623,
        startDate: 'Jan 20, 2026',
        endDate: 'Apr 20, 2026',
        budget: 62000,
        goalLeads: 700,
        deliveredLeads: 623,
        deliverySchedule: [
          { date: '2026-04-13T00:00:00Z', leadsDelivered: 175, status: 'completed', dayOfWeek: 'Monday' },
          { date: '2026-04-27T00:00:00Z', leadsDelivered: 175, status: 'completed', dayOfWeek: 'Monday' },
          { date: '2026-05-11T00:00:00Z', leadsDelivered: 175, status: 'completed', dayOfWeek: 'Monday' },
          { date: '2026-05-18T00:00:00Z', leadsDelivered: 98, status: 'completed', dayOfWeek: 'Monday' },
          { date: '2026-05-25T00:00:00Z', leadsDelivered: 77, status: 'upcoming', dayOfWeek: 'Monday' },
        ],
        deliveryDays: ['Monday'],
        leadsPerDelivery: 175,
      },
      {
        id: 'camp_4b',
        name: 'EMEA Industrial Automation – Double Touch',
        status: 'active',
        totalLeads: 353,
        leadsThisMonth: 228,
        acceptanceRate: 71,
        lastActivity: '2026-05-18T14:00:00Z',
        target: 500,
        delivered: 353,
        startDate: 'Feb 15, 2026',
        endDate: 'May 15, 2026',
        budget: 35000,
        goalLeads: 500,
        deliveredLeads: 353,
        deliverySchedule: [
          { date: '2026-04-20T00:00:00Z', leadsDelivered: 125, status: 'completed', dayOfWeek: 'Monday' },
          { date: '2026-05-04T00:00:00Z', leadsDelivered: 103, status: 'completed', dayOfWeek: 'Monday' },
          { date: '2026-05-18T00:00:00Z', leadsDelivered: 125, status: 'completed', dayOfWeek: 'Monday' },
          { date: '2026-05-25T00:00:00Z', leadsDelivered: 125, status: 'upcoming', dayOfWeek: 'Monday' },
          { date: '2026-06-01T00:00:00Z', leadsDelivered: 22, status: 'upcoming', dayOfWeek: 'Monday' },
        ],
        deliveryDays: ['Monday'],
        leadsPerDelivery: 125,
      },
      {
        id: 'camp_4c',
        name: 'Smart Factory IoT Integration – US Q2',
        status: 'active',
        totalLeads: 70,
        leadsThisMonth: 70,
        acceptanceRate: 82,
        lastActivity: '2026-05-22T09:00:00Z',
        target: 150,
        delivered: 70,
        startDate: 'May 1, 2026',
        endDate: 'Aug 31, 2026',
        budget: 25000,
        goalLeads: 150,
        deliveredLeads: 70,
        deliverySchedule: [
          { date: '2026-05-08T00:00:00Z', leadsDelivered: 35, status: 'completed', dayOfWeek: 'Friday' },
          { date: '2026-05-15T00:00:00Z', leadsDelivered: 35, status: 'completed', dayOfWeek: 'Friday' },
          { date: '2026-05-22T00:00:00Z', leadsDelivered: 40, status: 'upcoming', dayOfWeek: 'Friday' },
          { date: '2026-05-29T00:00:00Z', leadsDelivered: 40, status: 'upcoming', dayOfWeek: 'Friday' },
        ],
        deliveryDays: ['Friday'],
        leadsPerDelivery: 35,
      },
    ],
  },

  // ── Client 5: Nexus Enterprises (Healthcare) ─────────────────────────────
  {
    id: 'client_5',
    companyName: 'Nexus Enterprises',
    industry: 'Healthcare',
    status: 'active',
    totalLeads: 1957,
    leadsThisMonth: 625,
    campaignManager: 'Emily Rodriguez',
    campaignManagerEmail: 'emily.rodriguez@datamaticsbpm.com',
    backupManager: 'Michael Chen',
    backupManagerEmail: 'michael.chen@datamaticsbpm.com',
    lastActivity: '2026-05-22T08:30:00Z',
    unreadNotifications: 0,
    leadAcceptanceMethod: 'csv_manual',
    campaigns: [
      {
        id: 'camp_5a',
        name: 'Healthcare Provider Campaign – Q4 2025',
        status: 'completed',
        totalLeads: 892,
        leadsThisMonth: 0,
        acceptanceRate: 88,
        lastActivity: '2025-12-31T23:59:00Z',
        target: 900,
        delivered: 892,
        startDate: 'Oct 1, 2025',
        endDate: 'Dec 31, 2025',
        budget: 95000,
        goalLeads: 900,
        deliveredLeads: 892,
        deliverySchedule: [
          { date: '2025-10-15T00:00:00Z', leadsDelivered: 223, status: 'completed', dayOfWeek: 'Wednesday' },
          { date: '2025-11-01T00:00:00Z', leadsDelivered: 223, status: 'completed', dayOfWeek: 'Saturday' },
          { date: '2025-11-15T00:00:00Z', leadsDelivered: 223, status: 'completed', dayOfWeek: 'Saturday' },
          { date: '2025-12-15T00:00:00Z', leadsDelivered: 223, status: 'completed', dayOfWeek: 'Monday' },
        ],
        deliveryDays: ['Friday'],
        leadsPerDelivery: 223,
      },
      {
        id: 'camp_5b',
        name: 'Medical Device Decision Makers – US 2026',
        status: 'active',
        totalLeads: 675,
        leadsThisMonth: 325,
        acceptanceRate: 85,
        lastActivity: '2026-05-18T08:30:00Z',
        target: 750,
        delivered: 675,
        startDate: 'Jan 10, 2026',
        endDate: 'Apr 30, 2026',
        budget: 67500,
        goalLeads: 750,
        deliveredLeads: 675,
        deliverySchedule: [
          { date: '2026-04-13T00:00:00Z', leadsDelivered: 175, status: 'completed', dayOfWeek: 'Monday' },
          { date: '2026-04-27T00:00:00Z', leadsDelivered: 175, status: 'completed', dayOfWeek: 'Monday' },
          { date: '2026-05-11T00:00:00Z', leadsDelivered: 170, status: 'completed', dayOfWeek: 'Monday' },
          { date: '2026-05-18T00:00:00Z', leadsDelivered: 155, status: 'completed', dayOfWeek: 'Monday' },
          { date: '2026-05-25T00:00:00Z', leadsDelivered: 75, status: 'upcoming', dayOfWeek: 'Monday' },
        ],
        deliveryDays: ['Monday'],
        leadsPerDelivery: 175,
      },
      {
        id: 'camp_5c',
        name: 'Healthcare IT BANT Qualification – EMEA',
        status: 'active',
        totalLeads: 270,
        leadsThisMonth: 180,
        acceptanceRate: 79,
        lastActivity: '2026-05-18T15:00:00Z',
        target: 300,
        delivered: 270,
        startDate: 'Feb 1, 2026',
        endDate: 'May 31, 2026',
        budget: 42000,
        goalLeads: 300,
        deliveredLeads: 270,
        deliverySchedule: [
          { date: '2026-04-20T00:00:00Z', leadsDelivered: 90, status: 'completed', dayOfWeek: 'Monday' },
          { date: '2026-05-04T00:00:00Z', leadsDelivered: 90, status: 'completed', dayOfWeek: 'Monday' },
          { date: '2026-05-18T00:00:00Z', leadsDelivered: 90, status: 'completed', dayOfWeek: 'Monday' },
          { date: '2026-05-25T00:00:00Z', leadsDelivered: 30, status: 'upcoming', dayOfWeek: 'Monday' },
        ],
        deliveryDays: ['Monday'],
        leadsPerDelivery: 90,
      },
      {
        id: 'camp_5d',
        name: 'Healthcare Telehealth Systems – US Q2',
        status: 'active',
        totalLeads: 120,
        leadsThisMonth: 120,
        acceptanceRate: 83,
        lastActivity: '2026-05-22T08:00:00Z',
        target: 250,
        delivered: 120,
        startDate: 'May 1, 2026',
        endDate: 'Aug 31, 2026',
        budget: 40000,
        goalLeads: 250,
        deliveredLeads: 120,
        deliverySchedule: [
          { date: '2026-05-07T00:00:00Z', leadsDelivered: 60, status: 'completed', dayOfWeek: 'Thursday' },
          { date: '2026-05-14T00:00:00Z', leadsDelivered: 60, status: 'completed', dayOfWeek: 'Thursday' },
          { date: '2026-05-21T00:00:00Z', leadsDelivered: 60, status: 'upcoming', dayOfWeek: 'Thursday' },
          { date: '2026-05-28T00:00:00Z', leadsDelivered: 70, status: 'upcoming', dayOfWeek: 'Thursday' },
        ],
        deliveryDays: ['Thursday'],
        leadsPerDelivery: 60,
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
  const userEmailMap: Record<string, string> = {
    'manager_1': 'anish.akkoat@datamaticsbpm.com',
    'manager_2': 'michael.chen@datamaticsbpm.com',
    'backup_1': 'arjun.patel@datamaticsbpm.com',
    'backup_2': 'emily.rodriguez@datamaticsbpm.com',
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
  const activeCampaigns = allClients.reduce(
    (sum, c) => sum + c.campaigns.filter(camp => camp.status === 'active').length, 0
  );
  const totalCampaigns = allClients.reduce((sum, client) => sum + client.campaigns.length, 0);
  const totalLeadsDelivered = allClients.reduce((sum, client) => sum + client.totalLeads, 0);
  const totalLeadsThisMonth = allClients.reduce((sum, client) => sum + client.leadsThisMonth, 0);
  const teamMembers = 5;

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

export const recentUploadBatches: LeadUploadBatch[] = [
  {
    id: 'upload_001',
    campaignId: 'camp_1a',
    campaignName: 'Enterprise IT Security – US Q2 2026',
    clientId: 'client_1',
    clientName: 'Intentsify',
    uploadedBy: 'Anish Akkoat',
    uploadedAt: '2026-05-22T10:30:00Z',
    status: 'processing',
    fileName: 'intentsify_security_march_batch1.csv',
    totalRows: 450,
    processedRows: 287,
    successCount: 285,
    errorCount: 2,
    errorDetails: ['Row 45: Invalid email format', 'Row 123: Missing required field'],
  },
  {
    id: 'upload_002',
    campaignId: 'camp_2a',
    campaignName: 'Enterprise Outreach – North America Q2 2026',
    clientId: 'client_2',
    clientName: 'TechCo Ltd',
    uploadedBy: 'Arjun Patel',
    uploadedAt: '2026-05-22T09:15:00Z',
    status: 'completed',
    fileName: 'techco_na_batch5.xlsx',
    totalRows: 823,
    processedRows: 823,
    successCount: 820,
    errorCount: 3,
  },
  {
    id: 'upload_003',
    campaignId: 'camp_4a',
    campaignName: 'Manufacturing Leads – North America Q1 2026',
    clientId: 'client_4',
    clientName: 'Global Innovations Inc',
    uploadedBy: 'Michael Chen',
    uploadedAt: '2026-05-22T08:45:00Z',
    status: 'completed',
    fileName: 'global_innovations_batch4.csv',
    totalRows: 234,
    processedRows: 234,
    successCount: 234,
    errorCount: 0,
  },
  {
    id: 'upload_004',
    campaignId: 'camp_4b',
    campaignName: 'EMEA Industrial Automation – Double Touch',
    clientId: 'client_4',
    clientName: 'Global Innovations Inc',
    uploadedBy: 'Emily Rodriguez',
    uploadedAt: '2026-05-21T16:20:00Z',
    status: 'failed',
    fileName: 'emea_industrial_batch2.csv',
    totalRows: 156,
    processedRows: 45,
    successCount: 0,
    errorCount: 45,
    errorDetails: ['File format error: Invalid CSV structure', 'Multiple duplicate emails detected'],
  },
  {
    id: 'upload_005',
    campaignId: 'camp_5b',
    campaignName: 'Medical Device Decision Makers – US 2026',
    clientId: 'client_5',
    clientName: 'Nexus Enterprises',
    uploadedBy: 'Emily Rodriguez',
    uploadedAt: '2026-05-21T14:00:00Z',
    status: 'completed',
    fileName: 'nexus_medical_devices_batch3.xlsx',
    totalRows: 567,
    processedRows: 567,
    successCount: 565,
    errorCount: 2,
  },
  {
    id: 'upload_006',
    campaignId: 'camp_3a',
    campaignName: 'UK Banking Sector BANT Qualification – Q1 2026',
    clientId: 'client_3',
    clientName: 'Meridian Group',
    uploadedBy: 'Anish Akkoat',
    uploadedAt: '2026-05-20T13:00:00Z',
    status: 'completed',
    fileName: 'meridian_uk_bant_batch3.csv',
    totalRows: 172,
    processedRows: 172,
    successCount: 172,
    errorCount: 0,
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

// ============================================
// CAMPAIGN OVERRIDES PERSISTENCE (localStorage)
// ============================================

export function applyCampaignOverrides() {
  try {
    const saved = localStorage.getItem('datamatics-campaign-overrides');
    if (saved) {
      const overrides = JSON.parse(saved); // key: campaignId -> override fields
      allClients.forEach(client => {
        client.campaigns.forEach(campaign => {
          const o = overrides[campaign.id];
          if (o) {
            // Update base metrics
            if (o.deliveredLeads !== undefined) {
              campaign.delivered = o.deliveredLeads;
              campaign.deliveredLeads = o.deliveredLeads;
              campaign.totalLeads = o.deliveredLeads; // keep sync
            }
            if (o.targetLeads !== undefined) {
              campaign.target = o.targetLeads;
              campaign.goalLeads = o.targetLeads;
            }
            if (o.acceptanceRate !== undefined) {
              campaign.acceptanceRate = o.acceptanceRate;
            }
            
            // Update outreach metrics if they exist
            if (o.outreachMetrics) {
              campaign.outreachMetrics = {
                emailsSent: o.outreachMetrics.emailsSent,
                emailsOpened: o.outreachMetrics.emailsOpened,
                emailsClicked: o.outreachMetrics.emailsClicked,
                openRate: o.outreachMetrics.openRate,
                clickRate: o.outreachMetrics.clickRate,
              };
            }
            
            // Update convertr metrics
            if (o.convertrMetrics) {
              campaign.convertrMetrics = {
                uploadedLeads: o.convertrMetrics.uploadedLeads,
                acceptedLeads: o.convertrMetrics.acceptedLeads,
              };
            }
          }
        });
        
        // Recalculate client-level aggregate metrics based on campaigns
        client.totalLeads = client.campaigns.reduce((sum, camp) => sum + (camp.deliveredLeads || camp.delivered || camp.totalLeads || 0), 0);
      });
    }
  } catch (e) {
    console.error("Failed to apply campaign overrides:", e);
  }
}

export function saveCampaignOverride(campaignId: string, data: {
  deliveredLeads?: number;
  targetLeads?: number;
  acceptanceRate?: number;
  outreachMetrics?: {
    emailsSent: number;
    emailsOpened: number;
    emailsClicked: number;
    openRate: number;
    clickRate: number;
  };
  convertrMetrics?: {
    uploadedLeads: number;
    acceptedLeads: number;
  };
}) {
  try {
    const saved = localStorage.getItem('datamatics-campaign-overrides');
    const overrides = saved ? JSON.parse(saved) : {};
    overrides[campaignId] = {
      ...overrides[campaignId],
      ...data,
    };
    localStorage.setItem('datamatics-campaign-overrides', JSON.stringify(overrides));
    
    // Apply immediately to the in-memory array
    applyCampaignOverrides();
  } catch (e) {
    console.error("Failed to save campaign override:", e);
  }
}

// Automatically apply overrides on load if in browser environment
if (typeof window !== 'undefined') {
  applyCampaignOverrides();
}