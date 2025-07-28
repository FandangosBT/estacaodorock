import { useEffect, useState } from 'react';

const AnimatedLogo = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`flex flex-col items-center justify-center transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
      {/* Central Circle with Lightning Bolts */}
      <div className="relative mb-6">
        {/* Lightning Bolts */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s' }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 bg-gradient-to-t from-yellow-400 to-red-500 opacity-80 animate-pulse"
              style={{
                height: '60px',
                left: '50%',
                top: '-30px',
                transformOrigin: 'bottom center',
                transform: `translateX(-50%) rotate(${i * 45}deg)`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>

        {/* Inner Lightning Bolts */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 bg-gradient-to-t from-white to-yellow-300 opacity-60 animate-pulse"
              style={{
                height: '40px',
                left: '50%',
                top: '-20px',
                transformOrigin: 'bottom center',
                transform: `translateX(-50%) rotate(${i * 60}deg)`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </div>

        {/* Central Circle */}
        <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-red-800 rounded-full border-4 border-white shadow-2xl animate-pulse relative overflow-hidden">
          <div className="absolute inset-2 bg-gradient-to-br from-yellow-400 to-red-500 rounded-full opacity-80 animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="absolute inset-4 bg-white rounded-full opacity-90 animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
      </div>

      {/* ESTAÇÃO ROCK Text */}
      <div className="text-center mb-2">
        <h1 className="text-5xl md:text-7xl font-black text-white mb-1 relative">
          <span className="relative inline-block animate-pulse">
            ESTAÇÃO
            <div className="absolute inset-0 text-red-500 opacity-50 animate-pulse" style={{ 
              textShadow: '2px 2px 0px currentColor, -2px -2px 0px currentColor',
              animationDelay: '0.1s' 
            }}>
              ESTAÇÃO
            </div>
          </span>
        </h1>
        <h2 className="text-3xl md:text-5xl font-black text-white relative">
          <span className="relative inline-block animate-pulse" style={{ animationDelay: '0.2s' }}>
            ROCK
            <div className="absolute inset-0 text-red-500 opacity-50 animate-pulse" style={{ 
              textShadow: '2px 2px 0px currentColor, -2px -2px 0px currentColor',
              animationDelay: '0.3s' 
            }}>
              ROCK
            </div>
          </span>
        </h2>
      </div>

      {/* FESTIVAL Text */}
      <div className="text-center mb-4">
        <h3 className="text-2xl md:text-4xl font-bold text-white tracking-widest animate-pulse" style={{ animationDelay: '0.4s' }}>
          FESTIVAL
        </h3>
      </div>

      {/* 2025 with Decorative Line */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-yellow-400 animate-pulse" style={{ animationDelay: '0.6s' }} />
        <span className="text-3xl md:text-4xl font-black text-yellow-400 animate-pulse" style={{ 
          animationDelay: '0.5s',
          textShadow: '0 0 20px rgba(255, 215, 0, 0.5)' 
        }}>
          2025
        </span>
        <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-yellow-400 animate-pulse" style={{ animationDelay: '0.6s' }} />
      </div>

      {/* Glow Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full bg-gradient-radial from-red-500/20 via-transparent to-transparent animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
    </div>
  );
};

export default AnimatedLogo;