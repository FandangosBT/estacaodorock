"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StrobeBackgroundProps {
  className?: string;
  children?: React.ReactNode;
  intensity?: "subtle" | "medium" | "strong";
}

interface Flash {
  x: number;
  y: number;
  size: number;
  opacity: number;
  hue: number;
  duration: number;
  delay: number;
}

function createFlash(width: number, height: number): Flash {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    size: 50 + Math.random() * 200,
    opacity: 0.3 + Math.random() * 0.7,
    hue: Math.random() * 60, // Tons de vermelho/laranja/amarelo
    duration: 0.1 + Math.random() * 0.3,
    delay: Math.random() * 2,
  };
}

export function StrobeBackground({
  className,
  children,
  intensity = "strong",
}: StrobeBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const flashesRef = useRef<Flash[]>([]);
  const animationFrameRef = useRef<number>(0);
  const FLASH_COUNT = 15;

  const intensityMap = {
    subtle: 0.3,
    medium: 0.6,
    strong: 1,
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateFlashes = () => {
      const rect = container.getBoundingClientRect();
      flashesRef.current = Array.from({ length: FLASH_COUNT }, () =>
        createFlash(rect.width, rect.height)
      );
    };

    updateFlashes();
    window.addEventListener("resize", updateFlashes);

    return () => {
      window.removeEventListener("resize", updateFlashes);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative min-h-screen w-full bg-black",
        className
      )}
    >
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/silhueta.png)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-red-950/40 via-black/60 to-orange-950/30" />

      {/* Strobe flashes */}
      {flashesRef.current.map((flash, index) => (
        <motion.div
          key={`flash-${index}`}
          className="absolute rounded-full pointer-events-none"
          style={
              {
                left: flash.x,
                top: flash.y,
                width: flash.size,
                height: flash.size,
                background: `radial-gradient(circle, hsla(${flash.hue}, 100%, 80%, ${(flash.opacity * intensityMap[intensity]) * 1.5}) 0%, transparent 60%)`,
                filter: "blur(15px)",
                mixBlendMode: "screen",
              } as React.CSSProperties
            }
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1.2, 0.8],
          }}
          transition={{
            duration: flash.duration,
            delay: flash.delay,
            repeat: Infinity,
            repeatDelay: 1 + Math.random() * 3,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Additional rapid strobe effect */}
      <motion.div
        className="absolute inset-0 bg-white/10"
        style={{ mixBlendMode: "screen" }}
        animate={{
          opacity: [0, 0.6, 0, 0.2, 0],
        }}
        transition={{
          duration: 0.15,
          repeat: Infinity,
          repeatDelay: 0.5 + Math.random() * 1.2,
          ease: "easeInOut",
        }}
      />

      {/* Lightning-like flashes */}
      {Array.from({ length: 5 }).map((_, index) => (
        <motion.div
          key={`lightning-${index}`}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(${Math.random() * 360}deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)`,
          }}
          animate={{
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 0.05,
            delay: index * 0.3 + Math.random() * 2,
            repeat: Infinity,
            repeatDelay: 2 + Math.random() * 4,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Pulsing overlay for guitar solo effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-orange-500/10 to-yellow-500/10"
        animate={{
          opacity: [0.1, 0.4, 0.1, 0.6, 0.1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}