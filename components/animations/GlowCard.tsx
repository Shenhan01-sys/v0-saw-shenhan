'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  glowIntensity?: 'low' | 'medium' | 'high';
  borderWidth?: number;
  animated?: boolean;
  onClick?: () => void;
}

export function GlowCard({
  children,
  className = '',
  glowColor = '#6366f1',
  glowIntensity = 'medium',
  borderWidth = 1,
  animated = true,
  onClick
}: GlowCardProps) {
  const intensityMap = {
    low: 'blur(8px)',
    medium: 'blur(16px)',
    high: 'blur(24px)',
  };

  return (
    <div
      className={`relative overflow-hidden rounded-xl ${className}`}
      onClick={onClick}
      style={{ padding: borderWidth }}
    >
      {animated && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            background: `radial-gradient(circle at 50% 0%, ${glowColor}40 0%, transparent 60%)`,
            filter: intensityMap[glowIntensity],
          }}
        />
      )}
      <div
        className="relative z-10 bg-background/95 backdrop-blur-sm rounded-[calc(0.625rem-1px)]"
        style={{ border: `${borderWidth}px solid ${glowColor}20` }}
      >
        {children}
      </div>
    </div>
  );
}
