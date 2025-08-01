# Sistema de Estados Globais

Este documento descreve o sistema de gerenciamento de estados globais implementado para o Festival Berna, focado em estados de loading e erro.

## Visão Geral

O sistema foi projetado para centralizar o gerenciamento de estados de loading e erro em toda a aplicação, proporcionando uma experiência de usuário consistente e facilitando a manutenção do código.

## Componentes Principais

### 1. GlobalStateProvider

O provider principal que envolve toda a aplicação e fornece o contexto de estados globais.

```tsx
import { GlobalStateProvider } from '@/hooks/use-global-state';

// No App.tsx
const App = () => (
  <QueryClientProvider client={queryClient}>
    <GlobalStateProvider>
      {/* Resto da aplicação */}
    </GlobalStateProvider>
  </QueryClientProvider>
);
```

### 2. useGlobalState

Hook para acessar e manipular estados globais diretamente.

```tsx
import { useGlobalState } from '@/hooks/use-global-state';

const MyComponent = () => {
  const { setLoading, setError, isLoading, hasError } = useGlobalState();
  
  // Usar os métodos conforme necessário
};
```

### 3. useAsyncOperation

Hook especializado para operações assíncronas com gerenciamento automático de loading e erro.

```tsx
import { useAsyncOperation } from '@/hooks/use-global-state';

const MyComponent = () => {
  const { execute, isLoading, error, reset } = useAsyncOperation('my-operation');
  
  useEffect(() => {
    const loadData = async () => {
      // Simula carregamento de dados
      await new Promise(resolve => setTimeout(resolve, 1000));
      return data;
    };

    execute(loadData)
      .then((result) => {
        // Processar resultado
      })
      .catch(() => {
        // Erro já é gerenciado automaticamente
      });
  }, [execute]);
  
  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage />;
  
  return <Content />;
};
```

### 4. useMultipleAsyncOperations

Para gerenciar múltiplas operações assíncronas simultaneamente.

```tsx
const { executeAll, isAnyLoading, hasAnyError, resetAll } = useMultipleAsyncOperations([
  'operation-1',
  'operation-2',
  'operation-3'
]);
```

### 5. useAsyncWithTimeout

Para operações com timeout automático.

```tsx
const { execute, isLoading, error } = useAsyncWithTimeout('my-operation', 5000);
```

## Implementações Atuais

### HeroSection

- **Estado**: `hero-data`
- **Funcionalidade**: Carregamento simulado de dados da seção hero
- **Tratamento de erro**: Toast de notificação + botão de retry
- **Loading**: Componente Loading em tela cheia

### LineupSection

- **Estado**: `bands-data`
- **Funcionalidade**: Carregamento simulado de dados das bandas
- **Tratamento de erro**: Toast + mensagem de erro com retry
- **Loading**: Componente Loading centralizado
- **Estado vazio**: EmptyState quando não há bandas filtradas

### ProgramacaoSection

- **Estado**: `schedule-data`
- **Funcionalidade**: Carregamento simulado da programação
- **Tratamento de erro**: Mensagem de erro com botão de retry
- **Loading**: Componente Loading centralizado
- **Estado vazio**: EmptyState quando não há apresentações filtradas

## Padrões de Uso

### 1. Estrutura Básica

```tsx
const MyComponent = () => {
  const [data, setData] = useState([]);
  const { execute, isLoading, error, reset } = useAsyncOperation('unique-key');
  
  useEffect(() => {
    const loadData = async () => {
      // Lógica de carregamento
      return result;
    };

    execute(loadData)
      .then(setData)
      .catch(() => toast.error('Erro ao carregar dados'));
  }, [execute]);
  
  // Estados condicionais no JSX
  if (isLoading) return <Loading />;
  if (error) return <ErrorState onRetry={() => reset()} />;
  if (data.length === 0) return <EmptyState />;
  
  return <Content data={data} />;
};
```

### 2. Tratamento de Erro

```tsx
// Erro com retry automático
<Button onClick={() => {
  reset();
  window.location.reload();
}}>
  Tentar Novamente
</Button>

// Erro com toast
execute(asyncFn)
  .catch(() => {
    toast.error('Mensagem de erro personalizada');
  });
```

### 3. Estados Vazios

```tsx
{filteredData.length === 0 ? (
  <EmptyState 
    type="appropriate-type"
    title="Título descritivo"
    description="Descrição do estado vazio"
    action={{
      label: "Ação de recuperação",
      onClick: () => resetFilters()
    }}
  />
) : (
  <DataGrid data={filteredData} />
)}
```

## Benefícios

1. **Consistência**: Todos os componentes seguem o mesmo padrão de loading/erro
2. **Manutenibilidade**: Estados centralizados facilitam mudanças globais
3. **Escalabilidade**: Fácil adição de novos componentes com estados gerenciados
4. **UX**: Experiência de usuário uniforme em toda a aplicação
5. **Debugging**: Estados centralizados facilitam o debug

## Próximos Passos

1. Integrar mais componentes ao sistema
2. Adicionar métricas de performance
3. Implementar cache de estados
4. Adicionar testes unitários para os hooks
5. Documentar padrões de erro específicos

## Considerações de Performance

- Estados são isolados por chave única
- Não há re-renders desnecessários
- Cleanup automático de estados não utilizados
- Operações assíncronas são canceláveis

## Troubleshooting

### Erro: "Cannot find namespace 'GlobalStateContext'"
- Certifique-se de que o GlobalStateProvider está envolvendo a aplicação

### Estados não persistem entre componentes
- Verifique se está usando a mesma chave em diferentes componentes

### Loading infinito
- Verifique se a operação assíncrona está retornando corretamente
- Use o método `reset()` para limpar estados problemáticos