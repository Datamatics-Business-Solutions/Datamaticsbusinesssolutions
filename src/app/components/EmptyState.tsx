import { useTheme } from '../context/ThemeContext';
import { LucideIcon } from 'lucide-react';
import { EnhancedButton } from './EnhancedButton';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  illustration?: React.ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  illustration
}: EmptyStateProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Icon or Illustration */}
      <div
        className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${
          isDark ? 'bg-[#E63946]/10' : 'bg-[#BA2027]/10'
        }`}
      >
        {illustration || <Icon className={`w-12 h-12 ${isDark ? 'text-[#E63946]' : 'text-[#BA2027]'}`} />}
      </div>

      {/* Title */}
      <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-[#F1F0F5]' : 'text-[#1E1E1E]'}`}>
        {title}
      </h3>

      {/* Description */}
      <p className={`text-sm text-center max-w-md mb-6 ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
        {description}
      </p>

      {/* Action Button */}
      {actionLabel && onAction && (
        <EnhancedButton onClick={onAction}>
          {actionLabel}
        </EnhancedButton>
      )}

      {/* Preview hint */}
      <div className={`mt-8 text-xs ${isDark ? 'text-[#6B6880]' : 'text-[#9E9E9E]'}`}>
        {actionLabel ? 'Get started by creating your first item' : 'Try adjusting your filters'}
      </div>
    </div>
  );
}
