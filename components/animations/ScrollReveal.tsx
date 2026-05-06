"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
}

export default function ScrollReveal({
  children,
  className = "",
  direction = "up",
  delay = 0,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const directions = {
    up: { y: 100, x: 0 },
    down: { y: -100, x: 0 },
    left: { x: 100, y: 0 },
    right: { x: -100, y: 0 },
  };

  const { x, y } = directions[direction];
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const transform = useTransform(scrollYProgress, [0, 1], [y, 0]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ opacity, y: direction === "up" || direction === "down" ? transform : undefined }}
    >
      {children}
    </motion.div>
  );
}