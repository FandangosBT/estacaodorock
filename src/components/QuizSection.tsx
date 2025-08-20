import { useState } from 'react';
import { Share2, RotateCcw, Star } from 'lucide-react';
import { toast } from 'sonner';
import '../styles/rock-styles.css';
import StoryModal from '@/components/StoryModal';

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
  traits: string[];
}

const questions: Question[] = [
  {
    id: 1,
    question: "Qual frase mais representa seu estado de espírito em um show?",
    options: [
      { text: '"Perdi a noção do tempo e fui embora com a luz"', value: "psychedelic" },
      { text: '"Entrei no pogo e saí transformado"', value: "punk" },
      { text: '"O grave bateu no peito como armadura"', value: "metal" },
      { text: '"Fechei os olhos e cantei junto com o solo"', value: "classic" },
    ],
  },
  {
    id: 2,
    question: "Com quem você teria uma conversa de bar?",
    options: [
      { text: "Syd Barrett (Pink Floyd)", value: "psychedelic" },
      { text: "Joe Strummer (The Clash)", value: "punk" },
      { text: "Bruce Dickinson (Iron Maiden)", value: "metal" },
      { text: "Freddie Mercury (Queen)", value: "classic" },
    ],
  },
  {
    id: 3,
    question: "Qual desses elementos te atrai mais no som?",
    options: [
      { text: "Psicodelia e ambiência", value: "psychedelic" },
      { text: "Crueza e velocidade", value: "punk" },
      { text: "Peso e técnica", value: "metal" },
      { text: "Harmonia e composição melódica", value: "classic" },
    ],
  },
  {
    id: 4,
    question: "Sua postura ao montar uma playlist:",
    options: [
      { text: '"Ela precisa ter uma jornada sonora"', value: "psychedelic" },
      { text: '"Só quero porradas certeiras de até 2 min"', value: "punk" },
      { text: '"Vai ter solos e quebras de tempo, sim"', value: "metal" },
      { text: '"Ela precisa contar uma história em ordem"', value: "classic" },
    ],
  },
  {
    id: 5,
    question: "Você considera o rock:",
    options: [
      { text: "Uma linguagem cósmica e transcendental", value: "psychedelic" },
      { text: "Uma arma cultural e política", value: "punk" },
      { text: "Um ritual sonoro e físico", value: "metal" },
      { text: "Uma arte de composição e performance", value: "classic" },
    ],
  },
  {
    id: 6,
    question: "Se fosse montar uma banda, seria:",
    options: [
      { text: "Experimental com sintetizadores e visual retrô", value: "psychedelic" },
      { text: "Trio cru de garagem com letras cortantes", value: "punk" },
      { text: "Quinteto técnico com figurino e storytelling", value: "metal" },
      { text: "Banda com arranjos épicos e performance vocal intensa", value: "classic" },
    ],
  },
  {
    id: 7,
    question: "O cenário ideal para ouvir música:",
    options: [
      { text: "Sozinho com fones em um trem vazio", value: "psychedelic" },
      { text: "No skate, na rua, com caixa bluetooth barulhenta", value: "punk" },
      { text: "Na academia ou dirigindo à noite com tudo no talo", value: "metal" },
      { text: "Num toca-discos analógico com capa na mão", value: "classic" },
    ],
  },
  {
    id: 8,
    question: "Complete: o verdadeiro rockeiro...",
    options: [
      { text: "...se desconecta da realidade pelo som", value: "psychedelic" },
      { text: "...não pede permissão, apenas toca", value: "punk" },
      { text: "...vive cada nota como se fosse a última", value: "metal" },
      { text: "...sabe que toda boa música é atemporal", value: "classic" },
    ],
  },
];

const rockerTypes: Record<string, RockerType> = {
  psychedelic: {
    type: "psychedelic",
    title: "VISIONÁRIO PSICODÉLICO",
    description: "Você transcende a realidade através da música! Pink Floyd, The Doors e Jimi Hendrix são seus mestres. Você busca experiências sonoras que expandam a consciência e toquem a alma.",
    emoji: "🌀",
    traits: ["Visionário", "Transcendental", "Criativo", "Introspectivo"]
  },
  punk: {
    type: "punk",
    title: "REBELDE PUNK",
    description: "Você é pura atitude e revolução! Sex Pistols, The Clash e Dead Kennedys são suas bandeiras. Você acredita que o rock é resistência e não aceita regras impostas.",
    emoji: "🔥",
    traits: ["Rebelde", "Autêntico", "Direto", "Revolucionário"]
  },
  metal: {
    type: "metal",
    title: "MESTRE DO METAL",
    description: "Você vive pela intensidade e poder do metal! Black Sabbath, Iron Maiden e Metallica alimentam sua alma. Técnica, peso e energia brutal são sua linguagem universal.",
    emoji: "⚡",
    traits: ["Intenso", "Técnico", "Poderoso", "Apaixonado"]
  },
  classic: {
    type: "classic",
    title: "CLÁSSICO ATEMPORAL",
    description: "Você é guardião da essência do rock! Led Zeppelin, Queen e Rolling Stones são seus ídolos eternos. Você sabe que a verdadeira música transcende gerações e modismos.",
    emoji: "👑",
    traits: ["Clássico", "Sábio", "Atemporal", "Tradicionalista"]
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
    // Construir contagem por arquétipo respeitando a ordem das respostas
    const counts: Record<string, number> = { psychedelic: 0, punk: 0, metal: 0, classic: 0 };

    // Obter respostas em ordem de pergunta (índice crescente)
    const orderedAnswers = Object.keys(answers)
      .map((k) => Number(k))
      .sort((a, b) => a - b)
      .map((idx) => answers[idx]);

    orderedAnswers.forEach((value) => {
      if (value in counts) counts[value] += 1;
    });

    const max = Math.max(...Object.values(counts));
    const tied = Object.entries(counts)
      .filter(([, v]) => v === max)
      .map(([k]) => k);

    let resultType = tied[0] || 'classic';

    if (tied.length > 1) {
      // Desempate: prioridade pela ordem das respostas
      const firstInOrder = orderedAnswers.find((ans) => tied.includes(ans));
      if (firstInOrder) resultType = firstInOrder;
    }

    setResult(rockerTypes[resultType]);

    toast('Quiz concluído! 🎉', {
      description: 'Descubra seu arquétipo roqueiro no festival',
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

  const [openStories, setOpenStories] = useState(false);

  // Mapeamento pasta de stories por tipo
  const getStoriesForResult = (type: string) => {
    const base = '/stories';
    const map: Record<string, string> = {
      psychedelic: 'Psicodelico',
      punk: 'Punk',
      metal: 'Metal',
      classic: 'Classico',
    };
    const folder = map[type] || 'Classico';
    const path = `${base}/${folder}`;
    return [1,2,3,4,5].map(i => ({
      src: `${path}/slide${i}.png`,
      alt: `Story ${folder} ${i}`,
    }));
  };

  if (result) {
    return (
      <div className="w-full">
        {/* Resultado em estilo grunge/cartaz */}
        <div className="relative text-center mb-4">
          <div className="text-5xl mb-3">{result.emoji}</div>
          <h3 className="text-xl md:text-2xl font-bold font-queenrocker uppercase tracking-wider text-white drop-shadow-[3px_3px_0_#000] mb-3">
            {result.title}
          </h3>
          <div className="flex justify-center gap-1 mb-4" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-4 h-4 text-[#ffbd00] fill-current" />
            ))}
          </div>
        </div>

        {/* Descrição */}
        <div className="mb-4">
          <p className="text-white/90 text-sm leading-relaxed mb-4 text-center">
            {result.description}
          </p>
          
          {/* Traits em blocos grunge */}
          <div className="grid grid-cols-2 gap-2 mb-4 sm:grid-cols-2 md:grid-cols-4">
            {result.traits.map((trait, index) => (
              <div 
                key={trait} 
                className="bg-[#ffbd00] text-black px-2 py-2 text-[10px] sm:text-xs font-bold text-center uppercase tracking-wide border-2 border-black shadow-[3px_3px_0_#000] transform rotate-[-1deg] even:rotate-[1deg] font-queenrocker break-words whitespace-normal"
              >
                {trait}
              </div>
            ))}
          </div>
        </div>

        {/* Botões de ação em grid de 3 colunas */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setOpenStories(true)}
            className="bg-black text-[#ffbd00] px-3 py-2 text-xs font-bold uppercase tracking-wide transition hover:bg-[#ffbd00] hover:text-black hover:border-2 hover:border-black flex items-center justify-center gap-1 border-2 border-[#ffbd00] shadow-[3px_3px_0_#000] font-queenrocker"
          >
            Ver Stories
          </button>
          <button
            onClick={shareResult}
            className="bg-[#ffbd00] text-black px-3 py-2 text-xs font-bold uppercase tracking-wide transition hover:bg-black hover:text-[#ffbd00] hover:border-2 hover:border-[#ffbd00] flex items-center justify-center gap-1 border-2 border-black shadow-[3px_3px_0_#000] font-queenrocker"
          >
            <Share2 className="w-3 h-3" />
            SHARE
          </button>
          <button
            onClick={resetQuiz}
            className="bg-white text-black px-3 py-2 text-xs font-bold uppercase tracking-wide transition hover:bg-black hover:text-white hover:border-2 hover:border-white flex items-center justify-center gap-1 border-2 border-black shadow-[3px_3px_0_#000] font-queenrocker"
          >
            <RotateCcw className="w-3 h-3" />
            REFAZER
          </button>
        </div>

        {/* Modal de Stories */}
        <StoryModal
          open={openStories}
          onOpenChange={setOpenStories}
          title={`Stories — ${result.title}`}
          slides={getStoriesForResult(result.type)}
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Progress Bar estilo fita cassete */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-white/70 font-bold uppercase font-queenrocker">PROGRESSO</span>
          <span className="text-xs text-white/70 font-bold uppercase font-queenrocker">
            {currentQuestion + 1}/{questions.length}
          </span>
        </div>
        <div className="cassette-progress">
          <div 
            className="cassette-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Pergunta com rotação leve */}
      <div className={`transition-all duration-300 ${isAnimating ? 'animate-pulse' : ''} mb-6`}>
        <h3 className="text-lg md:text-xl font-bold text-white text-center transform rotate-[-2deg] mb-4 font-bold uppercase tracking-wide">
          {questions[currentQuestion].question}
        </h3>

        {/* Opções em blocos grunge */}
        <div className="grid grid-cols-1 gap-3">
          {questions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option.value)}
              className={`text-left py-3 px-4 text-sm font-semibold transition-all duration-200 transform hover:scale-105 border-2 border-black shadow-[4px_4px_0_#000] uppercase tracking-wide ${
                index % 2 === 0
                  ? 'bg-[#ffbd00] text-black hover:bg-[#ff2a2a] hover:text-white'
                  : 'bg-[#ff69b4] text-black hover:bg-[#ff2a2a] hover:text-white'
              } ${
                answers[currentQuestion] === option.value 
                  ? 'bg-[#ff2a2a] text-white scale-105' 
                  : ''
              }`}
              style={{
                animationDelay: `${index * 0.1}s`,
                animation: 'fade-in 0.6s ease-out forwards'
              }}
            >
              {option.text}
            </button>
          ))}
        </div>

        {/* Indicadores de progresso estilo fita isolante */}
        <div className="flex justify-center gap-1 mt-4">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`w-4 h-2 transition-all duration-300 tape-indicator ${
                index < currentQuestion
                  ? 'bg-[#ff2a2a] border-black'
                  : index === currentQuestion
                  ? 'bg-[#ffbd00] border-black ring-1 ring-[#ffbd00]'
                  : 'bg-white/30 border-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};