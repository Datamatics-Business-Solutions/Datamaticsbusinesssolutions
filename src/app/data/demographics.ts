// ============================================
// LEAD DEMOGRAPHICS (Geo + Industry) — manual entry store
// --------------------------------------------
// Convertr's API does not return geo / industry breakdowns, so an
// Ops or Campaign Manager enters them by hand in the Demographics
// Entry module. Data is persisted to localStorage and read back by
// the client-facing Reports page — exactly the same proven pattern
// used by the Campaign Metrics Override.
//
// IMPORTANT DESIGN NOTES
//  - We store COUNTS, not percentages. Percentages are derived at
//    render time. This is what lets the "All Campaigns" view be an
//    accurate weighted aggregate (sum of counts), instead of the
//    mathematically-wrong average-of-percentages.
//  - "All Campaigns" ('all') is ALWAYS computed, never stored.
//  - The campaign keys here must match the <option> values in the
//    Reports page "Filter by Campaign" dropdown.
// ============================================

export const GEO_REGIONS = ['North America', 'EMEA', 'APAC', 'LATAM', 'Other'] as const;

export const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Financial Services',
  'Manufacturing',
  'Retail',
  'Other',
] as const;

// Must match the Reports page dropdown options (excluding 'all').
export const REPORT_CAMPAIGNS = [
  'IT Security',
  'Healthcare Synd.',
  'Financial BANT',
  'SaaS Appts',
] as const;

export type Counts = Record<string, number>;

export interface DemographicEntry {
  geo: Counts;
  industry: Counts;
}

export interface ChartPoint {
  name: string;
  count: number;
  percentage: number;
}

const STORAGE_KEY = 'datamatics-demographics-overrides';

// Seed data so the charts are never empty before anyone enters values.
const SEED: Record<string, DemographicEntry> = {
  'IT Security': {
    geo: { 'North America': 180, EMEA: 80, APAC: 40, LATAM: 15, Other: 5 },
    industry: { Technology: 140, 'Financial Services': 60, Healthcare: 50, Manufacturing: 40, Retail: 20, Other: 10 },
  },
  'Healthcare Synd.': {
    geo: { 'North America': 120, EMEA: 60, APAC: 30, LATAM: 10, Other: 5 },
    industry: { Healthcare: 150, Technology: 30, 'Financial Services': 20, Manufacturing: 10, Retail: 5, Other: 10 },
  },
  'Financial BANT': {
    geo: { 'North America': 90, EMEA: 70, APAC: 25, LATAM: 8, Other: 7 },
    industry: { 'Financial Services': 130, Technology: 35, Healthcare: 15, Manufacturing: 8, Retail: 5, Other: 7 },
  },
  'SaaS Appts': {
    geo: { 'North America': 60, EMEA: 30, APAC: 20, LATAM: 5, Other: 5 },
    industry: { Technology: 70, 'Financial Services': 25, Healthcare: 12, Manufacturing: 6, Retail: 4, Other: 3 },
  },
};

function readStore(): Record<string, DemographicEntry> {
  try {
    const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    return saved ? JSON.parse(saved) : {};
  } catch (e) {
    console.error('Failed to read demographics store:', e);
    return {};
  }
}

/** Raw counts for a single campaign key (stored value wins over seed). */
export function getEntry(campaignKey: string): DemographicEntry {
  const store = readStore();
  const seed = SEED[campaignKey];
  const stored = store[campaignKey];
  return {
    geo: { ...(seed?.geo ?? {}), ...(stored?.geo ?? {}) },
    industry: { ...(seed?.industry ?? {}), ...(stored?.industry ?? {}) },
  };
}

/** Persist counts for one campaign. Percentages are NOT stored. */
export function saveDemographics(campaignKey: string, entry: DemographicEntry): void {
  try {
    const store = readStore();
    store[campaignKey] = entry;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (e) {
    console.error('Failed to save demographics:', e);
  }
}

function toChartPoints(counts: Counts, order: readonly string[]): ChartPoint[] {
  const total = order.reduce((sum, k) => sum + (counts[k] || 0), 0);
  return order
    .map((name) => {
      const count = counts[name] || 0;
      const percentage = total > 0 ? Math.round((count / total) * 1000) / 10 : 0;
      return { name, count, percentage };
    })
    .filter((p) => p.count > 0)
    .sort((a, b) => b.count - a.count);
}

/**
 * Chart-ready demographics for a campaign key, or computed aggregate
 * when key === 'all'. Returns geo + industry as sorted ChartPoints.
 */
export function getCampaignDemographics(campaignKey: string): {
  geo: ChartPoint[];
  industry: ChartPoint[];
} {
  if (campaignKey === 'all') {
    const geoTotals: Counts = {};
    const indTotals: Counts = {};
    REPORT_CAMPAIGNS.forEach((key) => {
      const e = getEntry(key);
      GEO_REGIONS.forEach((g) => (geoTotals[g] = (geoTotals[g] || 0) + (e.geo[g] || 0)));
      INDUSTRIES.forEach((i) => (indTotals[i] = (indTotals[i] || 0) + (e.industry[i] || 0)));
    });
    return {
      geo: toChartPoints(geoTotals, GEO_REGIONS),
      industry: toChartPoints(indTotals, INDUSTRIES),
    };
  }

  const e = getEntry(campaignKey);
  return {
    geo: toChartPoints(e.geo, GEO_REGIONS),
    industry: toChartPoints(e.industry, INDUSTRIES),
  };
}
