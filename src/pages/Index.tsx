import { HeroSection } from '@/components/HeroSection';
import { LineupSection } from '@/components/LineupSection';
import { ProgramacaoSection } from '@/components/ProgramacaoSection';
import { QuizSection } from '@/components/QuizSection';

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <LineupSection />
      <ProgramacaoSection />
      <QuizSection />
    </div>
  );
};

export default Index;
