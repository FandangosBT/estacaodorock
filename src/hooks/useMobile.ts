import { useState, useEffect } from 'react';

interface MobileDetection {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenSize: 'mobile' | 'tablet' | 'desktop';
  orientation: 'portrait' | 'landscape';
  touchSupport: boolean;
}

export const useMobile = (): MobileDetection => {
  const [detection, setDetection] = useState<MobileDetection>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    screenSize: 'desktop',
    orientation: 'landscape',
    touchSupport: false,
  });

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const userAgent = navigator.userAgent;
      
      // Detect touch support
      const touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Detect orientation
      const orientation = height > width ? 'portrait' : 'landscape';
      
      // Detect device type by screen size
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      const isDesktop = width >= 1024;
      
      let screenSize: 'mobile' | 'tablet' | 'desktop';
      if (isMobile) screenSize = 'mobile';
      else if (isTablet) screenSize = 'tablet';
      else screenSize = 'desktop';
      
      // Additional mobile detection using user agent
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      const isMobileUA = mobileRegex.test(userAgent);
      
      setDetection({
        isMobile: isMobile || isMobileUA,
        isTablet,
        isDesktop: !isMobile && !isTablet && !isMobileUA,
        screenSize,
        orientation,
        touchSupport,
      });
    };

    // Initial check
    checkDevice();

    // Listen for resize events
    window.addEventListener('resize', checkDevice);
    window.addEventListener('orientationchange', checkDevice);

    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('orientationchange', checkDevice);
    };
  }, []);

  return detection;
};

export default useMobile;