import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

/**
 * Reveals its children with a soft fade + slide-up the first time they scroll
 * into view, so the page "builds" as the client moves down it. Respects the
 * user's reduced-motion preference (renders in place, no movement).
 */
export function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
