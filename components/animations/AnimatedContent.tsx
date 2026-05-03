import { useRef, useEffect } from 'react';
import { motion, useInView } from 'motion/react';

interface AnimatedContentProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'left' | 'right' | 'up' | 'down';
  delay?: number;
}

export default function AnimatedContent({
  children,
  className = '',
  direction = 'up',
  delay = 0
}: AnimatedContentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px' });

  const directionMap = {
    up: { y: 30 },
    down: { y: -30 },
    left: { x: 30 },
    right: { x: -30 }
  };

  const initialState = directionMap[direction];

  useEffect(() => {
    if (isInView && ref.current) {
      ref.current.animate(
        [
          { opacity: 0, ...initialState },
          { opacity: 1, transform: 'translate(0, 0)' }
        ],
        {
          duration: 400,
          delay,
          easing: 'ease-out',
          fill: 'forwards'
        }
      );
    }
  }, [isInView, initialState, delay]);

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}