import { ReactNode, ButtonHTMLAttributes } from 'react';
import { useTheme } from '../context/ThemeContext';

// ========== Card Component ==========
interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className = '', hover = false, onClick }: CardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const cardStyle = isDark
    ? {
        background: hover ? 'rgba(40, 15, 17, 0.95)' : 'rgba(30, 10, 12, 0.9)',
        borderColor: 'rgba(186, 32, 39, 0.3)',
        backdropFilter: 'blur(10px)',
      }
    : {
        background: '#FFFFFF',
        border: '1px solid rgba(0, 0, 0, 0.06)',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.04)',
      };

  return (
    <div
      className={`rounded-2xl transition-all ${ 
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      style={cardStyle}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

// ========== Button Component ==========
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: ReactNode;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  className = '',
  disabled = false,
  ...props
}: ButtonProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const primaryButtonStyle = !isDark ? {
    background: 'linear-gradient(135deg, #C0392B 0%, #E74C3C 100%)',
    boxShadow: '0 2px 8px rgba(192, 57, 43, 0.3)',
  } : undefined;

  const variants = {
    primary: isDark
      ? 'bg-[#BA2027] hover:bg-[#D32F2F] text-white'
      : 'text-white hover:opacity-90',
    secondary: isDark
      ? 'bg-[#BA2027]/20 hover:bg-[#BA2027]/30 text-[#FF6B6B] border-[#BA2027]/40'
      : 'bg-[#BA2027]/10 hover:bg-[#BA2027]/20 text-[#BA2027] border border-[#BA2027]/30',
    ghost: isDark
      ? 'bg-transparent hover:bg-[#BA2027]/15 text-[#FF6B6B] border-[#BA2027]/30'
      : 'bg-transparent hover:bg-[#BA2027]/5 text-[#BA2027] border border-[#BA2027]/20',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        rounded-[10px] font-normal
        transition-all duration-200
        flex items-center justify-center gap-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      style={variant === 'primary' && !isDark ? primaryButtonStyle : undefined}
      disabled={disabled}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}

// ========== Text Component ==========
interface TextProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'muted';
  className?: string;
  as?: 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export function Text({ children, variant = 'primary', className = '', as: Component = 'p' }: TextProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const variants = {
    primary: isDark ? 'text-white' : 'text-[#1E1E1E]',
    secondary: isDark ? 'text-[#E0E0E0]' : 'text-[#4A4A4A]',
    tertiary: isDark ? 'text-[#B0B0B0]' : 'text-[#757575]',
    muted: isDark ? 'text-[#808080]' : 'text-[#9E9E9E]',
  };

  return <Component className={`${variants[variant]} ${className}`}>{children}</Component>;
}

// ========== Input Component ==========
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const inputStyle = isDark
    ? {
        background: 'rgba(30, 10, 12, 0.6)',
        borderColor: error ? '#E57373' : 'rgba(186, 32, 39, 0.3)',
        color: '#FFFFFF',
      }
    : {
        background: 'rgba(255, 255, 255, 0.9)',
        borderColor: error ? '#C62828' : 'rgba(186, 32, 39, 0.2)',
        color: '#1E1E1E',
      };

  return (
    <div className={className}>
      {label && (
        <label className={`block text-sm font-normal mb-2 ${isDark ? 'text-[#E0E0E0]' : 'text-[#4A4A4A]'}`}>
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-2 rounded-lg border
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-[#BA2027] focus:border-[#BA2027]
          placeholder:${isDark ? 'text-[#808080]' : 'text-[#9E9E9E]'}
        `}
        style={inputStyle}
        {...props}
      />
      {error && (
        <p className={`text-sm mt-1 ${isDark ? 'text-[#E57373]' : 'text-[#C62828]'}`}>{error}</p>
      )}
    </div>
  );
}

// ========== Badge Component ==========
interface BadgeProps {
  children: ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const variants = isDark
    ? {
        success: 'bg-[#4CAF50]/15 text-[#81C784] border-[#4CAF50]/30',
        warning: 'bg-[#FF9800]/15 text-[#FFB74D] border-[#FF9800]/30',
        error: 'bg-[#F44336]/15 text-[#E57373] border-[#F44336]/30',
        info: 'bg-[#2196F3]/15 text-[#64B5F6] border-[#2196F3]/30',
        default: 'bg-[#BA2027]/20 text-[#FF6B6B] border-[#BA2027]/40',
      }
    : {
        success: 'bg-[#E8F5E9] text-[#2E7D32] border-[#81C784]',
        warning: 'bg-[#FFF3E0] text-[#E65100] border-[#FFB74D]',
        error: 'bg-[#FFEBEE] text-[#C62828] border-[#E57373]',
        info: 'bg-[#E3F2FD] text-[#1565C0] border-[#64B5F6]',
        default: 'bg-[#BA2027]/10 text-[#BA2027] border-[#BA2027]/30',
      };

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-normal border
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

// ========== Select Component ==========
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, className = '', ...props }: SelectProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const selectStyle = isDark
    ? {
        background: 'rgba(30, 10, 12, 0.6)',
        borderColor: 'rgba(186, 32, 39, 0.3)',
        color: '#FFFFFF',
      }
    : {
        background: 'rgba(255, 255, 255, 0.9)',
        borderColor: 'rgba(186, 32, 39, 0.2)',
        color: '#1E1E1E',
      };

  return (
    <div className={className}>
      {label && (
        <label className={`block text-sm font-normal mb-2 ${isDark ? 'text-[#E0E0E0]' : 'text-[#4A4A4A]'}`}>
          {label}
        </label>
      )}
      <select
        className={`
          w-full px-4 py-2 rounded-lg border
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-[#BA2027] focus:border-[#BA2027]
          cursor-pointer
        `}
        style={selectStyle}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}