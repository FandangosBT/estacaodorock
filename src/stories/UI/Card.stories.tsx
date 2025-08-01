import type { Meta, StoryObj } from '@storybook/react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Calendar, MapPin, Users } from 'lucide-react'

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Componente Card do shadcn/ui para exibir conteúdo em containers estruturados.'
      }
    }
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content goes here.</p>
      </CardContent>
    </Card>
  )
}

export const WithFooter: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Configure your project settings and deploy.</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  )
}

export const EventCard: Story = {
  name: 'Event Card (Festival)',
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Iron Maiden</CardTitle>
          <Badge variant="secondary">Headliner</Badge>
        </div>
        <CardDescription className="flex items-center space-x-4 text-sm">
          <span className="flex items-center">
            <Calendar className="mr-1 h-4 w-4" />
            15 Jun 2025
          </span>
          <span className="flex items-center">
            <MapPin className="mr-1 h-4 w-4" />
            Palco Principal
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          A lendária banda britânica de heavy metal retorna ao Brasil com sua turnê mundial, 
          apresentando clássicos como "The Number of the Beast" e "Run to the Hills".
        </p>
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4" />
          <span className="text-sm">1.2k interessados</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Mais Info</Button>
        <Button>Favoritar</Button>
      </CardFooter>
    </Card>
  )
}

export const SimpleCard: Story = {
  render: () => (
    <Card className="w-[300px] p-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Simple Card</h3>
        <p className="text-sm text-muted-foreground mt-2">
          A simple card without header/footer structure.
        </p>
      </div>
    </Card>
  )
}

export const LoadingCard: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded animate-pulse" />
          <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="h-3 bg-muted rounded animate-pulse" />
          <div className="h-3 bg-muted rounded animate-pulse" />
          <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
        </div>
      </CardContent>
    </Card>
  )
}