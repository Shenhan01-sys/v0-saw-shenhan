'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BorderBeamProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  color?: string;
  size?: number;
  delay?: number;
}

export function BorderBeam({
  children,
  className = '',
  duration = 6,
  color = '#6366f1',
  size = 100,
  delay = 0
}: BorderBeamProps) {
  return (
    <div className={cn('relative overflow-hidden rounded-xl', className)}>
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            `radial-gradient(circle at 0% 0%, transparent 0%, transparent 0%, ${color} 50%, transparent 50%)`,
            `radial-gradient(circle at 100% 0%, transparent 0%, ${color} 0%, ${color} 50%, transparent 50%)`,
            `radial-gradient(circle at 100% 100%, transparent 0%, transparent 0%, ${color} 50%, transparent 50%)`,
            `radial-gradient(circle at 0% 100%, transparent 0%, ${color} 0%, ${color} 50%, transparent 50%)`,
            `radial-gradient(circle at 0% 0%, transparent 0%, transparent 0%, ${color} 50%, transparent 50%)`
          ],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'linear',
          delay
        }}
        style={{
          backgroundSize: `${size * 2}px ${size * 2}px`,
          backgroundPosition: '0 0'
        }}
      />
      <div className="relative z-10 bg-background/95 backdrop-blur-sm">
        {children}
      </div>
    </div>
  );
}

interface AnimatedBorderProps {
  children: React.ReactNode;
  className?: string;
  colors?: [string, string, string];
  duration?: number;
}

export function AnimatedBorder({
  children,
  className = '',
  colors = ['#6366f1', '#8b5cf6', '#06b6d4'],
  duration = 3
}: AnimatedBorderProps) {
  return (
    <motion.div
      className={cn('relative rounded-xl p-[1px]', className)}
      animate={{
        background: [`conic-gradient(from 0deg, ${colors.join(', ')}, ${colors[0]})`],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'linear'
      }}
      style={{
        backgroundSize: '200% 200%'
      }}
    >
      <div className="relative z-10 bg-background/95 rounded-[calc(0.625rem-1px)] backdrop-blur-sm">
        {children}
      </div>
    </motion.div>
  );
}
