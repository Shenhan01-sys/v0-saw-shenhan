'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface VitalSignProps {
  label: string;
  value: number;
  unit: string;
  icon: string;
  min?: number;
  max?: number;
  status?: 'normal' | 'warning' | 'danger';
  className?: string;
}

export default function VitalSign({
  label,
  value,
  unit,
  icon,
  min = 0,
  max = 100,
  status = 'normal',
  className = ""
}: VitalSignProps) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 200);
    }, 1000 + Math.random() * 500);
    return () => clearInterval(interval);
  }, []);

  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  const statusColor = {
    normal: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444'
  }[status];

  return (
    <div className={`bg-white rounded-xl p-4 shadow-sm border border-gray-100 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <span className="text-sm font-medium text-gray-600">{label}</span>
        </div>
        <motion.span
          animate={pulse ? { scale: [1, 1.1, 1] } : {}}
          className="text-xs px-2 py-1 rounded-full"
          style={{ backgroundColor: `${statusColor}20`, color: statusColor }}
        >
          {status}
        </motion.span>
      </div>

      <div className="flex items-end gap-2 mb-2">
        <motion.span
          key={value}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold"
          style={{ color: statusColor }}
        >
          {value}
        </motion.span>
        <span className="text-sm text-gray-400 mb-1">{unit}</span>
      </div>

      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: statusColor }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>

      <div className="flex justify-between mt-1 text-xs text-gray-400">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
