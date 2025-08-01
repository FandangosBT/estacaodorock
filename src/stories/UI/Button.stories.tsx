import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '../../components/ui/button'
import { Mail, Download, Loader2 } from 'lucide-react'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Componente Button do shadcn/ui com diferentes variantes e tamanhos.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link']
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'sm', 'lg', 'icon']
    },
    disabled: {
      control: { type: 'boolean' }
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Button'
  }
}

export const Primary: Story = {
  args: {
    variant: 'default',
    children: 'Primary Button'
  }
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button'
  }
}

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Delete'
  }
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline Button'
  }
}

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button'
  }
}

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link Button'
  }
}

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Button'
  }
}

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Button'
  }
}

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Mail className="mr-2 h-4 w-4" />
        Login with Email
      </>
    )
  }
}

export const IconOnly: Story = {
  args: {
    variant: 'outline',
    size: 'icon',
    children: <Download className="h-4 w-4" />
  }
}

export const Loading: Story = {
  args: {
    disabled: true,
    children: (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Please wait
      </>
    )
  }
}

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button'
  }
}