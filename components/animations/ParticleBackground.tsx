"use client";

import { useState, useEffect, useRef } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
}

const PARTICLE_COLORS = [
  "rgba(59, 130, 246, 0.6)",  // blue
  "rgba(168, 85, 247, 0.6)",  // purple
  "rgba(236, 72, 153, 0.6)",  // pink
  "rgba(34, 211, 238, 0.6)",  // cyan
  "rgba(16, 185, 129, 0.6)",  // emerald
];

export default function ParticleBackground({
  children,
  particleCount = 50,
}: {
  children: React.ReactNode;
  particleCount?: number;
}) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const newParticles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.1,
        color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
      });
    }
    setParticles(newParticles);
  }, [particleCount]);

  useEffect(() => {
    if (!mounted) return;

    const interval = setInterval(() => {
      setParticles((prev) =>
        prev.map((p) => {
          let newX = p.x + p.speedX;
          let newY = p.y + p.speedY;
          let newSpeedX = p.speedX;
          let newSpeedY = p.speedY;

          if (newX <= 0 || newX >= 100) {
            newSpeedX = -newSpeedX;
            newX = Math.max(0, Math.min(100, newX));
          }
          if (newY <= 0 || newY >= 100) {
            newSpeedY = -newSpeedY;
            newY = Math.max(0, Math.min(100, newY));
          }

          return {
            ...p,
            x: newX,
            y: newY,
            speedX: newSpeedX,
            speedY: newSpeedY,
          };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, [mounted]);

  if (!mounted) return <>{children}</>;

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full blur-sm"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              opacity: particle.opacity,
              transform: "translate(-50%, -50%)",
              transition: "all 0.5s ease",
            }}
          />
        ))}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(59, 130, 246, 0.08) 0%, transparent 70%)",
          }}
        />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
