import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import OptimizedImage from '@/components/OptimizedImage';

interface SponsorItem {
  id: string;
  name: string;
  logo: string; // prefer SVG
  url?: string;
  // Optional flags for edge cases (light/dark logos)
  darkCard?: boolean; // use darker glass background for very light logos
  solidCard?: boolean; // force solid neutral background if glass reduces contrast
}

interface SponsorsGridProps {
  logos: SponsorItem[];
  className?: string;
  subtitle?: string;
}

const cardBase =
  'relative isolate rounded-lg border transition-all duration-300 will-change-transform focus:outline-none';

// Glassmorphism tokens (base neutral + accent in border/focus)
const glassLight =
  'bg-white/12 backdrop-blur-md border-[#ede09f]/30 shadow-[0_6px_18px_rgba(0,0,0,0.28)] hover:bg-white/16 hover:backdrop-blur-sm hover:shadow-[0_10px_28px_rgba(0,0,0,0.35)] hover:-translate-y-0.5 md:hover:-translate-y-1 hover:border-[#ede09f]/60 focus-visible:ring-2 focus-visible:ring-[#ede09f]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black';
const glassDark =
  'bg-black/14 backdrop-blur-md border-[#ede09f]/30 shadow-[0_6px_18px_rgba(0,0,0,0.28)] hover:bg-black/20 hover:backdrop-blur-sm hover:shadow-[0_10px_28px_rgba(0,0,0,0.35)] hover:-translate-y-0.5 md:hover:-translate-y-1 hover:border-[#ede09f]/60 focus-visible:ring-2 focus-visible:ring-[#ede09f]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black';
const solidNeutral =
  'bg-white/90 border-[#ede09f]/30 shadow-[0_8px_22px_rgba(0,0,0,0.35)] hover:bg-white hover:shadow-[0_12px_32px_rgba(0,0,0,0.4)] hover:-translate-y-0.5 md:hover:-translate-y-1 hover:border-[#ede09f]/60 focus-visible:ring-2 focus-visible:ring-[#ede09f]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black';

export const SponsorsGrid: React.FC<SponsorsGridProps> = ({ logos, className = '', subtitle }) => {
  const prefersReduced = useReducedMotion();

  const reveal = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className={`relative isolate z-10 ${className}`}>
      <div className="flex items-end justify-between mb-4">
        {subtitle ? (
          <p className="text-white/80 text-sm md:text-base">{subtitle}</p>
        ) : null}
      </div>

      <div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 xl:gap-8"
        aria-label="Grade de patrocinadores"
      >
        {logos.map((item) => {
          const cardStyle = item.solidCard ? solidNeutral : item.darkCard ? glassDark : glassLight;
          const Wrapper: React.ElementType = item.url ? 'a' : 'div';
          const commonProps = item.url
            ? {
                href: item.url,
                target: '_blank',
                rel: 'noopener noreferrer',
                role: 'link',
                title: `Apoio: ${item.name}`,
                'aria-label': `Apoio: ${item.name}`,
              }
            : {
                role: 'img',
                'aria-label': `Apoio: ${item.name}`,
                tabIndex: 0,
                title: `Apoio: ${item.name}`,
              };

          return (
            <motion.div
              key={item.id}
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="w-full"
            >
              <Wrapper className={`${cardBase} ${cardStyle} aspect-[16/10] p-3 md:p-4`} {...(commonProps as any)}>
                <div className="absolute inset-0 rounded-lg" aria-hidden="true" />
                <div className="w-full h-full flex items-center justify-center">
                  <OptimizedImage
                    src={item.logo}
                    alt={`Logo ${item.name}`}
                    containerClassName="bg-transparent"
                    placeholderClassName="bg-transparent"
                    imgClassName="w-[85%] h-[85%] object-contain drop-shadow-[0_1px_1px_rgba(255,255,255,0.25)]"
                    lazy
                  />
                </div>
              </Wrapper>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default SponsorsGrid;