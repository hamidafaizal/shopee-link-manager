// ========== GLASS CARD COMPONENT (app/components/UI/GlassCard.tsx) ==========
'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function GlassCard({ children, className }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl',
        'hover:bg-white/15 transition-all duration-300',
        className
      )}
    >
      {children}
    </motion.div>
  );
}