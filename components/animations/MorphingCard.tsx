"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface MorphingCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export default function MorphingCard({
  children,
  className = "",
  glowColor = "rgba(59, 130, 246, 0.5)",
}: MorphingCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="absolute -inset-1 rounded-2xl opacity-70 blur-md transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, ${glowColor}, transparent 70%)`,
          opacity: isHovered ? 0.8 : 0,
        }}
        animate={{
          background: [
            `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, ${glowColor}, transparent 70%)`,
            `radial-gradient(circle at ${mousePosition.x + 10}% ${mousePosition.y - 10}%, rgba(168, 85, 247, 0.5), transparent 70%)`,
            `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, ${glowColor}, transparent 70%)`,
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        className="relative bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(255,255,255,0.3), transparent 50%)`,
          }}
          animate={{ opacity: isHovered ? 1 : 0 }}
        />
        <div className="relative z-10 p-6">{children}</div>
      </motion.div>
    </div>
  );
}
