"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface AnimatedBackgroundGradientProps {
  children?: React.ReactNode;
  className?: string;
}

export default function AnimatedBackgroundGradient({
  children,
  className = "",
}: AnimatedBackgroundGradientProps) {
  const gradientId = useMemo(() => `bg-gradient-${Math.random().toString(36).substr(2, 9)}`, []);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 40% 40%, rgba(236, 72, 153, 0.2) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />

        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(circle at 80% 30%, rgba(16, 185, 129, 0.2) 0%, transparent 40%)",
              "radial-gradient(circle at 30% 70%, rgba(34, 211, 238, 0.2) 0%, transparent 40%)",
              "radial-gradient(circle at 80% 30%, rgba(16, 185, 129, 0.2) 0%, transparent 40%)",
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />

        <svg className="absolute inset-0 w-full h-full opacity-30">
          <defs>
            <filter id={`noise-${gradientId}`}>
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.8"
                numOctaves="4"
                stitchTiles="stitch"
              />
              <feColorMatrix type="saturate" values="0" />
            </filter>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="url(#noise-filter)"
            opacity="0.05"
            filter={`url(#noise-${gradientId})`}
          />
        </svg>

        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}
        />

        <motion.div
          className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full blur-3xl opacity-15"
          animate={{
            x: [0, -80, 0],
            y: [0, -60, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          style={{ background: "linear-gradient(135deg, #EC4899, #F59E0B)" }}
        />
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  );
}
