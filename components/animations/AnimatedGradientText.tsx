"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface AnimatedGradientTextProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  duration?: number;
}

export default function AnimatedGradientText({
  children,
  className = "",
  colors = ["#3B82F6", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981"],
  duration = 3,
}: AnimatedGradientTextProps) {
  const gradientId = useMemo(() => `grad-${Math.random().toString(36).substr(2, 9)}`, []);

  const cssText = `
    background: linear-gradient(
      90deg,
      ${colors.map((c, i) => `${c} ${(i / (colors.length - 1)) * 100}%`).join(", ")}
    );
    background-size: 200% 100%;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  `;

  return (
    <span className={`relative inline-block ${className}`} style={{}}>
      <motion.span
        className="relative inline-block"
        style={{
          background: `linear-gradient(90deg, ${colors.join(", ")})`,
          backgroundSize: "200% 100%",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {children}
      </motion.span>
    </span>
  );
}