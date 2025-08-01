# Integração do Componente Loader

## 📋 Resumo da Integração

O componente **Loader** foi integrado com sucesso ao projeto React + TypeScript + Tailwind CSS + Shadcn/ui.

## 🎯 Componente Criado

### `/src/components/ui/loader.tsx`

Componente de loading com estética brutalista/rock que inclui:

- **Equalizer animado**: 5 barras vermelhas com animação irregular
- **Barra de progresso**: Estilo "fita adesiva" com borda vermelha
- **Incremento irregular**: Simula ambiente caótico e "rock n' roll"
- **Tipografia**: Bebas Neue para números, Roboto Condensed para texto
- **Cores**: Paleta brutalista (vermelho sangue #ff2a2a, amarelo queimado #ffbd00)

## 🚀 Como Usar

### Importação Básica
```tsx
import Loader from '@/components/ui/loader';

function App() {
  return (
    <div>
      <Loader />
    </div>
  );
}
```

### Exemplo com Redirecionamento
```tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '@/components/ui/loader';

function LoadingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redireciona após 4-6 segundos (tempo do loader)
    const timer = setTimeout(() => {
      navigate('/home');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return <Loader />;
}
```

## 🎨 Personalização

### Cores Disponíveis (Tailwind)
- `bg-blood` - Vermelho sangue (#ff2a2a)
- `text-burnt` - Amarelo queimado (#ffbd00)
- `text-dirtywhite` - Branco sujo (#f0f0f0)
- `bg-black` - Preto absoluto

### Fontes Configuradas
- `font-heading` - Bebas Neue (para números/títulos)
- `font-body` - Roboto Condensed (para texto)

## 📁 Estrutura de Arquivos

```
src/
├── components/
│   └── ui/
│       └── loader.tsx          # ✅ Componente principal
├── pages/
│   └── LoaderExample.tsx       # ✅ Página de exemplo
└── index.css                   # ✅ Fontes atualizadas
```

## 🔧 Dependências

### ✅ Já Instaladas
- `framer-motion@^12.23.12` - Para animações
- `tailwindcss` - Para estilização
- `typescript` - Para tipagem

### 📝 Configurações Atualizadas
- **Google Fonts**: Adicionado Roboto Condensed
- **Tailwind Config**: Fontes Bebas Neue e Roboto Condensed configuradas
- **Rotas**: Adicionada rota `/loader-example` para demonstração

## 🌐 Rotas Disponíveis

- `/` - Página inicial (PreHome)
- `/loader` - Loader integrado ao fluxo principal
- `/loader-example` - **NOVA**: Demonstração do componente
- `/festival` - Página principal do festival

## 🎭 Características Visuais

### Animações
- **Equalizer**: 5 barras com alturas e velocidades diferentes
- **Progresso**: Incremento irregular (0-8% por vez)
- **Duração**: ~4-6 segundos para completar

### Layout
- **Tela cheia**: `h-screen` ocupa 100% da viewport
- **Centralizado**: Flex com center alignment
- **Responsivo**: Funciona em todos os dispositivos

## 🚀 Próximos Passos

1. **Testar**: Acesse `/loader-example` para ver o componente
2. **Integrar**: Use no fluxo de carregamento da aplicação
3. **Personalizar**: Ajuste cores/textos conforme necessário
4. **Otimizar**: Adicione callbacks para controle de finalização

## 💡 Dicas de Uso

- Use como splash screen inicial
- Combine com lazy loading de componentes
- Implemente callback `onComplete` se necessário
- Mantenha a estética brutalista do projeto

---

**Status**: ✅ **Integração Completa**  
**Compatibilidade**: React 18+ | TypeScript | Tailwind CSS | Shadcn/ui