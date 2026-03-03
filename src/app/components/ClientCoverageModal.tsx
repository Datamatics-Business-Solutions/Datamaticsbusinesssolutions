/**
 * ClientCoverageModal — Unified Client Assignment & Management Module
 *
 * Combines client assignment + backup coverage into one intelligent panel.
 * Shows urgency cues, health score, inline editable dropdowns, and change
 * tracking with a single "Save All" commit.
 */

import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Shield, AlertTriangle, CheckCircle2, AlertCircle,
  ChevronDown, Search, Zap, RotateCcw, Save,
  Building2, TrendingUp,
} from 'lucide-react';
import { Client } from '../data/mockClients';
import { TeamMember } from '../mockData';
import { PersonAvatar } from './PersonAvatar';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Draft {
  manager: string;
  backup: string;
}

type UrgencyLevel = 'high' | 'medium' | 'ok';
type FilterLevel  = 'all' | 'high' | 'medium' | 'ok';

interface UrgencyResult {
  level: UrgencyLevel;
  reasons: string[];
}

// ─── Urgency Engine ─────────────────────────────────────────────────────────────

/** Compute how many clients each person manages (as primary) given drafts */
function computeManagerLoads(
  clients: Client[],
  drafts: Record<string, Draft>,
): Record<string, number> {
  const loads: Record<string, number> = {};
  clients.forEach(c => {
    const mgr = drafts[c.id]?.manager ?? c.campaignManager;
    if (mgr && mgr !== '—') loads[mgr] = (loads[mgr] ?? 0) + 1;
  });
  return loads;
}

function computeBackupLoads(
  clients: Client[],
  drafts: Record<string, Draft>,
): Record<string, number> {
  const loads: Record<string, number> = {};
  clients.forEach(c => {
    const bak = drafts[c.id]?.backup ?? c.backupManager;
    if (bak && bak !== '—') loads[bak] = (loads[bak] ?? 0) + 1;
  });
  return loads;
}

function getUrgency(
  client: Client,
  drafts: Record<string, Draft>,
  mgrLoads: Record<string, number>,
): UrgencyResult {
  const manager = drafts[client.id]?.manager ?? client.campaignManager;
  const backup  = drafts[client.id]?.backup  ?? client.backupManager;

  const reasons: string[] = [];
  let level: UrgencyLevel = 'ok';

  const noBackup      = !backup || backup === '—' || backup.trim() === '';
  const sameAsMgr     = backup === manager;
  const mgrOverloaded = (mgrLoads[manager] ?? 0) > 3;

  if (noBackup)   { reasons.push('No backup assigned');                         level = 'high';   }
  if (sameAsMgr)  { reasons.push('Backup cannot be the same as manager');       level = 'high';   }
  if (mgrOverloaded && level === 'ok') {
    reasons.push(`Manager overloaded — handling ${mgrLoads[manager]} clients`);
    level = 'medium';
  }

  return { level, reasons };
}

// ─── Colour maps ────────────────────────────────────────────────────────────────

const URGENCY_BORDER: Record<UrgencyLevel, string> = {
  high:   '#DC2626',
  medium: '#D97706',
  ok:     '#10B981',
};

const URGENCY_BG: Record<UrgencyLevel, string> = {
  high:   'rgba(220,38,38,0.04)',
  medium: 'rgba(217,119,6,0.03)',
  ok:     'transparent',
};

const URGENCY_BADGE: Record<UrgencyLevel, { label: string; style: React.CSSProperties }> = {
  high:   { label: 'UNPROTECTED', style: { background: 'rgba(220,38,38,0.1)', color: '#DC2626', border: '1px solid rgba(220,38,38,0.25)' } },
  medium: { label: 'AT RISK',     style: { background: 'rgba(217,119,6,0.1)', color: '#D97706', border: '1px solid rgba(217,119,6,0.25)' } },
  ok:     { label: 'COVERED',     style: { background: 'rgba(16,185,129,0.1)', color: '#059669', border: '1px solid rgba(16,185,129,0.25)' } },
};

const FILTER_LABEL: Record<FilterLevel, string> = {
  all:    'All Clients',
  high:   'Unprotected',
  medium: 'At Risk',
  ok:     'Covered',
};

// ─── Health Score Ring ──────────────────────────────────────────────────────────

function HealthRing({ pct }: { pct: number }) {
  const r = 22;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  const colour = pct >= 80 ? '#10B981' : pct >= 50 ? '#D97706' : '#DC2626';

  return (
    <svg width={60} height={60} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={30} cy={30} r={r} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth={5} />
      <motion.circle
        cx={30} cy={30} r={r}
        fill="none"
        stroke={colour}
        strokeWidth={5}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - dash }}
        transition={{ duration: 1.0, ease: 'easeOut' }}
      />
      <text
        x={30} y={34}
        textAnchor="middle"
        style={{ transform: 'rotate(90deg) translateX(-60px)', fontSize: 13, fontWeight: 700, fill: colour }}
      >
        {pct}%
      </text>
    </svg>
  );
}

// ─── Inline Select ──────────────────────────────────────────────────────────────

interface SelectOption { value: string; label: string; sublabel?: string; }

function InlineSelect({
  value, options, onChange, placeholder, isDanger, isModified,
}: {
  value: string;
  options: SelectOption[];
  onChange: (v: string) => void;
  placeholder?: string;
  isDanger?: boolean;
  isModified?: boolean;
}) {
  const ref = useRef<HTMLSelectElement>(null);

  return (
    <div className="relative">
      <select
        ref={ref}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          appearance: 'none',
          padding: '7px 32px 7px 10px',
          borderRadius: 10,
          fontSize: 13,
          fontWeight: value ? 500 : 400,
          color: value
            ? (isDanger ? '#DC2626' : 'var(--color-text-primary)')
            : 'var(--color-text-secondary)',
          background: 'var(--input-background)',
          border: `1.5px solid ${isDanger ? 'rgba(220,38,38,0.4)' : isModified ? 'var(--color-primary)' : 'rgba(0,0,0,0.12)'}`,
          outline: 'none',
          width: '100%',
          cursor: 'pointer',
          transition: 'border-color 0.15s',
          boxShadow: isModified ? '0 0 0 3px rgba(186,32,39,0.08)' : 'none',
        }}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <ChevronDown
        className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: isDanger ? '#DC2626' : 'var(--color-text-secondary)' }}
      />
      {isModified && (
        <div
          className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
          style={{ background: 'var(--color-primary)' }}
        />
      )}
    </div>
  );
}

// ─── Client Row ─────────────────────────────────────────────────────────────────

interface ClientRowProps {
  client: Client;
  draft: Draft | undefined;
  allMembers: TeamMember[];
  mgrLoads: Record<string, number>;
  bakLoads: Record<string, number>;
  urgency: UrgencyResult;
  onChangeManager: (v: string) => void;
  onChangeBackup:  (v: string) => void;
  onReset: () => void;
  index: number;
}

function ClientRow({
  client, draft, allMembers, mgrLoads, bakLoads,
  urgency, onChangeManager, onChangeBackup, onReset, index,
}: ClientRowProps) {
  const currentMgr = draft?.manager ?? client.campaignManager;
  const currentBak = draft?.backup  ?? client.backupManager;

  const isModifiedMgr = draft?.manager !== undefined && draft.manager !== client.campaignManager;
  const isModifiedBak = draft?.backup  !== undefined && draft.backup  !== client.backupManager;
  const isModified = isModifiedMgr || isModifiedBak;

  const activeMembers = allMembers.filter(m => (m.status as string) !== 'Inactive');

  const mgrOptions: SelectOption[] = activeMembers.map(m => ({
    value: m.name,
    label: `${m.name}${mgrLoads[m.name] ? ` (${mgrLoads[m.name]})` : ''}`,
  }));

  const bakOptions: SelectOption[] = activeMembers
    .filter(m => m.name !== currentMgr)
    .map(m => ({
      value: m.name,
      label: `${m.name}${bakLoads[m.name] ? ` (${bakLoads[m.name]})` : ''}`,
    }));

  const badge = URGENCY_BADGE[urgency.level];
  const mgrLoad = mgrLoads[currentMgr] ?? 0;
  const bakLoad = bakLoads[currentBak] ?? 0;
  const noBackup = !currentBak || currentBak === '—' || currentBak === currentMgr;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 400, damping: 30 }}
      className="flex items-start gap-4 px-5 py-4 relative"
      style={{
        borderLeft: `3px solid ${URGENCY_BORDER[urgency.level]}`,
        background: URGENCY_BG[urgency.level],
        borderBottom: '1px solid var(--color-border, rgba(0,0,0,0.07))',
      }}
    >
      {/* Pulse ring for HIGH urgency */}
      {urgency.level === 'high' && (
        <div
          className="absolute left-0 top-0 bottom-0 w-0.5 rounded-r"
          style={{
            background: '#DC2626',
            animation: 'pulse-dot 2s ease-in-out infinite',
          }}
        />
      )}

      {/* Urgency dot */}
      <div className="flex flex-col items-center gap-1 pt-1 flex-shrink-0" style={{ width: 16 }}>
        <div
          className="w-2 h-2 rounded-full"
          style={{
            background: URGENCY_BORDER[urgency.level],
            boxShadow: urgency.level === 'high' ? '0 0 0 3px rgba(220,38,38,0.2)' : 'none',
          }}
        />
      </div>

      {/* Client info */}
      <div style={{ width: 160, flexShrink: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1.2 }}>{client.companyName}</div>
        <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 3 }}>{client.industry}</div>
        <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 2 }}>
          {client.campaigns.filter(c => c.status === 'active').length} active campaign{client.campaigns.filter(c => c.status === 'active').length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Manager column */}
      <div className="flex-1 min-w-0">
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: 5 }}>Campaign Manager</div>
        <InlineSelect
          value={currentMgr}
          options={mgrOptions}
          onChange={onChangeManager}
          placeholder="— Assign manager —"
          isModified={isModifiedMgr}
        />
        <div className="flex items-center gap-1 mt-1.5" style={{ fontSize: 11, color: mgrLoad > 3 ? '#D97706' : 'var(--color-text-secondary)' }}>
          {mgrLoad > 3 && <AlertTriangle className="w-3 h-3" />}
          <span>{mgrLoad > 0 ? `${mgrLoad} client${mgrLoad !== 1 ? 's' : ''} total` : 'No clients yet'}</span>
          {mgrLoad > 3 && <span style={{ fontWeight: 600, color: '#D97706' }}> · Overloaded</span>}
        </div>
      </div>

      {/* Arrow */}
      <div className="flex-shrink-0 pt-8" style={{ color: 'var(--color-text-secondary)' }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Backup column */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-secondary)' }}>
          <Shield className="w-3 h-3" />
          Backup
        </div>
        <InlineSelect
          value={noBackup ? '' : currentBak}
          options={bakOptions}
          onChange={onChangeBackup}
          placeholder="— Assign backup —"
          isDanger={urgency.level === 'high'}
          isModified={isModifiedBak}
        />
        <div className="flex items-center gap-1 mt-1.5" style={{ fontSize: 11 }}>
          {urgency.level === 'high' ? (
            <span style={{ color: '#DC2626', fontWeight: 600 }}>
              <AlertCircle className="w-3 h-3 inline mr-0.5" />
              {!currentBak || currentBak === '—' ? 'Required — no backup set' : 'Same person as manager'}
            </span>
          ) : (
            <span style={{ color: 'var(--color-text-secondary)' }}>
              {bakLoad > 0 ? `${bakLoad} backup assignment${bakLoad !== 1 ? 's' : ''}` : '—'}
            </span>
          )}
        </div>
      </div>

      {/* Status badge + reset */}
      <div className="flex flex-col items-end gap-2 flex-shrink-0 pt-0.5">
        <span
          className="inline-flex items-center px-2 py-0.5 rounded-lg"
          style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', ...badge.style }}
        >
          {badge.label}
        </span>
        {urgency.reasons.length > 0 && (
          <div className="flex flex-col gap-0.5" style={{ maxWidth: 120 }}>
            {urgency.reasons.map((r, i) => (
              <div key={i} style={{ fontSize: 10, color: urgency.level === 'high' ? '#DC2626' : '#D97706', textAlign: 'right', lineHeight: 1.3 }}>{r}</div>
            ))}
          </div>
        )}
        {isModified && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 px-2 py-0.5 rounded-lg transition-colors"
            style={{ fontSize: 10, color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)', background: 'transparent' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <RotateCcw className="w-2.5 h-2.5" /> Reset
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main Modal ─────────────────────────────────────────────────────────────────

export interface ClientCoverageModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  members: TeamMember[];
  onSave: (updatedClients: Client[]) => void;
}

export function ClientCoverageModal({
  isOpen, onClose, clients, members, onSave,
}: ClientCoverageModalProps) {
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [filter, setFilter]  = useState<FilterLevel>('all');
  const [search, setSearch]  = useState('');

  // Reset drafts when opened
  useEffect(() => {
    if (isOpen) { setDrafts({}); setFilter('all'); setSearch(''); }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [isOpen, onClose]);

  // ── Computed values ────────────────────────────────────────────────────────

  const mgrLoads = useMemo(() => computeManagerLoads(clients, drafts), [clients, drafts]);
  const bakLoads = useMemo(() => computeBackupLoads(clients, drafts), [clients, drafts]);

  const urgencies = useMemo(() =>
    Object.fromEntries(clients.map(c => [c.id, getUrgency(c, drafts, mgrLoads)])),
    [clients, drafts, mgrLoads]
  );

  const counts = useMemo(() => ({
    high:   clients.filter(c => urgencies[c.id]?.level === 'high').length,
    medium: clients.filter(c => urgencies[c.id]?.level === 'medium').length,
    ok:     clients.filter(c => urgencies[c.id]?.level === 'ok').length,
  }), [clients, urgencies]);

  const healthPct = Math.round((counts.ok / clients.length) * 100);

  const changesCount = useMemo(() =>
    Object.entries(drafts).filter(([clientId, draft]) => {
      const c = clients.find(x => x.id === clientId);
      if (!c) return false;
      return draft.manager !== c.campaignManager || draft.backup !== c.backupManager;
    }).length,
    [drafts, clients]
  );

  const filteredClients = useMemo(() => {
    let list = clients;
    if (filter !== 'all')  list = list.filter(c => urgencies[c.id]?.level === filter);
    if (search.trim())     list = list.filter(c => c.companyName.toLowerCase().includes(search.toLowerCase()) || c.industry.toLowerCase().includes(search.toLowerCase()));
    // Sort: high first, then medium, then ok
    return [...list].sort((a, b) => {
      const order: Record<UrgencyLevel, number> = { high: 0, medium: 1, ok: 2 };
      return order[urgencies[a.id]?.level ?? 'ok'] - order[urgencies[b.id]?.level ?? 'ok'];
    });
  }, [clients, filter, search, urgencies]);

  // ── Draft helpers ──────────────────────────────────────────────────────────

  function setManager(clientId: string, value: string) {
    setDrafts(prev => ({
      ...prev,
      [clientId]: { manager: value, backup: prev[clientId]?.backup ?? clients.find(c => c.id === clientId)!.backupManager },
    }));
  }

  function setBackup(clientId: string, value: string) {
    setDrafts(prev => ({
      ...prev,
      [clientId]: { manager: prev[clientId]?.manager ?? clients.find(c => c.id === clientId)!.campaignManager, backup: value },
    }));
  }

  function resetClient(clientId: string) {
    setDrafts(prev => { const next = { ...prev }; delete next[clientId]; return next; });
  }

  function resetAll() { setDrafts({}); }

  // ── Save ───────────────────────────────────────────────────────────────────

  function handleSave() {
    const updated = clients.map(c => {
      const draft = drafts[c.id];
      if (!draft) return c;
      const mgrMember = members.find(m => m.name === draft.manager);
      const bakMember = members.find(m => m.name === draft.backup);
      return {
        ...c,
        campaignManager:      draft.manager,
        campaignManagerEmail: mgrMember?.email ?? c.campaignManagerEmail,
        backupManager:        draft.backup,
        backupManagerEmail:   bakMember?.email ?? c.backupManagerEmail,
      };
    });
    onSave(updated);
    onClose();
  }

  if (!isOpen) return null;

  // Filter button styles
  const filterBtnStyle = (f: FilterLevel): React.CSSProperties => {
    const active = filter === f;
    const colours: Record<FilterLevel, string> = { all: 'var(--color-primary)', high: '#DC2626', medium: '#D97706', ok: '#059669' };
    const colour = colours[f];
    return {
      padding: '5px 12px',
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 600,
      cursor: 'pointer',
      border: `1.5px solid ${active ? colour : 'rgba(0,0,0,0.1)'}`,
      background: active ? `${colour}14` : 'transparent',
      color: active ? colour : 'var(--color-text-secondary)',
      transition: 'all 0.15s',
    };
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 16 }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          onClick={e => e.stopPropagation()}
          className="flex flex-col w-full"
          style={{
            maxWidth: 880,
            maxHeight: '92vh',
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            borderRadius: 20,
            boxShadow: 'var(--card-shadow-lg)',
            overflow: 'hidden',
          }}
        >
          {/* ─── HEADER ────────────────────────────────────────────────────── */}
          <div
            className="flex items-center gap-4 px-6 py-5"
            style={{ borderBottom: '1px solid var(--glass-border)', flexShrink: 0 }}
          >
            {/* Health ring */}
            <div className="relative flex-shrink-0" style={{ width: 60, height: 60 }}>
              <HealthRing pct={healthPct} />
              {/* icon centred in ring */}
              <div className="absolute inset-0 flex items-center justify-center" style={{ pointerEvents: 'none' }}>
                <TrendingUp className="w-3.5 h-3.5" style={{ color: healthPct >= 80 ? '#10B981' : healthPct >= 50 ? '#D97706' : '#DC2626' }} />
              </div>
            </div>

            {/* Title block */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  Client Coverage Manager
                </h2>
                {counts.high > 0 && (
                  <motion.div
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ repeat: Infinity, duration: 2.0 }}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)' }}
                  >
                    <Zap className="w-3 h-3" style={{ color: '#DC2626' }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#DC2626' }}>{counts.high} urgent</span>
                  </motion.div>
                )}
              </div>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-secondary)' }}>
                Assign campaign managers and backup coverage for all {clients.length} clients in one place
              </p>
            </div>

            {/* Summary chips */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {counts.high > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)' }}>
                  <AlertTriangle className="w-3.5 h-3.5" style={{ color: '#DC2626' }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#DC2626' }}>{counts.high} unprotected</span>
                </div>
              )}
              {counts.medium > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ background: 'rgba(217,119,6,0.08)', border: '1px solid rgba(217,119,6,0.2)' }}>
                  <AlertCircle className="w-3.5 h-3.5" style={{ color: '#D97706' }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#D97706' }}>{counts.medium} at risk</span>
                </div>
              )}
              {counts.ok > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <CheckCircle2 className="w-3.5 h-3.5" style={{ color: '#059669' }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#059669' }}>{counts.ok} covered</span>
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
              style={{ color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.05)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ─── URGENT ALERT BANNER ────────────────────────────────────────── */}
          <AnimatePresence>
            {counts.high > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="flex items-center gap-3 px-6 py-3"
                style={{ background: 'rgba(220,38,38,0.06)', borderBottom: '1px solid rgba(220,38,38,0.15)', flexShrink: 0 }}
              >
                <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: '#DC2626' }} />
                <span style={{ fontSize: 13, color: '#DC2626' }}>
                  <strong>{counts.high} client{counts.high !== 1 ? 's are' : ' is'} unprotected</strong> — assign a backup manager immediately to ensure campaign continuity.
                </span>
                <button
                  onClick={() => setFilter('high')}
                  className="ml-auto flex-shrink-0 px-3 py-1 rounded-lg transition-colors"
                  style={{ fontSize: 12, fontWeight: 700, color: '#DC2626', border: '1px solid rgba(220,38,38,0.3)', background: 'rgba(220,38,38,0.08)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(220,38,38,0.14)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(220,38,38,0.08)')}
                >
                  Show only
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ─── FILTER + SEARCH ────────────────────────────────────────────── */}
          <div
            className="flex items-center gap-3 px-6 py-3 flex-wrap"
            style={{ borderBottom: '1px solid var(--color-border)', flexShrink: 0, gap: '10px' }}
          >
            <div className="flex items-center gap-1.5 flex-wrap">
              {(['all', 'high', 'medium', 'ok'] as FilterLevel[]).map(f => (
                <button key={f} style={filterBtnStyle(f)} onClick={() => setFilter(f)}>
                  {FILTER_LABEL[f]}
                  {f !== 'all' && (
                    <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full" style={{ fontSize: 10, background: filter === f ? 'rgba(0,0,0,0.12)' : 'rgba(0,0,0,0.07)' }}>
                      {counts[f as 'high'|'medium'|'ok']}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative flex-1 min-w-[180px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-secondary)' }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search clients…"
                style={{
                  paddingLeft: 30, paddingRight: 10, paddingTop: 7, paddingBottom: 7,
                  borderRadius: 10, fontSize: 13, width: '100%', outline: 'none',
                  border: '1.5px solid rgba(0,0,0,0.1)',
                  background: 'var(--input-background)',
                  color: 'var(--color-text-primary)',
                }}
              />
            </div>

            {/* Column headers */}
            <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginLeft: 'auto', whiteSpace: 'nowrap' }}>
              {filteredClients.length} of {clients.length} shown
            </div>
          </div>

          {/* ─── TABLE HEADERS ──────────────────────────────────────────────── */}
          <div
            className="flex items-center gap-4 px-5 py-2.5"
            style={{ background: 'rgba(0,0,0,0.02)', borderBottom: '1px solid var(--color-border)', flexShrink: 0 }}
          >
            <div style={{ width: 16, flexShrink: 0 }} />
            <div style={{ width: 160, flexShrink: 0, fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--color-text-secondary)' }}>Client</div>
            <div style={{ flex: 1, fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--color-text-secondary)' }}>Campaign Manager</div>
            <div style={{ width: 16, flexShrink: 0 }} />
            <div style={{ flex: 1, fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--color-text-secondary)' }}>Backup</div>
            <div style={{ width: 130, flexShrink: 0, textAlign: 'right', fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--color-text-secondary)' }}>Coverage</div>
          </div>

          {/* ─── SCROLLABLE CLIENT LIST ──────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto">
            {filteredClients.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <Building2 className="w-10 h-10" style={{ color: 'var(--color-text-secondary)', opacity: 0.4 }} />
                <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', margin: 0 }}>No clients match your filter</p>
                <button onClick={() => { setFilter('all'); setSearch(''); }} style={{ fontSize: 13, color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                  Clear filters
                </button>
              </div>
            ) : (
              filteredClients.map((client, i) => (
                <ClientRow
                  key={client.id}
                  client={client}
                  draft={drafts[client.id]}
                  allMembers={members}
                  mgrLoads={mgrLoads}
                  bakLoads={bakLoads}
                  urgency={urgencies[client.id] ?? { level: 'ok', reasons: [] }}
                  onChangeManager={v => setManager(client.id, v)}
                  onChangeBackup={v  => setBackup(client.id, v)}
                  onReset={() => resetClient(client.id)}
                  index={i}
                />
              ))
            )}
          </div>

          {/* ─── FOOTER ─────────────────────────────────────────────────────── */}
          <div
            className="flex items-center gap-4 px-6 py-4"
            style={{ borderTop: '1px solid var(--glass-border)', flexShrink: 0, background: 'rgba(0,0,0,0.02)' }}
          >
            {/* Change counter */}
            <div style={{ flex: 1 }}>
              {changesCount > 0 ? (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-2 h-2 rounded-full" style={{ background: 'var(--color-primary)' }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      {changesCount} change{changesCount !== 1 ? 's' : ''} pending
                    </span>
                    <button
                      onClick={resetAll}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-lg ml-2 transition-colors"
                      style={{ fontSize: 12, color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)', background: 'transparent' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <RotateCcw className="w-3 h-3" /> Reset all
                    </button>
                  </motion.div>
                </AnimatePresence>
              ) : (
                <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                  {counts.ok} of {clients.length} clients fully covered — {healthPct}% coverage
                </span>
              )}
            </div>

            {/* Cancel */}
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all"
              style={{ fontWeight: 600, fontSize: 14, border: '1.5px solid var(--color-border)', background: 'transparent', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              Cancel
            </button>

            {/* Save */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={changesCount === 0}
              className="flex items-center gap-2 px-5 py-2 rounded-xl transition-all"
              style={{
                fontWeight: 700,
                fontSize: 14,
                background: changesCount > 0 ? 'var(--color-primary)' : 'rgba(0,0,0,0.08)',
                color: changesCount > 0 ? '#fff' : 'var(--color-text-secondary)',
                border: 'none',
                cursor: changesCount > 0 ? 'pointer' : 'not-allowed',
                transition: 'background 0.2s',
              }}
            >
              <Save className="w-4 h-4" />
              Save All Changes
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
