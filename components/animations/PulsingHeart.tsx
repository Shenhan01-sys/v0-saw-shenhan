'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface PulsingHeartProps {
  size?: number;
  color?: string;
  className?: string;
}

export default function PulsingHeart({ size = 120, color = "#ef4444", className = "" }: PulsingHeartProps) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: color, opacity: 0.2 }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.2, 0, 0.2],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeOut",
        }}
      />
      <motion.div
        className="absolute inset-2 rounded-full"
        style={{ backgroundColor: color, opacity: 0.3 }}
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.3, 0, 0.3],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeOut",
          delay: 0.2,
        }}
      />
      <motion.svg
        viewBox="0 0 24 24"
        fill={color}
        className="w-full h-full drop-shadow-lg"
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </motion.svg>
    </div>
  );
}
