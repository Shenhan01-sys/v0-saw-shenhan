'use client';

import { motion } from 'framer-motion';

interface RaindropEffectProps {
  count?: number;
  color?: string;
  className?: string;
  width?: number;
  height?: number;
}

export default function RaindropEffect({
  count = 20,
  color = "#3b82f6",
  className = "",
  width = 300,
  height = 200
}: RaindropEffectProps) {
  const raindrops = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 2 + Math.random() * 2,
    size: 2 + Math.random() * 4,
  }));

  return (
    <div
      className={`relative overflow-hidden rounded-full ${className}`}
      style={{ width, height, backgroundColor: `${color}10` }}
    >
      {/* Ambient glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle at center, ${color}30 0%, transparent 70%)`,
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Raindrops */}
      {raindrops.map((drop) => (
        <motion.div
          key={drop.id}
          className="absolute rounded-full"
          style={{
            left: `${drop.x}%`,
            top: -10,
            width: drop.size,
            height: drop.size * 1.5,
            backgroundColor: color,
            opacity: 0.4,
          }}
          animate={{
            y: [0, height + 20],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: drop.duration,
            repeat: Infinity,
            delay: drop.delay,
            ease: "linear",
          }}
        />
      ))}

      {/* Center icon area */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{
            y: [0, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${color}20` }}
          >
            <span className="text-2xl">💧</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
