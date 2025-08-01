import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Music } from 'lucide-react';

interface CountdownTimerProps {
  targetDate: Date;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate, className = '' }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const calculateTimeLeft = (): TimeLeft => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
      }
      
      setIsActive(false);
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Calcular imediatamente
    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [targetDate]);

  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, '0');
  };

  const timeUnits = [
    { label: 'Dias', value: timeLeft.days, icon: Calendar },
    { label: 'Horas', value: timeLeft.hours, icon: Clock },
    { label: 'Min', value: timeLeft.minutes, icon: Music },
    { label: 'Seg', value: timeLeft.seconds, icon: Music }
  ];

  if (!isActive) {
    return (
      <div className={`countdown-container festival-started ${className}`}>
        <div className="text-center">
          <div className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary-electric to-primary-neon bg-clip-text text-transparent mb-4">
            🎸 FESTIVAL COMEÇOU! 🎸
          </div>
          <div className="text-lg md:text-xl text-primary-neon animate-pulse">
            A música está rolando agora!
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`countdown-container ${className}`}>
      <div className="text-center mb-6">
        <h3 className="text-lg md:text-xl font-semibold text-primary-neon mb-2">
          Faltam apenas:
        </h3>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {timeUnits.map((unit, index) => {
          const Icon = unit.icon;
          return (
            <div 
              key={unit.label}
              className="countdown-unit group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="countdown-card">
                <div className="countdown-icon">
                  <Icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                
                <div className="countdown-number">
                  {formatNumber(unit.value)}
                </div>
                
                <div className="countdown-label">
                  {unit.label}
                </div>
                
                {/* Efeito de partículas */}
                <div className="countdown-particles">
                  {[...Array(3)].map((_, i) => (
                    <div 
                      key={i} 
                      className="particle"
                      style={{ animationDelay: `${i * 0.5}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="text-center mt-6">
        <div className="text-sm md:text-base text-muted-foreground">
          Festival Berna 2025 • 15-17 de Março
        </div>
      </div>
      
      <style>{`
        .countdown-container {
          padding: 2rem;
          border-radius: 20px;
          background: linear-gradient(135deg, 
            hsl(var(--bg-card)), 
            hsl(var(--bg-secondary))
          );
          border: 1px solid hsl(var(--border));
          backdrop-filter: blur(10px);
          position: relative;
          overflow: hidden;
        }
        
        .countdown-container::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--gradient-neon);
          opacity: 0.05;
          z-index: 0;
        }
        
        .countdown-unit {
          position: relative;
          z-index: 1;
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
          transform: translateY(20px);
        }
        
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .countdown-card {
          background: hsl(var(--bg-card));
          border: 2px solid hsl(var(--border));
          border-radius: 16px;
          padding: 1.5rem 1rem;
          text-align: center;
          position: relative;
          overflow: hidden;
          transition: var(--transition-smooth);
          cursor: pointer;
        }
        
        .countdown-card:hover {
          transform: translateY(-4px) scale(1.02);
          border-color: hsl(var(--primary-electric));
          box-shadow: 
            0 10px 30px hsl(var(--primary-electric) / 0.2),
            0 0 20px hsl(var(--primary-neon) / 0.1);
        }
        
        .countdown-icon {
          color: hsl(var(--primary-neon));
          margin-bottom: 0.5rem;
          display: flex;
          justify-content: center;
          transition: var(--transition-smooth);
        }
        
        .group:hover .countdown-icon {
          color: hsl(var(--primary-electric));
          transform: scale(1.1) rotate(5deg);
        }
        
        .countdown-number {
          font-family: var(--font-display);
          font-size: 2.5rem;
          font-weight: 900;
          background: var(--gradient-neon);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          line-height: 1;
          margin-bottom: 0.5rem;
          transition: var(--transition-smooth);
        }
        
        @media (min-width: 768px) {
          .countdown-number {
            font-size: 3rem;
          }
        }
        
        .group:hover .countdown-number {
          transform: scale(1.05);
          filter: drop-shadow(0 0 10px hsl(var(--primary-electric)));
        }
        
        .countdown-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: hsl(var(--muted-foreground));
          text-transform: uppercase;
          letter-spacing: 0.05em;
          transition: var(--transition-smooth);
        }
        
        .group:hover .countdown-label {
          color: hsl(var(--primary-neon));
        }
        
        .countdown-particles {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .group:hover .countdown-particles {
          opacity: 1;
        }
        
        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: hsl(var(--primary-electric));
          border-radius: 50%;
          animation: float 2s ease-in-out infinite;
        }
        
        .particle:nth-child(1) {
          top: 20%;
          left: 20%;
        }
        
        .particle:nth-child(2) {
          top: 60%;
          right: 20%;
        }
        
        .particle:nth-child(3) {
          bottom: 20%;
          left: 50%;
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0.7;
          }
          50% {
            transform: translateY(-10px) scale(1.2);
            opacity: 1;
          }
        }
        
        .festival-started {
          background: var(--gradient-sunset);
          animation: celebration 2s ease-in-out infinite alternate;
        }
        
        @keyframes celebration {
          0% {
            transform: scale(1);
            filter: hue-rotate(0deg);
          }
          100% {
            transform: scale(1.02);
            filter: hue-rotate(10deg);
          }
        }
        
        /* Responsividade */
        @media (max-width: 768px) {
          .countdown-container {
            padding: 1.5rem;
          }
          
          .countdown-card {
            padding: 1rem 0.75rem;
          }
          
          .countdown-number {
            font-size: 2rem;
          }
          
          .countdown-label {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default CountdownTimer;