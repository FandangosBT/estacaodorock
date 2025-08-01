import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, MessageCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAsyncOperation } from '@/hooks/use-global-state';

// Brutal shake animation CSS
const brutalShakeStyles = `
  @keyframes brutal-shake {
    0%   { transform: translate(0px, 0px) rotate(0deg); }
    20%  { transform: translate(1px, -1px) rotate(-1deg); }
    40%  { transform: translate(-1px, 2px) rotate(1deg); }
    60%  { transform: translate(2px, 1px) rotate(0deg); }
    80%  { transform: translate(-1px, -1px) rotate(1deg); }
    100% { transform: translate(1px, 2px) rotate(0deg); }
  }
  
  .brutal-shake:hover {
    animation: brutal-shake 0.25s infinite;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = brutalShakeStyles;
  document.head.appendChild(styleSheet);
}

interface Performance {
  id: string;
  band: string;
  day: string;
  date: string;
  time: string;
  stage: string;
  duration: string;
  genre: string;
}

const schedule: Performance[] = [
  // Sexta-feira
  { id: '1', band: 'Thunder Wolves', day: 'Sexta', date: '15/08', time: '22:00', stage: 'Palco Principal', duration: '90min', genre: 'Heavy Metal' },
  { id: '2', band: 'Crimson Fire', day: 'Sexta', date: '15/08', time: '20:00', stage: 'Palco Principal', duration: '60min', genre: 'Hard Rock' },
  { id: '3', band: 'Metal Machine', day: 'Sexta', date: '15/08', time: '18:00', stage: 'Palco Alternativo', duration: '45min', genre: 'Heavy Metal' },
  { id: '4', band: 'Rock Fusion', day: 'Sexta', date: '15/08', time: '16:30', stage: 'Palco Eletrônico', duration: '45min', genre: 'Progressive Rock' },
  
  // Sábado
  { id: '5', band: 'Electric Storm', day: 'Sábado', date: '16/08', time: '20:30', stage: 'Palco Principal', duration: '90min', genre: 'Rock Alternativo' },
  { id: '6', band: 'Cyber Punk', day: 'Sábado', date: '16/08', time: '18:00', stage: 'Palco Eletrônico', duration: '60min', genre: 'Industrial Rock' },
  { id: '7', band: 'Voltage', day: 'Sábado', date: '16/08', time: '19:30', stage: 'Palco Alternativo', duration: '45min', genre: 'Punk Rock' },
  { id: '8', band: 'Sound Wave', day: 'Sábado', date: '16/08', time: '17:00', stage: 'Palco Principal', duration: '45min', genre: 'Rock Clássico' },
  
  // Domingo
  { id: '9', band: 'Dark Angels', day: 'Domingo', date: '17/08', time: '21:30', stage: 'Palco Principal', duration: '90min', genre: 'Gothic Metal' },
  { id: '10', band: 'Neon Rebels', day: 'Domingo', date: '17/08', time: '19:00', stage: 'Palco Alternativo', duration: '60min', genre: 'Punk Rock' },
  { id: '11', band: 'Steel Force', day: 'Domingo', date: '17/08', time: '17:30', stage: 'Palco Principal', duration: '45min', genre: 'Heavy Metal' },
  { id: '12', band: 'Echo Chamber', day: 'Domingo', date: '17/08', time: '16:00', stage: 'Palco Eletrônico', duration: '45min', genre: 'Indie Rock' }
];

const stages = ['Todos', 'Palco Principal', 'Palco Alternativo', 'Palco Eletrônico'];
const days = ['Todos', 'Sexta', 'Sábado', 'Domingo'];

export const ProgramacaoSection = () => {
  const [selectedDay, setSelectedDay] = useState('Todos');
  const [selectedStage, setSelectedStage] = useState('Todos');
  const [scheduleData, setScheduleData] = useState<Performance[]>([]);
  
  const { execute, isLoading, error, reset } = useAsyncOperation('schedule-data');

  useEffect(() => {
    const loadScheduleData = async () => {
      // Simula carregamento de dados da programação
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simula possível erro (10% de chance)
      if (Math.random() < 0.1) {
        throw new Error('Erro ao carregar programação do festival');
      }
      
      return schedule;
    };

    execute(loadScheduleData)
      .then((result) => {
        if (result) {
          setScheduleData(result);
        }
      })
      .catch(() => {
        toast.error('Erro ao carregar programação');
      });
  }, [execute]);

  const filteredSchedule = scheduleData.filter(performance => {
    const dayMatch = selectedDay === 'Todos' || performance.day === selectedDay;
    const stageMatch = selectedStage === 'Todos' || performance.stage === selectedStage;
    return dayMatch && stageMatch;
  });

  const addToWhatsApp = (performance: Performance) => {
    const message = `🎸 Festival de Rock 2025\n\n📅 ${performance.day}, ${performance.date}\n🕐 ${performance.time}\n🎤 ${performance.band}\n📍 ${performance.stage}\n\nVai ter que estar lá! 🤘`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
    
    toast("Compartilhado no WhatsApp! 📱", {
      description: `${performance.band} adicionado ao seu WhatsApp`
    });
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Palco Principal': return 'text-primary';
      case 'Palco Alternativo': return 'text-secondary';
      case 'Palco Eletrônico': return 'text-accent';
      default: return 'text-foreground';
    }
  };

  return (
    <section id="programacao" className="py-20 px-6 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold uppercase tracking-wider text-white mb-6" style={{ textShadow: '2px 2px 0 #ff2a2a' }}>
            PROGRAMAÇÃO
          </h2>
          <p className="text-[#f0f0f0] text-lg max-w-2xl mx-auto font-medium">
            Três dias de música ininterrupta com a melhor curadoria do rock nacional e internacional
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-[#ff2a2a] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[#f0f0f0] font-bold uppercase tracking-wider">CARREGANDO PROGRAMAÇÃO...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="flex flex-col items-center py-20 text-center">
            <AlertCircle className="w-16 h-16 text-[#ff2a2a] mb-4" />
            <h3 className="text-xl font-bold uppercase tracking-wider text-white mb-2">ERRO AO CARREGAR PROGRAMAÇÃO</h3>
            <p className="text-[#f0f0f0] mb-6">
              {typeof error === 'string' ? error : error.message}
            </p>
            <button 
              onClick={() => {
                reset();
                window.location.reload();
              }}
              className="brutal-shake px-6 py-3 bg-[#ff2a2a] text-white font-bold text-sm uppercase tracking-wider border-2 border-black hover:bg-black hover:text-[#ff2a2a] transition-all"
            >
              TENTAR NOVAMENTE
            </button>
          </div>
        )}

        {/* Content - Only show when not loading and no error */}
        {!isLoading && !error && (
        <>
        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          {/* Day Filter */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-[#ffbd00]" />
              <span className="font-bold text-[#ffbd00] text-xl uppercase tracking-wider">DIA</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-4 py-2 font-bold text-sm uppercase tracking-wider border-2 transition-all ${
                    selectedDay === day 
                      ? 'bg-[#ff2a2a] text-white border-[#ff2a2a]' 
                      : 'bg-[#111111] text-[#f0f0f0] border-white/20 hover:bg-[#ff2a2a] hover:text-white hover:border-[#ff2a2a]'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Stage Filter */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-[#ffbd00]" />
              <span className="font-bold text-[#ffbd00] text-xl uppercase tracking-wider">PALCO</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {stages.map((stage) => (
                <button
                  key={stage}
                  onClick={() => setSelectedStage(stage)}
                  className={`px-4 py-2 font-bold text-sm uppercase tracking-wider border-2 transition-all ${
                    selectedStage === stage 
                      ? 'bg-[#ff2a2a] text-white border-[#ff2a2a]' 
                      : 'bg-[#111111] text-[#f0f0f0] border-white/20 hover:bg-[#ff2a2a] hover:text-white hover:border-[#ff2a2a]'
                  }`}
                >
                  {stage}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Schedule Timeline */}
        <div className="space-y-4">
          {filteredSchedule.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <div className="text-6xl mb-4">🎸</div>
              <h3 className="text-2xl font-bold uppercase tracking-wider text-white mb-2">NENHUMA APRESENTAÇÃO ENCONTRADA</h3>
              <p className="text-[#f0f0f0] mb-6">
                Não encontramos apresentações para os filtros selecionados. Tente ajustar os filtros.
              </p>
              <button
                onClick={() => {
                  setSelectedDay('Todos');
                  setSelectedStage('Todos');
                }}
                className="brutal-shake px-6 py-3 bg-[#ff2a2a] text-white font-bold text-sm uppercase tracking-wider border-2 border-black hover:bg-black hover:text-[#ff2a2a] transition-all"
              >
                LIMPAR FILTROS
              </button>
            </div>
          ) : (
            filteredSchedule.map((performance, index) => (
              <div
                key={performance.id}
                className="border border-white/20 bg-[#111111] p-6 flex flex-col md:flex-row justify-between items-start md:items-center mb-4 hover:border-[#ff2a2a] transition-all"
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className="flex-1 mb-4 md:mb-0">
                  <div className="text-[#ffbd00] font-bold text-xl mb-1">{performance.time}</div>
                  <div className="text-white font-bold text-2xl uppercase tracking-wide mb-2">{performance.band}</div>
                  <div className="text-gray-400 text-sm mb-2">
                    {performance.genre} • <span className="text-[#ff2a2a]">{performance.stage}</span>
                  </div>
                  <div className="text-gray-500 text-xs">
                    {performance.day}, {performance.date} • {performance.duration}
                  </div>
                </div>
                <button
                  onClick={() => addToWhatsApp(performance)}
                  className="brutal-shake px-4 py-2 bg-[#ff2a2a] text-white font-bold text-xs uppercase tracking-wider border-2 border-black hover:bg-black hover:text-[#ff2a2a] transition-all flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  💬 ADICIONAR AO WHATSAPP
                </button>
              </div>
            ))
          )}
        </div>

        {/* Stage Legend */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold uppercase tracking-wider text-white mb-8 text-center" style={{ textShadow: '1px 1px 0 #ff2a2a' }}>
            LOCALIZAÇÃO DOS PALCOS
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-white/20 bg-[#111111] p-6 text-center">
              <h4 className="text-[#ff2a2a] font-bold text-xl uppercase tracking-wider mb-2">PALCO PRINCIPAL</h4>
              <p className="text-[#f0f0f0] text-sm">
                Arena Central • Capacidade: 30.000 pessoas
              </p>
            </div>
            <div className="border border-white/20 bg-[#111111] p-6 text-center">
              <h4 className="text-[#ffbd00] font-bold text-xl uppercase tracking-wider mb-2">PALCO ALTERNATIVO</h4>
              <p className="text-[#f0f0f0] text-sm">
                Setor Norte • Capacidade: 15.000 pessoas
              </p>
            </div>
            <div className="border border-white/20 bg-[#111111] p-6 text-center">
              <h4 className="text-[#ffbd00] font-bold text-xl uppercase tracking-wider mb-2">PALCO ELETRÔNICO</h4>
              <p className="text-[#f0f0f0] text-sm">
                Setor Sul • Capacidade: 10.000 pessoas
              </p>
            </div>
          </div>
        </div>
        </>
        )}
      </div>
    </section>
  );
};