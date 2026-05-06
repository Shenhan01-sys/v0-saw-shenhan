"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { useRef } from "react";

interface Floating3DIconProps {
  icon: React.ReactNode;
  floatRange?: number;
  rotateRange?: number;
  duration?: number;
  className?: string;
}

export default function Floating3DIcon({
  icon,
  floatRange = 20,
  rotateRange = 15,
  duration = 3,
  className = "",
}: Floating3DIconProps) {
  const ref = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [`-${rotateRange}deg`, `${rotateRange}deg`]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [`${rotateRange}deg`, `-${rotateRange}deg`]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`relative cursor-pointer ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
    >
      <motion.div
        className="relative"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        animate={{
          y: [0, -floatRange, 0],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <motion.div
          className="relative z-10"
          style={{ transform: "translateZ(50px)" }}
        >
          {icon}
        </motion.div>

        <motion.div
          className="absolute inset-0 flex items-center justify-center blur-xl opacity-50"
          animate={{
            y: [0, -floatRange, 0],
          }}
          transition={{
            duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="text-blue-500/50">{icon}</div>
        </motion.div>

        <motion.div
          className="absolute inset-0 -z-10"
          style={{ transform: "translateZ(-50px)" }}
        >
          <div className="opacity-20">{icon}</div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
