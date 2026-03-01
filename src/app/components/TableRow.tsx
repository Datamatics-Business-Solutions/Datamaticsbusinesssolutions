import { ReactNode } from 'react';
import { useTheme } from '../context/ThemeContext';

interface TableRowProps {
  children: ReactNode;
  onClick?: () => void;
  animationDelay?: number; // in milliseconds
  className?: string; // Additional custom classes
  showHoverEffect?: boolean; // Show hover effects (default: true)
}

/**
 * 🎯 UNIFIED TableRow Component
 * 
 * HOVER STATE SPECIFICATIONS:
 * - Light Mode: background #FFF5F5, 3px solid left border #C0392B
 * - Dark Mode: background rgba(192,57,43,0.1), 3px solid left border #C0392B
 * - 150ms ease transition for smooth animation
 * - Default: transparent left border (no layout shift)
 * - Default: white background in light mode, transparent in dark mode
 * 
 * Usage (identical on all pages):
 * <TableRow onClick={() => handleClick()} animationDelay={index * 30}>
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
    <tr
      onClick={onClick}
      className={`
        group
        border-b
        transition-all duration-150 ease-in-out
        ${showHoverEffect ? 'cursor-pointer' : ''}
        ${showHoverEffect && isDark ? 'hover:bg-[rgba(192,57,43,0.1)]' : ''}
        ${showHoverEffect && !isDark ? 'hover:bg-[#FFF5F5]' : ''}
        ${isDark ? 'border-white/[0.08]' : 'border-gray-100'}
        ${animationDelay > 0 ? 'animate-slideInUp' : ''}
        ${showHoverEffect ? 'border-l-[3px] border-l-transparent hover:border-l-[#C0392B]' : ''}
        ${className}
      `}
      style={{
        animationDelay: animationDelay > 0 ? `${animationDelay}ms` : undefined
      }}
    >
      {children}
    </tr>
  );
}