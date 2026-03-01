import { useTheme } from '../context/ThemeContext';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export function Skeleton({ className = '', variant = 'rectangular' }: SkeletonProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const baseClasses = isDark
    ? 'bg-white/[0.08] animate-shimmer'
    : 'bg-gray-200/80 animate-shimmer';

  const variantClasses = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{
        backgroundImage: isDark
          ? 'linear-gradient(90deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.08) 100%)'
          : 'linear-gradient(90deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.12) 50%, rgba(0,0,0,0.08) 100%)',
        backgroundSize: '1000px 100%'
      }}
    />
  );
}

// Table skeleton loader
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex items-center gap-4 animate-fadeIn" style={{ animationDelay: `${index * 50}ms` }}>
          <Skeleton className="h-12 w-full" />
        </div>
      ))}
    </div>
  );
}

// Card skeleton loader
export function CardSkeleton() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`rounded-2xl p-6 border ${isDark ? 'border-[#E63946]/12 bg-[#16151A]' : 'border-[#BA2027]/8 bg-white'}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 space-y-3">
          <Skeleton className="h-4 w-24" variant="text" />
          <Skeleton className="h-10 w-32" variant="text" />
          <Skeleton className="h-3 w-40" variant="text" />
        </div>
        <Skeleton className="w-16 h-16" variant="circular" />
      </div>
    </div>
  );
}

// KPI Cards skeleton
export function KPICardsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
}