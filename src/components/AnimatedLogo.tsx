import { useEffect, useState, useMemo } from 'react';
import { useDevicePerformance } from '../hooks/use-device-performance';

const AnimatedLogo = () => {
  const [isVisible, setIsVisible] = useState(false);
  const devicePerformance = useDevicePerformance();
  
  // Animation configuration based on device performance
  const animConfig = useMemo(() => {
    if (devicePerformance.shouldReduceAnimations) {
      return {
        enableAnimations: false,
        enablePulse: false,
        enableSpin: false,
        enableGlow: false,
        transitionDuration: 'duration-300'
      };
    }
    
    switch (devicePerformance.tier) {
      case 'low':
        return {
          enableAnimations: true,
          enablePulse: false,
          enableSpin: false,
          enableGlow: false,
          transitionDuration: 'duration-500'
        };
      case 'medium':
        return {
          enableAnimations: true,
          enablePulse: true,
          enableSpin: false,
          enableGlow: false,
          transitionDuration: 'duration-700'
        };
      case 'high':
      default:
        return {
          enableAnimations: true,
          enablePulse: true,
          enableSpin: true,
          enableGlow: true,
          transitionDuration: 'duration-1000'
        };
    }
  }, [devicePerformance]);

  useEffect(() => {
    const delay = devicePerformance.shouldReduceAnimations ? 100 : 500;
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [devicePerformance.shouldReduceAnimations]);

  return (
    <div className={`flex flex-col items-center justify-center transition-all ${animConfig.transitionDuration} ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
      {/* Central Circle with Lightning Bolts */}
      <div className="relative mb-6">
        {/* Lightning Bolts */}
        {animConfig.enableSpin && (
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s' }}>
            {Array.from({ length: devicePerformance.tier === 'high' ? 8 : 4 }).map((_, i) => (
              <div
                key={i}
                className={`absolute w-1 bg-gradient-to-t from-yellow-400 to-red-500 opacity-80 ${animConfig.enablePulse ? 'animate-pulse' : ''}`}
                style={{
                  height: '60px',
                  left: '50%',
                  top: '-30px',
                  transformOrigin: 'bottom center',
                  transform: `translateX(-50%) rotate(${i * (devicePerformance.tier === 'high' ? 45 : 90)}deg)`,
                  animationDelay: animConfig.enablePulse ? `${i * 0.2}s` : undefined,
                }}
              />
            ))}
          </div>
        )}

        {/* Inner Lightning Bolts */}
        {animConfig.enableSpin && devicePerformance.tier === 'high' && (
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`absolute w-0.5 bg-gradient-to-t from-white to-yellow-300 opacity-60 ${animConfig.enablePulse ? 'animate-pulse' : ''}`}
                style={{
                  height: '40px',
                  left: '50%',
                  top: '-20px',
                  transformOrigin: 'bottom center',
                  transform: `translateX(-50%) rotate(${i * 60}deg)`,
                  animationDelay: animConfig.enablePulse ? `${i * 0.3}s` : undefined,
                }}
              />
            ))}
          </div>
        )}

        {/* Central Circle */}
        <div className={`w-24 h-24 bg-gradient-to-br from-red-600 to-red-800 rounded-full border-4 border-white shadow-2xl ${animConfig.enablePulse ? 'animate-pulse' : ''} relative overflow-hidden`}>
          <div className={`absolute inset-2 bg-gradient-to-br from-yellow-400 to-red-500 rounded-full opacity-80 ${animConfig.enablePulse ? 'animate-pulse' : ''}`} style={{ animationDelay: animConfig.enablePulse ? '0.5s' : undefined }} />
          <div className={`absolute inset-4 bg-white rounded-full opacity-90 ${animConfig.enablePulse ? 'animate-pulse' : ''}`} style={{ animationDelay: animConfig.enablePulse ? '1s' : undefined }} />
        </div>
      </div>

      {/* ESTAÇÃO ROCK Text */}
      <div className="text-center mb-2">
        <h1 className="text-5xl md:text-7xl font-black text-white mb-1 relative">
          <span className={`relative inline-block ${animConfig.enablePulse ? 'animate-pulse' : ''}`}>
            ESTAÇÃO
            {animConfig.enableGlow && (
              <div className={`absolute inset-0 text-red-500 opacity-50 ${animConfig.enablePulse ? 'animate-pulse' : ''}`} style={{ 
                textShadow: '2px 2px 0px currentColor, -2px -2px 0px currentColor',
                animationDelay: animConfig.enablePulse ? '0.1s' : undefined
              }}>
                ESTAÇÃO
              </div>
            )}
          </span>
        </h1>
        <h2 className="text-3xl md:text-5xl font-black text-white relative">
          <span className={`relative inline-block ${animConfig.enablePulse ? 'animate-pulse' : ''}`} style={{ animationDelay: animConfig.enablePulse ? '0.2s' : undefined }}>
            ROCK
            {animConfig.enableGlow && (
              <div className={`absolute inset-0 text-red-500 opacity-50 ${animConfig.enablePulse ? 'animate-pulse' : ''}`} style={{ 
                textShadow: '2px 2px 0px currentColor, -2px -2px 0px currentColor',
                animationDelay: animConfig.enablePulse ? '0.3s' : undefined
              }}>
                ROCK
              </div>
            )}
          </span>
        </h2>
      </div>

      {/* FESTIVAL Text */}
      <div className="text-center mb-4">
        <h3 className={`text-2xl md:text-4xl font-bold text-white tracking-widest ${animConfig.enablePulse ? 'animate-pulse' : ''}`} style={{ animationDelay: animConfig.enablePulse ? '0.4s' : undefined }}>
          FESTIVAL
        </h3>
      </div>

      {/* 2025 with Decorative Line */}
      <div className="flex items-center gap-4">
        <div className={`w-12 h-0.5 bg-gradient-to-r from-transparent to-yellow-400 ${animConfig.enablePulse ? 'animate-pulse' : ''}`} style={{ animationDelay: animConfig.enablePulse ? '0.6s' : undefined }} />
        <span className={`text-3xl md:text-4xl font-black text-yellow-400 ${animConfig.enablePulse ? 'animate-pulse' : ''}`} style={{ 
          animationDelay: animConfig.enablePulse ? '0.5s' : undefined,
          textShadow: animConfig.enableGlow ? '0 0 20px rgba(255, 215, 0, 0.5)' : undefined
        }}>
          2025
        </span>
        <div className={`w-12 h-0.5 bg-gradient-to-l from-transparent to-yellow-400 ${animConfig.enablePulse ? 'animate-pulse' : ''}`} style={{ animationDelay: animConfig.enablePulse ? '0.6s' : undefined }} />
      </div>

      {/* Glow Effect */}
      {animConfig.enableGlow && (
        <div className="absolute inset-0 pointer-events-none">
          <div className={`w-full h-full bg-gradient-radial from-red-500/20 via-transparent to-transparent ${animConfig.enablePulse ? 'animate-pulse' : ''}`} style={{ animationDelay: animConfig.enablePulse ? '1s' : undefined }} />
        </div>
      )}
    </div>
  );
};

export default AnimatedLogo;