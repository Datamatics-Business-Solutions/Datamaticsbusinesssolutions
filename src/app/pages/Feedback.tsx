import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppLayout } from '../components/AppLayout';
import {
  MessageSquare, Send, CheckCircle2, AlertCircle, Lightbulb,
  TrendingUp, Zap, Shield, Users, DollarSign, ChevronDown,
  Rocket, GitBranch, Clock, FileSignature, Upload, Receipt,
  ArrowRight, Sparkles, Bot, Brain, BarChart3, CreditCard, Target,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import * as emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = 'service_2cz8e3g';
const EMAILJS_TEMPLATE_ID = 'template_4xaaoqg';
const EMAILJS_PUBLIC_KEY = '_oEucjCREDn4wOTcz';

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

// ── Core automations from the roadmap doc ──────────────────────────────────
const coreAutomations = [
  {
    icon: TrendingUp,
    emoji: '🏢',
    color: 'blue',
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
    icon: FileSignature,
    emoji: '✍️',
    color: 'purple',
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
    emoji: '📤',
    color: 'green',
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
    emoji: '🧾',
    color: 'amber',
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

// ── Ask Praful AI feature ──────────────────────────────────────────────────
const askPrafulCapabilities = [
  { icon: Target, label: 'Campaign Intelligence', text: 'Full breakdown of any campaign — status, delivery rate, lead quality, remaining targets, and what actions are pending.' },
  { icon: Users, label: 'Lead Insights', text: 'Ask about leads across any campaign: how many delivered, accepted, rejected, why they were rejected, and patterns in the data.' },
  { icon: BarChart3, label: 'Metrics & Performance', text: 'Plain-English summaries of KPIs, conversion rates, cost-per-lead, and campaign ROI — no need to dig through dashboards.' },
  { icon: CreditCard, label: 'Outstanding Payments', text: 'Instant visibility on which invoices are overdue, by how much, and for which clients — plus suggested next steps.' },
  { icon: Brain, label: 'Automated Actions', text: 'Praful won\'t just answer — it will act. Trigger lead uploads, flag anomalies, send reminders, and surface what needs your attention today.' },
];

const colorMap: Record<string, {
  gradientFrom: string; gradientTo: string;
  bg: string; lightBg: string; text: string; border: string;
  badge: string; iconBg: string; bulletDot: string;
}> = {
  blue: {
    gradientFrom: 'from-blue-500', gradientTo: 'to-blue-700',
    bg: 'bg-blue-50', lightBg: 'bg-blue-50/60', text: 'text-blue-700',
    border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700',
    iconBg: 'bg-blue-600', bulletDot: 'bg-blue-400',
  },
  purple: {
    gradientFrom: 'from-purple-500', gradientTo: 'to-violet-700',
    bg: 'bg-purple-50', lightBg: 'bg-purple-50/60', text: 'text-purple-700',
    border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700',
    iconBg: 'bg-purple-600', bulletDot: 'bg-purple-400',
  },
  green: {
    gradientFrom: 'from-emerald-500', gradientTo: 'to-green-700',
    bg: 'bg-emerald-50', lightBg: 'bg-emerald-50/60', text: 'text-emerald-700',
    border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-700',
    iconBg: 'bg-emerald-600', bulletDot: 'bg-emerald-400',
  },
  amber: {
    gradientFrom: 'from-amber-500', gradientTo: 'to-orange-600',
    bg: 'bg-amber-50', lightBg: 'bg-amber-50/60', text: 'text-amber-700',
    border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700',
    iconBg: 'bg-amber-600', bulletDot: 'bg-amber-400',
  },
};

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
      if (
        EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID' ||
        EMAILJS_TEMPLATE_ID === 'YOUR_TEMPLATE_ID' ||
        EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY'
      ) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSubmitStatus('success');
      } else {
        const templateParams = {
          from_name: formData.name,
          from_email: formData.email,
          feedback_type: formData.type.toUpperCase(),
          priority: formData.priority.toUpperCase(),
          subject: formData.subject,
          message: formData.message,
          user_role: currentUser?.role || 'Unknown',
          user_id: currentUser?.id || 'Unknown',
          submitted_at: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
        };

        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY);
        setSubmitStatus('success');
      }

      setTimeout(() => {
        setFormData({
          type: 'general', priority: 'medium', subject: '', message: '',
          email: currentUser?.email || '', name: currentUser?.name || '',
        });
        setSubmitStatus(null);
      }, 2500);
    } catch (error) {
      console.error('Error sending feedback:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const feedbackTypes: { value: FeedbackType; label: string }[] = [
    { value: 'bug', label: 'Bug Report' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'improvement', label: 'Improvement' },
    { value: 'general', label: 'General' },
  ];

  const priorityLevels: { value: FeedbackPriority; label: string }[] = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];

  const inputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = '#BA2027';
    e.target.style.boxShadow = '0 0 0 3px rgba(186, 32, 39, 0.1)';
  };
  const inputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = 'rgb(229, 231, 235)';
    e.target.style.boxShadow = 'none';
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 md:py-8 lg:px-8">

        {/* Page Header */}
        <div className="mb-6 flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #BA2027 0%, #DC143C 100%)' }}
          >
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Share Feedback</h1>
            <p className="text-sm text-gray-500 mt-0.5">Help us improve the DatamaticsBPM Client Portal</p>
          </div>
        </div>

        {/* ── Why This Platform Matters ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-4"
        >
          <button
            onClick={() => setShowPlatformVision(!showPlatformVision)}
            className="w-full p-5 rounded-2xl text-left transition-all"
            style={{
              background: 'linear-gradient(135deg, rgba(186,32,39,0.07) 0%, rgba(220,20,60,0.07) 100%)',
              border: '2px solid rgba(186,32,39,0.18)',
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#BA2027] to-[#DC143C] shadow">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Why This Platform Matters</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Vision, problems we're solving & the strategic play</p>
                </div>
              </div>
              <motion.div animate={{ rotate: showPlatformVision ? 180 : 0 }} transition={{ duration: 0.25 }}>
                <ChevronDown className="w-5 h-5 text-[#BA2027]" />
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
                <div
                  className="mt-3 rounded-2xl p-7 space-y-6"
                  style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 20px rgba(186,32,39,0.08)' }}
                >
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-[#BA2027]" />
                      The Core Problem We're Solving
                    </h4>
                    <div className="space-y-1.5 text-sm text-gray-700">
                      {[
                        { label: 'Internally', text: 'Mistakes happen, things fall through the cracks, and too much time is spent on admin.' },
                        { label: 'For Clients', text: 'They have no visibility into their campaigns and have to chase us for updates.' },
                        { label: 'Financially', text: 'Invoice follow-up is manual, slow, and awkward — we get paid later than we should.' },
                      ].map(item => (
                        <div key={item.label} className="flex items-start gap-2 pl-3">
                          <span className="text-[#BA2027] mt-0.5">•</span>
                          <span><strong>{item.label}:</strong> {item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { icon: Zap, color: 'bg-blue-600', bg: 'from-blue-50 to-blue-100 border-blue-200', title: 'Operational Efficiency', titleColor: 'text-blue-900', textColor: 'text-blue-800', text: 'Single source of truth for every campaign, lead, invoice, and client. Less admin, fewer mistakes, faster turnaround.' },
                      { icon: Shield, color: 'bg-purple-600', bg: 'from-purple-50 to-purple-100 border-purple-200', title: 'Professional Brand', titleColor: 'text-purple-900', textColor: 'text-purple-800', text: 'A clean, modern platform signals we\'re organized and technology-forward. Clients see us as a premium partner.' },
                      { icon: Users, color: 'bg-green-600', bg: 'from-green-50 to-green-100 border-green-200', title: 'Client Visibility', titleColor: 'text-green-900', textColor: 'text-green-800', text: 'Clients see campaign progress, lead delivery, acceptance rates, and invoices in real time — no more chasing us.' },
                      { icon: DollarSign, color: 'bg-amber-600', bg: 'from-amber-50 to-amber-100 border-amber-200', title: 'Faster Payments', titleColor: 'text-amber-900', textColor: 'text-amber-800', text: 'Invoices auto-generated and visible immediately. Clients can view, download, and action directly. Automated reminders.' },
                    ].map(card => (
                      <div key={card.title} className={`p-4 rounded-xl bg-gradient-to-br ${card.bg} border`}>
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-8 h-8 rounded-lg ${card.color} flex items-center justify-center`}>
                            <card.icon className="w-4 h-4 text-white" />
                          </div>
                          <h5 className={`font-bold text-sm ${card.titleColor}`}>{card.title}</h5>
                        </div>
                        <p className={`text-xs ${card.textColor}`}>{card.text}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-5 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 text-white">
                    <h5 className="font-bold mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      The Strategic Play
                    </h5>
                    <p className="text-sm text-gray-200 leading-relaxed">
                      Once clients use our platform and we integrate with their tools (Convertr, Salesforce, DocuSign, Tally), switching away doesn't just mean finding a new partner — it means replacing an entire workflow.{' '}
                      <strong className="text-white">We become infrastructure, not just a supplier.</strong> That's the definition of a sticky relationship.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Coming Features / Core Automations ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="mb-6"
        >
          <button
            onClick={() => setShowComingFeatures(!showComingFeatures)}
            className="w-full p-5 rounded-2xl text-left transition-all"
            style={{
              background: 'linear-gradient(135deg, rgba(79,70,229,0.07) 0%, rgba(109,40,217,0.07) 100%)',
              border: '2px solid rgba(79,70,229,0.18)',
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-600 shadow">
                  <Rocket className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900">Coming Features</h3>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
                      5 features
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">Salesforce · DocuSign · Convertr · Tally · Ask Praful AI</p>
                </div>
              </div>
              <motion.div animate={{ rotate: showComingFeatures ? 180 : 0 }} transition={{ duration: 0.25 }}>
                <ChevronDown className="w-5 h-5 text-indigo-500" />
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
                <div
                  className="mt-3 rounded-2xl overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 20px rgba(79,70,229,0.08)' }}
                >
                  {/* Summary bar */}
                  <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                    <GitBranch className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                    <p className="text-sm text-gray-600">
                      Four automations that will make the platform the <strong className="text-gray-800">central nervous system</strong> of the entire operation — campaigns, signatures, lead delivery, and accounting, all connected.
                    </p>
                  </div>

                  {/* Impact summary strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-100 border-b border-gray-100">
                    {coreAutomations.map(a => {
                      const c = colorMap[a.color];
                      return (
                        <div key={a.title} className="px-4 py-3 text-center">
                          <p className={`text-xs font-semibold ${c.text}`}>{a.saves}</p>
                          <p className="text-xs text-gray-400 mt-0.5">saved</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Automation cards */}
                  <div className="p-5 space-y-3">
                    {coreAutomations.map((automation, idx) => {
                      const c = colorMap[automation.color];
                      const isOpen = expandedAutomation === idx;
                      const Icon = automation.icon;
                      return (
                        <div
                          key={automation.title}
                          className={`rounded-xl border overflow-hidden transition-all ${c.bg} ${c.border}`}
                        >
                          {/* Card header — always visible */}
                          <button
                            className="w-full p-4 text-left flex items-start gap-3"
                            onClick={() => setExpandedAutomation(isOpen ? null : idx)}
                          >
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${c.iconBg}`}>
                              <Icon className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className={`font-bold text-sm ${c.text}`}>{automation.emoji} {automation.title}</p>
                                  <p className="text-xs text-gray-500 mt-0.5 italic">{automation.tagline}</p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c.badge}`}>
                                    {automation.eta}
                                  </span>
                                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                    <ChevronDown className={`w-4 h-4 ${c.text}`} />
                                  </motion.div>
                                </div>
                              </div>
                              <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">{automation.description}</p>
                            </div>
                          </button>

                          {/* Expanded detail */}
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
                                <div className="px-4 pb-4 space-y-3">
                                  <div className="border-t border-white/60 pt-3">
                                    <p className={`text-xs font-semibold ${c.text} mb-2`}>What it does:</p>
                                    <ul className="space-y-1.5">
                                      {automation.bullets.map((bullet, bi) => (
                                        <li key={bi} className="flex items-start gap-2 text-xs text-gray-700">
                                          <span className={`w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0 ${c.bulletDot}`} />
                                          {bullet}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div className="flex items-center gap-4 pt-1">
                                    <div className="flex items-center gap-1.5">
                                      <Clock className={`w-3.5 h-3.5 ${c.text}`} />
                                      <span className="text-xs text-gray-600"><strong>Build time:</strong> {automation.buildTime}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <ArrowRight className={`w-3.5 h-3.5 ${c.text}`} />
                                      <span className="text-xs text-gray-600"><strong>Eliminates:</strong> {automation.eliminates}</span>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}

                    {/* ── Ask Praful AI card ── */}
                    {(() => {
                      const prafulIdx = coreAutomations.length;
                      const isOpen = expandedAutomation === prafulIdx;
                      return (
                        <div
                          className="rounded-xl overflow-hidden transition-all relative"
                          style={{
                            background: 'linear-gradient(135deg, rgba(15,23,42,0.94) 0%, rgba(30,27,75,0.94) 100%)',
                            border: '1.5px solid rgba(139,92,246,0.4)',
                            boxShadow: '0 0 0 1px rgba(139,92,246,0.08), 0 4px 16px rgba(124,58,237,0.15)',
                          }}
                        >
                          <div className="absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.5), transparent)' }} />
                          <button
                            className="w-full p-4 text-left flex items-start gap-3"
                            onClick={() => setExpandedAutomation(isOpen ? null : prafulIdx)}
                          >
                            <div
                              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)', boxShadow: '0 0 12px rgba(124,58,237,0.4)' }}
                            >
                              <Bot className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="font-bold text-sm" style={{ color: '#e9d5ff' }}>🤖 Ask Praful — Resident AI</p>
                                  <p className="text-xs mt-0.5 italic" style={{ color: 'rgba(196,181,253,0.65)' }}>Ask anything. Get instant answers — and automated actions.</p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: 'rgba(52,211,153,0.15)', color: '#6ee7b7', border: '1px solid rgba(52,211,153,0.3)' }}>
                                    Coming Soon
                                  </span>
                                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                    <ChevronDown className="w-4 h-4" style={{ color: 'rgba(167,139,250,0.8)' }} />
                                  </motion.div>
                                </div>
                              </div>
                              <p className="text-xs mt-1.5 leading-relaxed" style={{ color: 'rgba(196,181,253,0.6)' }}>
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
                                <div className="px-4 pb-4 space-y-3" style={{ borderTop: '1px solid rgba(139,92,246,0.15)' }}>
                                  <div className="pt-3">
                                    <p className="text-xs font-semibold mb-2" style={{ color: 'rgba(167,139,250,0.8)' }}>EXAMPLE QUESTIONS</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                      {[
                                        '"What\'s the delivery status on the Barclays campaign?"',
                                        '"Which invoices are more than 30 days overdue?"',
                                        '"Show me all leads rejected last week and why."',
                                        '"Which campaigns are behind on their targets?"',
                                        '"Summarise performance for all active campaigns."',
                                        '"Which clients haven\'t paid this month?"',
                                      ].map((q, i) => (
                                        <div key={i} className="px-2.5 py-1.5 rounded-lg text-xs" style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)', color: 'rgba(221,214,254,0.8)', fontStyle: 'italic' }}>
                                          {q}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="space-y-1.5">
                                    <p className="text-xs font-semibold" style={{ color: 'rgba(167,139,250,0.8)' }}>WHAT PRAFUL CAN DO</p>
                                    {askPrafulCapabilities.map((cap) => {
                                      const CapIcon = cap.icon;
                                      return (
                                        <div key={cap.label} className="flex items-start gap-2.5 p-2.5 rounded-lg" style={{ background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.12)' }}>
                                          <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(124,58,237,0.25)' }}>
                                            <CapIcon className="w-3.5 h-3.5" style={{ color: '#c4b5fd' }} />
                                          </div>
                                          <div>
                                            <p className="text-xs font-semibold" style={{ color: '#e9d5ff' }}>{cap.label}</p>
                                            <p className="text-xs leading-relaxed" style={{ color: 'rgba(196,181,253,0.6)' }}>{cap.text}</p>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                  <div className="flex items-start gap-2 p-3 rounded-lg" style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.18) 0%, rgba(79,70,229,0.18) 100%)', border: '1px solid rgba(139,92,246,0.22)' }}>
                                    <Sparkles className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: '#c4b5fd' }} />
                                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(221,214,254,0.8)' }}>
                                      <strong style={{ color: '#e9d5ff' }}>Beyond answers, Praful will act.</strong>{' '}
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

                  {/* Combined impact */}
                  <div className="mx-5 mb-5 p-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-700 text-white">
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-sm">Combined Impact</p>
                        <p className="text-xs text-indigo-100 mt-1 leading-relaxed">
                          Total estimated build time for all four automations: <strong className="text-white">~2–3 weeks.</strong> The platform effectively becomes the central nervous system of the entire operation — campaigns, signatures, lead delivery, and accounting all connected and automated in one place.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Feedback Form (compact) ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow: '0 8px 32px rgba(186,32,39,0.08)',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          {/* Form header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #BA2027 0%, #DC143C 100%)' }}
            >
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">We Value Your Input</h2>
              <p className="text-xs text-gray-500 mt-0.5">Share bugs, feature ideas, or general thoughts</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Type + Priority on one row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Feedback Type */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Feedback Type</label>
                <div className="flex gap-1.5 flex-wrap">
                  {feedbackTypes.map(type => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                        formData.type === type.value
                          ? 'border-[#BA2027] bg-red-50 text-[#BA2027]'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                      style={{
                        boxShadow: formData.type === type.value ? '0 2px 8px rgba(186,32,39,0.12)' : 'none',
                      }}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Priority</label>
                <div className="flex gap-1.5">
                  {priorityLevels.map(priority => (
                    <button
                      key={priority.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, priority: priority.value }))}
                      className={`flex-1 py-1.5 px-3 rounded-lg border text-xs font-semibold transition-all ${
                        formData.priority === priority.value
                          ? 'border-[#BA2027] bg-red-50 text-[#BA2027]'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                      style={{
                        boxShadow: formData.priority === priority.value ? '0 2px 8px rgba(186,32,39,0.12)' : 'none',
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
                <label htmlFor="name" className="block text-xs font-semibold text-gray-600 mb-1.5">Your Name</label>
                <input
                  type="text" id="name" name="name" value={formData.name}
                  onChange={handleInputChange} required
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 bg-white focus:outline-none focus:ring-0 transition-all text-sm text-gray-900"
                  style={{ borderColor: 'rgb(229,231,235)' }}
                  onFocus={inputFocus} onBlur={inputBlur}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-gray-600 mb-1.5">Your Email</label>
                <input
                  type="email" id="email" name="email" value={formData.email}
                  onChange={handleInputChange} required
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 bg-white focus:outline-none focus:ring-0 transition-all text-sm text-gray-900"
                  style={{ borderColor: 'rgb(229,231,235)' }}
                  onFocus={inputFocus} onBlur={inputBlur}
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block text-xs font-semibold text-gray-600 mb-1.5">Subject</label>
              <input
                type="text" id="subject" name="subject" value={formData.subject}
                onChange={handleInputChange} required placeholder="Brief summary of your feedback"
                className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 bg-white focus:outline-none focus:ring-0 transition-all text-sm text-gray-900 placeholder-gray-400"
                style={{ borderColor: 'rgb(229,231,235)' }}
                onFocus={inputFocus} onBlur={inputBlur}
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-xs font-semibold text-gray-600 mb-1.5">Message</label>
              <textarea
                id="message" name="message" value={formData.message}
                onChange={handleInputChange} required rows={5}
                placeholder="Please provide as much detail as possible..."
                className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 bg-white focus:outline-none focus:ring-0 transition-all resize-none text-sm text-gray-900 placeholder-gray-400"
                style={{ borderColor: 'rgb(229,231,235)' }}
                onFocus={inputFocus} onBlur={inputBlur}
              />
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isSubmitting || submitStatus === 'success'}
              whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
              className="w-full px-6 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, #BA2027 0%, #DC143C 100%)',
                boxShadow: '0 4px 12px rgba(186,32,39,0.25)',
              }}
            >
              {isSubmitting ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Submitting...</span></>
              ) : submitStatus === 'success' ? (
                <><CheckCircle2 className="w-4 h-4" /><span>Feedback Sent!</span></>
              ) : (
                <><Send className="w-4 h-4" /><span>Submit Feedback</span></>
              )}
            </motion.button>

            <AnimatePresence>
              {submitStatus === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="p-3 rounded-xl bg-green-50 border border-green-200 flex items-center gap-3"
                >
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm text-green-900">Thank you for your feedback!</p>
                    <p className="text-xs text-green-700 mt-0.5">We've received your message and will review it shortly.</p>
                  </div>
                </motion.div>
              )}
              {submitStatus === 'error' && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3"
                >
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm text-red-900">Something went wrong</p>
                    <p className="text-xs text-red-700 mt-0.5">Please try again or contact support if the issue persists.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          {/* What happens next */}
          <div className="px-6 pb-6">
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
              <p className="text-xs font-semibold text-blue-900 mb-1.5">What happens next?</p>
              <ul className="space-y-1 text-xs text-blue-800">
                <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span><span>Our team reviews feedback within 24–48 hours</span></li>
                <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span><span>High priority issues are addressed immediately</span></li>
                <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span><span>Email confirmation sent to {formData.email || 'your email'}</span></li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}