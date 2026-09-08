import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps extends React.ComponentProps<typeof motion.div> {
  children: React.ReactNode;
  className?: string;
  intensity?: 'light' | 'medium' | 'heavy';
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  intensity = 'medium',
  ...props 
}) => {
  const intensityClasses = {
    light: 'bg-white/30 dark:bg-black/30 backdrop-blur-sm border-white/20 dark:border-white/5',
    medium: 'bg-white/50 dark:bg-black/50 backdrop-blur-md border-white/30 dark:border-white/10',
    heavy: 'bg-white/70 dark:bg-black/70 backdrop-blur-xl border-white/40 dark:border-white/20'
  };

  return (
    <motion.div 
      className={`border shadow-xl rounded-2xl ${intensityClasses[intensity]} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
