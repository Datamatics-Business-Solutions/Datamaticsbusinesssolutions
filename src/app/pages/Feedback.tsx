import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PageLayout } from '../components/PageLayout';
import { MessageSquare, Send, CheckCircle2, AlertCircle, Lightbulb, TrendingUp, Zap, Shield, Users, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import * as emailjs from '@emailjs/browser';

// EmailJS Configuration - Replace these with your actual values from EmailJS dashboard
const EMAILJS_SERVICE_ID = 'service_2cz8e3g'; // Your EmailJS Service ID
const EMAILJS_TEMPLATE_ID = 'template_4xaaoqg'; // e.g., 'template_xyz456'
const EMAILJS_PUBLIC_KEY = '_oEucjCREDn4wOTcz'; // Your EmailJS Public Key

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
      // Check if EmailJS is configured
      if (
        EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID' ||
        EMAILJS_TEMPLATE_ID === 'YOUR_TEMPLATE_ID' ||
        EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY'
      ) {
        console.warn('EmailJS is not configured. Please add your EmailJS credentials.');
        // Fall back to console logging for demo purposes
        console.log('Feedback submitted:', {
          ...formData,
          submittedAt: new Date().toISOString(),
          userId: currentUser?.id,
          userRole: currentUser?.role,
        });
        
        // Simulate success
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSubmitStatus('success');
      } else {
        // Send email using EmailJS
        const templateParams = {
          from_name: formData.name,
          from_email: formData.email,
          feedback_type: formData.type.toUpperCase(),
          priority: formData.priority.toUpperCase(),
          subject: formData.subject,
          message: formData.message,
          user_role: currentUser?.role || 'Unknown',
          user_id: currentUser?.id || 'Unknown',
          submitted_at: new Date().toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
          }),
        };

        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          templateParams,
          EMAILJS_PUBLIC_KEY
        );

        setSubmitStatus('success');
      }
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({
          type: 'general',
          priority: 'medium',
          subject: '',
          message: '',
          email: currentUser?.email || '',
          name: currentUser?.name || '',
        });
        setSubmitStatus(null);
      }, 2000);
    } catch (error) {
      console.error('Error sending feedback:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const feedbackTypes = [
    { value: 'bug', label: 'Bug Report', description: 'Report a technical issue' },
    { value: 'feature', label: 'Feature Request', description: 'Suggest a new feature' },
    { value: 'improvement', label: 'Improvement', description: 'Suggest an enhancement' },
    { value: 'general', label: 'General Feedback', description: 'Share your thoughts' },
  ];

  const priorityLevels = [
    { value: 'low', label: 'Low', color: 'text-green-600' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
    { value: 'high', label: 'High', color: 'text-red-600' },
  ];

  return (
    <PageLayout
      title="Share Feedback"
      description="Help us improve the DatamaticsBPM Client Portal"
      icon={MessageSquare}
    >
      <div className="max-w-4xl mx-auto">
        {/* Why This Platform Matters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <motion.button
            onClick={() => setShowPlatformVision(!showPlatformVision)}
            className="w-full p-6 rounded-2xl overflow-hidden text-left transition-all"
            style={{
              background: 'linear-gradient(135deg, rgba(186, 32, 39, 0.08) 0%, rgba(220, 20, 60, 0.08) 100%)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px 0 rgba(186, 32, 39, 0.1)',
              border: '2px solid rgba(186, 32, 39, 0.2)',
            }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#BA2027] to-[#DC143C] shadow-lg">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Why This Platform Matters</h3>
                  <p className="text-sm text-gray-600 mt-0.5">Learn about the vision behind this portal</p>
                </div>
              </div>
              <motion.div
                animate={{ rotate: showPlatformVision ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-6 h-6 text-[#BA2027]" />
              </motion.div>
            </div>
          </motion.button>

          <motion.div
            initial={false}
            animate={{
              height: showPlatformVision ? 'auto' : 0,
              opacity: showPlatformVision ? 1 : 0,
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: showPlatformVision ? 1 : 0, y: showPlatformVision ? 0 : -20 }}
              transition={{ duration: 0.3, delay: showPlatformVision ? 0.1 : 0 }}
              className="mt-4 rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px 0 rgba(186, 32, 39, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
              }}
            >
              <div className="p-8 space-y-6">
                {/* Core Problem */}
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-[#BA2027]" />
                    The Core Problem We're Solving
                  </h4>
                  <p className="text-gray-700 mb-3">
                    Right now our operations run on emails, spreadsheets, and manual follow-ups. This creates three consistent pain points:
                  </p>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-start gap-2 pl-4">
                      <span className="text-[#BA2027] mt-1">•</span>
                      <span><strong>Internally:</strong> Mistakes happen, things fall through the cracks, and too much time is spent on admin.</span>
                    </div>
                    <div className="flex items-start gap-2 pl-4">
                      <span className="text-[#BA2027] mt-1">•</span>
                      <span><strong>For Clients:</strong> They have no visibility into their campaigns and have to chase us for updates.</span>
                    </div>
                    <div className="flex items-start gap-2 pl-4">
                      <span className="text-[#BA2027] mt-1">•</span>
                      <span><strong>Financially:</strong> Invoice follow-up is manual, slow, and awkward, which means we get paid later than we should.</span>
                    </div>
                  </div>
                </div>

                {/* Key Benefits Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Operational Efficiency */}
                  <div className="p-5 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      <h5 className="font-bold text-blue-900">Operational Efficiency</h5>
                    </div>
                    <p className="text-sm text-blue-800">
                      Single source of truth for every campaign, lead, invoice, and client. Less admin time, fewer mistakes, faster turnaround—handle more clients without adding headcount.
                    </p>
                  </div>

                  {/* Professional Brand */}
                  <div className="p-5 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <h5 className="font-bold text-purple-900">Professional Brand</h5>
                    </div>
                    <p className="text-sm text-purple-800">
                      Clean, modern platform signals we're organized and technology-forward. Clients see us as a premium partner, not just a vendor.
                    </p>
                  </div>

                  {/* Client Visibility */}
                  <div className="p-5 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <h5 className="font-bold text-green-900">Client Visibility</h5>
                    </div>
                    <p className="text-sm text-green-800">
                      Clients see campaign progress, lead delivery, acceptance rates, and invoices in real time. No more chasing us for updates—fewer check-in calls, stronger relationships.
                    </p>
                  </div>

                  {/* Faster Payments */}
                  <div className="p-5 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-600 flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-white" />
                      </div>
                      <h5 className="font-bold text-amber-900">Faster Payments</h5>
                    </div>
                    <p className="text-sm text-amber-800">
                      Invoices are auto-generated and visible immediately. Clients can view, download, and action invoices directly. Automated reminders—no awkward chase calls.
                    </p>
                  </div>
                </div>

                {/* Strategic Value */}
                <div className="p-6 rounded-xl bg-gradient-to-r from-[#BA2027]/5 to-[#DC143C]/5 border-2 border-[#BA2027]/20">
                  <h5 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#BA2027]" />
                    The Strategic Play
                  </h5>
                  <p className="text-sm text-gray-700">
                    Once clients set up campaigns through our platform and we integrate with their existing tools (Convertr, CRM, accounting), switching away doesn't just mean finding a new partner—it means replacing an entire workflow. <strong className="text-[#BA2027]">We become infrastructure, not just a supplier.</strong> That's the definition of a sticky relationship.
                  </p>
                </div>

                {/* Competitive Edge */}
                <div className="p-5 rounded-xl bg-gray-50 border border-gray-200">
                  <h5 className="font-bold text-gray-900 mb-2">Competitive Differentiation</h5>
                  <p className="text-sm text-gray-700">
                    Very few companies at our level have built a proprietary client-facing platform. Most competitors are still running on email and spreadsheets. This platform becomes <strong>a genuine differentiator in sales conversations</strong>—something tangible that signals operational maturity and client-centricity.
                  </p>
                </div>

                {/* The Bottom Line */}
                <div className="p-6 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 text-white">
                  <h5 className="font-bold mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    The Bottom Line
                  </h5>
                  <p className="text-sm text-gray-100 leading-relaxed">
                    We have built a client-facing platform that solves three problems simultaneously—it makes our operations more efficient, gives clients the real-time visibility they've always asked for, and creates sticky relationships that make us hard to leave. The platform positions us as modern and technology-forward, and opens a clear path to monetizing the tool through subscriptions as we scale.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px 0 rgba(186, 32, 39, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
          }}
        >
          {/* Header Section */}
          <div className="p-8 pb-6 border-b border-gray-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #BA2027 0%, #DC143C 100%)' }}
              >
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">We Value Your Input</h2>
                <p className="mt-1 text-gray-600">
                  Your feedback helps us build a better experience for everyone. Share bugs, feature ideas, or general thoughts.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Feedback Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Feedback Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {feedbackTypes.map((type) => (
                  <motion.button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: type.value as FeedbackType }))}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      formData.type === type.value
                        ? 'border-[#BA2027] bg-red-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                    style={{
                      boxShadow: formData.type === type.value ? '0 4px 12px rgba(186, 32, 39, 0.15)' : 'none'
                    }}
                  >
                    <div className="font-semibold text-gray-900">{type.label}</div>
                    <div className="text-sm text-gray-600 mt-1">{type.description}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Priority
              </label>
              <div className="flex gap-3">
                {priorityLevels.map((priority) => (
                  <motion.button
                    key={priority.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, priority: priority.value as FeedbackPriority }))}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex-1 py-3 px-4 rounded-xl border-2 font-semibold transition-all ${
                      formData.priority === priority.value
                        ? 'border-[#BA2027] bg-red-50 text-gray-900'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {priority.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Name and Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:outline-none focus:ring-0 transition-all text-gray-900"
                  style={{
                    borderColor: 'rgb(229, 231, 235)',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#BA2027';
                    e.target.style.boxShadow = '0 0 0 3px rgba(186, 32, 39, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgb(229, 231, 235)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:outline-none focus:ring-0 transition-all text-gray-900"
                  style={{
                    borderColor: 'rgb(229, 231, 235)',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#BA2027';
                    e.target.style.boxShadow = '0 0 0 3px rgba(186, 32, 39, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgb(229, 231, 235)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                placeholder="Brief summary of your feedback"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:outline-none focus:ring-0 transition-all text-gray-900 placeholder-gray-400"
                style={{
                  borderColor: 'rgb(229, 231, 235)',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#BA2027';
                  e.target.style.boxShadow = '0 0 0 3px rgba(186, 32, 39, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgb(229, 231, 235)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={6}
                placeholder="Please provide as much detail as possible..."
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:outline-none focus:ring-0 transition-all resize-none text-gray-900 placeholder-gray-400"
                style={{
                  borderColor: 'rgb(229, 231, 235)',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#BA2027';
                  e.target.style.boxShadow = '0 0 0 3px rgba(186, 32, 39, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgb(229, 231, 235)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center gap-4 pt-4">
              <motion.button
                type="submit"
                disabled={isSubmitting || submitStatus === 'success'}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                className="flex-1 px-6 py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, #BA2027 0%, #DC143C 100%)',
                  boxShadow: '0 4px 12px rgba(186, 32, 39, 0.3)',
                }}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : submitStatus === 'success' ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Feedback Sent!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Submit Feedback</span>
                  </>
                )}
              </motion.button>
            </div>

            {/* Success/Error Messages */}
            {submitStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-green-50 border border-green-200 flex items-center gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-green-900">Thank you for your feedback!</p>
                  <p className="text-sm text-green-700 mt-0.5">
                    We've received your message and will review it shortly.
                  </p>
                </div>
              </motion.div>
            )}

            {submitStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-red-900">Something went wrong</p>
                  <p className="text-sm text-red-700 mt-0.5">
                    Please try again or contact support if the issue persists.
                  </p>
                </div>
              </motion.div>
            )}
          </form>

          {/* Info Section */}
          <div className="px-8 pb-8">
            <div className="p-6 rounded-xl bg-blue-50 border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Our team will review your feedback within 24-48 hours</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>High priority issues will be addressed immediately</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>You'll receive an email confirmation at {formData.email}</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
}