import type { Meta, StoryObj } from '@storybook/react'
import { LazyExample } from '../components/examples/LazyExample'

const meta: Meta<typeof LazyExample> = {
  title: 'Examples/LazyExample',
  component: LazyExample,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Demonstração de carregamento sob demanda (lazy loading) de componentes React com diferentes estratégias de otimização.'
      }
    }
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Exemplo Padrão',
  parameters: {
    docs: {
      description: {
        story: 'Exemplo básico mostrando lazy loading, preload on hover e componentes com wrapper customizado.'
      }
    }
  }
}

export const WithPerformanceMonitoring: Story = {
  name: 'Com Monitoramento de Performance',
  parameters: {
    docs: {
      description: {
        story: 'Versão com monitoramento de performance ativo para demonstrar os benefícios do lazy loading.'
      }
    }
  },
  decorators: [
    (Story) => {
      // Simular monitoramento de performance
      console.log('🚀 Performance monitoring ativo')
      return Story()
    }
  ]
}