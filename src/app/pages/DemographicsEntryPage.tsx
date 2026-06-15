import { useState, useEffect, useMemo } from 'react';
import { AppLayout } from '../components/AppLayout';
import { useAuth } from '../context/AuthContext';
import { Globe, Building2, Users, IdCard, Save, Info, AlertTriangle, CheckCircle2, Target } from 'lucide-react';
import { toast } from 'sonner';
import {
  DIMENSIONS,
  REPORT_CAMPAIGNS,
  getEntry,
  saveDemographics,
  dimensionTotal,
  type Counts,
  type DemographicEntry,
  type DimensionKey,
} from '../data/demographics';

const DIM_ICON: Record<DimensionKey, any> = { geo: Globe, industry: Building2, size: Users, title: IdCard };
const DIM_CHIP: Record<DimensionKey, { bg: string; color: string }> = {
  geo: { bg: '#EEF0FE', color: '#4F46E5' },
  industry: { bg: '#E2F5F1', color: '#0F9488' },
  size: { bg: '#FBE7EC', color: '#BE123C' },
  title: { bg: '#FBF0DD', color: '#C2790B' },
};

function pct(value: number, total: number) {
  return total > 0 ? Math.round((value / total) * 1000) / 10 : 0;
}

function CountRow({ label, value, total, onChange }: { label: string; value: number; total: number; onChange: (v: number) => void; }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <label className="flex-1 text-sm" style={{ color: 'var(--color-text-primary)' }}>{label}</label>
      <span className="w-14 text-right text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>{pct(value, total)}%</span>
      <input
        type="number" min={0} value={value === 0 ? '' : value} placeholder="0"
        onChange={(e) => onChange(Math.max(0, parseInt(e.target.value) || 0))}
        className="input-base w-24 px-3 py-2 text-center text-sm font-semibold"
      />
    </div>
  );
}

export default function DemographicsEntryPage() {
  const { currentUser } = useAuth();
  const [selected, setSelected] = useState<string>(REPORT_CAMPAIGNS[0].key);
  const [entry, setEntry] = useState<DemographicEntry>(() => getEntry(REPORT_CAMPAIGNS[0].key));

  useEffect(() => { setEntry(getEntry(selected)); }, [selected]);

  const setDim = (dim: DimensionKey, option: string, v: number) =>
    setEntry((p) => ({ ...p, [dim]: { ...(p[dim] as Counts), [option]: v } }));
  const setPacing = (field: 'monthTarget' | 'monthDelivered', v: number) =>
    setEntry((p) => ({ ...p, pacing: { ...p.pacing, [field]: v } }));

  // Integrity: every lead has all four attributes, so the four dimension
  // totals should match. Surface any mismatch before it reaches the client.
  const totals = useMemo(
    () => DIMENSIONS.map((d) => ({ key: d.key, label: d.label, total: dimensionTotal(entry[d.key] as Counts, d.key) })),
    [entry],
  );
  const nonZero = totals.filter((t) => t.total > 0);
  const reference = nonZero.length ? Math.max(...nonZero.map((t) => t.total)) : 0;
  const mismatched = totals.filter((t) => t.total !== reference && reference > 0);
  const consistent = mismatched.length === 0 && reference > 0;

  const handleSave = () => {
    saveDemographics(selected, entry);
    toast.success(`${selected} demographics saved — now live on the client Reports page.`);
  };

  return (
    <AppLayout>
      <div className="max-w-[1100px] mx-auto page-content animate-fadeIn">
        <div className="mb-4">
          <h1 style={{ color: 'var(--color-text-primary)' }} className="mb-1">Lead Demographics</h1>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
            Manually enter Geo, Industry, Size &amp; Title breakdowns and this month&apos;s pacing per campaign. Convertr
            doesn&apos;t supply these, so they&apos;re entered here and surface read-only on the client Reports page.
          </p>
        </div>

        <div className="glass-card p-4 mb-4 flex gap-3" style={{ background: 'var(--background-muted)' }}>
          <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#BA2027]" />
          <div className="text-[13px] leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            Enter the <strong>number of leads</strong> for each option — percentages calculate automatically. The
            &quot;All campaigns&quot; client view is the sum of every campaign, so you only ever enter raw counts.
            Logged in as <strong>{currentUser.name}</strong>.
          </div>
        </div>

        {/* Campaign selector */}
        <div className="flex flex-wrap gap-2 mb-5">
          {REPORT_CAMPAIGNS.map((c) => {
            const active = c.key === selected;
            return (
              <button
                key={c.key}
                onClick={() => setSelected(c.key)}
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-all border flex items-center gap-2"
                style={{
                  background: active ? '#BA2027' : 'var(--color-surface)',
                  color: active ? '#fff' : 'var(--color-text-primary)',
                  borderColor: active ? '#BA2027' : 'var(--color-border)',
                }}
              >
                {c.key}
                <span
                  className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded"
                  style={{
                    background: active ? 'rgba(255,255,255,0.2)' : 'var(--background-muted)',
                    color: active ? '#fff' : 'var(--color-text-secondary)',
                  }}
                >
                  {c.status}
                </span>
              </button>
            );
          })}
        </div>

        {/* This month pacing */}
        <div className="glass-card p-5 mb-4">
          <h3 className="flex items-center gap-2 mb-3" style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)' }}>
            <Target className="w-4 h-4 text-[#BA2027]" /> This Month — Pacing
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--color-text-secondary)' }}>Month target</label>
              <input type="number" min={0} value={entry.pacing.monthTarget === 0 ? '' : entry.pacing.monthTarget} placeholder="0"
                onChange={(e) => setPacing('monthTarget', Math.max(0, parseInt(e.target.value) || 0))}
                className="input-base w-full px-3 py-2 text-sm font-semibold" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--color-text-secondary)' }}>Delivered so far</label>
              <input type="number" min={0} value={entry.pacing.monthDelivered === 0 ? '' : entry.pacing.monthDelivered} placeholder="0"
                onChange={(e) => setPacing('monthDelivered', Math.max(0, parseInt(e.target.value) || 0))}
                className="input-base w-full px-3 py-2 text-sm font-semibold" />
            </div>
          </div>
        </div>

        {/* Integrity banner */}
        <div
          className="rounded-xl p-4 mb-4 flex gap-3 items-start border"
          style={{
            background: consistent ? 'rgba(16,163,127,0.06)' : 'rgba(186,32,39,0.06)',
            borderColor: consistent ? 'rgba(16,163,127,0.3)' : 'rgba(186,32,39,0.3)',
          }}
        >
          {consistent ? <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-green-600" /> : <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#BA2027]" />}
          <div className="text-[13px] leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            {consistent ? (
              <span>All four dimensions total <strong>{reference.toLocaleString()}</strong> leads — consistent and ready to save.</span>
            ) : (
              <span>
                Totals don&apos;t match across dimensions. Every lead has a geo, industry, size and title, so all four should sum to the same number.{' '}
                {mismatched.map((m) => `${m.label.replace(' Distribution', '')}: ${m.total.toLocaleString()}`).join(' · ')}{' '}
                vs expected <strong>{reference.toLocaleString()}</strong>.
              </span>
            )}
          </div>
        </div>

        {/* Four dimension panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {DIMENSIONS.map(({ key, label, options }) => {
            const Icon = DIM_ICON[key];
            const counts = entry[key] as Counts;
            const total = dimensionTotal(counts, key);
            return (
              <div key={key} className="glass-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="flex items-center gap-2" style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)' }}>
                    <span className="flex items-center justify-center rounded-lg flex-shrink-0" style={{ width: 24, height: 24, background: DIM_CHIP[key].bg, color: DIM_CHIP[key].color }}>
                      <Icon className="w-3.5 h-3.5" />
                    </span> {label}
                  </h3>
                  <span className="text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>{total.toLocaleString()} leads</span>
                </div>
                <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                  {options.map((opt) => (
                    <CountRow key={opt} label={opt} value={counts[opt] || 0} total={total} onChange={(v) => setDim(key, opt, v)} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end mt-5">
          <button onClick={handleSave} className="btn-primary px-6 py-3 flex items-center gap-2">
            <Save className="w-4 h-4" /> Save &amp; Sync to Client
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
