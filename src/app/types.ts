export type CampaignStatus =
  | 'Not started'
  | 'In progress'
  | 'Paused'
  | 'Completed'
  | 'Under review'
  | 'Pending Approval'
  | 'Changes Requested'
  | 'Cancelled'
  | 'Accepted'
  | 'Pending'
  | 'Rejected'
  | 'Overdue';

export type ServiceType = 'Leads' | 'Content Syndication' | 'BANT' | 'Appointments' | 'Single Touch' | 'Double Touch' | 'Appointment Setting' | 'Custom';

export interface Campaign {
  id: string;
  name: string;
  clientCompany: string;
  serviceType: ServiceType;
  status: CampaignStatus;
  startDate: string;
  endDate: string;
  delivered: number;
  target: number;
  accepted: number;
  lastUpdated: string;
  geo: string;
  industry: string;
  revenueRange: string;
  employeeSize: string;
  jobTitles: string;
  pricingModel: string;
  clientDetails: {
    name: string;
    address: string;
    contact: string;
  };
  scopeOfWork: string[];
  terms: string;
}

// ─── Campaign Approval Workflow ───────────────────────────────────────────────
export type SubmissionStatus = 'Pending Approval' | 'Changes Requested' | 'Approved' | 'Declined';

export interface CampaignSubmission {
  id: string;
  campaignName: string;
  clientId: string;
  clientCompany: string;
  submittedBy: string;
  submittedAt: string; // ISO date
  assignedManager: string;
  assignedManagerEmail: string;
  status: SubmissionStatus;
  // Campaign spec
  serviceType: string;
  geography: string;
  locations: string[];
  targetLeads: number;
  cpl: number;
  jobTitles: string[];
  employeeSize: string;
  industry: string;
  additionalInfo?: string;
  // Ops feedback
  managerNotes?: string;
  reviewedAt?: string;
  reviewedBy?: string;
}
// ─────────────────────────────────────────────────────────────────────────────

export interface DailyProgress {
  date: string;
  leadsSourced: number;
  leadsValidated: number;
  leadsRejected: number;
  bantQualified: number;
  appointmentsSet: number;
}

export interface ActivityUpdate {
  title: string;
  message?: string;
  date: string;
  timestamp?: string;
  completed: boolean;
}