// ─── Documents Workflow Contract ──────────────────────────────────────────────
// Frontend contract for the Job Card lifecycle. Every function here is a mock
// that resolves after simulated latency.
//
// Vaibhav — backend mapping:
//   uploadScopeDump        → POST /job-cards/intake        (multipart; triggers AI scope extraction)
//   createSalesforceOpp    → handled server-side after extraction (SF REST: Opportunity create)
//   confirmOpportunity     → POST /job-cards/:id/review    (client manager sign-off → JC generation)
//   confirmJobCard         → POST /job-cards/:id/confirm   (role recorded; both roles required)
//   sendForSignature       → POST /job-cards/:id/signature (e-sign envelope create; webhook flips to 'signed')
//   The e-sign provider sits behind this contract — DocuSign / Zoho Sign / Documenso are swappable.

import type { JobCard, JobCardStage, JobCardType, ScopeSummary } from '../types';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// ─── Stage metadata (single source of truth for steppers & badges) ────────────

export interface StageMeta {
  label: string;
  description: string;
}

export const JOB_CARD_STAGE_ORDER: JobCardStage[] = [
  'intake',
  'sf_opportunity_created',
  'pending_cm_review',
  'jc_generated',
  'pending_confirmations',
  'sent_for_signature',
  'signed',
  'completed',
];

export const JOB_CARD_STAGE_META: Record<JobCardStage, StageMeta> = {
  intake: { label: 'Scope Intake', description: 'Conversation dump uploaded — extracting scope' },
  sf_opportunity_created: { label: 'Salesforce Opportunity', description: 'Opportunity created in Salesforce' },
  pending_cm_review: { label: 'Manager Review', description: 'Client manager verifying opportunity details' },
  jc_generated: { label: 'Job Card Generated', description: 'Job card built from template' },
  pending_confirmations: { label: 'Dual Confirmation', description: 'Account + client manager confirm accuracy' },
  sent_for_signature: { label: 'Client Signature', description: 'Awaiting client e-signature' },
  signed: { label: 'Signed', description: 'Client has signed the job card' },
  completed: { label: 'Completed', description: 'Job card finalized' },
  declined: { label: 'Declined', description: 'Workflow stopped' },
};

export const JOB_CARD_TYPE_META: Record<JobCardType, { label: string; hint: string }> = {
  client_signature: { label: 'Client Signature', hint: 'Sent to the client for e-signature' },
  internal_only: { label: 'Internal Only', hint: 'Made for internal records — never sent to the client' },
  msa_covered: { label: 'MSA in Place', hint: 'No job card required — covered by the master agreement' },
};

/** Stages that apply for a given job card type (internal-only and MSA skip signature). */
export function stagesForType(type: JobCardType): JobCardStage[] {
  if (type === 'msa_covered') {
    return ['intake', 'sf_opportunity_created', 'pending_cm_review', 'completed'];
  }
  if (type === 'internal_only') {
    return ['intake', 'sf_opportunity_created', 'pending_cm_review', 'jc_generated', 'pending_confirmations', 'completed'];
  }
  return JOB_CARD_STAGE_ORDER;
}

/** 0-based index of the current stage within the card's own stage track. */
export function stageIndex(card: JobCard): number {
  const track = stagesForType(card.type);
  const i = track.indexOf(card.stage);
  return i === -1 ? 0 : i;
}

export function isAwaitingClientSignature(card: JobCard): boolean {
  return card.type === 'client_signature' && card.stage === 'sent_for_signature';
}

// ─── Workflow actions (mocked) ────────────────────────────────────────────────

/**
 * Account manager uploads the full conversation dump for a won campaign.
 * Backend runs AI scope extraction and creates the Salesforce opportunity.
 * Returns the extracted scope so the UI can preview it immediately.
 */
export async function uploadScopeDump(
  _file: { name: string; size: number },
): Promise<{ scope: ScopeSummary; salesforceOpportunityId: string }> {
  await delay(1800); // extraction + SF round-trip
  return {
    scope: {
      serviceType: 'Content Syndication',
      geography: 'NAM',
      targetLeads: 500,
      cpl: 45,
      startDate: '2026-08-01',
      endDate: '2026-10-31',
      jobTitles: ['CIO', 'VP IT', 'Director of Infrastructure'],
      industry: 'Technology',
      employeeSize: '1,000+',
      notes: 'Extracted from uploaded conversation — verify before confirming.',
    },
    salesforceOpportunityId: `006${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
  };
}

/** Client manager confirms the Salesforce opportunity is accurate → JC generation (or completion if MSA). */
export async function confirmOpportunity(card: JobCard): Promise<JobCardStage> {
  await delay(900);
  return card.type === 'msa_covered' ? 'completed' : 'jc_generated';
}

/**
 * One party (account manager or client manager) confirms the generated job card.
 * When both have confirmed: client_signature cards go out for e-sign;
 * internal_only cards complete.
 */
export async function confirmJobCard(
  card: JobCard,
  role: 'accountManager' | 'clientManager',
): Promise<{ nextStage: JobCardStage; bothConfirmed: boolean }> {
  await delay(700);
  const other = role === 'accountManager' ? 'clientManager' : 'accountManager';
  const bothConfirmed = card.confirmations[other].confirmed;
  if (!bothConfirmed) return { nextStage: 'pending_confirmations', bothConfirmed: false };
  return {
    nextStage: card.type === 'client_signature' ? 'sent_for_signature' : 'completed',
    bothConfirmed: true,
  };
}

/** Creates the e-signature envelope and emails the client. Provider swappable. */
export async function sendForSignature(_card: JobCard): Promise<{ envelopeId: string; sentAt: string }> {
  await delay(1200);
  return {
    envelopeId: `ENV-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
    sentAt: new Date().toISOString(),
  };
}

/**
 * Client-side signing action. In production this redirects to the provider's
 * embedded signing session; the provider webhook then flips the stage to 'signed'.
 */
export async function signJobCard(_card: JobCard, signerName: string): Promise<{ signedAt: string; signedBy: string }> {
  await delay(1400);
  return { signedAt: new Date().toISOString(), signedBy: signerName };
}

// ─── Human phases & situation line ────────────────────────────────────────────
// The 9 system stages collapse into the phases a person actually tracks.
// System events (scope extraction, SF opportunity, JC generation) are instants —
// they belong in History, not on the stepper.

export interface Phase { key: string; label: string }

const PHASES_FULL: Phase[] = [
  { key: 'intake', label: 'Intake' },
  { key: 'review', label: 'Manager Review' },
  { key: 'confirmation', label: 'Confirmation' },
  { key: 'signature', label: 'Client Signature' },
  { key: 'done', label: 'Done' },
];

export function phasesForType(type: JobCardType): Phase[] {
  if (type === 'msa_covered') return [PHASES_FULL[0], PHASES_FULL[1], PHASES_FULL[4]];
  if (type === 'internal_only') return [PHASES_FULL[0], PHASES_FULL[1], PHASES_FULL[2], PHASES_FULL[4]];
  return PHASES_FULL;
}

export function phaseIndex(card: JobCard): number {
  const phases = phasesForType(card.type);
  const key =
    card.stage === 'intake' || card.stage === 'sf_opportunity_created' ? 'intake'
      : card.stage === 'pending_cm_review' ? 'review'
        : card.stage === 'jc_generated' || card.stage === 'pending_confirmations' ? 'confirmation'
          : card.stage === 'sent_for_signature' ? 'signature'
            : 'done';
  const i = phases.findIndex((p) => p.key === key);
  return i === -1 ? 0 : i;
}

export function daysInStage(card: JobCard): number {
  return Math.max(0, Math.floor((Date.now() - new Date(card.updatedAt).getTime()) / 86400000));
}

export type SituationTone = 'action' | 'waiting' | 'done' | 'blocked';

export interface Situation {
  text: string;
  tone: SituationTone;
  since?: string; // ISO — when the wait started
}

/**
 * The one sentence that answers "who is this waiting on?".
 * `viewerIsBlocking` is decided by the caller (it depends on perspective);
 * pass it to upgrade a 'waiting' into an 'action' (waiting on YOU).
 */
export function jobCardSituation(card: JobCard, viewerIsBlocking = false): Situation {
  const since = card.updatedAt;
  if (card.stage === 'declined') return { text: 'Declined — workflow stopped', tone: 'blocked', since };
  if (card.salesforce.status === 'failed') {
    return { text: `Blocked — Salesforce sync failed${card.salesforce.error ? `: ${card.salesforce.error}` : ''}`, tone: 'blocked', since };
  }
  if (card.stage === 'signed') {
    return { text: `Signed by ${card.signature?.signedBy ?? card.clientCompany}`, tone: 'done', since: card.signature?.signedAt ?? since };
  }
  if (card.stage === 'completed') return { text: 'Completed', tone: 'done', since };
  if (card.stage === 'intake' || card.stage === 'sf_opportunity_created') {
    return { text: 'Processing intake — extracting scope and creating the Salesforce opportunity', tone: 'waiting', since };
  }
  if (card.stage === 'pending_cm_review') {
    return { text: `Waiting on ${card.clientManager} (Client Manager) to verify the opportunity`, tone: viewerIsBlocking ? 'action' : 'waiting', since };
  }
  if (card.stage === 'jc_generated' || card.stage === 'pending_confirmations') {
    const pending: string[] = [];
    if (!card.confirmations.accountManager.confirmed) pending.push(`${card.accountManager} (Account Manager)`);
    if (!card.confirmations.clientManager.confirmed) pending.push(`${card.clientManager} (Client Manager)`);
    const who = pending.length === 2 ? `${pending[0]} and ${pending[1]}` : pending[0] ?? 'confirmation';
    return { text: `Waiting on ${who} to confirm`, tone: viewerIsBlocking ? 'action' : 'waiting', since };
  }
  // sent_for_signature
  return { text: `Waiting on ${card.clientCompany} to sign`, tone: viewerIsBlocking ? 'action' : 'waiting', since };
}
