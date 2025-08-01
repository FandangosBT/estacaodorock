import { useEffect, useState } from 'react';
import { useMobile } from './useMobile';

interface MobileOptimizations {
  reducedMotion: boolean;
  lowDataMode: boolean;
  batteryLevel: number | null;
  isCharging: boolean | null;
  connectionType: string | null;
  shouldReduceAnimations: boolean;
  shouldOptimizeImages: boolean;
  shouldPreloadContent: boolean;
}

export const useMobileOptimizations = (): MobileOptimizations => {
  const { isMobile } = useMobile();
  const [optimizations, setOptimizations] = useState<MobileOptimizations>({
    reducedMotion: false,
    lowDataMode: false,
    batteryLevel: null,
    isCharging: null,
    connectionType: null,
    shouldReduceAnimations: false,
    shouldOptimizeImages: false,
    shouldPreloadContent: true,
  });

  useEffect(() => {
    const updateOptimizations = async () => {
      // Check for reduced motion preference
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      // Check for low data mode (Save-Data header)
      const lowDataMode = 'connection' in navigator && 
        (navigator as any).connection?.saveData === true;
      
      // Get battery information
      let batteryLevel: number | null = null;
      let isCharging: boolean | null = null;
      
      if ('getBattery' in navigator) {
        try {
          const battery = await (navigator as any).getBattery();
          batteryLevel = battery.level;
          isCharging = battery.charging;
        } catch (error) {
          console.log('Battery API not available');
        }
      }
      
      // Get connection information
      let connectionType: string | null = null;
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        connectionType = connection?.effectiveType || connection?.type || null;
      }
      
      // Determine optimization strategies
      const isSlowConnection = connectionType === 'slow-2g' || connectionType === '2g';
      const isLowBattery = batteryLevel !== null && batteryLevel < 0.2 && !isCharging;
      
      const shouldReduceAnimations = reducedMotion || isLowBattery || isSlowConnection;
      const shouldOptimizeImages = isMobile || lowDataMode || isSlowConnection;
      const shouldPreloadContent = !lowDataMode && !isSlowConnection && !isLowBattery;
      
      setOptimizations({
        reducedMotion,
        lowDataMode,
        batteryLevel,
        isCharging,
        connectionType,
        shouldReduceAnimations,
        shouldOptimizeImages,
        shouldPreloadContent,
      });
    };

    updateOptimizations();

    // Listen for battery changes
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const handleBatteryChange = () => updateOptimizations();
        battery.addEventListener('chargingchange', handleBatteryChange);
        battery.addEventListener('levelchange', handleBatteryChange);
        
        return () => {
          battery.removeEventListener('chargingchange', handleBatteryChange);
          battery.removeEventListener('levelchange', handleBatteryChange);
        };
      }).catch(() => {});
    }

    // Listen for connection changes
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      const handleConnectionChange = () => updateOptimizations();
      connection?.addEventListener('change', handleConnectionChange);
      
      return () => {
        connection?.removeEventListener('change', handleConnectionChange);
      };
    }
  }, [isMobile]);

  return optimizations;
};

export default useMobileOptimizations;