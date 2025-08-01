import React, { useRef, useEffect, ReactNode } from 'react';
import { useMobile } from '@/hooks/useMobile';

interface TouchGesturesProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onPinch?: (scale: number) => void;
  onDoubleTap?: () => void;
  className?: string;
  threshold?: number;
}

export const TouchGestures: React.FC<TouchGesturesProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onPinch,
  onDoubleTap,
  className,
  threshold = 50,
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const { touchSupport } = useMobile();
  
  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastTap = useRef<number>(0);
  const initialDistance = useRef<number>(0);
  const lastScale = useRef<number>(1);

  useEffect(() => {
    if (!touchSupport || !elementRef.current) return;

    const element = elementRef.current;

    const getTouchDistance = (touches: TouchList): number => {
      if (touches.length < 2) return 0;
      const touch1 = touches[0];
      const touch2 = touches[1];
      return Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        // Single touch - potential swipe or tap
        const touch = e.touches[0];
        touchStart.current = {
          x: touch.clientX,
          y: touch.clientY,
          time: Date.now(),
        };
      } else if (e.touches.length === 2) {
        // Two touches - potential pinch
        initialDistance.current = getTouchDistance(e.touches);
        lastScale.current = 1;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && onPinch) {
        // Handle pinch gesture
        const currentDistance = getTouchDistance(e.touches);
        if (initialDistance.current > 0) {
          const scale = currentDistance / initialDistance.current;
          if (Math.abs(scale - lastScale.current) > 0.1) {
            onPinch(scale);
            lastScale.current = scale;
          }
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStart.current) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStart.current.x;
      const deltaY = touch.clientY - touchStart.current.y;
      const deltaTime = Date.now() - touchStart.current.time;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // Check for double tap
      if (onDoubleTap && distance < 10 && deltaTime < 300) {
        const now = Date.now();
        if (now - lastTap.current < 300) {
          onDoubleTap();
          lastTap.current = 0;
        } else {
          lastTap.current = now;
        }
      }

      // Check for swipe gestures
      if (distance > threshold && deltaTime < 500) {
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);

        if (absDeltaX > absDeltaY) {
          // Horizontal swipe
          if (deltaX > 0 && onSwipeRight) {
            onSwipeRight();
          } else if (deltaX < 0 && onSwipeLeft) {
            onSwipeLeft();
          }
        } else {
          // Vertical swipe
          if (deltaY > 0 && onSwipeDown) {
            onSwipeDown();
          } else if (deltaY < 0 && onSwipeUp) {
            onSwipeUp();
          }
        }
      }

      touchStart.current = null;
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [touchSupport, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onPinch, onDoubleTap, threshold]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
};

export default TouchGestures;