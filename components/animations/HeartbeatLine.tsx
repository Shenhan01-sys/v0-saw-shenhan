'use client';

import { motion } from 'framer-motion';

interface HeartbeatLineProps {
  width?: number;
  height?: number;
  lineColor?: string;
  className?: string;
  speed?: number;
}

export default function HeartbeatLine({
  width = 300,
  height = 80,
  lineColor = "#ef4444",
  className = "",
  speed = 1
}: HeartbeatLineProps) {
  const heartbeatPath = "M0,40 L30,40 L35,40 L40,10 L50,70 L60,30 L65,40 L70,40 L100,40 L105,40 L110,10 L120,70 L130,30 L135,40 L140,40 L200,40";

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 200 80"
        className="overflow-visible"
      >
        <defs>
          <linearGradient id={`heartbeatGradient-${speed}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={lineColor} stopOpacity="0" />
            <stop offset="20%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="80%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
          </linearGradient>
          <filter id={`glow-${speed}`}>
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Animated heartbeat line */}
        <motion.path
          d={heartbeatPath}
          fill="none"
          stroke={`url(#heartbeatGradient-${speed})`}
          strokeWidth="3"
          strokeLinecap="round"
          filter={`url(#glow-${speed})`}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            pathLength: { duration: 2 / speed, repeat: Infinity, ease: "linear" },
            opacity: { duration: 0.5 }
          }}
        />
      </svg>
    </div>
  );
}
