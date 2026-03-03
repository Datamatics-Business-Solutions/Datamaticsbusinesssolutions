import { useEffect, useRef } from 'react';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function AnimatedNumber({
  value,
  duration = 1500,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
}: AnimatedNumberProps) {
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const span = spanRef.current;
    if (!span) return;

    let rafId: number;
    let startTime: number | null = null;

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // easeOutCubic: fast start, decelerates smoothly to end
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = value * eased;

      const formatted =
        decimals > 0
          ? current.toFixed(decimals)
          : Math.round(current).toLocaleString();

      // Direct DOM update — no React re-render triggered
      span.textContent = `${prefix}${formatted}${suffix}`;

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      } else {
        const final =
          decimals > 0
            ? value.toFixed(decimals)
            : value.toLocaleString();
        span.textContent = `${prefix}${final}${suffix}`;
      }
    };

    rafId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafId);
  }, [value, duration, prefix, suffix, decimals]);

  const initialFormatted =
    decimals > 0 ? (0).toFixed(decimals) : (0).toLocaleString();

  return (
    <span ref={spanRef} className={className}>
      {prefix}{initialFormatted}{suffix}
    </span>
  );
}
