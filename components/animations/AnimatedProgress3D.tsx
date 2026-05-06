"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface AnimatedProgress3DProps {
  value: number;
  max?: number;
  label?: string;
  sublabel?: string;
  color?: string;
  size?: "sm" | "md" | "lg";
}

export default function AnimatedProgress3D({
  value,
  max = 100,
  label,
  sublabel,
  color = "#3B82F6",
  size = "md",
}: AnimatedProgress3DProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeConfig = {
    sm: { width: 120, height: 120, strokeWidth: 8, fontSize: "text-lg" },
    md: { width: 180, height: 180, strokeWidth: 12, fontSize: "text-3xl" },
    lg: { width: 240, height: 240, strokeWidth: 16, fontSize: "text-4xl" },
  };

  const { width, height, strokeWidth, fontSize } = sizeConfig[size];
  const radius = (width - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const gradientId = useMemo(() => `gradient-${Math.random().toString(36).substr(2, 9)}`, []);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width, height }}>
        <svg
          className="transform -rotate-90"
          width={width}
          height={height}
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <circle
            cx={width / 2}
            cy={height / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={strokeWidth}
          />

          <motion.circle
            cx={width / 2}
            cy={height / 2}
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            filter="url(#glow)"
          />

          <motion.circle
            cx={width / 2}
            cy={height / 2}
            r={radius + 10}
            fill="none"
            stroke={color}
            strokeWidth={2}
            strokeDasharray="10 20"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            opacity={0.3}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={`${fontSize} font-bold text-gray-800`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {Math.round(percentage)}%
          </motion.span>
          {sublabel && (
            <span className="text-xs text-gray-500">{sublabel}</span>
          )}
        </div>

        <motion.div
          className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full bg-white shadow-lg"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            times: [0, 0.2, 0.8, 1],
          }}
          style={{
            transform: "translate(-50%, -50%)",
            boxShadow: `0 0 20px ${color}`,
          }}
        />
      </div>

      {label && (
        <motion.span
          className="text-sm font-medium text-gray-600"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          {label}
        </motion.span>
      )}
    </div>
  );
}
