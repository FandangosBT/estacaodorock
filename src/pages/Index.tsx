import { Navigation } from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import { AboutSection } from '@/components/AboutSection';
import { LineupSection } from '@/components/LineupSection';
import { ProgramacaoSection } from '@/components/ProgramacaoSection';
import { GaleriaSection } from '@/components/GaleriaSection';
import { InfoSection } from '@/components/InfoSection';
import { SponsorsSection } from '@/components/SponsorsSection';
import { QuizSection } from '@/components/QuizSection';
import { DemoHeroScroll } from '@/components/ui/hero-scroll-animation-demo';

const Index = () => {
  return (
    <div className="relative">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <LineupSection />
      <ProgramacaoSection />
      <InfoSection />
      <QuizSection />
      <GaleriaSection />
      <SponsorsSection />
      <DemoHeroScroll />
    </div>
  );
};

export default Index;
