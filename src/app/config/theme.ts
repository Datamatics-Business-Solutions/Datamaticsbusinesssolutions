// Centralized Theme Configuration for DatamaticsBPM Portal
// Based on Datamatics brand colors: Red (#BA2027) and Gray (#5A555D)

export const themeConfig = {
  // Brand Colors
  brand: {
    primary: '#BA2027', // Datamatics Red
    secondary: '#5A555D', // Datamatics Gray
    accent: '#D32F2F', // Lighter Red for accents
  },

  // Light Theme
  light: {
    // Background Gradients
    background: {
      gradient: 'linear-gradient(135deg, #FFFFFF 0%, #FFE5E7 25%, #FFCCD0 50%, #FFE5E7 75%, #FFFFFF 100%)',
      solid: '#FFFFFF',
    },
    
    // Card Backgrounds
    card: {
      default: 'rgba(255, 255, 255, 0.95)',
      hover: 'rgba(255, 255, 255, 0.98)',
      border: 'rgba(186, 32, 39, 0.15)',
    },
    
    // Text Colors
    text: {
      primary: '#1E1E1E',
      secondary: '#4A4A4A',
      tertiary: '#757575',
      muted: '#9E9E9E',
      onPrimary: '#FFFFFF', // Text on red backgrounds
    },
    
    // Button Colors
    button: {
      primary: {
        bg: '#BA2027',
        bgHover: '#A01C22',
        text: '#FFFFFF',
        border: '#BA2027',
      },
      secondary: {
        bg: 'rgba(186, 32, 39, 0.1)',
        bgHover: 'rgba(186, 32, 39, 0.2)',
        text: '#BA2027',
        border: 'rgba(186, 32, 39, 0.3)',
      },
      ghost: {
        bg: 'transparent',
        bgHover: 'rgba(186, 32, 39, 0.05)',
        text: '#BA2027',
        border: 'rgba(186, 32, 39, 0.2)',
      },
    },
    
    // Status Colors
    status: {
      success: { bg: '#E8F5E9', text: '#2E7D32', border: '#81C784' },
      warning: { bg: '#FFF3E0', text: '#E65100', border: '#FFB74D' },
      error: { bg: '#FFEBEE', text: '#C62828', border: '#E57373' },
      info: { bg: '#E3F2FD', text: '#1565C0', border: '#64B5F6' },
    },
    
    // Input Colors
    input: {
      bg: 'rgba(255, 255, 255, 0.9)',
      border: 'rgba(186, 32, 39, 0.2)',
      borderFocus: '#BA2027',
      text: '#1E1E1E',
      placeholder: '#9E9E9E',
    },
  },

  // Dark Theme
  dark: {
    // Background Gradients
    background: {
      gradient: 'linear-gradient(135deg, #0A0A0A 0%, #1A0508 25%, #2D0A0E 50%, #1A0508 75%, #0A0A0A 100%)',
      solid: '#0F0F0F',
    },
    
    // Card Backgrounds
    card: {
      default: 'rgba(30, 10, 12, 0.9)',
      hover: 'rgba(40, 15, 17, 0.95)',
      border: 'rgba(186, 32, 39, 0.3)',
    },
    
    // Text Colors
    text: {
      primary: '#FFFFFF',
      secondary: '#E0E0E0',
      tertiary: '#B0B0B0',
      muted: '#808080',
      onPrimary: '#FFFFFF',
    },
    
    // Button Colors
    button: {
      primary: {
        bg: '#BA2027',
        bgHover: '#D32F2F',
        text: '#FFFFFF',
        border: '#BA2027',
      },
      secondary: {
        bg: 'rgba(186, 32, 39, 0.2)',
        bgHover: 'rgba(186, 32, 39, 0.3)',
        text: '#FF6B6B',
        border: 'rgba(186, 32, 39, 0.4)',
      },
      ghost: {
        bg: 'transparent',
        bgHover: 'rgba(186, 32, 39, 0.15)',
        text: '#FF6B6B',
        border: 'rgba(186, 32, 39, 0.3)',
      },
    },
    
    // Status Colors
    status: {
      success: { bg: 'rgba(76, 175, 80, 0.15)', text: '#81C784', border: 'rgba(76, 175, 80, 0.3)' },
      warning: { bg: 'rgba(255, 152, 0, 0.15)', text: '#FFB74D', border: 'rgba(255, 152, 0, 0.3)' },
      error: { bg: 'rgba(244, 67, 54, 0.15)', text: '#E57373', border: 'rgba(244, 67, 54, 0.3)' },
      info: { bg: 'rgba(33, 150, 243, 0.15)', text: '#64B5F6', border: 'rgba(33, 150, 243, 0.3)' },
    },
    
    // Input Colors
    input: {
      bg: 'rgba(30, 10, 12, 0.6)',
      border: 'rgba(186, 32, 39, 0.3)',
      borderFocus: '#BA2027',
      text: '#FFFFFF',
      placeholder: '#808080',
    },
  },

  // Typography
  typography: {
    fontFamily: {
      sans: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },

  // Spacing
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },

  // Border Radius
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    red: '0 10px 25px -5px rgba(186, 32, 39, 0.3)',
  },
};

// Helper function to get theme colors
export const getThemeColors = (isDark: boolean) => {
  return isDark ? themeConfig.dark : themeConfig.light;
};

// CSS class generators
export const getBackgroundClass = (isDark: boolean) => {
  const colors = getThemeColors(isDark);
  return {
    background: colors.background.gradient,
    minHeight: '100vh',
  };
};

export const getCardClass = (isDark: boolean, hover = false) => {
  const colors = getThemeColors(isDark);
  return {
    background: hover ? colors.card.hover : colors.card.default,
    borderColor: colors.card.border,
    backdropFilter: 'blur(10px)',
  };
};

export const getButtonClass = (isDark: boolean, variant: 'primary' | 'secondary' | 'ghost' = 'primary') => {
  const colors = getThemeColors(isDark);
  const button = colors.button[variant];
  
  return {
    backgroundColor: button.bg,
    color: button.text,
    borderColor: button.border,
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: button.bgHover,
    },
  };
};

export const getTextClass = (isDark: boolean, variant: 'primary' | 'secondary' | 'tertiary' | 'muted' = 'primary') => {
  const colors = getThemeColors(isDark);
  return {
    color: colors.text[variant],
  };
};
