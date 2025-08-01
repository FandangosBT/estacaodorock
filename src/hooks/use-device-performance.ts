import { useState, useEffect, useRef } from 'react';

export interface DevicePerformance {
  tier: 'low' | 'medium' | 'high';
  fps: number;
  memory: number;
  cores: number;
  isMobile: boolean;
  supportsWebGL: boolean;
  shouldReduceAnimations: boolean;
}

export function useDevicePerformance(): DevicePerformance {
  const [performance, setPerformance] = useState<DevicePerformance>({
    tier: 'medium',
    fps: 60,
    memory: 4,
    cores: 4,
    isMobile: false,
    supportsWebGL: true,
    shouldReduceAnimations: false
  });

  const frameCount = useRef(0);
  const lastTime = useRef(window.performance.now());
  const fpsHistory = useRef<number[]>([]);

  useEffect(() => {
    const detectPerformance = () => {
      // Detect mobile device
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.innerWidth < 768;

      // Detect hardware concurrency (CPU cores)
      const cores = navigator.hardwareConcurrency || 4;

      // Detect memory (if available)
      const memory = (navigator as any).deviceMemory || 4;

      // Check WebGL support
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      const supportsWebGL = !!gl;

      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Measure FPS over a short period
      const measureFPS = () => {
            return new Promise<number>((resolve) => {
              let frames = 0;
              const startTime = window.performance.now();
          
          const countFrame = () => {
            frames++;
            if (frames < 60) {
              requestAnimationFrame(countFrame);
            } else {
                const endTime = window.performance.now();
                const fps = Math.round((frames * 1000) / (endTime - startTime));
              resolve(Math.min(fps, 60));
            }
          };
          
          requestAnimationFrame(countFrame);
        });
      };

      // Determine performance tier
      measureFPS().then((fps) => {
        let tier: 'low' | 'medium' | 'high' = 'medium';
        
        if (isMobile && memory <= 2) {
          tier = 'low';
        } else if (isMobile && memory <= 4) {
          tier = 'medium';
        } else if (cores >= 8 && memory >= 8 && fps >= 55) {
          tier = 'high';
        } else if (cores >= 4 && memory >= 4 && fps >= 45) {
          tier = 'medium';
        } else {
          tier = 'low';
        }

        const shouldReduceAnimations = prefersReducedMotion || tier === 'low' || fps < 30;

        setPerformance({
          tier,
          fps,
          memory,
          cores,
          isMobile,
          supportsWebGL,
          shouldReduceAnimations
        });
      });
    };

    detectPerformance();

    // Listen for reduced motion preference changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => {
      setPerformance(prev => ({
        ...prev,
        shouldReduceAnimations: mediaQuery.matches || prev.tier === 'low'
      }));
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return performance;
}

// Hook for continuous FPS monitoring
export function useFPSMonitor(enabled = true) {
  const [currentFPS, setCurrentFPS] = useState(60);
  const frameCount = useRef(0);
  const lastTime = useRef(window.performance.now());
  const animationFrameId = useRef<number>();

  useEffect(() => {
    if (!enabled) return;

    const measureFPS = () => {
      frameCount.current++;
      const currentTime = window.performance.now();
      
      if (currentTime - lastTime.current >= 1000) {
        const fps = Math.round((frameCount.current * 1000) / (currentTime - lastTime.current));
        setCurrentFPS(fps);
        frameCount.current = 0;
        lastTime.current = currentTime;
      }
      
      animationFrameId.current = requestAnimationFrame(measureFPS);
    };

    animationFrameId.current = requestAnimationFrame(measureFPS);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [enabled]);

  return currentFPS;
}

// Performance-based animation config
export function getAnimationConfig(performance: DevicePerformance) {
  switch (performance.tier) {
    case 'low':
      return {
        particleCount: { smoke: 10, light: 15, spark: 5 },
        maxParticles: 50,
        updateInterval: 32, // 30fps
        enableBlur: false,
        enableShadows: false,
        enableInteraction: false,
        crowdDetail: 'low'
      };
    case 'medium':
      return {
        particleCount: { smoke: 20, light: 30, spark: 10 },
        maxParticles: 100,
        updateInterval: 16, // 60fps
        enableBlur: true,
        enableShadows: false,
        enableInteraction: true,
        crowdDetail: 'medium'
      };
    case 'high':
      return {
        particleCount: { smoke: 30, light: 50, spark: 20 },
        maxParticles: 200,
        updateInterval: 16, // 60fps
        enableBlur: true,
        enableShadows: true,
        enableInteraction: true,
        crowdDetail: 'high'
      };
    default:
      return {
        particleCount: { smoke: 20, light: 30, spark: 10 },
        maxParticles: 100,
        updateInterval: 16,
        enableBlur: true,
        enableShadows: false,
        enableInteraction: true,
        crowdDetail: 'medium'
      };
  }
}