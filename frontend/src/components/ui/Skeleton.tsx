import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  type?: 'text' | 'rectangular' | 'circular';
}

const Skeleton: React.FC<SkeletonProps> = ({ className = '', type = 'rectangular' }) => {
  const baseClasses = "bg-border dark:bg-[#2a2a2a] overflow-hidden relative";
  
  const typeClasses = {
    text: "h-4 w-3/4 rounded-md",
    rectangular: "w-full h-full rounded-lg",
    circular: "rounded-full"
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]} ${className}`}>
      <motion.div
        className="absolute inset-0 -translate-x-full"
        animate={{
          translateX: ['-100%', '100%']
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "linear"
        }}
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)'
        }}
      />
    </div>
  );
};

export default Skeleton;
