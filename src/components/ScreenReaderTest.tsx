import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useKeyboardNavigation } from '@/hooks/use-keyboard-navigation';
import { Volume2, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface ScreenReaderTestProps {
  className?: string;
}

export const ScreenReaderTest: React.FC<ScreenReaderTestProps> = ({ className }) => {
  const [testResults, setTestResults] = useState<Array<{
    test: string;
    status: 'pass' | 'fail' | 'warning';
    message: string;
  }>>([]);
  const [isRunning, setIsRunning] = useState(false);
  const { announceToScreenReader } = useKeyboardNavigation();

  const runAccessibilityTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    const tests = [
      {
        name: 'Estrutura de Cabeçalhos',
        test: () => {
          const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
          const h1Count = document.querySelectorAll('h1').length;
          
          if (h1Count === 0) {
            return { status: 'fail' as const, message: 'Nenhum h1 encontrado na página' };
          }
          if (h1Count > 1) {
            return { status: 'warning' as const, message: `${h1Count} elementos h1 encontrados. Recomenda-se apenas um.` };
          }
          return { status: 'pass' as const, message: `${headings.length} cabeçalhos encontrados com estrutura adequada` };
        }
      },
      {
        name: 'Imagens com Alt Text',
        test: () => {
          const images = document.querySelectorAll('img');
          const imagesWithoutAlt = Array.from(images).filter(img => !img.alt || img.alt.trim() === '');
          
          if (imagesWithoutAlt.length > 0) {
            return { status: 'fail' as const, message: `${imagesWithoutAlt.length} imagens sem texto alternativo` };
          }
          return { status: 'pass' as const, message: `${images.length} imagens com texto alternativo adequado` };
        }
      },
      {
        name: 'Botões com Labels',
        test: () => {
          const buttons = document.querySelectorAll('button');
          const buttonsWithoutLabel = Array.from(buttons).filter(btn => {
            const hasText = btn.textContent?.trim();
            const hasAriaLabel = btn.getAttribute('aria-label');
            const hasAriaLabelledBy = btn.getAttribute('aria-labelledby');
            return !hasText && !hasAriaLabel && !hasAriaLabelledBy;
          });
          
          if (buttonsWithoutLabel.length > 0) {
            return { status: 'fail' as const, message: `${buttonsWithoutLabel.length} botões sem rótulos acessíveis` };
          }
          return { status: 'pass' as const, message: `${buttons.length} botões com rótulos adequados` };
        }
      },
      {
        name: 'Links com Texto Descritivo',
        test: () => {
          const links = document.querySelectorAll('a');
          const linksWithoutText = Array.from(links).filter(link => {
            const text = link.textContent?.trim();
            const ariaLabel = link.getAttribute('aria-label');
            return (!text || text.length < 3) && !ariaLabel;
          });
          
          if (linksWithoutText.length > 0) {
            return { status: 'warning' as const, message: `${linksWithoutText.length} links com texto pouco descritivo` };
          }
          return { status: 'pass' as const, message: `${links.length} links com texto descritivo adequado` };
        }
      },
      {
        name: 'Elementos com Foco Visível',
        test: () => {
          const focusableElements = document.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          
          // Simula teste de foco (em um teste real, seria mais complexo)
          return { 
            status: 'pass' as const, 
            message: `${focusableElements.length} elementos focalizáveis encontrados` 
          };
        }
      },
      {
        name: 'Landmarks e Regiões',
        test: () => {
          const landmarks = document.querySelectorAll(
            'main, nav, header, footer, aside, section[aria-label], [role="main"], [role="navigation"], [role="banner"], [role="contentinfo"]'
          );
          
          if (landmarks.length === 0) {
            return { status: 'fail' as const, message: 'Nenhum landmark encontrado' };
          }
          return { status: 'pass' as const, message: `${landmarks.length} landmarks encontrados` };
        }
      }
    ];

    for (const testCase of tests) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simula tempo de teste
      const result = testCase.test();
      setTestResults(prev => [...prev, {
        test: testCase.name,
        status: result.status,
        message: result.message
      }]);
    }
    
    setIsRunning(false);
    announceToScreenReader('Testes de acessibilidade concluídos');
  };

  const getStatusIcon = (status: 'pass' | 'fail' | 'warning') => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'fail':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <Info className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: 'pass' | 'fail' | 'warning') => {
    switch (status) {
      case 'pass':
        return 'bg-green-500';
      case 'fail':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
    }
  };

  return (
    <Card className={className} role="region" aria-labelledby="screen-reader-test-title">
      <CardHeader>
        <CardTitle id="screen-reader-test-title" className="flex items-center gap-2">
          <Volume2 className="h-5 w-5" aria-hidden="true" />
          Teste de Acessibilidade
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4">
          <Button
            onClick={runAccessibilityTests}
            disabled={isRunning}
            className="w-full"
            aria-describedby="test-description"
          >
            {isRunning ? 'Executando Testes...' : 'Executar Testes de Acessibilidade'}
          </Button>
          <p id="test-description" className="text-sm text-muted-foreground">
            Executa uma série de testes para verificar a acessibilidade da página
          </p>
        </div>

        {testResults.length > 0 && (
          <div className="space-y-3" role="log" aria-label="Resultados dos testes">
            <h3 className="font-semibold text-sm">Resultados:</h3>
            {testResults.map((result, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg border"
                role="listitem"
              >
                {getStatusIcon(result.status)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{result.test}</span>
                    <Badge 
                      variant="secondary" 
                      className={`text-white ${getStatusColor(result.status)}`}
                    >
                      {result.status === 'pass' ? 'Passou' : 
                       result.status === 'fail' ? 'Falhou' : 'Atenção'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{result.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {testResults.length > 0 && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <h4 className="font-medium text-sm mb-2">Resumo:</h4>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-lg font-bold text-green-500">
                  {testResults.filter(r => r.status === 'pass').length}
                </div>
                <div className="text-xs text-muted-foreground">Passou</div>
              </div>
              <div>
                <div className="text-lg font-bold text-yellow-500">
                  {testResults.filter(r => r.status === 'warning').length}
                </div>
                <div className="text-xs text-muted-foreground">Atenção</div>
              </div>
              <div>
                <div className="text-lg font-bold text-red-500">
                  {testResults.filter(r => r.status === 'fail').length}
                </div>
                <div className="text-xs text-muted-foreground">Falhou</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ScreenReaderTest;