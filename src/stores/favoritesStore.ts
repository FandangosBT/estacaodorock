import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Band {
  id: string
  name: string
  genre: string
  day: string
  time: string
  stage: string
  spotify?: string
  youtube?: string
  instagram?: string
}

export interface Performance {
  id: string
  band: string
  day: string
  date: string
  time: string
  stage: string
  duration: string
  genre: string
}

interface FavoritesState {
  favoriteBands: string[]
  favoritePerformances: string[]
  addFavoriteBand: (bandId: string) => void
  removeFavoriteBand: (bandId: string) => void
  isBandFavorite: (bandId: string) => boolean
  addFavoritePerformance: (performanceId: string) => void
  removeFavoritePerformance: (performanceId: string) => void
  isPerformanceFavorite: (performanceId: string) => boolean
  clearAllFavorites: () => void
  getFavoriteCount: () => number
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteBands: [],
      favoritePerformances: [],
      
      addFavoriteBand: (bandId: string) => {
        set((state) => ({
          favoriteBands: state.favoriteBands.includes(bandId)
            ? state.favoriteBands
            : [...state.favoriteBands, bandId]
        }))
      },
      
      removeFavoriteBand: (bandId: string) => {
        set((state) => ({
          favoriteBands: state.favoriteBands.filter(id => id !== bandId)
        }))
      },
      
      isBandFavorite: (bandId: string) => {
        return get().favoriteBands.includes(bandId)
      },
      
      addFavoritePerformance: (performanceId: string) => {
        set((state) => ({
          favoritePerformances: state.favoritePerformances.includes(performanceId)
            ? state.favoritePerformances
            : [...state.favoritePerformances, performanceId]
        }))
      },
      
      removeFavoritePerformance: (performanceId: string) => {
        set((state) => ({
          favoritePerformances: state.favoritePerformances.filter(id => id !== performanceId)
        }))
      },
      
      isPerformanceFavorite: (performanceId: string) => {
        return get().favoritePerformances.includes(performanceId)
      },
      
      clearAllFavorites: () => {
        set({ favoriteBands: [], favoritePerformances: [] })
      },
      
      getFavoriteCount: () => {
        const state = get()
        return state.favoriteBands.length + state.favoritePerformances.length
      }
    }),
    {
      name: 'festival-favorites',
      version: 1,
    }
  )
)