import { useEffect, useRef } from 'react';

interface AnimatedCounterProps {
  end?: number;
  value?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export function AnimatedCounter({
  end,
  value,
  duration = 2000,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
}: AnimatedCounterProps) {
  const targetValue = value ?? end ?? 0;
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const span = spanRef.current;
    if (!span) return;

    let rafId: number;
    let startTime: number | null = null;

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // easeOutQuart: fast start, decelerates smoothly to end
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = targetValue * eased;

      const formatted =
        decimals > 0
          ? current.toFixed(decimals)
          : Math.floor(current).toLocaleString();

      // Direct DOM update — no React re-render triggered
      span.textContent = `${prefix}${formatted}${suffix}`;

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      } else {
        const final =
          decimals > 0
            ? targetValue.toFixed(decimals)
            : targetValue.toLocaleString();
        span.textContent = `${prefix}${final}${suffix}`;
      }
    };

    rafId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafId);
  }, [targetValue, duration, prefix, suffix, decimals]);

  // Render the initial "0" synchronously so there's no flicker
  const initialFormatted =
    decimals > 0 ? (0).toFixed(decimals) : (0).toLocaleString();

  return (
    <span ref={spanRef} className={className}>
      {prefix}{initialFormatted}{suffix}
    </span>
  );
}
