import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark' | 'system'
export type AnimationLevel = 'full' | 'reduced' | 'none'
export type AudioPreference = 'enabled' | 'disabled' | 'auto'

interface UserSettingsState {
  // Theme settings
  theme: Theme
  setTheme: (theme: Theme) => void
  
  // Animation settings
  animationLevel: AnimationLevel
  setAnimationLevel: (level: AnimationLevel) => void
  
  // Audio settings
  audioEnabled: boolean
  audioVolume: number
  audioPreference: AudioPreference
  setAudioEnabled: (enabled: boolean) => void
  setAudioVolume: (volume: number) => void
  setAudioPreference: (preference: AudioPreference) => void
  
  // Accessibility settings
  reducedMotion: boolean
  highContrast: boolean
  fontSize: 'small' | 'medium' | 'large'
  setReducedMotion: (enabled: boolean) => void
  setHighContrast: (enabled: boolean) => void
  setFontSize: (size: 'small' | 'medium' | 'large') => void
  
  // Notification settings
  notificationsEnabled: boolean
  emailNotifications: boolean
  pushNotifications: boolean
  setNotificationsEnabled: (enabled: boolean) => void
  setEmailNotifications: (enabled: boolean) => void
  setPushNotifications: (enabled: boolean) => void
  
  // User preferences
  favoriteGenres: string[]
  preferredLanguage: 'pt' | 'en' | 'es'
  addFavoriteGenre: (genre: string) => void
  removeFavoriteGenre: (genre: string) => void
  setPreferredLanguage: (language: 'pt' | 'en' | 'es') => void
  
  // Reset functions
  resetToDefaults: () => void
  resetAudioSettings: () => void
  resetAccessibilitySettings: () => void
}

const defaultSettings = {
  theme: 'dark' as Theme,
  animationLevel: 'full' as AnimationLevel,
  audioEnabled: true,
  audioVolume: 0.7,
  audioPreference: 'auto' as AudioPreference,
  reducedMotion: false,
  highContrast: false,
  fontSize: 'medium' as const,
  notificationsEnabled: true,
  emailNotifications: false,
  pushNotifications: true,
  favoriteGenres: [],
  preferredLanguage: 'pt' as const,
}

export const useUserSettingsStore = create<UserSettingsState>()(
  persist(
    (set, get) => ({
      ...defaultSettings,
      
      setTheme: (theme: Theme) => {
        set({ theme })
        // Apply theme to document
        if (theme === 'dark') {
          document.documentElement.classList.add('dark')
        } else if (theme === 'light') {
          document.documentElement.classList.remove('dark')
        } else {
          // System theme
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
          if (prefersDark) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
        }
      },
      
      setAnimationLevel: (animationLevel: AnimationLevel) => {
        set({ animationLevel })
        // Apply animation preferences to document
        const root = document.documentElement
        root.classList.remove('animations-full', 'animations-reduced', 'animations-none')
        root.classList.add(`animations-${animationLevel}`)
      },
      
      setAudioEnabled: (audioEnabled: boolean) => {
        set({ audioEnabled })
      },
      
      setAudioVolume: (audioVolume: number) => {
        const clampedVolume = Math.max(0, Math.min(1, audioVolume))
        set({ audioVolume: clampedVolume })
      },
      
      setAudioPreference: (audioPreference: AudioPreference) => {
        set({ audioPreference })
      },
      
      setReducedMotion: (reducedMotion: boolean) => {
        set({ reducedMotion })
        // Apply reduced motion preference
        if (reducedMotion) {
          document.documentElement.style.setProperty('--animation-duration', '0.01ms')
        } else {
          document.documentElement.style.removeProperty('--animation-duration')
        }
      },
      
      setHighContrast: (highContrast: boolean) => {
        set({ highContrast })
        if (highContrast) {
          document.documentElement.classList.add('high-contrast')
        } else {
          document.documentElement.classList.remove('high-contrast')
        }
      },
      
      setFontSize: (fontSize: 'small' | 'medium' | 'large') => {
        set({ fontSize })
        const root = document.documentElement
        root.classList.remove('font-small', 'font-medium', 'font-large')
        root.classList.add(`font-${fontSize}`)
      },
      
      setNotificationsEnabled: (notificationsEnabled: boolean) => {
        set({ notificationsEnabled })
      },
      
      setEmailNotifications: (emailNotifications: boolean) => {
        set({ emailNotifications })
      },
      
      setPushNotifications: (pushNotifications: boolean) => {
        set({ pushNotifications })
      },
      
      addFavoriteGenre: (genre: string) => {
        set((state) => ({
          favoriteGenres: state.favoriteGenres.includes(genre)
            ? state.favoriteGenres
            : [...state.favoriteGenres, genre]
        }))
      },
      
      removeFavoriteGenre: (genre: string) => {
        set((state) => ({
          favoriteGenres: state.favoriteGenres.filter(g => g !== genre)
        }))
      },
      
      setPreferredLanguage: (preferredLanguage: 'pt' | 'en' | 'es') => {
        set({ preferredLanguage })
      },
      
      resetToDefaults: () => {
        set(defaultSettings)
      },
      
      resetAudioSettings: () => {
        set({
          audioEnabled: defaultSettings.audioEnabled,
          audioVolume: defaultSettings.audioVolume,
          audioPreference: defaultSettings.audioPreference,
        })
      },
      
      resetAccessibilitySettings: () => {
        set({
          reducedMotion: defaultSettings.reducedMotion,
          highContrast: defaultSettings.highContrast,
          fontSize: defaultSettings.fontSize,
        })
      },
    }),
    {
      name: 'festival-user-settings',
      version: 1,
    }
  )
)