import { useState } from 'react';
import {
  ChevronDown, ChevronUp, CheckCircle2, Circle, FileSignature,
  Download, RefreshCw, History, PenLine,
} from 'lucide-react';
import { toast } from 'sonner';
import type { JobCard } from '../../types';
import {
  JOB_CARD_STAGE_META, JOB_CARD_TYPE_META, stagesForType, stageIndex,
} from '../../utils/documentWorkflow';
import { WorkflowStepper } from './WorkflowStepper';
import { IntegrationChip } from './IntegrationChip';

export type JobCardPerspective = 'client' | 'account_manager' | 'client_manager' | 'readonly';

interface JobCardCardProps {
  card: JobCard;
  perspective: JobCardPerspective;
  /** Called with the intended action; the page owns the state mutation. */
  onVerifyOpportunity?: (card: JobCard) => void;
  onConfirm?: (card: JobCard) => void;
  onSign?: (card: JobCard) => void;
  onRetrySync?: (card: JobCard) => void;
  /** Disables action buttons while an async action is in flight. */
  busy?: boolean;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const stageChipStyles: Record<string, string> = {
  intake: 'bg-[#F5F3FF] text-[#7C3AED]',
  sf_opportunity_created: 'bg-[#EFF6FF] text-[#2563EB]',
  pending_cm_review: 'bg-[#FFF7ED] text-[#C2410C]',
  jc_generated: 'bg-[#EFF6FF] text-[#2563EB]',
  pending_confirmations: 'bg-[#FFFBEB] text-[#D97706]',
  sent_for_signature: 'bg-[#FFFBEB] text-[#D97706]',
  signed: 'bg-[#ECFDF5] text-[#059669]',
  completed: 'bg-[#ECFDF5] text-[#059669]',
  declined: 'bg-[#FEF2F2] text-[#DC2626]',
};

export function JobCardCard({
  card, perspective, onVerifyOpportunity, onConfirm, onSign, onRetrySync, busy = false,
}: JobCardCardProps) {
  const [expanded, setExpanded] = useState(false);

  const track = stagesForType(card.type);
  const steps = track.map((s) => ({ key: s, label: JOB_CARD_STAGE_META[s].label }));
  const isTerminal = card.stage === 'signed' || card.stage === 'completed';
  const sfFailed = card.salesforce.status === 'failed';

  const amConfirmed = card.confirmations.accountManager.confirmed;
  const cmConfirmed = card.confirmations.clientManager.confirmed;

  // Which action does this perspective get right now?
  const canVerify = perspective === 'client_manager' && card.stage === 'pending_cm_review';
  const canConfirmAM = perspective === 'account_manager' && card.stage === 'pending_confirmations' && !amConfirmed;
  const canConfirmCM = perspective === 'client_manager' && card.stage === 'pending_confirmations' && !cmConfirmed;
  const canSign = perspective === 'client' && card.type === 'client_signature' && card.stage === 'sent_for_signature';
  const canRetry = (perspective === 'account_manager' || perspective === 'client_manager') && sfFailed;

  return (
    <div className="glass-card p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', letterSpacing: '0.03em' }}>
              {card.id}
            </span>
            <span
              className="inline-flex items-center px-2 py-0.5 rounded-full"
              style={{ fontSize: '11px', fontWeight: 500, background: 'var(--color-primary-tint)', color: 'var(--color-primary)' }}
              title={JOB_CARD_TYPE_META[card.type].hint}
            >
              {JOB_CARD_TYPE_META[card.type].label}
            </span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${stageChipStyles[card.stage]}`}>
              {JOB_CARD_STAGE_META[card.stage].label}
            </span>
          </div>
          <h3 className="truncate" style={{ fontSize: 'var(--font-size-md, 15px)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
            {card.campaignName}
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
            {card.clientCompany} · Created {fmtDate(card.createdAt)}
          </p>
        </div>

        {isTerminal && (
          <div className="flex items-center gap-1.5 flex-shrink-0" style={{ color: 'var(--color-success, #0F9D58)' }}>
            <CheckCircle2 className="w-5 h-5" />
            <span style={{ fontSize: '13px', fontWeight: 600 }}>
              {card.stage === 'signed' ? `Signed by ${card.signature?.signedBy}` : 'Completed'}
            </span>
          </div>
        )}
      </div>

      {/* Stepper */}
      <div className="mb-4 overflow-x-auto">
        <div style={{ minWidth: track.length * 90 }}>
          <WorkflowStepper steps={steps} currentIndex={stageIndex(card)} allDone={isTerminal} failed={sfFailed} size="sm" />
        </div>
      </div>

      {/* Scope summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {[
          { label: 'Service', value: card.scope.serviceType },
          { label: 'Geo', value: card.scope.geography },
          { label: 'Target Leads', value: card.scope.targetLeads.toLocaleString('en-US') },
          { label: 'CPL', value: `$${card.scope.cpl.toLocaleString('en-US')}` },
        ].map(({ label, value }) => (
          <div key={label}>
            <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              {label}
            </div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Integrations + confirmations */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <IntegrationChip
          system="Salesforce"
          status={card.salesforce.status}
          detail={card.salesforce.opportunityId}
          error={card.salesforce.error}
        />
        {card.signature && (
          <IntegrationChip
            system={card.signature.provider}
            status={card.signature.signedAt ? 'synced' : 'syncing'}
            detail={card.signature.signedAt ? `Signed ${fmtDate(card.signature.signedAt)}` : undefined}
          />
        )}
        {card.type !== 'msa_covered' && card.stage !== 'intake' && card.stage !== 'pending_cm_review' && (
          <>
            <span className="inline-flex items-center gap-1" style={{ fontSize: '11px', color: amConfirmed ? 'var(--color-success, #0F9D58)' : 'var(--color-text-muted)' }}>
              {amConfirmed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
              AM: {card.accountManager}
            </span>
            <span className="inline-flex items-center gap-1" style={{ fontSize: '11px', color: cmConfirmed ? 'var(--color-success, #0F9D58)' : 'var(--color-text-muted)' }}>
              {cmConfirmed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
              CM: {card.clientManager}
            </span>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2">
        {canSign && (
          <button onClick={() => onSign?.(card)} disabled={busy} className="btn-primary px-4 py-2 flex items-center gap-2">
            <PenLine className="w-4 h-4" />
            Review & Sign
          </button>
        )}
        {canVerify && (
          <button onClick={() => onVerifyOpportunity?.(card)} disabled={busy} className="btn-primary px-4 py-2 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Verify Opportunity
          </button>
        )}
        {(canConfirmAM || canConfirmCM) && (
          <button onClick={() => onConfirm?.(card)} disabled={busy} className="btn-primary px-4 py-2 flex items-center gap-2">
            <FileSignature className="w-4 h-4" />
            Confirm Accuracy
          </button>
        )}
        {canRetry && (
          <button onClick={() => onRetrySync?.(card)} disabled={busy} className="btn-secondary px-4 py-2 flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Retry Salesforce Sync
          </button>
        )}
        {card.documentUrl && card.stage !== 'intake' && card.stage !== 'pending_cm_review' && (
          <button
            onClick={() => toast.success(`Downloading ${card.id}.pdf…`)}
            className="btn-secondary px-4 py-2 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        )}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="ml-auto flex items-center gap-1 px-2 py-1"
          style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}
        >
          <History className="w-3.5 h-3.5" />
          History
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* History timeline */}
      {expanded && (
        <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--color-border-light)' }}>
          <div className="space-y-2">
            {card.history.map((event, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'var(--color-primary)' }} />
                <div>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-primary)' }}>{event.action}</span>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}> — {event.actor}, {fmtDate(event.at)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
