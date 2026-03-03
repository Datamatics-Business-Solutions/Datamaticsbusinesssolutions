import { CampaignStatus } from '../types';

interface StatusBadgeProps {
  status: CampaignStatus | string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusStyles: Record<string, string> = {
    'Completed':          'bg-[#ECFDF5] text-[#059669] border border-[rgba(5,150,105,0.2)]',
    'In progress':        'bg-[#EFF6FF] text-[#2563EB] border border-[rgba(37,99,235,0.2)]',
    'Not started':        'bg-[#F5F3FF] text-[#7C3AED] border border-[rgba(124,58,237,0.2)]',
    'Paused':             'bg-[#F5F3FF] text-[#7C3AED] border border-[rgba(124,58,237,0.2)]',
    'Cancelled':          'bg-[#FEF2F2] text-[#DC2626] border border-[rgba(220,38,38,0.2)]',
    'Accepted':           'bg-[#ECFDF5] text-[#059669] border border-[rgba(5,150,105,0.2)]',
    'Approved':           'bg-[#ECFDF5] text-[#059669] border border-[rgba(5,150,105,0.2)]',
    'Pending':            'bg-[#FFFBEB] text-[#D97706] border border-[rgba(217,119,6,0.2)]',
    'Under review':       'bg-[#FFFBEB] text-[#D97706] border border-[rgba(217,119,6,0.2)]',
    'Pending Approval':   'bg-[#FFF7ED] text-[#C2410C] border border-[rgba(194,65,12,0.25)]',
    'Changes Requested':  'bg-[#FFFBEB] text-[#B45309] border border-[rgba(180,83,9,0.25)]',
    'Rejected':           'bg-[#FEF2F2] text-[#DC2626] border border-[rgba(220,38,38,0.2)]',
    'Declined':           'bg-[#FEF2F2] text-[#DC2626] border border-[rgba(220,38,38,0.2)]',
    'Overdue':            'bg-[#FEF2F2] text-[#DC2626] border border-[rgba(220,38,38,0.2)]',
  };

  const style = statusStyles[status] ?? 'bg-[#F3F4F6] text-[#6B7280] border border-[rgba(107,114,128,0.2)]';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}>
      {status}
    </span>
  );
}