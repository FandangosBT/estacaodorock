import React, { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import gsap from 'gsap';

interface FloatingPanelProps {
  children: React.ReactNode;
  className?: string;
  animationDelay?: number;
  animationDuration?: number;
  animationAmplitude?: [number, number, number];
  initialAnimation?: {
    opacity?: number;
    y?: number;
    x?: number;
  };
  enterAnimation?: {
    opacity?: number;
    y?: number;
    x?: number;
  };
  enterDuration?: number;
  enterDelay?: number;
}

export const FloatingPanel: React.FC<FloatingPanelProps> = ({
  children,
  className = '',
  animationDelay = 0,
  animationDuration = 8,
  animationAmplitude = [-5, 15, -5],
  initialAnimation = { opacity: 0, y: 20 },
  enterAnimation = { opacity: 1, y: 0 },
  enterDuration = 0.6,
  enterDelay = 0.3,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (typeof window === 'undefined') return;
    const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    if (isTouch) return; // evita hover em touch

    const el = panelRef.current;
    if (!el) return;

    const onEnter = () => {
      gsap.to(el, {
        scale: 1.01,
        y: -2,
        boxShadow: '0 24px 110px rgba(0,0,0,0.7)',
        duration: 0.4,
        ease: 'power2.out',
      });
      gsap.to(el, { borderColor: 'rgba(255,255,255,0.25)', duration: 0.3, ease: 'power2.out' });
    };
    const onLeave = () => {
      gsap.to(el, {
        scale: 1,
        y: 0,
        boxShadow: '0 20px 80px rgba(0,0,0,0.6)',
        duration: 0.45,
        ease: 'power2.inOut',
      });
      gsap.to(el, { borderColor: 'rgba(255,255,255,0.15)', duration: 0.35, ease: 'power2.inOut' });
    };

    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    el.addEventListener('focusin', onEnter);
    el.addEventListener('focusout', onLeave);

    return () => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
      el.removeEventListener('focusin', onEnter);
      el.removeEventListener('focusout', onLeave);
    };
  }, [prefersReducedMotion]);

  return (
    <motion.div
      initial={initialAnimation}
      animate={enterAnimation}
      transition={{ duration: enterDuration, delay: enterDelay }}
      className={cn('px-4 md:px-8', className)}
    >
      <motion.div
        ref={panelRef}
        animate={prefersReducedMotion ? {} : { y: animationAmplitude }}
        transition={
          prefersReducedMotion
            ? {}
            : {
                duration: animationDuration + animationDelay,
                repeat: Infinity,
                repeatType: 'mirror',
              }
        }
        className="w-full max-w-6xl mx-auto bg-black/10 backdrop-blur-sm rounded-2xl border border-white/15 shadow-[0_20px_80px_rgba(0,0,0,0.6)] will-change-transform"
      >
        <div className="p-6 md:p-8 overflow-visible min-h-[2rem]">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FloatingPanel;