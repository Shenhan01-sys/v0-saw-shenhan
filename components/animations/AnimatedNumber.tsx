'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  decimalPlaces?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function AnimatedNumber({
  value,
  duration = 1.5,
  decimalPlaces = 0,
  prefix = '',
  suffix = '',
  className = ''
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const controls = useAnimation();
  const previousValue = useRef(0);
  const animationRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    const startValue = previousValue.current;
    const endValue = value;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (endValue - startValue) * eased;
      setDisplayValue(current);

      if (progress < 1) {
        animationRef.current = { stop: () => {} };
        requestAnimationFrame(animate);
      } else {
        previousValue.current = endValue;
      }
    };

    requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, [value, duration]);

  return (
    <span className={className}>
      {prefix}{displayValue.toFixed(decimalPlaces)}{suffix}
    </span>
  );
}
