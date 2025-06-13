// ========== ANIMATED BUTTON (app/components/UI/AnimatedButton.tsx) ==========
'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

export default function AnimatedButton({ 
  children, 
  className, 
  variant = 'primary',
  isLoading = false,
  disabled,
  ...props 
}: AnimatedButtonProps) {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white',
    secondary: 'bg-white/20 text-white border border-white/30',
    danger: 'bg-gradient-to-r from-red-500 to-pink-600 text-white'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        'px-6 py-3 rounded-xl font-medium transition-all duration-300',
        'hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Loading...
        </div>
      ) : children}
    </motion.button>
  );
}