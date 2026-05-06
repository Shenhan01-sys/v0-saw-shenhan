'use client';

import { motion } from 'framer-motion';

interface DNAHelixProps {
  height?: number;
  width?: number;
  color1?: string;
  color2?: string;
  className?: string;
  speed?: number;
}

export default function DNAHelix({
  height = 300,
  width = 60,
  color1 = "#3b82f6",
  color2 = "#8b5cf6",
  className = "",
  speed = 3
}: DNAHelixProps) {
  const bars = 20;
  const barHeight = height / bars;

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <motion.div
        className="absolute inset-0"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
        animate={{
          rotateY: [0, 360],
        }}
        transition={{
          duration: speed * 2,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {Array.from({ length: bars }).map((_, i) => {
          const progress = i / bars;
          const offset = Math.sin(progress * Math.PI * 4) * (width / 2 - 10);
          const phase = Math.cos(progress * Math.PI * 4) > 0;

          return (
            <div
              key={i}
              className="relative"
              style={{ height: barHeight }}
            >
              {/* Left bar */}
              <motion.div
                className="absolute w-2 h-1 rounded-full"
                style={{
                  backgroundColor: color1,
                  left: 0,
                  top: '50%',
                  transform: `translateY(-50%) translateX(${offset}px)`,
                  boxShadow: `0 0 10px ${color1}`,
                }}
                animate={{
                  opacity: [0.6, 1, 0.6],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />

              {/* Right bar */}
              <motion.div
                className="absolute w-2 h-1 rounded-full"
                style={{
                  backgroundColor: color2,
                  right: 0,
                  top: '50%',
                  transform: `translateY(-50%) translateX(-${offset}px)`,
                  boxShadow: `0 0 10px ${color2}`,
                }}
                animate={{
                  opacity: [0.6, 1, 0.6],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />

              {/* Connecting line */}
              {phase && (
                <motion.div
                  className="absolute h-0.5 left-0 right-0 top-1/2"
                  style={{
                    background: `linear-gradient(90deg, ${color1}, ${color2})`,
                    transform: 'translateY(-50%)',
                  }}
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 0.5, scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
