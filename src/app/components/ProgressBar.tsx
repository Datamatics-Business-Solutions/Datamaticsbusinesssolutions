interface ProgressBarProps {
  label: string;
  value: number | string;
  percentage: number;
  maxPercentage?: number; // For scaling the bar width (default 100)
  showBadge?: boolean; // Show colored percentage badge (default true)
  animationDelay?: number; // Animation delay in ms
  valueColor?: string; // Custom color for value text
  badgeColorThresholds?: {
    high: number; // >= this value shows green
    medium: number; // >= this value shows yellow, < shows red
  };
}

export function ProgressBar({
  label,
  value,
  percentage,
  maxPercentage = 100,
  showBadge = true,
  animationDelay = 0,
  valueColor,
  badgeColorThresholds = { high: 80, medium: 60 }
}: ProgressBarProps) {
  // Calculate bar width based on maxPercentage scale
  const barWidth = maxPercentage === 100 
    ? percentage 
    : (percentage / maxPercentage) * 100;

  // Determine badge color based on percentage
  const getBadgeColor = () => {
    if (percentage >= badgeColorThresholds.high) {
      return 'bg-[#0F9D58]/20 text-[#0F9D58]';
    }
    if (percentage >= badgeColorThresholds.medium) {
      return 'bg-[#F4B400]/20 text-[#F4B400]';
    }
    return 'bg-[#EA4335]/20 text-[#EA4335]';
  };

  // Standard badge color (red gradient theme)
  const getStandardBadgeColor = () => {
    return 'bg-[#BA2027]/10 text-[#BA2027]';
  };

  const defaultValueColor = valueColor || 'text-[#0891B2]';

  return (
    <div 
      className="animate-slideInUp"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {/* Label and Value Row */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-[#64748B]">
          {label}
        </span>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${defaultValueColor}`}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </span>
          {showBadge && (
            <span className={`text-sm px-2 py-0.5 rounded-full font-bold ${
              badgeColorThresholds ? getBadgeColor() : getStandardBadgeColor()
            }`}>
              {percentage}%
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-5 rounded-full overflow-hidden bg-gray-100">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${Math.min(barWidth, 100)}%`,
            background: 'linear-gradient(90deg, #BA2027, #D32F2F)',
          }}
        />
      </div>
    </div>
  );
}

// Simplified variant for inline display (no label/value)
interface SimpleProgressBarProps {
  percentage: number;
  height?: string; // Tailwind class (default: h-5)
  showPercentageText?: boolean;
}

export function SimpleProgressBar({
  percentage,
  height = 'h-5',
  showPercentageText = false
}: SimpleProgressBarProps) {
  return (
    <div className="relative group">
      <div className={`w-full ${height} rounded-full overflow-hidden transition-all bg-gray-100`}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${Math.min(percentage, 100)}%`,
            background: 'linear-gradient(90deg, #BA2027, #D32F2F)',
          }}
        />
      </div>
      {showPercentageText && (
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-[#1F2937]">
          {percentage}%
        </span>
      )}
    </div>
  );
}