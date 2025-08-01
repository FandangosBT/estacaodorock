import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { Eye, Type, Volume2, Palette } from 'lucide-react';

interface AccessibilityControlProps {
  className?: string;
}

export const AccessibilityControl: React.FC<AccessibilityControlProps> = ({ className }) => {
  const {
    highContrast,
    fontSize,
    reducedMotion,
    animationLevel,
    setHighContrast,
    setFontSize,
    setReducedMotion,
    setAnimationLevel
  } = useAccessibility();

  const fontSizeOptions = [
    { value: 'small', label: 'Pequeno' },
    { value: 'medium', label: 'Médio' },
    { value: 'large', label: 'Grande' }
  ];

  const animationOptions = [
    { value: 'none', label: 'Sem animações' },
    { value: 'reduced', label: 'Reduzidas' },
    { value: 'full', label: 'Completas' }
  ];

  return (
    <Card className={className} role="region" aria-labelledby="accessibility-title">
      <CardHeader>
        <CardTitle id="accessibility-title" className="flex items-center gap-2">
          <Eye className="h-5 w-5" aria-hidden="true" />
          Configurações de Acessibilidade
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Alto Contraste */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4" aria-hidden="true" />
            <label htmlFor="high-contrast" className="text-sm font-medium">
              Alto Contraste
            </label>
          </div>
          <Switch
            id="high-contrast"
            checked={highContrast}
            onCheckedChange={setHighContrast}
            aria-describedby="high-contrast-desc"
          />
        </div>
        <p id="high-contrast-desc" className="text-xs text-muted-foreground">
          Aumenta o contraste entre texto e fundo para melhor legibilidade
        </p>

        {/* Tamanho da Fonte */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Type className="h-4 w-4" aria-hidden="true" />
            <label htmlFor="font-size" className="text-sm font-medium">
              Tamanho da Fonte
            </label>
          </div>
          <Select value={fontSize} onValueChange={setFontSize}>
            <SelectTrigger id="font-size" aria-describedby="font-size-desc">
              <SelectValue placeholder="Selecione o tamanho" />
            </SelectTrigger>
            <SelectContent>
              {fontSizeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p id="font-size-desc" className="text-xs text-muted-foreground">
            Ajusta o tamanho do texto em toda a aplicação
          </p>
        </div>

        {/* Movimento Reduzido */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4" aria-hidden="true" />
            <label htmlFor="reduced-motion" className="text-sm font-medium">
              Reduzir Movimento
            </label>
          </div>
          <Switch
            id="reduced-motion"
            checked={reducedMotion}
            onCheckedChange={setReducedMotion}
            aria-describedby="reduced-motion-desc"
          />
        </div>
        <p id="reduced-motion-desc" className="text-xs text-muted-foreground">
          Reduz ou remove animações e transições
        </p>

        {/* Nível de Animação */}
        <div className="space-y-2">
          <label htmlFor="animation-level" className="text-sm font-medium">
            Nível de Animação
          </label>
          <Select value={animationLevel} onValueChange={setAnimationLevel}>
            <SelectTrigger id="animation-level" aria-describedby="animation-level-desc">
              <SelectValue placeholder="Selecione o nível" />
            </SelectTrigger>
            <SelectContent>
              {animationOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p id="animation-level-desc" className="text-xs text-muted-foreground">
            Controla a intensidade das animações na interface
          </p>
        </div>

        {/* Botão de Reset */}
        <Button
          variant="outline"
          onClick={() => {
            setHighContrast(false);
            setFontSize('medium');
            setReducedMotion(false);
            setAnimationLevel('full');
          }}
          className="w-full"
          aria-describedby="reset-desc"
        >
          Restaurar Padrões
        </Button>
        <p id="reset-desc" className="text-xs text-muted-foreground text-center">
          Volta todas as configurações para os valores padrão
        </p>
      </CardContent>
    </Card>
  );
};

export default AccessibilityControl;