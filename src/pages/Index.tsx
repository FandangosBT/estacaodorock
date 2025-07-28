import { HeroSection } from '@/components/HeroSection';
import { LineupSection } from '@/components/LineupSection';
import { ProgramacaoSection } from '@/components/ProgramacaoSection';
import { GaleriaSection } from '@/components/GaleriaSection';
import { QuizSection } from '@/components/QuizSection';

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <LineupSection />
      <ProgramacaoSection />
      <GaleriaSection />
      <QuizSection />
    </div>
  );
};

export default Index;
