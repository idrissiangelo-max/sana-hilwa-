"use client";

import React, { useEffect, useState } from "react";

interface Particle {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  type: "heart" | "sparkle" | "star";
  opacity: number;
}

export default function FloatingParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate random ambient particles
    const items: Particle[] = Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      left: Math.random() * 96 + 2,
      size: Math.random() * 16 + 10,
      duration: Math.random() * 12 + 10,
      delay: Math.random() * 8,
      type: i % 3 === 0 ? "heart" : i % 3 === 1 ? "sparkle" : "star",
      opacity: Math.random() * 0.4 + 0.2,
    }));
    setParticles(items);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute text-pink-400 select-none animate-float-slow"
          style={{
            left: `${p.left}%`,
            top: `${(p.id * 7) % 90}%`,
            fontSize: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            opacity: p.opacity,
          }}
        >
          {p.type === "heart" ? "💖" : p.type === "sparkle" ? "✨" : "⭐"}
        </div>
      ))}
    </div>
  );
}
