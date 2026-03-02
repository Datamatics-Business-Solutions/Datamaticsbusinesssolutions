import { LucideIcon } from 'lucide-react';

interface SimpleEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SimpleEmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: SimpleEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {/* Small gray icon - 32px */}
      <Icon className="w-8 h-8 text-gray-400 mb-3" />
      
      {/* Short title */}
      <h3 className="text-sm font-medium text-gray-900 mb-1">
        {title}
      </h3>
      
      {/* One line subtitle */}
      <p className="text-sm text-gray-500 text-center max-w-sm mb-4">
        {description}
      </p>
      
      {/* Optional action button */}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="btn-primary px-4 py-2 text-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
