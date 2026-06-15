import { useState, useEffect, useMemo } from 'react';
import { AppLayout } from '../components/AppLayout';
import { useAuth } from '../context/AuthContext';
import { Globe, Building2, Save, Info } from 'lucide-react';
import { toast } from 'sonner';
import {
  GEO_REGIONS,
  INDUSTRIES,
  REPORT_CAMPAIGNS,
  getEntry,
  saveDemographics,
  type Counts,
} from '../data/demographics';

function sumCounts(counts: Counts, keys: readonly string[]) {
  return keys.reduce((s, k) => s + (Number(counts[k]) || 0), 0);
}

function pct(value: number, total: number) {
  return total > 0 ? Math.round((value / total) * 1000) / 10 : 0;
}

// A single editable metric row: label · number input · live percentage
function CountRow({
  label,
  value,
  total,
  onChange,
}: {
  label: string;
  value: number;
  total: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-3 py-2">
      <label className="flex-1 text-sm" style={{ color: 'var(--color-text-primary)' }}>
        {label}
      </label>
      <span
        className="w-14 text-right text-xs font-semibold"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        {pct(value, total)}%
      </span>
      <input
        type="number"
        min={0}
        value={value === 0 ? '' : value}
        placeholder="0"
        onChange={(e) => onChange(Math.max(0, parseInt(e.target.value) || 0))}
        className="input-base w-24 px-3 py-2 text-center text-sm font-semibold"
      />
    </div>
  );
}

export default function DemographicsEntryPage() {
  const { currentUser } = useAuth();
  const [selected, setSelected] = useState<string>(REPORT_CAMPAIGNS[0]);
  const [geo, setGeo] = useState<Counts>({});
  const [industry, setIndustry] = useState<Counts>({});

  // Load stored counts whenever the selected campaign changes.
  useEffect(() => {
    const entry = getEntry(selected);
    setGeo({ ...entry.geo });
    setIndustry({ ...entry.industry });
  }, [selected]);

  const geoTotal = useMemo(() => sumCounts(geo, GEO_REGIONS), [geo]);
  const indTotal = useMemo(() => sumCounts(industry, INDUSTRIES), [industry]);

  const handleSave = () => {
    saveDemographics(selected, { geo, industry });
    toast.success(`${selected} demographics saved — now live on the client Reports page.`);
  };

  return (
    <AppLayout>
      <div className="max-w-[1100px] mx-auto page-content animate-fadeIn">
        {/* Header */}
        <div className="mb-4">
          <h1 style={{ color: 'var(--color-text-primary)' }} className="mb-1">
            Lead Demographics
          </h1>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
            Manually enter Geo &amp; Industry breakdowns per campaign. Convertr doesn&apos;t supply these,
            so they&apos;re entered here and surface read-only on the client Reports page.
          </p>
        </div>

        {/* Info banner */}
        <div className="glass-card p-4 mb-4 flex gap-3" style={{ background: 'var(--background-muted)' }}>
          <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#BA2027]" />
          <div className="text-[13px] leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            Enter the <strong>number of leads</strong> for each region and industry — percentages are
            calculated automatically. The &quot;All Campaigns&quot; view on the client side is the sum of every
            campaign, so you only ever enter raw counts here. Logged in as <strong>{currentUser.name}</strong>.
          </div>
        </div>

        {/* Campaign selector pills */}
        <div className="flex flex-wrap gap-2 mb-5">
          {REPORT_CAMPAIGNS.map((c) => {
            const active = c === selected;
            return (
              <button
                key={c}
                onClick={() => setSelected(c)}
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-all border"
                style={{
                  background: active ? '#BA2027' : 'var(--color-surface)',
                  color: active ? '#fff' : 'var(--color-text-primary)',
                  borderColor: active ? '#BA2027' : 'var(--color-border)',
                }}
              >
                {c}
              </button>
            );
          })}
        </div>

        {/* Two entry panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Geo */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3
                className="flex items-center gap-2"
                style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)' }}
              >
                <Globe className="w-4 h-4 text-[#BA2027]" />
                Geographic Distribution
              </h3>
              <span className="text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
                {geoTotal.toLocaleString()} leads
              </span>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
              {GEO_REGIONS.map((region) => (
                <CountRow
                  key={region}
                  label={region}
                  value={geo[region] || 0}
                  total={geoTotal}
                  onChange={(v) => setGeo((p) => ({ ...p, [region]: v }))}
                />
              ))}
            </div>
          </div>

          {/* Industry */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3
                className="flex items-center gap-2"
                style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)' }}
              >
                <Building2 className="w-4 h-4 text-[#BA2027]" />
                Industry Distribution
              </h3>
              <span className="text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
                {indTotal.toLocaleString()} leads
              </span>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
              {INDUSTRIES.map((ind) => (
                <CountRow
                  key={ind}
                  label={ind}
                  value={industry[ind] || 0}
                  total={indTotal}
                  onChange={(v) => setIndustry((p) => ({ ...p, [ind]: v }))}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end mt-5">
          <button onClick={handleSave} className="btn-primary px-6 py-3 flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save &amp; Sync to Client
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
