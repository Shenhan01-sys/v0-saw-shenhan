"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useState, useEffect } from "react";

interface SwipeCarouselProps {
  items: React.ReactNode[];
  autoPlay?: boolean;
  interval?: number;
  className?: string;
}

export default function SwipeCarousel({
  items,
  autoPlay = true,
  interval = 4000,
  className = "",
}: SwipeCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);
  const dragConstraints = (items.length - 1) * 320;

  useEffect(() => {
    if (!autoPlay || isDragging) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, isDragging, items.length]);

  useEffect(() => {
    animate(x, -current * 320, { type: "spring", stiffness: 300, damping: 30 });
  }, [current]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="flex gap-4"
        style={{ x, cursor: isDragging ? "grabbing" : "grab" }}
        drag="x"
        dragConstraints={{ left: -dragConstraints, right: 0 }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
      >
        {items.map((item, index) => (
          <motion.div
            key={index}
            className="flex-shrink-0 w-80"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {item}
          </motion.div>
        ))}
      </motion.div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              current === index
                ? "bg-blue-500 w-6"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>

      <motion.button
        className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg"
        onClick={() => setCurrent((prev) => Math.max(0, prev - 1))}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </motion.button>

      <motion.button
        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg"
        onClick={() => setCurrent((prev) => Math.min(items.length - 1, prev + 1))}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </motion.button>
    </div>
  );
}