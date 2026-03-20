import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface EmailDigestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function getCurrentMonthYear() {
  return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function EmailDigestModal({ isOpen, onClose }: EmailDigestModalProps) {
  const handleSend = () => {
    toast.success('Digest sent to tj.leyland@intentsify.com!');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden z-10 flex flex-col"
            style={{ maxHeight: '90vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Email header bar */}
            <div className="bg-gray-100 border-b border-gray-200 px-6 py-4 flex-shrink-0">
              <div className="space-y-1" style={{ fontSize: '13px', color: '#374151' }}>
                <div className="flex gap-2">
                  <span className="font-semibold text-gray-500 w-16">From:</span>
                  <span>reports@datamatics.com</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-semibold text-gray-500 w-16">To:</span>
                  <span>tj.leyland@intentsify.com</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-semibold text-gray-500 w-16">Subject:</span>
                  <span className="font-medium text-gray-800">Your Weekly Campaign Performance Digest</span>
                </div>
              </div>
            </div>

            {/* Email body — scrollable */}
            <div className="flex-1 overflow-y-auto bg-gray-50">
              <div className="max-w-xl mx-auto py-8 px-6">
                {/* Datamatics header */}
                <div
                  className="rounded-xl px-6 py-5 mb-6 text-center"
                  style={{ background: '#BA2027' }}
                >
                  <h1 className="text-white font-bold" style={{ fontSize: '20px', letterSpacing: '-0.02em' }}>
                    Datamatics Business Solutions
                  </h1>
                </div>

                {/* Sub-heading */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-5">
                  <h2
                    className="font-semibold text-gray-800 mb-1"
                    style={{ fontSize: '17px' }}
                  >
                    Weekly Performance Digest
                  </h2>
                  <p className="text-gray-500" style={{ fontSize: '13px' }}>
                    {getCurrentMonthYear()}
                  </p>

                  {/* 3 stat boxes */}
                  <div className="grid grid-cols-3 gap-3 mt-5">
                    {[
                      { label: 'Leads Delivered', value: '847' },
                      { label: 'Acceptance Rate', value: '94%' },
                      { label: 'Pipeline Value', value: '$127,500' },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-xl p-3 text-center border"
                        style={{ background: 'rgba(186,32,39,0.04)', borderColor: 'rgba(186,32,39,0.12)' }}
                      >
                        <p
                          className="font-bold mb-1"
                          style={{ fontSize: '20px', color: '#BA2027', lineHeight: 1 }}
                        >
                          {stat.value}
                        </p>
                        <p className="text-gray-500" style={{ fontSize: '11px' }}>
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bar chart placeholder */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-5">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                    Leads by Day
                  </p>
                  <div className="flex items-end justify-around gap-3 h-24">
                    {[
                      { day: 'Mon', height: '60%' },
                      { day: 'Tue', height: '85%' },
                      { day: 'Wed', height: '100%' },
                      { day: 'Thu', height: '70%' },
                      { day: 'Fri', height: '45%' },
                    ].map((bar) => (
                      <div key={bar.day} className="flex flex-col items-center gap-2 flex-1">
                        <div
                          className="w-full rounded-t-md transition-all"
                          style={{ height: bar.height, background: '#BA2027', opacity: 0.8 }}
                        />
                        <span className="text-xs text-gray-400">{bar.day}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* View full report link */}
                <div className="text-center mb-6">
                  <a
                    href="#"
                    className="font-semibold text-sm hover:underline"
                    style={{ color: '#BA2027' }}
                    onClick={(e) => e.preventDefault()}
                  >
                    View full report →
                  </a>
                </div>

                {/* Footer */}
                <div className="text-center border-t border-gray-200 pt-4">
                  <p className="text-xs text-gray-400">
                    Datamatics Business Solutions · <span className="underline cursor-pointer">Unsubscribe</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom actions */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-white flex-shrink-0">
              <button
                onClick={onClose}
                className="btn-outline px-5 py-2 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                className="btn-primary px-5 py-2 text-sm font-semibold"
              >
                Send Digest Now
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
