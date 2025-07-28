import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Star, MessageCircle, Share2, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface Question {
  id: number;
  question: string;
  options: {
    text: string;
    value: string;
  }[];
}

interface RockerType {
  type: string;
  title: string;
  description: string;
  emoji: string;
  coupon: string;
  traits: string[];
}

const questions: Question[] = [
  {
    id: 1,
    question: "Qual é a sua banda de rock favorita?",
    options: [
      { text: "🎸 Metallica", value: "classic" },
      { text: "⚡ AC/DC", value: "classic" },
      { text: "🔥 Foo Fighters", value: "alternative" },
      { text: "🎭 My Chemical Romance", value: "emo" }
    ]
  },
  {
    id: 2,
    question: "Como você curte um show de rock?",
    options: [
      { text: "🤘 Na primeira fileira gritando", value: "hardcore" },
      { text: "🍺 Relaxando com uma cerveja", value: "chill" },
      { text: "📱 Gravando tudo no celular", value: "social" },
      { text: "🎵 Cantando todas as músicas", value: "passionate" }
    ]
  },
  {
    id: 3,
    question: "Qual instrumento te representa?",
    options: [
      { text: "🎸 Guitarra elétrica", value: "lead" },
      { text: "🥁 Bateria", value: "rhythm" },
      { text: "🎤 Vocal", value: "frontman" },
      { text: "🎼 Baixo", value: "foundation" }
    ]
  },
  {
    id: 4,
    question: "Seu estilo de rock preferido:",
    options: [
      { text: "⚫ Heavy Metal", value: "heavy" },
      { text: "🌟 Rock Clássico", value: "classic" },
      { text: "💀 Punk Rock", value: "punk" },
      { text: "🎭 Rock Alternativo", value: "alternative" }
    ]
  }
];

const rockerTypes: Record<string, RockerType> = {
  classic: {
    type: "classic",
    title: "Roqueiro Clássico",
    description: "Você é um verdadeiro conhecedor dos clássicos! Bandas como Led Zeppelin, Pink Floyd e The Rolling Stones fazem seu coração vibrar. Você aprecia a autenticidade e a história por trás de cada acorde.",
    emoji: "🎸",
    coupon: "CLASSIC20",
    traits: ["Nostálgico", "Autêntico", "Tradicionalista", "Apaixonado por história"]
  },
  alternative: {
    type: "alternative",
    title: "Roqueiro Alternativo",
    description: "Você está sempre em busca de novos sons e bandas underground. Seu gosto é eclético e você não tem medo de explorar subgêneros. A criatividade e originalidade são seus pontos fortes!",
    emoji: "⚡",
    coupon: "ALT15",
    traits: ["Criativo", "Explorador", "Vanguardista", "Open-minded"]
  },
  hardcore: {
    type: "hardcore",
    title: "Roqueiro Hardcore",
    description: "ENERGIA PURA! Você vive o rock com intensidade máxima. Wall of death, circle pit, crowd surfing - você está no meio de tudo! Sua paixão pelo rock é contagiante e visceral.",
    emoji: "🔥",
    coupon: "HARDCORE25",
    traits: ["Intenso", "Corajoso", "Energético", "Apaixonado"]
  },
  chill: {
    type: "chill",
    title: "Roqueiro Zen",
    description: "Você curte rock de uma forma mais relaxada e contemplativa. Prefere apreciar cada nota, cada letra, cada momento. Sua vibe é única e você sabe como aproveitar a música de verdade.",
    emoji: "🧘",
    coupon: "ZEN10",
    traits: ["Contemplativo", "Equilibrado", "Sábio", "Observador"]
  }
};

export const QuizSection = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<RockerType | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (value: string) => {
    setIsAnimating(true);
    setAnswers(prev => ({ ...prev, [currentQuestion]: value }));
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        calculateResult();
      }
      setIsAnimating(false);
    }, 300);
  };

  const calculateResult = () => {
    const answerCounts: Record<string, number> = {};
    
    Object.values(answers).forEach(answer => {
      answerCounts[answer] = (answerCounts[answer] || 0) + 1;
    });

    // Logic to determine result type based on answers
    let resultType = 'classic'; // default
    
    if (answerCounts['hardcore'] >= 2) resultType = 'hardcore';
    else if (answerCounts['alternative'] >= 2) resultType = 'alternative';
    else if (answerCounts['chill'] >= 2) resultType = 'chill';
    
    setResult(rockerTypes[resultType]);
    
    toast("Quiz concluído! 🎉", {
      description: "Descubra que tipo de roqueiro você é!"
    });
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setResult(null);
    setIsAnimating(false);
  };

  const shareResult = () => {
    if (!result) return;
    
    const text = `🤘 Descobri que sou um ${result.title}! ${result.emoji}\n\nFaça o quiz do Festival de Rock 2025 e descubra seu tipo de roqueiro!`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Meu Resultado - Festival de Rock 2025',
        text: text,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(text + '\n' + window.location.href);
      toast("Resultado copiado!", {
        description: "Cole onde quiser para compartilhar"
      });
    }
  };

  const redeemCoupon = () => {
    if (!result) return;
    
    const message = `🎸 Festival de Rock 2025\n\n🏆 Meu resultado: ${result.title} ${result.emoji}\n💸 Cupom: ${result.coupon}\n\nQuero resgatar meu desconto!`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
    
    toast("Cupom enviado para WhatsApp! 🎫", {
      description: "Resgate seu desconto agora mesmo"
    });
  };

  if (result) {
    return (
      <section id="quiz" className="py-20 px-6 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Result Header */}
          <div className="mb-8">
            <div className="text-8xl mb-4 animate-bounce">{result.emoji}</div>
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-gradient-neon">
              {result.title}
            </h2>
            <div className="flex justify-center gap-2 mb-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-6 h-6 text-secondary fill-current" />
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="card-neon mb-8">
            <p className="text-lg leading-relaxed mb-6">
              {result.description}
            </p>
            
            {/* Traits */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {result.traits.map((trait, index) => (
                <div 
                  key={trait} 
                  className="px-4 py-2 bg-primary/20 rounded-full border border-primary/30 text-sm font-semibold"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animation: 'fade-in 0.6s ease-out forwards'
                  }}
                >
                  {trait}
                </div>
              ))}
            </div>
          </div>

          {/* Coupon */}
          <div className="card-neon bg-gradient-to-r from-secondary/20 to-accent/20 border-secondary/50 mb-8">
            <h3 className="text-2xl font-bold text-glow-secondary mb-3">
              🎫 Seu Cupom Exclusivo
            </h3>
            <div className="text-3xl font-black text-secondary mb-3 tracking-wider">
              {result.coupon}
            </div>
            <p className="text-foreground/80 mb-4">
              Use este cupom para ganhar desconto nos ingressos!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button
              onClick={redeemCoupon}
              className="btn-neon-secondary"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Resgatar no WhatsApp
            </Button>
            <Button
              onClick={shareResult}
              className="btn-neon-accent"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Compartilhar Resultado
            </Button>
            <Button
              onClick={resetQuiz}
              className="bg-muted text-muted-foreground hover:bg-primary/20 hover:text-primary border border-border"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Fazer Novamente
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="quiz" className="py-20 px-6 bg-gradient-to-br from-accent/10 via-background to-primary/10">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-black mb-6 text-gradient-neon uppercase tracking-wider">
            Quiz Rock
          </h2>
          <p className="text-xl text-foreground/80 mb-8">
            Descubra que tipo de roqueiro você é e ganhe um cupom exclusivo!
          </p>
          
          {/* Progress Bar */}
          <div className="max-w-md mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-foreground/70">Progresso</span>
              <span className="text-sm font-bold text-primary">
                {currentQuestion + 1}/{questions.length}
              </span>
            </div>
            <Progress 
              value={progress} 
              className="h-3 bg-muted"
            />
          </div>
        </div>

        {/* Question Card */}
        <div className={`card-neon transition-all duration-300 ${isAnimating ? 'animate-shake' : ''}`}>
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎸</div>
            <h3 className="text-2xl md:text-3xl font-bold text-glow-primary mb-6">
              {questions[currentQuestion].question}
            </h3>
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {questions[currentQuestion].options.map((option, index) => (
              <Button
                key={index}
                onClick={() => handleAnswer(option.value)}
                className="p-6 h-auto text-left bg-muted text-muted-foreground hover:bg-primary/20 hover:text-primary border border-border hover:border-primary/50 transition-all duration-300 hover:scale-105"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animation: 'fade-in 0.6s ease-out forwards'
                }}
              >
                <div className="text-lg font-semibold">
                  {option.text}
                </div>
              </Button>
            ))}
          </div>

          {/* Question Counter */}
          <div className="text-center mt-8">
            <div className="inline-flex gap-2">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index <= currentQuestion
                      ? 'bg-primary glow-primary'
                      : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};