'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface BreathingCircleProps {
  size?: number;
  color?: string;
  className?: string;
  label?: string;
}

export default function BreathingCircle({
  size = 200,
  color = "#6366f1",
  className = "",
  label = "Breathe"
}: BreathingCircleProps) {
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    const phases = [
      { phase: 'inhale', duration: 4000 },
      { phase: 'hold', duration: 2000 },
      { phase: 'exhale', duration: 4000 },
    ];

    let currentIndex = 0;
    let timeout: NodeJS.Timeout;

    const runPhase = () => {
      const { phase, duration } = phases[currentIndex];
      setBreathPhase(phase);
      setCountdown(Math.round(duration / 1000));

      const countInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      timeout = setTimeout(() => {
        clearInterval(countInterval);
        currentIndex = (currentIndex + 1) % phases.length;
        runPhase();
      }, duration);
    };

    runPhase();

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const scale = breathPhase === 'inhale' ? 1.3 : breathPhase === 'hold' ? 1.3 : 1;
  const opacity = breathPhase === 'hold' ? 0.8 : 0.4;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        {/* Outer ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            backgroundColor: color,
            opacity: 0.1,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Middle ring */}
        <motion.div
          className="absolute inset-4 rounded-full"
          style={{
            backgroundColor: color,
            opacity: 0.15,
          }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />

        {/* Inner circle - breathing */}
        <motion.div
          className="absolute inset-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: color }}
          animate={{
            scale: [1, scale],
            opacity: [0.6, opacity],
          }}
          transition={{
            duration: breathPhase === 'hold' ? 0.2 : 4,
            ease: "easeInOut",
          }}
        >
          <div className="text-center text-white">
            <motion.p
              key={breathPhase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm font-medium"
            >
              {breathPhase === 'inhale' ? 'Breathe In' : breathPhase === 'hold' ? 'Hold' : 'Breathe Out'}
            </motion.p>
            <motion.p
              key={countdown}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-3xl font-bold mt-1"
            >
              {countdown}
            </motion.p>
          </div>
        </motion.div>

        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full blur-xl"
          style={{ backgroundColor: color }}
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {label && (
        <p className="mt-4 text-sm font-medium text-gray-500">{label}</p>
      )}
    </div>
  );
}
