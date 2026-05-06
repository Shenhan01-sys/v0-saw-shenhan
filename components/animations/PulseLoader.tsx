'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface PulseLoaderProps {
  size?: number;
  color?: string;
  className?: string;
  dots?: number;
}

export default function PulseLoader({
  size = 40,
  color = "#3b82f6",
  className = "",
  dots = 5
}: PulseLoaderProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {Array.from({ length: dots }).map((_, i) => (
        <motion.div
          key={i}
          className="rounded-full"
          style={{
            width: size / dots,
            height: size / dots,
            backgroundColor: color,
          }}
          animate={{
            scale: [0.5, 1.5, 0.5],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
