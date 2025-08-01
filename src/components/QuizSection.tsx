import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Star, MessageCircle, Share2, RotateCcw, Guitar } from 'lucide-react';
import { toast } from 'sonner';
import '../styles/rock-styles.css';

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
      <section id="quiz" className="bg-black py-20 px-6">
        <div className="bg-[#0f0f0f] border border-white/10 rounded-lg px-6 py-8 max-w-3xl mx-auto shadow-[0_0_12px_#ff2a2a66]">
          {/* Title */}
          <h2 className="text-4xl lg:text-5xl font-bold uppercase tracking-wider text-[#ff2a2a] text-center drop-shadow-[0_0_2px_#ff2a2a]">
            QUIZ ROCK
          </h2>
          <p className="text-[#f0f0f0] text-center text-sm mt-2 mb-8">
            Resultado do seu perfil roqueiro
          </p>

          {/* Result Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{result.emoji}</div>
            <h3 className="text-2xl md:text-3xl font-bold text-[#f0f0f0] drop-shadow-[0_0_3px_#ff2a2a] text-center mb-4">
              {result.title}
            </h3>
            <div className="flex justify-center gap-2 mb-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-6 h-6 text-[#ffbd00] fill-current" />
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <p className="text-[#f0f0f0] text-lg leading-relaxed mb-6 text-center">
              {result.description}
            </p>
            
            {/* Traits */}
            <div className="grid grid-cols-2 gap-3">
              {result.traits.map((trait, index) => (
                <div 
                  key={trait} 
                  className="bg-[#111] border border-white/20 text-[#f0f0f0] px-4 py-2 rounded-md text-sm font-bold text-center uppercase tracking-wide"
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
          <div className="bg-[#111] border border-[#ff2a2a] rounded-md p-6 mb-8">
            <h4 className="text-[#ffbd00] text-xl font-bold uppercase tracking-wider text-center mb-3">
              🎫 CUPOM EXCLUSIVO
            </h4>
            <div className="bg-[#0f0f0f] border-2 border-[#ff2a2a] rounded-md p-4 text-center mb-3">
              <span className="text-[#ff2a2a] text-2xl font-bold tracking-widest">
                {result.coupon}
              </span>
            </div>
            <p className="text-[#f0f0f0] text-sm text-center font-medium">
              Use este cupom para ganhar desconto nos ingressos!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={redeemCoupon}
              className="bg-[#ff2a2a] text-[#f0f0f0] px-6 py-4 rounded-md font-bold uppercase tracking-wide transition hover:bg-[#111] hover:text-[#ff2a2a] hover:border-2 hover:border-[#ff2a2a] flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              RESGATAR
            </button>
            <button
              onClick={shareResult}
              className="bg-[#ffbd00] text-black px-6 py-4 rounded-md font-bold uppercase tracking-wide transition hover:bg-[#111] hover:text-[#ffbd00] hover:border-2 hover:border-[#ffbd00] flex items-center justify-center gap-2"
            >
              <Share2 className="w-5 h-5" />
              COMPARTILHAR
            </button>
            <button
              onClick={resetQuiz}
              className="bg-[#111] text-[#f0f0f0] border border-white/20 px-6 py-4 rounded-md font-bold uppercase tracking-wide transition hover:bg-[#f0f0f0] hover:text-black flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              REFAZER
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="quiz" className="bg-black py-20 px-6">
      <div className="bg-[#0f0f0f] border border-white/10 rounded-lg px-6 py-8 max-w-3xl mx-auto shadow-[0_0_12px_#ff2a2a66]">
        {/* Title & Subtitle */}
        <h2 className="text-4xl lg:text-5xl font-bold uppercase tracking-wider text-[#ff2a2a] text-center drop-shadow-[0_0_2px_#ff2a2a]">
          QUIZ ROCK
        </h2>
        <p className="text-[#f0f0f0] text-center text-sm mt-2 mb-8">
          Descubra que tipo de roqueiro você é
        </p>
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-400">PROGRESSO</span>
            <span className="text-xs text-gray-400 text-right">
              {currentQuestion + 1}/{questions.length}
            </span>
          </div>
          <div className="relative h-2 w-full bg-[#1a1a1a] rounded-full overflow-hidden">
            <div 
              className="absolute left-0 top-0 h-2 bg-[#ff2a2a] transition-all ease-in-out duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className={`transition-all duration-300 ${isAnimating ? 'animate-pulse' : ''}`}>
          <h3 className="text-2xl md:text-3xl font-bold text-[#f0f0f0] drop-shadow-[0_0_3px_#ff2a2a] text-center mt-6 mb-6">
            {questions[currentQuestion].question}
          </h3>

          {/* Answer Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option.value)}
                className={`bg-[#111] border border-white/20 text-[#f0f0f0] py-3 px-4 rounded-md text-left hover:border-[#ff2a2a] hover:bg-[#1a1a1a] hover:scale-105 transition-all duration-200 font-medium ${
                  answers[currentQuestion] === option.value 
                    ? 'border-[#ff2a2a] bg-[#1a1a1a] text-[#ff2a2a]' 
                    : ''
                }`}
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animation: 'fade-in 0.6s ease-out forwards'
                }}
              >
                <span className="text-lg mr-2">{option.text.split(' ')[0]}</span>
                <span>{option.text.substring(option.text.indexOf(' ') + 1)}</span>
              </button>
            ))}
          </div>

          {/* Question Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index < currentQuestion
                    ? 'bg-[#ff2a2a]'
                    : index === currentQuestion
                    ? 'bg-[#ffbd00] ring-2 ring-[#ffbd00]/50'
                    : 'bg-[#333]'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};