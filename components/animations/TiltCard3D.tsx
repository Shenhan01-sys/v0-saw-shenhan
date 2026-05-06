"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";

interface TiltCard3DProps {
  children: React.ReactNode;
  className?: string;
  tiltStrength?: number;
}

export default function TiltCard3D({
  children,
  className = "",
  tiltStrength = 10,
}: TiltCard3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const smoothRotateX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const smoothRotateY = useSpring(rotateY, { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateXValue = ((y - centerY) / centerY) * -tiltStrength;
    const rotateYValue = ((x - centerX) / centerX) * tiltStrength;

    rotateX.set(rotateXValue);
    rotateY.set(rotateYValue);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={{
        perspective: 1000,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="relative bg-white/90 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl p-6"
        style={{
          rotateX: smoothRotateX,
          rotateY: smoothRotateY,
          transformStyle: "preserve-3d",
        }}
      >
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 0%, transparent 70%)",
          }}
          whileHover={{ opacity: 1 }}
        />

        <div
          className="relative z-10"
          style={{ transform: "translateZ(30px)" }}
        >
          {children}
        </div>

        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl"
          style={{
            background: "linear-gradient(90deg, transparent, #3B82F6, #8B5CF6, #EC4899, transparent)",
            transform: "translateZ(1px)",
          }}
        />
      </motion.div>
    </motion.div>
  );
}