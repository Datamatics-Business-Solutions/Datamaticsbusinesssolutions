import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Loader2 } from 'lucide-react';

interface EnhancedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export function EnhancedButton({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  icon,
  fullWidth = false,
  className = '',
  onClick,
  disabled,
  ...props
}: EnhancedButtonProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;

    // Create ripple effect
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRipple = { x, y, id: Date.now() };

    setRipples([...ripples, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);

    onClick?.(e);
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3.5 text-base'
  };

  const variantStyles = {
    primary: {
      background: isDark
        ? 'linear-gradient(135deg, #E63946 0%, #FF4D5A 100%)'
        : 'linear-gradient(135deg, #BA2027 0%, #D32F2F 100%)',
      color: 'text-white',
      shadow: 'shadow-lg hover:shadow-xl',
      glow: isDark ? 'hover:shadow-[0_0_20px_rgba(230,57,70,0.4)]' : ''
    },
    secondary: {
      background: isDark ? 'bg-[#1A1820]' : 'bg-gray-100',
      color: isDark ? 'text-[#F1F0F5]' : 'text-[#1E1E1E]',
      shadow: 'shadow hover:shadow-md',
      glow: ''
    },
    success: {
      background: 'bg-gradient-to-br from-[#0F9D58] to-[#34A853]',
      color: 'text-white',
      shadow: 'shadow-lg hover:shadow-xl',
      glow: isDark ? 'hover:shadow-[0_0_20px_rgba(15,157,88,0.4)]' : ''
    },
    danger: {
      background: 'bg-gradient-to-br from-[#EA4335] to-[#F44336]',
      color: 'text-white',
      shadow: 'shadow-lg hover:shadow-xl',
      glow: isDark ? 'hover:shadow-[0_0_20px_rgba(234,67,53,0.4)]' : ''
    },
    ghost: {
      background: 'bg-transparent hover:bg-white/5',
      color: isDark ? 'text-[#F1F0F5]' : 'text-[#1E1E1E]',
      shadow: '',
      glow: ''
    }
  };

  const style = variantStyles[variant];

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      className={`
        relative overflow-hidden
        ${sizeClasses[size]}
        ${style.color}
        ${style.shadow}
        ${style.glow}
        rounded-xl font-medium
        transition-all duration-200
        hover:scale-105
        active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        flex items-center justify-center gap-2
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      style={variant === 'primary' || variant === 'success' || variant === 'danger' ? { background: style.background } : undefined}
      {...props}
    >
      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 pointer-events-none animate-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 10,
            height: 10,
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}

      {/* Loading spinner */}
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}

      {/* Icon */}
      {!loading && icon && <span className="flex items-center">{icon}</span>}

      {/* Content */}
      <span className="relative z-10">{children}</span>
    </button>
  );
}
