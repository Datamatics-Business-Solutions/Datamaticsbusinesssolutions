import { motion } from 'motion/react';
import { forwardRef } from 'react';

interface AnimatedButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'danger' | 'ghost';
}

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ children, variant = 'default', className = '', ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        className={className}
        whileHover={{ 
          scale: 1.02, 
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          transition: { duration: 0.2 }
        }}
        whileTap={{ 
          scale: 0.98,
          transition: { duration: 0.1 }
        }}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 25 
        }}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

AnimatedButton.displayName = 'AnimatedButton';