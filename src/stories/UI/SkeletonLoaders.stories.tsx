import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  BandCardSkeleton,
  BandListSkeleton,
  ProgramItemSkeleton,
  ProgramListSkeleton,
  FiltersSkeleton,
  SectionSkeleton,
  BandDetailsSkeleton,
  HeaderSkeleton,
  PageSkeleton
} from '@/components/ui/skeleton-loaders'
import { SkeletonExample } from '@/components/examples/SkeletonExample'

const meta: Meta<typeof BandCardSkeleton> = {
  title: 'UI/Skeleton Loaders',
  component: BandCardSkeleton,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Skeleton loading states para diferentes componentes do Festival Berna. Estes componentes fornecem feedback visual durante o carregamento de conteúdo.'
      }
    }
  },
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof BandCardSkeleton>

// Individual skeleton components
export const BandCard: Story = {
  render: () => <BandCardSkeleton />,
  parameters: {
    docs: {
      description: {
        story: 'Skeleton loading para card de banda individual.'
      }
    }
  }
}

export const ProgramItem: Story = {
  render: () => <ProgramItemSkeleton />,
  parameters: {
    docs: {
      description: {
        story: 'Skeleton loading para item de programação.'
      }
    }
  }
}

export const Filters: Story = {
  render: () => <FiltersSkeleton />,
  parameters: {
    docs: {
      description: {
        story: 'Skeleton loading para filtros de busca.'
      }
    }
  }
}

export const Header: Story = {
  render: () => <HeaderSkeleton />,
  parameters: {
    docs: {
      description: {
        story: 'Skeleton loading para header/navegação.'
      }
    }
  }
}

export const BandDetails: Story = {
  render: () => <BandDetailsSkeleton />,
  parameters: {
    docs: {
      description: {
        story: 'Skeleton loading para página de detalhes de banda.'
      }
    }
  }
}

// List skeletons
export const BandList: Story = {
  render: () => <BandListSkeleton count={3} />,
  parameters: {
    docs: {
      description: {
        story: 'Skeleton loading para lista de bandas.'
      }
    }
  }
}

export const ProgramList: Story = {
  render: () => <ProgramListSkeleton count={4} />,
  parameters: {
    docs: {
      description: {
        story: 'Skeleton loading para lista de programação.'
      }
    }
  }
}

// Section skeletons
export const BandSection: Story = {
  render: () => <SectionSkeleton content="bands" title={true} filters={true} />,
  parameters: {
    docs: {
      description: {
        story: 'Skeleton loading para seção completa de bandas com título e filtros.'
      }
    }
  }
}

export const ProgramSection: Story = {
  render: () => <SectionSkeleton content="program" title={true} filters={true} />,
  parameters: {
    docs: {
      description: {
        story: 'Skeleton loading para seção completa de programação com título e filtros.'
      }
    }
  }
}

// Page skeleton
export const FullPage: Story = {
  render: () => <PageSkeleton header={true} content="bands" />,
  parameters: {
    docs: {
      description: {
        story: 'Skeleton loading para página completa com header e conteúdo.'
      }
    }
  }
}

// Interactive example
export const InteractiveExample: Story = {
  render: () => <SkeletonExample />,
  parameters: {
    docs: {
      description: {
        story: 'Exemplo interativo demonstrando todos os tipos de skeleton loading e como eles funcionam com lazy loading.'
      }
    }
  }
}

// Variations
export const CustomCounts: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Lista com 2 itens</h3>
        <BandListSkeleton count={2} />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Lista com 8 itens</h3>
        <ProgramListSkeleton count={8} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstração de diferentes quantidades de itens nos skeleton loaders.'
      }
    }
  }
}

export const WithCustomStyling: Story = {
  render: () => (
    <div className="space-y-6">
      <BandCardSkeleton className="border-2 border-dashed border-primary" />
      <ProgramItemSkeleton className="bg-muted/50 rounded-xl" />
      <FiltersSkeleton className="justify-center" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Skeleton loaders com estilos customizados usando className.'
      }
    }
  }
}