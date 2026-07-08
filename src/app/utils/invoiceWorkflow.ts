// ─── Invoices Workflow Contract ───────────────────────────────────────────────
// Frontend contract for the invoice lifecycle. Every function here is a mock
// that resolves after simulated latency.
//
// Vaibhav — backend mapping:
//   generateDraftInvoices → POST /invoices/generate     (prior-month BILLABLE leads per campaign; grouping param)
//   validateInvoice       → POST /invoices/:id/validate (Accounts sign-off; then create Tally sales voucher)
//   syncInvoiceToTally    → Tally Prime integration (XML/HTTP gateway or a connector like Tallygraphs)
//   sendInvoice           → POST /invoices/:id/send     (client visibility + email)
//   initiatePayment       → payment gateway TBD — decision deferred, keep behind this stub
//   recordPayment         → POST /invoices/:id/payment  (then create Tally receipt voucher)
//
// Rule that must never break: invoices bill BILLABLE leads, not Delivered.

import type { InvoiceRecord, InvoiceStage, InvoiceGrouping } from '../types';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// ─── Stage metadata ───────────────────────────────────────────────────────────

export const INVOICE_STAGE_ORDER: InvoiceStage[] = [
  'draft',
  'pending_validation',
  'approved',
  'sent',
  'paid',
];

export const INVOICE_STAGE_META: Record<InvoiceStage, { label: string; description: string }> = {
  draft: { label: 'Draft', description: 'Generated from prior-month billable leads' },
  pending_validation: { label: 'Validation', description: 'Awaiting Accounts sign-off on the amount' },
  approved: { label: 'Approved', description: 'Validated — Tally entry created' },
  sent: { label: 'Sent', description: 'Visible to the client, awaiting payment' },
  paid: { label: 'Paid', description: 'Payment received and synced to Tally' },
  overdue: { label: 'Overdue', description: 'Past due date' },
  void: { label: 'Void', description: 'Cancelled' },
};

export const GROUPING_META: Record<InvoiceGrouping, { label: string; hint: string }> = {
  per_campaign: { label: 'Per Campaign', hint: 'One invoice for a single campaign' },
  consolidated: { label: 'Consolidated', hint: 'One invoice for all campaigns billed in the period' },
  geo_split: { label: 'Geo Split', hint: 'Separate invoices per region (NAM / EMEA / APAC)' },
};

export function stageIndex(inv: InvoiceRecord): number {
  // Overdue sits visually at the 'sent' step — it is a sent invoice past due.
  const stage: InvoiceStage = inv.stage === 'overdue' ? 'sent' : inv.stage;
  const i = INVOICE_STAGE_ORDER.indexOf(stage);
  return i === -1 ? 0 : i;
}

export function formatBillingPeriod(period: string): string {
  const [y, m] = period.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export function formatUSD(amount: number): string {
  return `$${amount.toLocaleString('en-US')}`;
}

// ─── Workflow actions (mocked) ────────────────────────────────────────────────

/** Accounts validates the amount. Backend then creates the Tally sales voucher. */
export async function validateInvoice(_invoice: InvoiceRecord): Promise<{ validatedAt: string }> {
  await delay(800);
  return { validatedAt: new Date().toISOString() };
}

/** Pushes the sales voucher to Tally. Resolves with the voucher id, or throws on gateway failure. */
export async function syncInvoiceToTally(_invoice: InvoiceRecord): Promise<{ voucherId: string; syncedAt: string }> {
  await delay(1500);
  return {
    voucherId: `TLY-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    syncedAt: new Date().toISOString(),
  };
}

/** Makes the invoice visible to the client and emails it. */
export async function sendInvoice(_invoice: InvoiceRecord): Promise<{ issueDate: string; dueDate: string }> {
  await delay(600);
  const issue = new Date();
  const due = new Date(issue.getTime() + 30 * 86400000); // Net 30
  return { issueDate: issue.toISOString(), dueDate: due.toISOString() };
}

/**
 * Client-initiated payment. Gateway not selected yet — this stub records the
 * intent and resolves as a simulated successful payment so the downstream
 * Tally receipt sync can be demonstrated end-to-end.
 */
export async function initiatePayment(invoice: InvoiceRecord): Promise<{ reference: string; paidAt: string }> {
  await delay(1600);
  return {
    reference: `PAY-${invoice.invoiceNumber.slice(-6)}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    paidAt: new Date().toISOString(),
  };
}

/** Records the receipt voucher in Tally after a successful payment. */
export async function syncPaymentToTally(_invoice: InvoiceRecord): Promise<{ syncedAt: string }> {
  await delay(1100);
  return { syncedAt: new Date().toISOString() };
}
