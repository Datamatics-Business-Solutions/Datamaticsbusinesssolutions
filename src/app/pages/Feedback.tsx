import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppLayout } from '../components/AppLayout';
import {
  MessageSquare, Send, CheckCircle2, AlertCircle, Lightbulb,
  TrendingUp, Zap, Shield, Users, DollarSign, ChevronDown,
  Rocket, GitBranch, Clock, FilePen, Upload, Receipt,
  ArrowRight, Bot, Brain, BarChart3, CreditCard, Target, Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID  = 'service_2cz8e3g';
const EMAILJS_TEMPLATE_ID = 'template_up5p94g';
const EMAILJS_PUBLIC_KEY  = '_oEucjCREDn4wOTcz';

type FeedbackType = 'bug' | 'feature' | 'improvement' | 'general';
type FeedbackPriority = 'low' | 'medium' | 'high';

interface FeedbackFormData {
  type: FeedbackType;
  priority: FeedbackPriority;
  subject: string;
  message: string;
  email: string;
  name: string;
}

const coreAutomations = [
  {
    icon: TrendingUp,
    title: 'Salesforce — Auto-Create Opportunities',
    tagline: 'Zero manual CRM entry, ever.',
    description:
      'Every time a new campaign is created on the platform, a corresponding Opportunity is automatically created in Salesforce — no manual entry ever.',
    bullets: [
      'Campaign name, client, value, dates & targets all populate automatically',
      'Full two-way sync — updates on the platform reflect in Salesforce and vice versa',
      'The team sees every new campaign in Salesforce the moment it\'s approved',
    ],
    saves: '~30 min/campaign',
    eliminates: 'Manual CRM data entry',
    eta: 'Q3 2026',
    buildTime: '~1 day',
  },
  {
    icon: FilePen,
    title: 'DocuSign — Auto-Generate & Send Job Cards',
    tagline: 'Campaigns approved → job cards signed, automatically.',
    description:
      'The moment a campaign is approved, a Job Card PDF is automatically generated from the campaign data and sent via DocuSign to all required signatories.',
    bullets: [
      'Automatically emails every stakeholder with their DocuSign signing link',
      'Sends reminders to anyone who hasn\'t signed',
      'Real-time status: "Awaiting Client Signature" → "Fully Executed"',
      'Completed signed PDF stored and visible on the platform with full audit trail',
    ],
    saves: '~2 hrs/campaign',
    eliminates: 'Job card creation & signature chasing',
    eta: 'Q3 2026',
    buildTime: '~2–3 days',
  },
  {
    icon: Upload,
    title: 'Convertr — Auto-Deliver Leads',
    tagline: 'No spreadsheets. No manual uploads. Ever.',
    description:
      'When leads are ready for delivery, the platform automatically sends them directly into each client\'s Convertr campaign in real time.',
    bullets: [
      'Convertr validates and dedupes each lead instantly upon receipt',
      'Accepted/rejected status feeds back into the platform automatically',
      'Rejection reasons visible on the dashboard — full visibility on failed leads',
      'Campaign delivery counters update live as leads are accepted',
      'Leads flow automatically into the client\'s CRM via Convertr\'s 45+ integrations',
    ],
    saves: '~1–3 hrs/delivery',
    eliminates: 'Spreadsheet prep & manual lead upload',
    eta: 'Q4 2026',
    buildTime: '~1–2 days',
  },
  {
    icon: Receipt,
    title: 'Tally — Invoice & Payment Sync',
    tagline: 'Every invoice auto-posted. Every payment auto-reconciled.',
    description:
      'Every invoice generated on the platform automatically syncs to TallyPrime — and when payment is received, Tally updates too. No manual accounting entry ever again.',
    bullets: [
      'Invoice generated → Sales voucher created automatically in Tally',
      'Invoice sent → Tally records the outstanding receivable',
      'Payment received → Tally updates with receipt entry & marks ledger settled',
      'Invoice cancelled → Tally credit note created automatically',
      'New client added → Tally ledger created automatically',
    ],
    saves: '~1–2 hrs/invoice',
    eliminates: 'Manual accounting entry & payment tracking',
    eta: 'Q4 2026',
    buildTime: '~2–3 days',
  },
];

const askPrafulCapabilities = [
  { icon: Target,    label: 'Campaign Intelligence',  text: 'Full breakdown of any campaign — status, delivery rate, lead quality, remaining targets, and what actions are pending.' },
  { icon: Users,     label: 'Lead Insights',           text: 'Ask about leads across any campaign: how many delivered, accepted, rejected, why they were rejected, and patterns in the data.' },
  { icon: BarChart3, label: 'Metrics & Performance',   text: 'Plain-English summaries of KPIs, conversion rates, cost-per-lead, and campaign ROI — no need to dig through dashboards.' },
  { icon: CreditCard,label: 'Outstanding Payments',    text: 'Instant visibility on which invoices are overdue, by how much, and for which clients — plus suggested next steps.' },
  { icon: Brain,     label: 'Automated Actions',       text: 'Praful won\'t just answer — it will act. Trigger lead uploads, flag anomalies, send reminders, and surface what needs your attention today.' },
];

export default function Feedback() {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState<FeedbackFormData>({
    type: 'general',
    priority: 'medium',
    subject: '',
    message: '',
    email: currentUser?.email || '',
    name: currentUser?.name || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [showPlatformVision, setShowPlatformVision] = useState(false);
  const [showComingFeatures, setShowComingFeatures] = useState(false);
  const [expandedAutomation, setExpandedAutomation] = useState<number | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const templateParams = {
        email:         'vishalpmehta@gmail.com',
        from_name:     formData.name,
        from_email:    formData.email,
        user_role:     currentUser?.role || 'Unknown',
        user_id:       currentUser?.id  || 'Unknown',
        submitted_at:  new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
        feedback_type: formData.type.toUpperCase(),
        priority:      formData.priority.toUpperCase(),
        subject:       formData.subject,
        message:       formData.message,
      };

      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY);
      setSubmitStatus('success');

      setTimeout(() => {
        setFormData({
          type: 'general', priority: 'medium', subject: '', message: '',
          email: currentUser?.email || '', name: currentUser?.name || '',
        });
        setSubmitStatus(null);
      }, 3000);
    } catch (error: any) {
      console.error('EmailJS error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const feedbackTypes: { value: FeedbackType; label: string }[] = [
    { value: 'bug',         label: 'Bug Report'  },
    { value: 'feature',     label: 'Feature Request' },
    { value: 'improvement', label: 'Improvement' },
    { value: 'general',     label: 'General'     },
  ];

  const priorityLevels: { value: FeedbackPriority; label: string }[] = [
    { value: 'low',    label: 'Low'    },
    { value: 'medium', label: 'Medium' },
    { value: 'high',   label: 'High'   },
  ];

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto page-content">

        {/* Page Header */}
        <div className="mb-6 flex items-center gap-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--color-primary)' }}
          >
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 style={{ color: 'var(--color-text-primary)' }}>Share Feedback</h1>
            <p className="t2 mt-0.5">Help us improve the DatamaticsBPM Client Portal</p>
          </div>
        </div>

        {/* ── Why This Platform Matters ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-3"
        >
          <button
            onClick={() => setShowPlatformVision(!showPlatformVision)}
            className="glass-card w-full p-5 text-left cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--color-primary)' }}
                >
                  <Lightbulb className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="t1">Why This Platform Matters</h3>
                  <p className="t3 mt-0.5">Vision, problems we're solving & the strategic play</p>
                </div>
              </div>
              <motion.div animate={{ rotate: showPlatformVision ? 180 : 0 }} transition={{ duration: 0.25 }}>
                <ChevronDown className="w-5 h-5" style={{ color: 'var(--color-text-muted)' }} />
              </motion.div>
            </div>
          </button>

          <AnimatePresence initial={false}>
            {showPlatformVision && (
              <motion.div
                key="vision"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="glass-card mt-2 p-6 space-y-5">
                  {/* Core Problem */}
                  <div>
                    <h4 className="t1 mb-3 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                      The Core Problem We're Solving
                    </h4>
                    <div className="space-y-2">
                      {[
                        { label: 'Internally',  text: 'Mistakes happen, things fall through the cracks, and too much time is spent on admin.' },
                        { label: 'For Clients', text: 'They have no visibility into their campaigns and have to chase us for updates.' },
                        { label: 'Financially', text: 'Invoice follow-up is manual, slow, and awkward — we get paid later than we should.' },
                      ].map(item => (
                        <div key={item.label} className="flex items-start gap-2 pl-2">
                          <span style={{ color: 'var(--color-primary)', marginTop: '2px' }}>•</span>
                          <p className="t2"><strong style={{ color: 'var(--color-text-primary)' }}>{item.label}:</strong> {item.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 4 pillars */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { icon: Zap,       title: 'Operational Efficiency', text: 'Single source of truth for every campaign, lead, invoice, and client. Less admin, fewer mistakes, faster turnaround.' },
                      { icon: Shield,    title: 'Professional Brand',     text: 'A clean, modern platform signals we\'re organized and technology-forward. Clients see us as a premium partner.' },
                      { icon: Users,     title: 'Client Visibility',      text: 'Clients see campaign progress, lead delivery, acceptance rates, and invoices in real time — no more chasing us.' },
                      { icon: DollarSign,title: 'Faster Payments',        text: 'Invoices auto-generated and visible immediately. Clients can view, download, and action directly.' },
                    ].map(card => {
                      const CardIcon = card.icon;
                      return (
                        <div
                          key={card.title}
                          className="p-4 rounded-xl"
                          style={{ background: 'var(--color-border-light)', border: '1px solid var(--color-border)' }}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div
                              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ background: 'var(--color-primary)' }}
                            >
                              <CardIcon className="w-3.5 h-3.5 text-white" />
                            </div>
                            <h5 className="t1">{card.title}</h5>
                          </div>
                          <p className="t2">{card.text}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Strategic Play */}
                  <div
                    className="p-4 rounded-xl"
                    style={{ background: 'var(--color-border-light)', border: '1px solid var(--color-border)', borderLeft: '3px solid var(--color-primary)' }}
                  >
                    <h5 className="t1 mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                      The Strategic Play
                    </h5>
                    <p className="t2 leading-relaxed">
                      Once clients use our platform and we integrate with their tools (Convertr, Salesforce, DocuSign, Tally), switching away doesn't just mean finding a new partner — it means replacing an entire workflow.{' '}
                      <strong style={{ color: 'var(--color-text-primary)' }}>We become infrastructure, not just a supplier.</strong> That's the definition of a sticky relationship.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Coming Features / Core Automations ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="mb-6"
        >
          <button
            onClick={() => setShowComingFeatures(!showComingFeatures)}
            className="glass-card w-full p-5 text-left cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--color-primary)' }}
                >
                  <Rocket className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="t1">Coming Features</h3>
                    <span
                      className="px-2 py-0.5 rounded-full"
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        background: 'var(--color-border-light)',
                        color: 'var(--color-text-secondary)',
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      5 features
                    </span>
                  </div>
                  <p className="t3 mt-0.5">Salesforce · DocuSign · Convertr · Tally · Ask Praful AI</p>
                </div>
              </div>
              <motion.div animate={{ rotate: showComingFeatures ? 180 : 0 }} transition={{ duration: 0.25 }}>
                <ChevronDown className="w-5 h-5" style={{ color: 'var(--color-text-muted)' }} />
              </motion.div>
            </div>
          </button>

          <AnimatePresence initial={false}>
            {showComingFeatures && (
              <motion.div
                key="features"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="glass-card mt-2 overflow-hidden">
                  {/* Summary bar */}
                  <div
                    className="px-5 py-4 flex items-center gap-3"
                    style={{ borderBottom: '1px solid var(--color-border)' }}
                  >
                    <GitBranch className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-text-muted)' }} />
                    <p className="t2">
                      Four automations that will make the platform the <strong style={{ color: 'var(--color-text-primary)' }}>central nervous system</strong> of the entire operation — campaigns, signatures, lead delivery, and accounting, all connected.
                    </p>
                  </div>

                  {/* Time savings strip */}
                  <div
                    className="grid grid-cols-2 sm:grid-cols-4"
                    style={{ borderBottom: '1px solid var(--color-border)' }}
                  >
                    {coreAutomations.map((a, i) => (
                      <div
                        key={a.title}
                        className="px-4 py-3 text-center"
                        style={{ borderRight: i < 3 ? '1px solid var(--color-border)' : undefined }}
                      >
                        <p className="t1" style={{ color: 'var(--color-primary)' }}>{a.saves}</p>
                        <p className="t3 mt-0.5">saved</p>
                      </div>
                    ))}
                  </div>

                  {/* Automation cards */}
                  <div className="p-4 space-y-2">
                    {coreAutomations.map((automation, idx) => {
                      const isOpen = expandedAutomation === idx;
                      const Icon = automation.icon;
                      return (
                        <div
                          key={automation.title}
                          className="rounded-xl overflow-hidden"
                          style={{ border: '1px solid var(--color-border)', background: 'var(--color-border-light)' }}
                        >
                          <button
                            className="w-full p-4 text-left flex items-start gap-3"
                            onClick={() => setExpandedAutomation(isOpen ? null : idx)}
                          >
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ background: 'var(--color-primary)' }}
                            >
                              <Icon className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="t1">{automation.title}</p>
                                  <p className="t3 mt-0.5 italic">{automation.tagline}</p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <span
                                    className="px-2 py-0.5 rounded-full"
                                    style={{
                                      fontSize: '11px',
                                      fontWeight: 600,
                                      background: 'rgba(186,32,39,0.08)',
                                      color: 'var(--color-primary)',
                                      border: '1px solid rgba(186,32,39,0.15)',
                                    }}
                                  >
                                    {automation.eta}
                                  </span>
                                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                    <ChevronDown className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
                                  </motion.div>
                                </div>
                              </div>
                              <p className="t2 mt-1.5 leading-relaxed">{automation.description}</p>
                            </div>
                          </button>

                          <AnimatePresence initial={false}>
                            {isOpen && (
                              <motion.div
                                key={`detail-${idx}`}
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25, ease: 'easeInOut' }}
                                className="overflow-hidden"
                              >
                                <div
                                  className="px-4 pb-4 space-y-3"
                                  style={{ borderTop: '1px solid var(--color-border)' }}
                                >
                                  <div className="pt-3">
                                    <p className="t3 uppercase tracking-wide mb-2">What it does</p>
                                    <ul className="space-y-1.5">
                                      {automation.bullets.map((bullet, bi) => (
                                        <li key={bi} className="flex items-start gap-2">
                                          <span
                                            className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                                            style={{ background: 'var(--color-primary)' }}
                                          />
                                          <span className="t2">{bullet}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div className="flex items-center gap-5 pt-1">
                                    <div className="flex items-center gap-1.5">
                                      <Clock className="w-3.5 h-3.5" style={{ color: 'var(--color-text-muted)' }} />
                                      <span className="t2"><strong style={{ color: 'var(--color-text-primary)' }}>Build time:</strong> {automation.buildTime}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <ArrowRight className="w-3.5 h-3.5" style={{ color: 'var(--color-text-muted)' }} />
                                      <span className="t2"><strong style={{ color: 'var(--color-text-primary)' }}>Eliminates:</strong> {automation.eliminates}</span>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}

                    {/* Ask Praful AI */}
                    {(() => {
                      const prafulIdx = coreAutomations.length;
                      const isOpen = expandedAutomation === prafulIdx;
                      return (
                        <div
                          className="rounded-xl overflow-hidden"
                          style={{
                            border: '1px solid var(--color-border)',
                            background: 'var(--color-border-light)',
                          }}
                        >
                          <button
                            className="w-full p-4 text-left flex items-start gap-3"
                            onClick={() => setExpandedAutomation(isOpen ? null : prafulIdx)}
                          >
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ background: 'var(--color-primary)' }}
                            >
                              <Bot className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="t1">Ask Praful — Resident AI</p>
                                  <p className="t3 mt-0.5 italic">Ask anything. Get instant answers — and automated actions.</p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <span
                                    className="px-2 py-0.5 rounded-full"
                                    style={{
                                      fontSize: '11px',
                                      fontWeight: 600,
                                      background: 'var(--color-border-light)',
                                      color: 'var(--color-text-secondary)',
                                      border: '1px solid var(--color-border)',
                                    }}
                                  >
                                    Coming Soon
                                  </span>
                                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                    <ChevronDown className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
                                  </motion.div>
                                </div>
                              </div>
                              <p className="t2 mt-1.5 leading-relaxed">
                                Your resident AI that lives inside this platform. Ask anything in plain English — campaigns, leads, payments, performance — and get the answer instantly.
                              </p>
                            </div>
                          </button>

                          <AnimatePresence initial={false}>
                            {isOpen && (
                              <motion.div
                                key="praful-detail"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25, ease: 'easeInOut' }}
                                className="overflow-hidden"
                              >
                                <div
                                  className="px-4 pb-4 space-y-3"
                                  style={{ borderTop: '1px solid var(--color-border)' }}
                                >
                                  <div className="pt-3">
                                    <p className="t3 uppercase tracking-wide mb-2">Example Questions</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                      {[
                                        '"What\'s the delivery status on the Barclays campaign?"',
                                        '"Which invoices are more than 30 days overdue?"',
                                        '"Show me all leads rejected last week and why."',
                                        '"Which campaigns are behind on their targets?"',
                                        '"Summarise performance for all active campaigns."',
                                        '"Which clients haven\'t paid this month?"',
                                      ].map((q, i) => (
                                        <div
                                          key={i}
                                          className="px-3 py-2 rounded-lg"
                                          style={{
                                            background: 'rgba(255,255,255,0.6)',
                                            border: '1px solid var(--color-border)',
                                          }}
                                        >
                                          <span className="t2 italic">{q}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="space-y-1.5">
                                    <p className="t3 uppercase tracking-wide">What Praful Can Do</p>
                                    {askPrafulCapabilities.map((cap) => {
                                      const CapIcon = cap.icon;
                                      return (
                                        <div
                                          key={cap.label}
                                          className="flex items-start gap-2.5 p-3 rounded-lg"
                                          style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid var(--color-border)' }}
                                        >
                                          <div
                                            className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                                            style={{ background: 'rgba(186,32,39,0.08)' }}
                                          >
                                            <CapIcon className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
                                          </div>
                                          <div>
                                            <p className="t1">{cap.label}</p>
                                            <p className="t2 mt-0.5">{cap.text}</p>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                  <div
                                    className="flex items-start gap-2.5 p-3 rounded-lg"
                                    style={{
                                      background: 'rgba(255,255,255,0.6)',
                                      border: '1px solid var(--color-border)',
                                      borderLeft: '3px solid var(--color-primary)',
                                    }}
                                  >
                                    <Sparkles className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: 'var(--color-primary)' }} />
                                    <p className="t2 leading-relaxed">
                                      <strong style={{ color: 'var(--color-text-primary)' }}>Beyond answers, Praful will act.</strong>{' '}
                                      Trigger uploads, send reminders, flag anomalies — a team member who knows everything on the platform, 24/7.
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Combined Impact */}
                  <div
                    className="mx-4 mb-4 p-4 rounded-xl flex items-start gap-3"
                    style={{
                      background: 'var(--color-border-light)',
                      border: '1px solid var(--color-border)',
                      borderLeft: '3px solid var(--color-primary)',
                    }}
                  >
                    <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--color-primary)' }} />
                    <div>
                      <p className="t1 mb-1">Combined Impact</p>
                      <p className="t2 leading-relaxed">
                        Total estimated build time for all four automations:{' '}
                        <strong style={{ color: 'var(--color-text-primary)' }}>~2–3 weeks.</strong>{' '}
                        The platform effectively becomes the central nervous system of the entire operation — campaigns, signatures, lead delivery, and accounting all connected and automated in one place.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Feedback Form ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="glass-card overflow-hidden"
        >
          {/* Form header */}
          <div
            className="px-6 py-4 flex items-center gap-3"
            style={{ borderBottom: '1px solid var(--color-border)' }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--color-primary)' }}
            >
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="t1">We Value Your Input</h2>
              <p className="t3 mt-0.5">Share bugs, feature ideas, or general thoughts</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Type + Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1.5" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                  Feedback Type
                </label>
                <div className="flex gap-1.5 flex-wrap">
                  {feedbackTypes.map(type => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                      className="px-3 py-1.5 rounded-lg border transition-all"
                      style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        borderColor: formData.type === type.value ? 'var(--color-primary)' : 'var(--color-border)',
                        background: formData.type === type.value ? 'rgba(186,32,39,0.06)' : 'white',
                        color: formData.type === type.value ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                      }}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block mb-1.5" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                  Priority
                </label>
                <div className="flex gap-1.5">
                  {priorityLevels.map(priority => (
                    <button
                      key={priority.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, priority: priority.value }))}
                      className="flex-1 py-1.5 px-3 rounded-lg border transition-all"
                      style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        borderColor: formData.priority === priority.value ? 'var(--color-primary)' : 'var(--color-border)',
                        background: formData.priority === priority.value ? 'rgba(186,32,39,0.06)' : 'white',
                        color: formData.priority === priority.value ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                      }}
                    >
                      {priority.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Name + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="name" className="block mb-1.5" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                  Your Name
                </label>
                <input
                  type="text" id="name" name="name" value={formData.name}
                  onChange={handleInputChange} required
                  className="input-base px-3 py-2.5"
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-1.5" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                  Your Email
                </label>
                <input
                  type="email" id="email" name="email" value={formData.email}
                  onChange={handleInputChange} required
                  className="input-base px-3 py-2.5"
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block mb-1.5" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                Subject
              </label>
              <input
                type="text" id="subject" name="subject" value={formData.subject}
                onChange={handleInputChange} required placeholder="Brief summary of your feedback"
                className="input-base px-3 py-2.5"
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block mb-1.5" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                Message
              </label>
              <textarea
                id="message" name="message" value={formData.message}
                onChange={handleInputChange} required rows={5}
                placeholder="Please provide as much detail as possible..."
                className="input-base px-3 py-2.5 resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || submitStatus === 'success'}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Submitting...</span></>
              ) : submitStatus === 'success' ? (
                <><CheckCircle2 className="w-4 h-4" /><span>Feedback Sent!</span></>
              ) : (
                <><Send className="w-4 h-4" /><span>Submit Feedback</span></>
              )}
            </button>

            <AnimatePresence>
              {submitStatus === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="p-3 rounded-xl flex items-center gap-3"
                  style={{ background: 'var(--color-success-bg)', border: '1px solid var(--color-success)' }}
                >
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-success)' }} />
                  <div>
                    <p className="t1" style={{ color: 'var(--color-success)' }}>Thank you for your feedback!</p>
                    <p className="t2 mt-0.5">We've received your message and will review it shortly.</p>
                  </div>
                </motion.div>
              )}
              {submitStatus === 'error' && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="p-3 rounded-xl flex items-center gap-3"
                  style={{ background: 'var(--color-error-bg)', border: '1px solid var(--color-error)' }}
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-error)' }} />
                  <div>
                    <p className="t1" style={{ color: 'var(--color-error)' }}>Something went wrong</p>
                    <p className="t2 mt-0.5">Please try again or contact support if the issue persists.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          {/* What happens next */}
          <div className="px-6 pb-6">
            <div
              className="p-4 rounded-xl"
              style={{ background: 'var(--color-border-light)', border: '1px solid var(--color-border)' }}
            >
              <p className="t1 mb-2">What happens next?</p>
              <ul className="space-y-1.5">
                {[
                  'Our team reviews feedback within 24–48 hours',
                  'High priority issues are addressed immediately',
                  `Email confirmation sent to ${formData.email || 'your email'}`,
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'var(--color-primary)' }} />
                    <span className="t2">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
