'use client';

import { motion } from 'framer-motion';

const icons = [
  { emoji: "❤️", label: "Heart", color: "#ef4444" },
  { emoji: "🧠", label: "Brain", color: "#8b5cf6" },
  { emoji: "🫀", label: "Heart", color: "#ec4899" },
  { emoji: "💪", label: "Muscle", color: "#f59e0b" },
  { emoji: "🩺", label: "Stethoscope", color: "#06b6d4" },
  { emoji: "💊", label: "Pill", color: "#10b981" },
  { emoji: "🩸", label: "Blood", color: "#dc2626" },
  { emoji: "🫁", label: "Lungs", color: "#6366f1" },
];

interface FloatingHealthIconsProps {
  count?: number;
  className?: string;
}

export default function FloatingHealthIcons({
  count = 6,
  className = ""
}: FloatingHealthIconsProps) {
  const selectedIcons = icons.slice(0, count);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {selectedIcons.map((icon, index) => (
        <motion.div
          key={index}
          className="absolute text-3xl"
          style={{ filter: "drop-shadow(0 0 10px rgba(0,0,0,0.3))" }}
          initial={{
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
            scale: 0.5,
            opacity: 0,
          }}
          animate={{
            y: [null, `${Math.random() * -30 - 10}%`, `${Math.random() * 30 + 10}%`, null],
            x: [null, `${Math.random() * 20 - 10}%`, `${Math.random() * -20 + 10}%`, null],
            scale: [0.5, 1, 0.8, 1, 0.6],
            opacity: [0, 0.8, 0.6, 0.9, 0],
            rotate: [0, Math.random() * 20 - 10, Math.random() * -20 + 10, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.5,
          }}
        >
          <motion.div
            animate={{
              boxShadow: [
                `0 0 10px ${icon.color}40`,
                `0 0 20px ${icon.color}60`,
                `0 0 10px ${icon.color}40`,
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="rounded-full p-2"
            style={{ backgroundColor: `${icon.color}20` }}
          >
            <span role="img" aria-label={icon.label}>{icon.emoji}</span>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
