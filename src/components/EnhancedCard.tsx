import React, { useState, useRef, useEffect } from 'react';
import { LucideIcon } from 'lucide-react';

interface EnhancedCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'neon' | 'festival' | 'minimal';
  hover?: 'lift' | 'glow' | 'scale' | 'tilt' | 'none';
  onClick?: () => void;
  interactive?: boolean;
  loading?: boolean;
  icon?: LucideIcon;
  title?: string;
  subtitle?: string;
  badge?: string;
  image?: string;
  gradient?: boolean;
  blur?: boolean;
  border?: boolean;
  shadow?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const EnhancedCard: React.FC<EnhancedCardProps> = ({
  children,
  className = '',
  variant = 'default',
  hover = 'lift',
  onClick,
  interactive = false,
  loading = false,
  icon: Icon,
  title,
  subtitle,
  badge,
  image,
  gradient = false,
  blur = false,
  border = true,
  shadow = 'md',
  padding = 'md',
  rounded = 'lg'
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || hover !== 'tilt') return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'glass':
        return 'card-glass';
      case 'neon':
        return 'card-neon';
      case 'festival':
        return 'card-festival';
      case 'minimal':
        return 'card-minimal';
      default:
        return 'card-default';
    }
  };

  const getHoverClasses = () => {
    switch (hover) {
      case 'lift':
        return 'card-hover-lift';
      case 'glow':
        return 'card-hover-glow';
      case 'scale':
        return 'card-hover-scale';
      case 'tilt':
        return 'card-hover-tilt';
      default:
        return '';
    }
  };

  const getShadowClasses = () => {
    switch (shadow) {
      case 'sm':
        return 'card-shadow-sm';
      case 'md':
        return 'card-shadow-md';
      case 'lg':
        return 'card-shadow-lg';
      case 'xl':
        return 'card-shadow-xl';
      default:
        return '';
    }
  };

  const getPaddingClasses = () => {
    switch (padding) {
      case 'sm':
        return 'card-padding-sm';
      case 'md':
        return 'card-padding-md';
      case 'lg':
        return 'card-padding-lg';
      case 'xl':
        return 'card-padding-xl';
      default:
        return 'card-padding-md';
    }
  };

  const getRoundedClasses = () => {
    switch (rounded) {
      case 'sm':
        return 'card-rounded-sm';
      case 'md':
        return 'card-rounded-md';
      case 'lg':
        return 'card-rounded-lg';
      case 'xl':
        return 'card-rounded-xl';
      case 'full':
        return 'card-rounded-full';
      default:
        return 'card-rounded-lg';
    }
  };

  const getTiltStyle = () => {
    if (hover !== 'tilt' || !isHovered || !cardRef.current) return {};
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (mousePosition.y - centerY) / 10;
    const rotateY = (centerX - mousePosition.x) / 10;
    
    return {
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
    };
  };

  const renderHeader = () => {
    if (!title && !Icon && !badge) return null;
    
    return (
      <div className="card-header">
        <div className="card-header-content">
          {Icon && (
            <div className="card-icon">
              <Icon className="w-6 h-6" />
            </div>
          )}
          
          <div className="card-title-section">
            {title && (
              <h3 className="card-title">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="card-subtitle">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        
        {badge && (
          <div className="card-badge">
            {badge}
          </div>
        )}
      </div>
    );
  };

  const renderImage = () => {
    if (!image) return null;
    
    return (
      <div className="card-image-container">
        <img 
          src={image} 
          alt={title || 'Card image'}
          className="card-image"
          loading="lazy"
        />
        <div className="card-image-overlay" />
      </div>
    );
  };

  const renderLoadingState = () => (
    <div className="card-loading">
      <div className="loading-spinner" />
      <div className="loading-text">Carregando...</div>
    </div>
  );

  return (
    <div
      ref={cardRef}
      className={`
        enhanced-card
        ${getVariantClasses()}
        ${getHoverClasses()}
        ${getShadowClasses()}
        ${getPaddingClasses()}
        ${getRoundedClasses()}
        ${interactive || onClick ? 'card-interactive' : ''}
        ${gradient ? 'card-gradient' : ''}
        ${blur ? 'card-blur' : ''}
        ${border ? 'card-border' : ''}
        ${isHovered ? 'card-hovered' : ''}
        ${loading ? 'card-loading-state' : ''}
        ${className}
      `}
      style={getTiltStyle()}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Background Effects */}
      <div className="card-bg-effects">
        {gradient && <div className="card-gradient-bg" />}
        {blur && <div className="card-blur-bg" />}
        <div className="card-shine" />
      </div>
      
      {/* Image */}
      {renderImage()}
      
      {/* Content */}
      <div className="card-content">
        {loading ? renderLoadingState() : (
          <>
            {renderHeader()}
            <div className="card-body">
              {children}
            </div>
          </>
        )}
      </div>
      
      {/* Hover Indicator */}
      {interactive && (
        <div className="card-hover-indicator">
          <div className="hover-dot" />
        </div>
      )}
      
      <style>{`
        .enhanced-card {
          position: relative;
          display: flex;
          flex-direction: column;
          transition: var(--transition-smooth);
          overflow: hidden;
          cursor: default;
        }
        
        .card-interactive {
          cursor: pointer;
        }
        
        .card-interactive:focus {
          outline: 2px solid hsl(var(--focus-ring));
          outline-offset: 2px;
        }
        
        /* Variants */
        .card-default {
          background: hsl(var(--bg-card));
          color: hsl(var(--foreground));
        }
        
        .card-glass {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .card-neon {
          background: hsl(var(--bg-card));
          border: 2px solid hsl(var(--primary-neon));
          box-shadow: 
            0 0 20px hsl(var(--primary-neon) / 0.3),
            inset 0 0 20px hsl(var(--primary-neon) / 0.1);
        }
        
        .card-festival {
          background: var(--gradient-sunset);
          color: white;
          border: 2px solid hsl(var(--primary-electric));
        }
        
        .card-minimal {
          background: transparent;
          border: 1px solid hsl(var(--border));
        }
        
        /* Hover Effects */
        .card-hover-lift:hover {
          transform: translateY(-8px);
        }
        
        .card-hover-glow:hover {
          box-shadow: 
            0 0 30px hsl(var(--primary) / 0.4),
            0 10px 30px hsl(var(--primary) / 0.2);
        }
        
        .card-hover-scale:hover {
          transform: scale(1.03);
        }
        
        .card-hover-tilt {
          transform-style: preserve-3d;
        }
        
        /* Shadows */
        .card-shadow-sm {
          box-shadow: 0 2px 4px hsl(var(--shadow) / 0.1);
        }
        
        .card-shadow-md {
          box-shadow: 0 4px 12px hsl(var(--shadow) / 0.15);
        }
        
        .card-shadow-lg {
          box-shadow: 0 8px 25px hsl(var(--shadow) / 0.2);
        }
        
        .card-shadow-xl {
          box-shadow: 0 15px 35px hsl(var(--shadow) / 0.25);
        }
        
        /* Padding */
        .card-padding-sm {
          padding: 1rem;
        }
        
        .card-padding-md {
          padding: 1.5rem;
        }
        
        .card-padding-lg {
          padding: 2rem;
        }
        
        .card-padding-xl {
          padding: 2.5rem;
        }
        
        /* Rounded */
        .card-rounded-sm {
          border-radius: 0.375rem;
        }
        
        .card-rounded-md {
          border-radius: 0.5rem;
        }
        
        .card-rounded-lg {
          border-radius: 0.75rem;
        }
        
        .card-rounded-xl {
          border-radius: 1rem;
        }
        
        .card-rounded-full {
          border-radius: 9999px;
        }
        
        /* Border */
        .card-border {
          border: 1px solid hsl(var(--border));
        }
        
        /* Background Effects */
        .card-bg-effects {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }
        
        .card-gradient-bg {
          position: absolute;
          inset: 0;
          background: var(--gradient-primary);
          opacity: 0.05;
        }
        
        .card-blur-bg {
          position: absolute;
          inset: 0;
          backdrop-filter: blur(5px);
        }
        
        .card-shine {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          transition: left 0.6s ease;
        }
        
        .enhanced-card:hover .card-shine {
          left: 100%;
        }
        
        /* Image */
        .card-image-container {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
        }
        
        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: var(--transition-smooth);
        }
        
        .enhanced-card:hover .card-image {
          transform: scale(1.05);
        }
        
        .card-image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            transparent,
            rgba(0, 0, 0, 0.3)
          );
        }
        
        /* Content */
        .card-content {
          position: relative;
          z-index: 1;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        
        .card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 1rem;
        }
        
        .card-header-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .card-icon {
          color: hsl(var(--primary));
          transition: var(--transition-smooth);
        }
        
        .enhanced-card:hover .card-icon {
          color: hsl(var(--primary-electric));
          transform: scale(1.1);
        }
        
        .card-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: hsl(var(--foreground));
          margin: 0;
          line-height: 1.3;
        }
        
        .card-subtitle {
          font-size: 0.875rem;
          color: hsl(var(--muted-foreground));
          margin: 0.25rem 0 0 0;
        }
        
        .card-badge {
          padding: 0.25rem 0.75rem;
          background: hsl(var(--primary));
          color: white;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .card-body {
          flex: 1;
        }
        
        /* Loading State */
        .card-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 120px;
          gap: 1rem;
        }
        
        .loading-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid hsl(var(--border));
          border-top: 3px solid hsl(var(--primary));
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .loading-text {
          color: hsl(var(--muted-foreground));
          font-size: 0.875rem;
        }
        
        /* Hover Indicator */
        .card-hover-indicator {
          position: absolute;
          top: 1rem;
          right: 1rem;
          opacity: 0;
          transition: var(--transition-smooth);
        }
        
        .enhanced-card:hover .card-hover-indicator {
          opacity: 1;
        }
        
        .hover-dot {
          width: 8px;
          height: 8px;
          background: hsl(var(--primary));
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.2);
          }
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          .card-padding-lg {
            padding: 1.5rem;
          }
          
          .card-padding-xl {
            padding: 2rem;
          }
          
          .card-image-container {
            height: 150px;
          }
        }
        
        /* Accessibility */
        @media (prefers-reduced-motion: reduce) {
          .enhanced-card,
          .card-image,
          .card-icon,
          .card-shine,
          .loading-spinner {
            animation: none !important;
            transition: none !important;
          }
          
          .enhanced-card:hover {
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default EnhancedCard;