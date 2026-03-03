import { useEffect, useRef } from 'react';

/**
 * Returns a ref to attach to a <span> element.
 * The span's textContent is updated imperatively via requestAnimationFrame,
 * bypassing React re-renders entirely for smooth 60fps animation.
 *
 * Usage:
 *   const ref = useCountUp(1265, 2000);
 *   return <span ref={ref} />;
 */
export function useCountUp(
  end: number,
  duration: number = 2000,
  start: number = 0,
  format: (n: number) => string = (n) => Math.floor(n).toLocaleString()
) {
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
      const current = start + (end - start) * eased;

      span.textContent = format(current);

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      } else {
        span.textContent = format(end);
      }
    };

    rafId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafId);
  }, [end, duration, start, format]);

  return spanRef;
}
