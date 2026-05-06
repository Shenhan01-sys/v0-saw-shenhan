"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface GlassmorphismCardProps {
  children: React.ReactNode;
  className?: string;
  blur?: number;
}

export default function GlassmorphismCard({
  children,
  className = "",
  blur = 20,
}: GlassmorphismCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div
        className="absolute -inset-px rounded-2xl opacity-50"
        style={{
          background: isHovered
            ? "linear-gradient(135deg, rgba(255,255,255,0.4), rgba(255,255,255,0.1))"
            : "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))",
          backdropFilter: `blur(${blur}px)`,
          WebkitBackdropFilter: `blur(${blur}px)`,
        }}
      />

      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)",
        }}
      />

      <motion.div
        className="absolute -top-px left-0 right-0 h-px"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{
          scaleX: isHovered ? 1 : 0,
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        style={{
          background: "linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.8), transparent)",
        }}
      />

      <motion.div
        className="absolute -bottom-px left-0 right-0 h-px"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{
          scaleX: isHovered ? 1 : 0,
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        style={{
          background: "linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.8), transparent)",
        }}
      />

      <div className="relative z-10 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl p-6">
        {children}
      </div>
    </motion.div>
  );
}
