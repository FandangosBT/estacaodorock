import React, { useState, useRef, useEffect } from 'react';
import { useMobile } from '@/hooks/useMobile';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string; // additional classes for container
  mobileSrc?: string;
  tabletSrc?: string;
  lazy?: boolean;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
  containerClassName?: string; // override container background/shape
  imgClassName?: string; // override image object-fit behavior
  placeholderClassName?: string; // override placeholder overlay background
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  mobileSrc,
  tabletSrc,
  lazy = true,
  placeholder,
  onLoad,
  onError,
  containerClassName = 'bg-muted',
  imgClassName,
  placeholderClassName,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const imgRef = useRef<HTMLImageElement>(null);
  const { isMobile, isTablet } = useMobile();

  // Determine which image source to use based on device
  const getOptimizedSrc = () => {
    if (isMobile && mobileSrc) return mobileSrc;
    if (isTablet && tabletSrc) return tabletSrc;
    return src;
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [lazy, isInView]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const shouldShowImage = isInView && !hasError;
  const imageSrc = getOptimizedSrc();

  return (
    <div
      ref={imgRef}
      className={cn(
        'relative overflow-hidden',
        containerClassName,
        className
      )}
    >
      {/* Placeholder */}
      {(!isLoaded || !shouldShowImage) && (
        <div className={cn('absolute inset-0 flex items-center justify-center', placeholderClassName ?? 'bg-muted')}>
          {placeholder ? (
            <img
              src={placeholder}
              alt=""
              className="w-full h-full object-cover opacity-50 blur-sm"
            />
          ) : (
            <div className={cn('w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20 animate-pulse', placeholderClassName)} />
          )}
        </div>
      )}

      {/* Main Image */}
      {shouldShowImage && (
        <img
          src={imageSrc}
          alt={alt}
          className={cn(
            imgClassName ?? 'w-full h-full object-cover transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={handleLoad}
          onError={handleError}
          loading={lazy ? 'lazy' : 'eager'}
          decoding="async"
        />
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground">
          <div className="text-center">
            <div className="text-2xl mb-2">📷</div>
            <p className="text-sm">Imagem não disponível</p>
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {shouldShowImage && !isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;