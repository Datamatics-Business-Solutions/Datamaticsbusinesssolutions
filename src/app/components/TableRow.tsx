import { ReactNode } from 'react';
import { motion } from 'motion/react';
import { useTheme } from '../context/ThemeContext';

interface TableRowProps {
  children: ReactNode;
  onClick?: () => void;
  animationDelay?: number; // in milliseconds
  className?: string; // Additional custom classes
  showHoverEffect?: boolean; // Show hover effects (default: true)
}

/**
 * 🎯 UNIFIED TableRow Component with iOS-Quality Motion
 * 
 * ANIMATION PATTERN (Matches HomePage Recent Activity):
 * - Slide in from left: x: -10 → 0
 * - Fade in: opacity: 0 → 1
 * - Stagger delay: 100ms per row
 * - Hover: scale 1.01x + subtle background glow
 * - Duration: 300ms smooth transition
 * 
 * Usage (identical on all pages):
 * <TableRow onClick={() => handleClick()} animationDelay={index * 100}>
 *   <td className="px-6 py-4">Content 1</td>
 *   <td className="px-6 py-4">Content 2</td>
 * </TableRow>
 */
export function TableRow({
  children,
  onClick,
  animationDelay = 0,
  className = '',
  showHoverEffect = true
}: TableRowProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.tr
      onClick={onClick}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: animationDelay / 1000, duration: 0.3 }}
      whileHover={showHoverEffect ? { 
        scale: 1.01,
        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
        transition: { duration: 0.1 }
      } : undefined}
      className={`
        group
        border-b
        ${showHoverEffect ? 'cursor-pointer' : ''}
        ${isDark ? 'border-white/[0.08]' : 'border-gray-100'}
        ${className}
      `}
    >
      {children}
    </motion.tr>
  );
}