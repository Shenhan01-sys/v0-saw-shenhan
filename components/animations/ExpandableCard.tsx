"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface ExpandableCardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export default function ExpandableCard({
  children,
  title = "Click to expand",
  className = "",
}: ExpandableCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl ${className}`}
      layout
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <motion.div
        className="absolute inset-0 cursor-pointer"
        animate={{
          background: isExpanded
            ? [
                "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, transparent 50%, rgba(168, 85, 247, 0.1) 100%)",
                "linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, transparent 50%, rgba(236, 72, 153, 0.1) 100%)",
                "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, transparent 50%, rgba(168, 85, 247, 0.1) 100%)",
              ]
            : "linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, transparent 50%)",
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      <motion.div
        className="absolute inset-0 border border-transparent rounded-2xl"
        animate={{
          borderColor: isExpanded
            ? ["rgba(59, 130, 246, 0.3)", "rgba(168, 85, 247, 0.3)", "rgba(59, 130, 246, 0.3)"]
            : "rgba(255, 255, 255, 0.1)",
        }}
        transition={{ duration: 1.5, repeat: isExpanded ? Infinity : 0 }}
        style={{
          background: "linear-gradient(#fff, #fff) padding-box, linear-gradient(90deg, #3B82F6, #8B5CF6, #EC4899, #3B82F6) border-box",
          backgroundSize: "200% 200%",
        }}
      />

      <motion.div
        className="relative z-10 p-6 cursor-pointer"
        layout
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-600">{title}</span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}