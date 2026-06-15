// ───────────────────────────────────────────────────────────────────────────
// Deterministic lead-data parser + learnable value map
//
// Reads rows from an uploaded delivery sheet and maps recognised values into the
// four demographic buckets used across the portal (geo / industry / size / title).
//
// "Deterministic": fixed rules, same input → same output. No model guessing.
// Anything the rules don't recognise is NOT silently dropped — it's surfaced as
// "unmapped" so an operator can map it once. That mapping is then LEARNED
// (persisted to localStorage) and applied automatically on every future upload.
//
// Two-phase value resolution, in priority order:
//   1. Learned map   (operator-confirmed mappings, persisted)
//   2. Seed map / rules  (geo+industry lookups, size bands, title seniority)
//   3. Unmapped      (returned for review)
// ───────────────────────────────────────────────────────────────────────────

import { type DimensionKey, type Counts } from './demographics';

// ── Column-header detection ────────────────────────────────────────────────
// Header wording varies between files, so each dimension carries synonyms.
// Exact match wins; otherwise the first header that *contains* a synonym.
const HEADER_SYNONYMS: Record<DimensionKey, string[]> = {
  geo: ['country', 'region', 'geo', 'location', 'market', 'territory'],
  industry: ['industry', 'vertical', 'sector'],
  size: ['employee size', 'company size', 'headcount', 'employees', 'employee count', 'size', 'staff'],
  title: ['job title', 'title', 'designation', 'role', 'position', 'seniority'],
};

// A column carrying a pre-aggregated quantity (so one row can mean "N leads").
const QTY_SYNONYMS = ['count', 'quantity', 'qty', 'volume', 'leads', 'number', 'total', 'delivered'];
// A column carrying an accept/reject disposition.
const STATUS_SYNONYMS = ['status', 'disposition', 'result', 'accepted', 'qa'];

// ── Seed value → bucket maps (lowercased keys) ──────────────────────────────
const SEED_VALUE_MAP: Record<DimensionKey, Record<string, string>> = {
  geo: {
    'united states': 'North America', 'united states of america': 'North America', usa: 'North America',
    us: 'North America', 'u.s.': 'North America', 'u.s.a.': 'North America', canada: 'North America',
    mexico: 'North America', 'north america': 'North America', na: 'North America', namer: 'North America',
    'united kingdom': 'EMEA', uk: 'EMEA', england: 'EMEA', germany: 'EMEA', france: 'EMEA', spain: 'EMEA',
    italy: 'EMEA', netherlands: 'EMEA', sweden: 'EMEA', ireland: 'EMEA', europe: 'EMEA', emea: 'EMEA',
    uae: 'EMEA', 'saudi arabia': 'EMEA', israel: 'EMEA', africa: 'EMEA', 'middle east': 'EMEA',
    india: 'APAC', china: 'APAC', japan: 'APAC', australia: 'APAC', singapore: 'APAC', 'new zealand': 'APAC',
    'south korea': 'APAC', indonesia: 'APAC', apac: 'APAC', asia: 'APAC',
    brazil: 'LATAM', argentina: 'LATAM', chile: 'LATAM', colombia: 'LATAM', peru: 'LATAM',
    latam: 'LATAM', 'latin america': 'LATAM', 'south america': 'LATAM',
  },
  industry: {
    technology: 'Technology', tech: 'Technology', software: 'Technology', saas: 'Technology',
    it: 'Technology', 'information technology': 'Technology', telecom: 'Technology', telecommunications: 'Technology',
    healthcare: 'Healthcare', health: 'Healthcare', pharma: 'Healthcare', pharmaceutical: 'Healthcare',
    pharmaceuticals: 'Healthcare', medical: 'Healthcare', biotech: 'Healthcare', 'life sciences': 'Healthcare',
    'financial services': 'Financial Services', finance: 'Financial Services', financial: 'Financial Services',
    fintech: 'Financial Services', banking: 'Financial Services', bank: 'Financial Services',
    insurance: 'Financial Services', 'capital markets': 'Financial Services',
    manufacturing: 'Manufacturing', industrial: 'Manufacturing', automotive: 'Manufacturing',
    aerospace: 'Manufacturing', 'oil and gas': 'Manufacturing', energy: 'Manufacturing',
    retail: 'Retail', ecommerce: 'Retail', 'e-commerce': 'Retail', cpg: 'Retail',
    'consumer goods': 'Retail', hospitality: 'Retail',
  },
  size: {}, // resolved by sizeBand()
  title: {}, // resolved by titleFamily()
};

// ── Size band rule ──────────────────────────────────────────────────────────
function sizeBand(raw: string): string | null {
  const s = raw.toLowerCase().replace(/,/g, '').trim();
  if (!s) return null;
  if (/enterprise/.test(s)) return 'Enterprise (10K+)';
  if (/\bsmb\b|small\b/.test(s)) return 'SMB (<100)';
  if (/mid.?market|medium/.test(s)) return 'Mid-Market';
  if (/large/.test(s)) return 'Large (1K-10K)';
  const nums = (s.match(/\d+/g) || []).map(Number);
  if (nums.length) {
    const n = Math.max(...nums);
    if (n >= 10000) return 'Enterprise (10K+)';
    if (n >= 1000) return 'Large (1K-10K)';
    if (n >= 100) return 'Mid-Market';
    return 'SMB (<100)';
  }
  return null;
}

// ── Title seniority rule (checked in priority order) ────────────────────────
const TITLE_RULES: { kw: RegExp; family: string }[] = [
  { kw: /\b(ceo|cfo|cto|cio|cmo|coo|cxo|chief|founder|co-founder|owner|president|partner|managing director)\b/, family: 'C-Level' },
  { kw: /\b(vp|svp|evp|avp|vice president|director|head)\b/, family: 'VP/Director' },
  { kw: /\b(manager|mgr|lead|supervisor)\b/, family: 'Manager' },
  { kw: /\b(specialist|senior|sr|engineer|analyst|architect|consultant|administrator|coordinator|associate|executive|officer)\b/, family: 'Senior Specialist' },
];
function titleFamily(raw: string): string | null {
  // Normalise so "Vice President" lands in VP/Director, not C-Level via "president".
  const s = raw.toLowerCase().replace(/vice president/g, 'vp');
  for (const r of TITLE_RULES) if (r.kw.test(s)) return r.family;
  return null;
}

// ── Learned map (persisted, operator-confirmed) ─────────────────────────────
const LS_LEARN = 'datamatics-lead-learned-map';
type LearnedMap = Record<DimensionKey, Record<string, string>>;
const EMPTY_LEARNED: LearnedMap = { geo: {}, industry: {}, size: {}, title: {} };

function readLearned(): LearnedMap {
  try {
    const saved = typeof window !== 'undefined' ? localStorage.getItem(LS_LEARN) : null;
    const parsed = saved ? JSON.parse(saved) : {};
    return { geo: {}, industry: {}, size: {}, title: {}, ...parsed };
  } catch {
    return { ...EMPTY_LEARNED };
  }
}

/** Persist an operator-confirmed mapping so it auto-applies on future uploads. */
export function learnValue(dim: DimensionKey, rawValue: string, bucket: string): void {
  try {
    const map = readLearned();
    map[dim] = { ...map[dim], [rawValue.trim().toLowerCase()]: bucket };
    localStorage.setItem(LS_LEARN, JSON.stringify(map));
  } catch (e) {
    console.error('Failed to persist learned mapping:', e);
  }
}

/** How many learned mappings exist (for "the system has learned N values" UI). */
export function learnedCount(): number {
  const map = readLearned();
  return (Object.keys(map) as DimensionKey[]).reduce((n, d) => n + Object.keys(map[d]).length, 0);
}

// ── Single-value resolution ─────────────────────────────────────────────────
export function mapValue(dim: DimensionKey, raw: string): string | null {
  const key = raw.trim().toLowerCase();
  if (!key) return null;
  const learned = readLearned()[dim];
  if (learned[key]) return learned[key];          // 1. learned wins
  if (dim === 'size') return sizeBand(raw);        // 2a. rules
  if (dim === 'title') return titleFamily(raw);    // 2b. rules
  const seed = SEED_VALUE_MAP[dim][key];           // 2c. exact seed
  if (seed) return seed;
  for (const [k, v] of Object.entries(SEED_VALUE_MAP[dim])) {   // 2d. contains
    if (key.includes(k)) return v;
  }
  return null;                                      // 3. unmapped
}

// ── Header detection ────────────────────────────────────────────────────────
export function detectHeaders(headers: string[]): Record<DimensionKey, string | null> {
  const result: Record<DimensionKey, string | null> = { geo: null, industry: null, size: null, title: null };
  const lower = headers.map((h) => ({ raw: h, low: String(h).toLowerCase().trim() }));
  (Object.keys(HEADER_SYNONYMS) as DimensionKey[]).forEach((dim) => {
    for (const syn of HEADER_SYNONYMS[dim]) {
      const hit = lower.find((h) => h.low === syn) || lower.find((h) => h.low.includes(syn));
      if (hit) { result[dim] = hit.raw; break; }
    }
  });
  return result;
}

function findHeader(headers: string[], synonyms: string[]): string | null {
  const lower = headers.map((h) => ({ raw: h, low: String(h).toLowerCase().trim() }));
  for (const syn of synonyms) {
    const hit = lower.find((h) => h.low === syn) || lower.find((h) => h.low.includes(syn));
    if (hit) return hit.raw;
  }
  return null;
}

// ── Parse result ──────────────────────────────────────────────────────────-
export interface ParseResult {
  counts: Record<DimensionKey, Counts>;
  unmapped: Record<DimensionKey, Record<string, number>>; // raw value → occurrences
  detected: Record<DimensionKey, string | null>;
  rowsParsed: number;
  rowsCounted: number;
  hasQtyColumn: boolean;
}

const emptyDimRecord = <T,>(): Record<DimensionKey, T> =>
  ({ geo: {} as T, industry: {} as T, size: {} as T, title: {} as T });

/**
 * Parse rows into bucket counts.
 * - If a quantity column exists, each row adds that quantity; otherwise +1 per row.
 * - With acceptedOnly + a status column, only accepted/valid rows are counted.
 */
export function parseRows(
  rows: Record<string, any>[],
  opts?: { acceptedOnly?: boolean },
): ParseResult {
  const counts = emptyDimRecord<Counts>();
  const unmapped = emptyDimRecord<Record<string, number>>();
  const headers = rows.length ? Object.keys(rows[0]) : [];
  const detected = detectHeaders(headers);
  const qtyHeader = findHeader(headers, QTY_SYNONYMS);
  const statusHeader = findHeader(headers, STATUS_SYNONYMS);
  let rowsCounted = 0;

  for (const row of rows) {
    if (opts?.acceptedOnly && statusHeader) {
      const sv = String(row[statusHeader] ?? '').toLowerCase();
      if (!/accept|valid|approv|qualif|good/.test(sv)) continue;
    }
    const qty = qtyHeader ? Number(String(row[qtyHeader]).replace(/[^0-9.-]/g, '')) || 0 : 1;
    if (qty <= 0) continue;
    rowsCounted += qty;

    (Object.keys(detected) as DimensionKey[]).forEach((dim) => {
      const header = detected[dim];
      if (!header) return;
      const rawVal = row[header];
      if (rawVal === undefined || rawVal === null || String(rawVal).trim() === '') return;
      const bucket = mapValue(dim, String(rawVal));
      if (bucket) {
        counts[dim][bucket] = (counts[dim][bucket] || 0) + qty;
      } else {
        const k = String(rawVal).trim();
        unmapped[dim][k] = (unmapped[dim][k] || 0) + qty;
      }
    });
  }

  return { counts, unmapped, detected, rowsParsed: rows.length, rowsCounted, hasQtyColumn: !!qtyHeader };
}

// ── Demo sample (used by the "Try a sample file" button before the real file) ─
export function sampleRows(): Record<string, any>[] {
  const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];
  const countries = ['United States', 'United States', 'Germany', 'United Kingdom', 'India', 'Japan', 'Brazil', 'Canada', 'Australia'];
  const industries = ['SaaS', 'Healthcare', 'Fintech', 'Manufacturing', 'Retail', 'Biotech', 'Logistics'];
  const sizes = ['250', '1,200', '15000', '80', '4500', 'Enterprise'];
  const titles = ['VP Marketing', 'CISO', 'IT Manager', 'Security Analyst', 'CEO', 'Head of Growth', 'Director of IT', 'Procurement Lead'];
  const statuses = ['Accepted', 'Accepted', 'Accepted', 'Accepted', 'Rejected'];
  const rows: Record<string, any>[] = [];
  for (let i = 0; i < 200; i++) {
    rows.push({
      Company: `Account ${i + 1}`,
      Country: pick(countries),
      Industry: pick(industries),
      'Employee Size': pick(sizes),
      'Job Title': pick(titles),
      Status: pick(statuses),
    });
  }
  return rows;
}
