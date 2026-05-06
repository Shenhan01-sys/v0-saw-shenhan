'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface FloatingOrbProps {
  size?: number;
  color?: string;
  blur?: number;
  speed?: number;
  className?: string;
}

export function FloatingOrb({
  size = 100,
  color = '#6366f1',
  blur = 60,
  speed = 1,
  className = ''
}: FloatingOrbProps) {
  const constraintsRef = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 20, damping: 20 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  useEffect(() => {
    let animationId: number;
    let startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = (currentTime - startTime) / 1000;

      const offsetX = Math.sin(elapsed * speed * 0.5) * 50;
      const offsetY = Math.cos(elapsed * speed * 0.3) * 30;

      x.set(offsetX);
      y.set(offsetY);

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [speed, x, y]);

  return (
    <div ref={constraintsRef} className={`relative ${className}`}>
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          width: size,
          height: size,
          borderRadius: '50%',
          background: `radial-gradient(circle at 30% 30%, ${color}80, ${color}40, transparent)`,
          filter: `blur(${blur}px)`,
          opacity: 0.6
        }}
        drag
        dragConstraints={constraintsRef}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      />
    </div>
  );
}

interface PulsingRingProps {
  size?: number;
  color?: string;
  duration?: number;
  className?: string;
}

export function PulsingRing({
  size = 100,
  color = '#6366f1',
  duration = 2,
  className = ''
}: PulsingRingProps) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="absolute inset-0 rounded-full"
          style={{
            border: `2px solid ${color}`,
            animationDelay: `${index * (duration / 3)}s`
          }}
          initial={{ scale: 0.3, opacity: 1 }}
          animate={{
            scale: [0.3, 1.2],
            opacity: [0.8, 0]
          }}
          transition={{
            duration,
            repeat: Infinity,
            ease: 'easeOut',
            delay: index * (duration / 3)
          }}
        />
      ))}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${color}30, transparent 70%)`
        }}
      />
    </div>
  );
}
