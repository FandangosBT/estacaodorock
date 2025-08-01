import React from 'react';
import { Music, Zap, Volume2 } from 'lucide-react';

interface EnhancedLoadingProps {
  message?: string;
  progress?: number;
  className?: string;
  variant?: 'default' | 'minimal' | 'festival';
}

const EnhancedLoading: React.FC<EnhancedLoadingProps> = ({ 
  message = 'Carregando...', 
  progress,
  className = '',
  variant = 'festival'
}) => {
  const renderFestivalLoading = () => (
    <div className={`enhanced-loading festival-variant ${className}`}>
      {/* Background Effects */}
      <div className="loading-bg-effects">
        <div className="pulse-ring pulse-ring-1" />
        <div className="pulse-ring pulse-ring-2" />
        <div className="pulse-ring pulse-ring-3" />
      </div>
      
      {/* Main Loading Animation */}
      <div className="loading-content">
        {/* Animated Icons */}
        <div className="loading-icons">
          <div className="icon-container icon-1">
            <Music className="w-8 h-8" />
          </div>
          <div className="icon-container icon-2">
            <Zap className="w-8 h-8" />
          </div>
          <div className="icon-container icon-3">
            <Volume2 className="w-8 h-8" />
          </div>
        </div>
        
        {/* Loading Text */}
        <div className="loading-text">
          <h3 className="loading-title">
            Festival Berna
          </h3>
          <p className="loading-message">
            {message}
          </p>
        </div>
        
        {/* Progress Bar */}
        {progress !== undefined && (
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
            <span className="progress-text">
              {Math.round(progress)}%
            </span>
          </div>
        )}
        
        {/* Animated Dots */}
        <div className="loading-dots">
          <div className="dot dot-1" />
          <div className="dot dot-2" />
          <div className="dot dot-3" />
        </div>
      </div>
      
      {/* Sound Waves Animation */}
      <div className="sound-waves">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i}
            className="wave"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
      
      <style>{`
        .enhanced-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 200px;
          position: relative;
          padding: 2rem;
        }
        
        .festival-variant {
          background: linear-gradient(135deg, 
            hsl(var(--bg-primary)), 
            hsl(var(--bg-secondary))
          );
          border-radius: 20px;
          overflow: hidden;
        }
        
        .loading-bg-effects {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        
        .pulse-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border: 2px solid hsl(var(--primary-electric));
          border-radius: 50%;
          animation: pulse 2s ease-out infinite;
        }
        
        .pulse-ring-1 {
          width: 100px;
          height: 100px;
          animation-delay: 0s;
        }
        
        .pulse-ring-2 {
          width: 150px;
          height: 150px;
          animation-delay: 0.5s;
        }
        
        .pulse-ring-3 {
          width: 200px;
          height: 200px;
          animation-delay: 1s;
        }
        
        @keyframes pulse {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0.8);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.2);
          }
        }
        
        .loading-content {
          position: relative;
          z-index: 10;
          text-align: center;
        }
        
        .loading-icons {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
          justify-content: center;
        }
        
        .icon-container {
          padding: 1rem;
          border-radius: 50%;
          background: hsl(var(--bg-card));
          border: 2px solid hsl(var(--border));
          color: hsl(var(--primary-neon));
          animation: iconFloat 2s ease-in-out infinite;
        }
        
        .icon-1 {
          animation-delay: 0s;
        }
        
        .icon-2 {
          animation-delay: 0.3s;
        }
        
        .icon-3 {
          animation-delay: 0.6s;
        }
        
        @keyframes iconFloat {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(5deg);
          }
        }
        
        .loading-title {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 900;
          background: var(--gradient-neon);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          margin-bottom: 0.5rem;
          animation: titleGlow 2s ease-in-out infinite alternate;
        }
        
        @keyframes titleGlow {
          0% {
            filter: drop-shadow(0 0 5px hsl(var(--primary-electric)));
          }
          100% {
            filter: drop-shadow(0 0 15px hsl(var(--primary-neon)));
          }
        }
        
        .loading-message {
          color: hsl(var(--muted-foreground));
          font-size: 1rem;
          margin-bottom: 1.5rem;
          animation: fadeInOut 2s ease-in-out infinite;
        }
        
        @keyframes fadeInOut {
          0%, 100% {
            opacity: 0.7;
          }
          50% {
            opacity: 1;
          }
        }
        
        .progress-container {
          width: 200px;
          margin: 1rem 0;
        }
        
        .progress-bar {
          width: 100%;
          height: 6px;
          background: hsl(var(--bg-secondary));
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }
        
        .progress-fill {
          height: 100%;
          background: var(--gradient-neon);
          border-radius: 3px;
          transition: width 0.3s ease;
          position: relative;
        }
        
        .progress-fill::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 20px;
          height: 100%;
          background: linear-gradient(90deg, 
            transparent, 
            hsl(var(--primary-electric))
          );
          animation: shimmer 1.5s ease-in-out infinite;
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-20px);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(20px);
            opacity: 0;
          }
        }
        
        .progress-text {
          font-size: 0.875rem;
          color: hsl(var(--primary-neon));
          font-weight: 600;
        }
        
        .loading-dots {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
        }
        
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: hsl(var(--primary-electric));
          animation: dotBounce 1.4s ease-in-out infinite;
        }
        
        .dot-1 {
          animation-delay: 0s;
        }
        
        .dot-2 {
          animation-delay: 0.2s;
        }
        
        .dot-3 {
          animation-delay: 0.4s;
        }
        
        @keyframes dotBounce {
          0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          40% {
            transform: scale(1.2);
            opacity: 1;
          }
        }
        
        .sound-waves {
          position: absolute;
          bottom: 1rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 2px;
          align-items: end;
        }
        
        .wave {
          width: 3px;
          background: hsl(var(--primary-neon));
          border-radius: 1.5px;
          animation: waveHeight 1s ease-in-out infinite;
        }
        
        @keyframes waveHeight {
          0%, 100% {
            height: 10px;
          }
          50% {
            height: 30px;
          }
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          .enhanced-loading {
            padding: 1.5rem;
          }
          
          .loading-icons {
            gap: 0.75rem;
          }
          
          .icon-container {
            padding: 0.75rem;
          }
          
          .loading-title {
            font-size: 1.25rem;
          }
          
          .progress-container {
            width: 150px;
          }
        }
      `}</style>
    </div>
  );
  
  const renderMinimalLoading = () => (
    <div className={`enhanced-loading minimal-variant ${className}`}>
      <div className="minimal-spinner" />
      <p className="minimal-text">{message}</p>
      
      <style>{`
        .minimal-variant {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
        }
        
        .minimal-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid hsl(var(--border));
          border-top: 3px solid hsl(var(--primary-electric));
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .minimal-text {
          color: hsl(var(--muted-foreground));
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  );
  
  const renderDefaultLoading = () => (
    <div className={`enhanced-loading default-variant ${className}`}>
      <div className="default-spinner" />
      <p className="default-text">{message}</p>
      {progress !== undefined && (
        <div className="default-progress">
          <div className="default-progress-bar">
            <div 
              className="default-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span>{Math.round(progress)}%</span>
        </div>
      )}
      
      <style>{`
        .default-variant {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
        }
        
        .default-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid hsl(var(--border));
          border-top: 4px solid hsl(var(--primary));
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        .default-text {
          color: hsl(var(--foreground));
          font-size: 1rem;
        }
        
        .default-progress {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          width: 200px;
        }
        
        .default-progress-bar {
          width: 100%;
          height: 8px;
          background: hsl(var(--bg-secondary));
          border-radius: 4px;
          overflow: hidden;
        }
        
        .default-progress-fill {
          height: 100%;
          background: hsl(var(--primary));
          border-radius: 4px;
          transition: width 0.3s ease;
        }
      `}</style>
    </div>
  );
  
  switch (variant) {
    case 'minimal':
      return renderMinimalLoading();
    case 'default':
      return renderDefaultLoading();
    case 'festival':
    default:
      return renderFestivalLoading();
  }
};

export default EnhancedLoading;