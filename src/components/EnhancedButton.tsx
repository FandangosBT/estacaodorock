import React, { useState, useRef, useEffect } from 'react';
import { LucideIcon } from 'lucide-react';

interface EnhancedButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'festival' | 'neon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  ripple?: boolean;
  glow?: boolean;
  pulse?: boolean;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
}

const EnhancedButton: React.FC<EnhancedButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  ripple = true,
  glow = false,
  pulse = false,
  type = 'button',
  ariaLabel
}) => {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [isPressed, setIsPressed] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleId = useRef(0);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    
    // Criar efeito ripple
    if (ripple && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const newRipple = {
        id: rippleId.current++,
        x,
        y
      };
      
      setRipples(prev => [...prev, newRipple]);
      
      // Remover ripple após animação
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 600);
    }
    
    // Efeito de pressão
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);
    
    onClick?.(e);
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'btn-primary';
      case 'secondary':
        return 'btn-secondary';
      case 'ghost':
        return 'btn-ghost';
      case 'festival':
        return 'btn-festival';
      case 'neon':
        return 'btn-neon';
      default:
        return 'btn-primary';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'btn-sm';
      case 'md':
        return 'btn-md';
      case 'lg':
        return 'btn-lg';
      case 'xl':
        return 'btn-xl';
      default:
        return 'btn-md';
    }
  };

  const renderIcon = () => {
    if (!Icon) return null;
    
    return (
      <Icon 
        className={`btn-icon ${loading ? 'animate-spin' : ''}`}
        aria-hidden="true"
      />
    );
  };

  const renderLoadingSpinner = () => (
    <div className="btn-spinner" aria-hidden="true">
      <div className="spinner-ring" />
    </div>
  );

  return (
    <button
      ref={buttonRef}
      type={type}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      className={`
        enhanced-btn
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${glow ? 'btn-glow' : ''}
        ${pulse ? 'btn-pulse' : ''}
        ${isPressed ? 'btn-pressed' : ''}
        ${disabled ? 'btn-disabled' : ''}
        ${loading ? 'btn-loading' : ''}
        ${className}
      `}
    >
      {/* Ripple Effects */}
      {ripple && (
        <div className="btn-ripple-container">
          {ripples.map(ripple => (
            <div
              key={ripple.id}
              className="btn-ripple"
              style={{
                left: ripple.x,
                top: ripple.y
              }}
            />
          ))}
        </div>
      )}
      
      {/* Content */}
      <div className="btn-content">
        {loading && renderLoadingSpinner()}
        
        {!loading && Icon && iconPosition === 'left' && renderIcon()}
        
        <span className="btn-text">
          {children}
        </span>
        
        {!loading && Icon && iconPosition === 'right' && renderIcon()}
      </div>
      
      {/* Background Effects */}
      <div className="btn-bg-effects" aria-hidden="true">
        <div className="btn-shine" />
        <div className="btn-gradient" />
      </div>
      
      <style>{`
        .enhanced-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: none;
          border-radius: 12px;
          font-family: var(--font-sans);
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: var(--transition-smooth);
          overflow: hidden;
          outline: none;
          user-select: none;
          transform-origin: center;
        }
        
        .enhanced-btn:focus-visible {
          outline: 2px solid hsl(var(--focus-ring));
          outline-offset: 2px;
        }
        
        /* Sizes */
        .btn-sm {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          min-height: 36px;
        }
        
        .btn-md {
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          min-height: 44px;
        }
        
        .btn-lg {
          padding: 1rem 2rem;
          font-size: 1.125rem;
          min-height: 52px;
        }
        
        .btn-xl {
          padding: 1.25rem 2.5rem;
          font-size: 1.25rem;
          min-height: 60px;
        }
        
        /* Variants */
        .btn-primary {
          background: var(--gradient-primary);
          color: white;
          border: 1px solid hsl(var(--primary));
        }
        
        .btn-primary:hover:not(.btn-disabled) {
          transform: translateY(-2px);
          box-shadow: 
            0 8px 25px hsl(var(--primary) / 0.3),
            0 0 20px hsl(var(--primary) / 0.2);
        }
        
        .btn-secondary {
          background: var(--gradient-secondary);
          color: white;
          border: 1px solid hsl(var(--secondary));
        }
        
        .btn-secondary:hover:not(.btn-disabled) {
          transform: translateY(-2px);
          box-shadow: 
            0 8px 25px hsl(var(--secondary) / 0.3),
            0 0 20px hsl(var(--secondary) / 0.2);
        }
        
        .btn-ghost {
          background: transparent;
          color: hsl(var(--foreground));
          border: 1px solid hsl(var(--border));
        }
        
        .btn-ghost:hover:not(.btn-disabled) {
          background: hsl(var(--bg-secondary));
          border-color: hsl(var(--primary));
        }
        
        .btn-festival {
          background: var(--gradient-neon);
          color: hsl(var(--bg-primary));
          border: 2px solid hsl(var(--primary-electric));
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .btn-festival:hover:not(.btn-disabled) {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 
            0 15px 35px hsl(var(--primary-electric) / 0.4),
            0 0 30px hsl(var(--primary-neon) / 0.3),
            inset 0 0 20px hsl(var(--primary-electric) / 0.1);
        }
        
        .btn-neon {
          background: transparent;
          color: hsl(var(--primary-neon));
          border: 2px solid hsl(var(--primary-neon));
          text-shadow: 0 0 10px hsl(var(--primary-neon));
          box-shadow: 
            0 0 20px hsl(var(--primary-neon) / 0.3),
            inset 0 0 20px hsl(var(--primary-neon) / 0.1);
        }
        
        .btn-neon:hover:not(.btn-disabled) {
          background: hsl(var(--primary-neon) / 0.1);
          box-shadow: 
            0 0 30px hsl(var(--primary-neon) / 0.5),
            0 0 60px hsl(var(--primary-neon) / 0.3),
            inset 0 0 30px hsl(var(--primary-neon) / 0.2);
          text-shadow: 0 0 15px hsl(var(--primary-neon));
        }
        
        /* States */
        .btn-pressed {
          transform: scale(0.95);
        }
        
        .btn-disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none !important;
          box-shadow: none !important;
        }
        
        .btn-loading {
          cursor: wait;
        }
        
        .btn-glow {
          animation: buttonGlow 2s ease-in-out infinite alternate;
        }
        
        @keyframes buttonGlow {
          0% {
            box-shadow: 0 0 20px hsl(var(--primary) / 0.3);
          }
          100% {
            box-shadow: 0 0 40px hsl(var(--primary) / 0.6);
          }
        }
        
        .btn-pulse {
          animation: buttonPulse 2s ease-in-out infinite;
        }
        
        @keyframes buttonPulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        
        /* Content */
        .btn-content {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .btn-text {
          position: relative;
        }
        
        .btn-icon {
          width: 1.25em;
          height: 1.25em;
          transition: var(--transition-smooth);
        }
        
        .enhanced-btn:hover .btn-icon {
          transform: scale(1.1);
        }
        
        .btn-spinner {
          width: 1.25em;
          height: 1.25em;
          position: relative;
        }
        
        .spinner-ring {
          width: 100%;
          height: 100%;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* Ripple Effect */
        .btn-ripple-container {
          position: absolute;
          inset: 0;
          overflow: hidden;
          border-radius: inherit;
          pointer-events: none;
        }
        
        .btn-ripple {
          position: absolute;
          width: 20px;
          height: 20px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          transform: translate(-50%, -50%) scale(0);
          animation: ripple 0.6s ease-out;
          pointer-events: none;
        }
        
        @keyframes ripple {
          to {
            transform: translate(-50%, -50%) scale(4);
            opacity: 0;
          }
        }
        
        /* Background Effects */
        .btn-bg-effects {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          overflow: hidden;
          pointer-events: none;
        }
        
        .btn-shine {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          transition: left 0.5s ease;
        }
        
        .enhanced-btn:hover .btn-shine {
          left: 100%;
        }
        
        .btn-gradient {
          position: absolute;
          inset: 0;
          background: inherit;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .enhanced-btn:hover .btn-gradient {
          opacity: 0.1;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          .btn-xl {
            padding: 1rem 2rem;
            font-size: 1.125rem;
            min-height: 52px;
          }
          
          .btn-lg {
            padding: 0.875rem 1.75rem;
            font-size: 1rem;
            min-height: 48px;
          }
        }
        
        /* Accessibility */
        @media (prefers-reduced-motion: reduce) {
          .enhanced-btn,
          .btn-icon,
          .btn-ripple,
          .btn-shine {
            animation: none !important;
            transition: none !important;
          }
          
          .enhanced-btn:hover {
            transform: none !important;
          }
        }
      `}</style>
    </button>
  );
};

export default EnhancedButton;