export interface CampaignActivity {
  id: string;
  campaignId: string;
  type: 'delivery' | 'rejection' | 'replacement' | 'milestone' | 'status_change' | 'note';
  title: string;
  description: string;
  timestamp: string; // ISO date
  icon: 'truck' | 'x-circle' | 'refresh' | 'flag' | 'edit' | 'message';
}

export const campaignActivities: CampaignActivity[] = [
  // ─── camp_1a: Enterprise IT Security ─────────────────────────────────────
  {
    id: 'act_1', campaignId: 'camp_1a', type: 'delivery',
    title: '150 leads delivered',
    description: 'Batch #6 delivered — 150 validated leads uploaded and sent to client.',
    timestamp: '2026-03-02T14:30:00Z', icon: 'truck',
  },
  {
    id: 'act_2', campaignId: 'camp_1a', type: 'rejection',
    title: '12 leads rejected by client',
    description: 'Reasons: 5 wrong title, 4 out of geo, 3 duplicate entries.',
    timestamp: '2026-02-28T10:15:00Z', icon: 'x-circle',
  },
  {
    id: 'act_3', campaignId: 'camp_1a', type: 'replacement',
    title: '10 replacement leads delivered',
    description: 'Replacement batch for rejected leads from Feb 28. 2 remaining.',
    timestamp: '2026-03-01T09:00:00Z', icon: 'refresh',
  },
  {
    id: 'act_4', campaignId: 'camp_1a', type: 'milestone',
    title: 'Campaign reached 50% delivery',
    description: '500 of 1,000 target leads delivered. On track for Apr 15 deadline.',
    timestamp: '2026-02-20T16:00:00Z', icon: 'flag',
  },
  {
    id: 'act_5', campaignId: 'camp_1a', type: 'delivery',
    title: '130 leads delivered',
    description: 'Batch #5 delivered — 130 validated leads.',
    timestamp: '2026-02-16T11:45:00Z', icon: 'truck',
  },
  {
    id: 'act_6', campaignId: 'camp_1a', type: 'status_change',
    title: 'Campaign went live',
    description: 'Job card signed by all parties. Campaign is now active.',
    timestamp: '2026-01-15T08:00:00Z', icon: 'edit',
  },
  {
    id: 'act_7', campaignId: 'camp_1a', type: 'delivery',
    title: '150 leads delivered',
    description: 'Batch #4 — all QA checks passed.',
    timestamp: '2026-02-09T10:30:00Z', icon: 'truck',
  },
  {
    id: 'act_8', campaignId: 'camp_1a', type: 'note',
    title: 'Client requested additional BANT fields',
    description: 'John Carter requested adding "Budget Authority" and "Purchase Timeline" fields to lead format.',
    timestamp: '2026-02-05T14:20:00Z', icon: 'message',
  },

  // ─── camp_1b: APAC Cloud Migration ───────────────────────────────────────
  {
    id: 'act_9', campaignId: 'camp_1b', type: 'delivery',
    title: '120 leads delivered',
    description: 'Batch #3 — APAC region leads, focus on Japan and India.',
    timestamp: '2026-03-01T09:00:00Z', icon: 'truck',
  },
  {
    id: 'act_10', campaignId: 'camp_1b', type: 'milestone',
    title: 'Campaign reached 75% delivery',
    description: '374 of 500 target leads delivered.',
    timestamp: '2026-02-25T16:00:00Z', icon: 'flag',
  },
  {
    id: 'act_11', campaignId: 'camp_1b', type: 'rejection',
    title: '8 leads rejected',
    description: 'Reasons: 3 invalid email, 3 company size below threshold, 2 wrong industry.',
    timestamp: '2026-02-22T11:00:00Z', icon: 'x-circle',
  },
  {
    id: 'act_12', campaignId: 'camp_1b', type: 'replacement',
    title: '8 replacement leads delivered',
    description: 'All replacements for Feb 22 rejections delivered.',
    timestamp: '2026-02-24T10:00:00Z', icon: 'refresh',
  },

  // ─── camp_2a: Enterprise Outreach ────────────────────────────────────────
  {
    id: 'act_13', campaignId: 'camp_2a', type: 'delivery',
    title: '200 leads delivered',
    description: 'Batch #4 — North America enterprise segment.',
    timestamp: '2026-02-28T15:00:00Z', icon: 'truck',
  },
  {
    id: 'act_14', campaignId: 'camp_2a', type: 'milestone',
    title: 'Campaign reached 25% delivery',
    description: '345 of 1,200 target leads delivered.',
    timestamp: '2026-02-15T12:00:00Z', icon: 'flag',
  },

  // ─── camp_3a: UK Banking BANT ────────────────────────────────────────────
  {
    id: 'act_15', campaignId: 'camp_3a', type: 'delivery',
    title: '85 leads delivered',
    description: 'Batch #2 — UK banking sector BANT-qualified leads.',
    timestamp: '2026-02-27T10:00:00Z', icon: 'truck',
  },
  {
    id: 'act_16', campaignId: 'camp_3a', type: 'rejection',
    title: '5 leads rejected by client',
    description: 'Reasons: 3 missing BANT criteria, 2 already in CRM.',
    timestamp: '2026-02-25T14:30:00Z', icon: 'x-circle',
  },
];

export function getActivitiesForCampaign(campaignId: string): CampaignActivity[] {
  return campaignActivities
    .filter(a => a.campaignId === campaignId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

/**
 * Calculate lead replacement stats for a campaign
 */
export function getReplacementStats(campaignId: string) {
  const activities = campaignActivities.filter(a => a.campaignId === campaignId);

  // Count total rejected from rejection activities
  const rejections = activities.filter(a => a.type === 'rejection');
  const totalRejected = rejections.reduce((sum, a) => {
    const match = a.title.match(/(\d+)/);
    return sum + (match ? parseInt(match[1]) : 0);
  }, 0);

  // Count total replacements delivered
  const replacements = activities.filter(a => a.type === 'replacement');
  const totalReplaced = replacements.reduce((sum, a) => {
    const match = a.title.match(/(\d+)/);
    return sum + (match ? parseInt(match[1]) : 0);
  }, 0);

  return {
    totalRejected,
    totalReplaced,
    remaining: Math.max(0, totalRejected - totalReplaced),
    isFullyReplaced: totalReplaced >= totalRejected,
  };
}
