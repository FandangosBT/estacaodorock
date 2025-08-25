import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect, useState } from 'react'
import { useFavoritesStore } from '../../stores'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Heart, Users, Calendar, MapPin } from 'lucide-react'

// Componente de demonstração
const FavoritesDemo = () => {
  const {
    favoriteBands,
    favoritePerformances,
    addFavoriteBand,
    removeFavoriteBand,
    addFavoritePerformance,
    removeFavoritePerformance,
    isBandFavorite,
    isPerformanceFavorite,
    getFavoriteCount,
    clearAllFavorites
  } = useFavoritesStore()

  const [selectedTab, setSelectedTab] = useState<'bands' | 'performances'>('bands')

  // Dados de exemplo
  const sampleBands = [
    { id: '1', name: 'Iron Maiden', genre: 'Heavy Metal', country: 'UK' },
    { id: '2', name: 'Metallica', genre: 'Thrash Metal', country: 'USA' },
    { id: '3', name: 'Black Sabbath', genre: 'Heavy Metal', country: 'UK' }
  ]

  const samplePerformances = [
    {
      id: '1',
      bandId: '1',
      bandName: 'Iron Maiden',
      date: '2025-06-15T20:00:00Z',
      stage: 'Palco Principal',
      duration: 120
    },
    {
      id: '2',
      bandId: '2',
      bandName: 'Metallica',
      date: '2025-06-16T21:00:00Z',
      stage: 'Palco Principal',
      duration: 150
    }
  ]

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Demonstração do Favorites Store</h1>
        <p className="text-muted-foreground">
          Teste as funcionalidades de favoritos para bandas e performances
        </p>
        <div className="flex items-center justify-center space-x-4">
          <Badge variant="outline">
            <Heart className="mr-1 h-3 w-3" />
            {getFavoriteCount()} favoritos
          </Badge>
          <Button
            variant="destructive"
            size="sm"
            onClick={clearAllFavorites}
            disabled={getFavoriteCount() === 0}
          >
            Limpar Todos
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center space-x-2">
        <Button
          variant={selectedTab === 'bands' ? 'default' : 'outline'}
          onClick={() => setSelectedTab('bands')}
        >
          Bandas ({favoriteBands.length})
        </Button>
        <Button
          variant={selectedTab === 'performances' ? 'default' : 'outline'}
          onClick={() => setSelectedTab('performances')}
        >
          Performances ({favoritePerformances.length})
        </Button>
      </div>

      {/* Bandas */}
      {selectedTab === 'bands' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Bandas Disponíveis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sampleBands.map((band) => {
              const isFavorite = isBandFavorite(band.id)
              return (
                <Card key={band.id} className={isFavorite ? 'ring-2 ring-primary' : ''}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{band.name}</CardTitle>
                      <Button
                        variant={isFavorite ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => {
                          if (isFavorite) {
                            removeFavoriteBand(band.id)
                          } else {
                            addFavoriteBand(band.id)
                          }
                        }}
                      >
                        <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                    <CardDescription>
                      {band.genre} • {band.country}
                    </CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Performances */}
      {selectedTab === 'performances' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Performances Disponíveis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {samplePerformances.map((performance) => {
              const isFavorite = isPerformanceFavorite(performance.id)
              return (
                <Card key={performance.id} className={isFavorite ? 'ring-2 ring-primary' : ''}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{performance.bandName}</CardTitle>
                      <Button
                        variant={isFavorite ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => {
                          if (isFavorite) {
                            removeFavoritePerformance(performance.id)
                          } else {
                            addFavoritePerformance(performance.id)
                          }
                        }}
                      >
                        <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                    <CardDescription className="space-y-1">
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        {new Date(performance.date).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="mr-1 h-3 w-3" />
                        {performance.stage}
                      </div>
                      <div className="flex items-center">
                        <Users className="mr-1 h-3 w-3" />
                        {performance.duration} min
                      </div>
                    </CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Lista de Favoritos */}
      {getFavoriteCount() > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Seus Favoritos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {favoriteBands.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Bandas Favoritas</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {favoriteBands.map((bandId) => {
                      const band = sampleBands.find(b => b.id === bandId)
                      return band ? (
                        <li key={bandId} className="text-sm">
                          {band.name} ({band.genre})
                        </li>
                      ) : null
                    })}
                  </ul>
                </CardContent>
              </Card>
            )}
            {favoritePerformances.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Performances Favoritas</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {favoritePerformances.map((performanceId) => {
                      const performance = samplePerformances.find(p => p.id === performanceId)
                      return performance ? (
                        <li key={performanceId} className="text-sm">
                          {performance.bandName} - {performance.stage}
                        </li>
                      ) : null
                    })}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const meta: Meta<typeof FavoritesDemo> = {
  title: 'Stores/FavoritesStore',
  component: FavoritesDemo,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Demonstração interativa do store de favoritos usando Zustand com persistência.'
      }
    }
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Interactive: Story = {
  name: 'Demonstração Interativa',
  parameters: {
    docs: {
      description: {
        story: 'Interface interativa para testar todas as funcionalidades do favorites store: adicionar/remover favoritos, contar total e limpar todos.'
      }
    }
  }
}