// Per-browser client dashboard metric visibility.
// Clients toggle which KPI cards show; the dashboard reflows with no gaps.
// (localStorage for now — moves to user settings on the backend later.)

export type DashMetricKey = 'totalLeads' | 'totalBusiness' | 'campaigns' | 'actionRequired';

export const DASH_METRICS: { key: DashMetricKey; label: string; description: string }[] = [
  { key: 'totalLeads', label: 'Total Leads', description: 'Leads delivered this month / year' },
  { key: 'totalBusiness', label: 'Total Business', description: 'Billable value (accepted × CPL)' },
  { key: 'campaigns', label: 'Campaigns', description: 'Live / completed campaign counts' },
  { key: 'actionRequired', label: 'Action Required', description: 'Pending invoices & signatures' },
];

export type DashPrefs = Record<DashMetricKey, boolean>;

const LS_KEY = 'datamatics-dashboard-prefs';
const EVENT = 'datamatics-dashboard-prefs-changed';

const DEFAULT_PREFS: DashPrefs = {
  totalLeads: true,
  totalBusiness: true,
  campaigns: true,
  actionRequired: true,
};

export function getDashPrefs(): DashPrefs {
  try {
    const saved = typeof window !== 'undefined' ? localStorage.getItem(LS_KEY) : null;
    return saved ? { ...DEFAULT_PREFS, ...JSON.parse(saved) } : { ...DEFAULT_PREFS };
  } catch {
    return { ...DEFAULT_PREFS };
  }
}

export function setDashMetric(key: DashMetricKey, visible: boolean): void {
  try {
    const next = { ...getDashPrefs(), [key]: visible };
    localStorage.setItem(LS_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent(EVENT));
  } catch (e) {
    console.error('Failed to save dashboard prefs:', e);
  }
}

/** Subscribe to changes (same-tab via CustomEvent, cross-tab via storage). */
export function subscribeDashPrefs(cb: () => void): () => void {
  window.addEventListener(EVENT, cb);
  window.addEventListener('storage', cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener('storage', cb);
  };
}
