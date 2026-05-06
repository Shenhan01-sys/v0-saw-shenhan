"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function MagneticButton({
  children,
  onClick,
  className = "",
}: MagneticButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <motion.button
      className={`relative px-8 py-4 rounded-2xl font-bold text-white overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={{
        x: mousePosition.x,
        y: mousePosition.y,
        scale: isHovered ? 1.05 : 1,
      }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      style={{
        background: isHovered
          ? "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #EC4899 100%)"
          : "linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)",
        boxShadow: isHovered
          ? "0 20px 40px rgba(59, 130, 246, 0.4), 0 0 60px rgba(139, 92, 246, 0.3)"
          : "0 10px 20px rgba(59, 130, 246, 0.2)",
      }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
        animate={{ x: isHovered ? "100%" : "-100%" }}
        transition={{ duration: 0.6 }}
        style={{ transform: "skewX(-20deg)" }}
      />
      <span className="relative z-10">{children}</span>

      <motion.div
        className="absolute -inset-1 rounded-2xl opacity-0"
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{ duration: 0.3 }}
        style={{
          background: "linear-gradient(135deg, #3B82F6, #8B5CF6, #EC4899)",
          filter: "blur(20px)",
          zIndex: -1,
        }}
      />
    </motion.button>
  );
}