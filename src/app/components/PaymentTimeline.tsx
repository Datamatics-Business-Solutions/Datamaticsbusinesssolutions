import { Check, Clock, Send, CreditCard } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface PaymentTimelineProps {
  status: 'Paid' | 'Pending' | 'Overdue';
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  compact?: boolean;
}

export function PaymentTimeline({ status, issueDate, dueDate, paidDate, compact = false }: PaymentTimelineProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Compact version for table rows
  if (compact) {
    const progressWidth = status === 'Paid' ? 100 : status === 'Pending' ? 50 : 75;
    const progressColor = 
      status === 'Paid' 
        ? '#0F9D58' 
        : status === 'Pending' 
        ? '#4285F4' 
        : '#EA4335';

    return (
      <div className="w-full">
        <div className="flex items-center gap-2 mb-1">
          {status === 'Paid' ? (
            <Check className="w-3.5 h-3.5 text-[#0F9D58]" />
          ) : status === 'Pending' ? (
            <Clock className="w-3.5 h-3.5 text-[#4285F4]" />
          ) : (
            <Clock className="w-3.5 h-3.5 text-[#EA4335]" />
          )}
          <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {status === 'Paid' 
              ? `Paid ${new Date(paidDate || dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
              : `Due ${new Date(dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
            }
          </span>
        </div>
        <div className={`w-full h-1.5 rounded-full overflow-hidden ${
          isDark ? 'bg-white/10' : 'bg-gray-200'
        }`}>
          <div
            className="h-full transition-all duration-1000"
            style={{
              width: `${progressWidth}%`,
              backgroundColor: progressColor
            }}
          />
        </div>
      </div>
    );
  }

  // Full version for detailed views
  const steps = [
    {
      label: 'Invoice Issued',
      date: issueDate,
      icon: Send,
      completed: true
    },
    {
      label: 'Payment Due',
      date: dueDate,
      icon: Clock,
      completed: status === 'Paid'
    },
    {
      label: 'Payment Received',
      date: paidDate || dueDate,
      icon: status === 'Paid' ? Check : CreditCard,
      completed: status === 'Paid'
    }
  ];

  return (
    <div className="flex items-center justify-between relative">
      {/* Progress Line */}
      <div className={`absolute top-5 left-0 right-0 h-0.5 ${
        isDark ? 'bg-white/10' : 'bg-gray-200'
      }`}>
        <div
          className={`h-full transition-all duration-1000 ${
            status === 'Paid'
              ? 'bg-gradient-to-r from-[#0F9D58] to-[#34D399]'
              : status === 'Pending'
              ? 'bg-gradient-to-r from-[#4285F4] to-[#60A5FA]'
              : 'bg-gradient-to-r from-[#EA4335] to-[#EF4444]'
          }`}
          style={{
            width: status === 'Paid' ? '100%' : status === 'Pending' ? '50%' : '75%'
          }}
        />
      </div>

      {/* Steps */}
      {steps.map((step, index) => (
        <div key={index} className="relative z-10 flex-1 flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              step.completed
                ? status === 'Paid'
                  ? isDark
                    ? 'bg-[#0F9D58] text-white shadow-lg shadow-[#0F9D58]/50'
                    : 'bg-[#0F9D58] text-white shadow-lg shadow-[#0F9D58]/30'
                  : isDark
                    ? 'bg-[#4285F4] text-white shadow-lg shadow-[#4285F4]/50'
                    : 'bg-[#4285F4] text-white shadow-lg shadow-[#4285F4]/30'
                : isDark
                  ? 'bg-white/10 text-gray-500'
                  : 'bg-gray-200 text-gray-500'
            }`}
          >
            <step.icon className="w-5 h-5" />
          </div>
          <p className={`text-xs font-medium mt-2 text-center ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {step.label}
          </p>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            {new Date(step.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </p>
        </div>
      ))}
    </div>
  );
}