import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Filter, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

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

  const filteredSchedule = schedule.filter(performance => {
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
    <section id="programacao" className="py-20 px-6 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black mb-6 text-gradient-neon uppercase tracking-wider">
            Programação
          </h2>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
            Três dias de música ininterrupta com a melhor curadoria do rock nacional e internacional
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-6 mb-12">
          {/* Day Filter */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-primary" />
              <span className="font-semibold text-primary">Dia</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {days.map((day) => (
                <Button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    selectedDay === day
                      ? 'btn-neon-primary'
                      : 'bg-muted text-muted-foreground hover:bg-primary/20 hover:text-primary border border-border'
                  }`}
                >
                  {day}
                </Button>
              ))}
            </div>
          </div>

          {/* Stage Filter */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-secondary" />
              <span className="font-semibold text-secondary">Palco</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {stages.map((stage) => (
                <Button
                  key={stage}
                  onClick={() => setSelectedStage(stage)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    selectedStage === stage
                      ? 'btn-neon-secondary'
                      : 'bg-muted text-muted-foreground hover:bg-secondary/20 hover:text-secondary border border-border'
                  }`}
                >
                  {stage}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Schedule Timeline */}
        <div className="space-y-6">
          {filteredSchedule.length === 0 ? (
            <div className="text-center py-12">
              <Filter className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-xl text-muted-foreground">
                Nenhuma apresentação encontrada com os filtros selecionados
              </p>
            </div>
          ) : (
            filteredSchedule.map((performance, index) => (
              <div
                key={performance.id}
                className="card-neon group"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animation: 'fade-in 0.6s ease-out forwards'
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Time and Date */}
                  <div className="md:col-span-3 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                      <Clock className="w-5 h-5 text-accent" />
                      <span className="text-2xl font-bold text-glow-accent">
                        {performance.time}
                      </span>
                    </div>
                    <div className="text-foreground/70">
                      {performance.day}, {performance.date}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {performance.duration}
                    </div>
                  </div>

                  {/* Band Info */}
                  <div className="md:col-span-5">
                    <h3 className="text-2xl md:text-3xl font-bold text-glow-primary mb-2">
                      {performance.band}
                    </h3>
                    <p className="text-foreground/80 mb-2">
                      {performance.genre}
                    </p>
                    <div className={`flex items-center gap-2 ${getStageColor(performance.stage)}`}>
                      <MapPin className="w-4 h-4" />
                      <span className="font-semibold">
                        {performance.stage}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="md:col-span-4 flex justify-center md:justify-end">
                    <Button
                      onClick={() => addToWhatsApp(performance)}
                      className="btn-neon-accent w-full md:w-auto"
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Adicionar ao WhatsApp
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Stage Legend */}
        <div className="mt-16 p-6 bg-card/50 rounded-xl border border-border/50">
          <h3 className="text-xl font-bold mb-4 text-center">
            Localização dos Palcos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-primary/10 border border-primary/30">
              <h4 className="font-bold text-primary mb-2">Palco Principal</h4>
              <p className="text-sm text-foreground/70">
                Arena Central • Capacidade: 30.000 pessoas
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-secondary/10 border border-secondary/30">
              <h4 className="font-bold text-secondary mb-2">Palco Alternativo</h4>
              <p className="text-sm text-foreground/70">
                Setor Norte • Capacidade: 15.000 pessoas
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-accent/10 border border-accent/30">
              <h4 className="font-bold text-accent mb-2">Palco Eletrônico</h4>
              <p className="text-sm text-foreground/70">
                Setor Sul • Capacidade: 10.000 pessoas
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};