"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface ParallaxScrollSectionProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

export default function ParallaxScrollSection({
  children,
  speed = 0.5,
  className = "",
}: ParallaxScrollSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -500 * speed]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y, opacity }} className="relative z-10">
        {children}
      </motion.div>
    </div>
  );
}