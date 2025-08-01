import { useEffect, useRef, useState } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';

interface ScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
  stagger?: number;
}

export function useScrollAnimation(
  options: ScrollAnimationOptions = {}
) {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true,
    delay = 0,
    stagger = 0
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<any>(null);
  const { animationLevel } = useAccessibility();

  useEffect(() => {
    const element = elementRef.current;
    if (!element || animationLevel === 'none') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!triggerOnce || !hasTriggered)) {
          setTimeout(() => {
            setIsVisible(true);
            setHasTriggered(true);
          }, delay);
        } else if (!triggerOnce && !entry.isIntersecting) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce, delay, hasTriggered, animationLevel]);

  const getAnimationClasses = (index: number = 0) => {
    if (animationLevel === 'none') return 'opacity-100 translate-y-0';
    
    const baseClasses = 'transition-all duration-700 ease-out';
    const visibleClasses = 'opacity-100 translate-y-0';
    const hiddenClasses = 'opacity-0 translate-y-8';
    
    const staggerDelay = stagger > 0 ? `delay-[${index * stagger}ms]` : '';
    
    return `${baseClasses} ${staggerDelay} ${isVisible ? visibleClasses : hiddenClasses}`;
  };

  const getSlideInClasses = (direction: 'left' | 'right' | 'up' | 'down' = 'up', index: number = 0) => {
    if (animationLevel === 'none') return 'opacity-100 translate-x-0 translate-y-0';
    
    const baseClasses = 'transition-all duration-700 ease-out';
    const visibleClasses = 'opacity-100 translate-x-0 translate-y-0';
    
    let hiddenClasses = 'opacity-0';
    switch (direction) {
      case 'left':
        hiddenClasses += ' -translate-x-8';
        break;
      case 'right':
        hiddenClasses += ' translate-x-8';
        break;
      case 'up':
        hiddenClasses += ' translate-y-8';
        break;
      case 'down':
        hiddenClasses += ' -translate-y-8';
        break;
    }
    
    const staggerDelay = stagger > 0 ? `delay-[${index * stagger}ms]` : '';
    
    return `${baseClasses} ${staggerDelay} ${isVisible ? visibleClasses : hiddenClasses}`;
  };

  const getScaleClasses = (index: number = 0) => {
    if (animationLevel === 'none') return 'opacity-100 scale-100';
    
    const baseClasses = 'transition-all duration-700 ease-out';
    const visibleClasses = 'opacity-100 scale-100';
    const hiddenClasses = 'opacity-0 scale-95';
    
    const staggerDelay = stagger > 0 ? `delay-[${index * stagger}ms]` : '';
    
    return `${baseClasses} ${staggerDelay} ${isVisible ? visibleClasses : hiddenClasses}`;
  };

  return {
    ref: elementRef,
    isVisible,
    hasTriggered,
    getAnimationClasses,
    getSlideInClasses,
    getScaleClasses
  };
}

// Hook específico para animações de timeline
export function useTimelineAnimation(itemCount: number) {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const { animationLevel } = useAccessibility();
  const observerRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (animationLevel === 'none') {
      setVisibleItems(new Set(Array.from({ length: itemCount }, (_, i) => i)));
      return;
    }

    const observers: IntersectionObserver[] = [];

    observerRefs.current.forEach((element, index) => {
      if (element) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setVisibleItems(prev => new Set([...prev, index]));
            }
          },
          {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
          }
        );

        observer.observe(element);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, [itemCount, animationLevel]);

  const getItemRef = (index: number) => (el: HTMLElement | null) => {
    observerRefs.current[index] = el;
  };

  const getItemClasses = (index: number) => {
    if (animationLevel === 'none') return 'opacity-100 translate-x-0';
    
    const isVisible = visibleItems.has(index);
    const isEven = index % 2 === 0;
    
    const baseClasses = 'transition-all duration-700 ease-out';
    const visibleClasses = 'opacity-100 translate-x-0';
    const hiddenClasses = `opacity-0 ${isEven ? '-translate-x-8' : 'translate-x-8'}`;
    
    return `${baseClasses} ${isVisible ? visibleClasses : hiddenClasses}`;
  };

  return {
    getItemRef,
    getItemClasses,
    visibleItems
  };
}