import React, { createContext, useContext, useEffect, useRef, ReactNode } from 'react'
import { useUserSettingsStore, AudioPreference } from '@/stores'

interface AudioContextType {
  // Audio state
  audioEnabled: boolean
  audioVolume: number
  audioPreference: AudioPreference
  isMuted: boolean
  isPlaying: boolean
  
  // Audio controls
  setAudioEnabled: (enabled: boolean) => void
  setAudioVolume: (volume: number) => void
  setAudioPreference: (preference: AudioPreference) => void
  toggleMute: () => void
  toggleAudio: () => void
  
  // Audio playback
  playSound: (soundUrl: string, options?: { volume?: number; loop?: boolean }) => Promise<void>
  stopAllSounds: () => void
  
  // Background music
  playBackgroundMusic: (musicUrl: string) => Promise<void>
  stopBackgroundMusic: () => void
  setBackgroundVolume: (volume: number) => void
}

const AudioContext = createContext<AudioContextType | undefined>(undefined)

interface AudioProviderProps {
  children: ReactNode
}

export function AudioProvider({ children }: AudioProviderProps) {
  const {
    audioEnabled,
    audioVolume,
    audioPreference,
    setAudioEnabled,
    setAudioVolume,
    setAudioPreference,
  } = useUserSettingsStore()
  
  const [isMuted, setIsMuted] = React.useState(false)
  const [isPlaying, setIsPlaying] = React.useState(false)
  
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null)
  const soundEffectsRef = useRef<HTMLAudioElement[]>([])
  
  const effectiveVolume = React.useMemo(() => {
    if (!audioEnabled || isMuted) return 0
    return audioVolume
  }, [audioEnabled, isMuted, audioVolume])
  
  const toggleMute = () => {
    setIsMuted(!isMuted)
  }
  
  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled)
  }
  
  const playSound = async (soundUrl: string, options: { volume?: number; loop?: boolean } = {}) => {
    if (!audioEnabled || isMuted) return
    
    try {
      const audio = new Audio(soundUrl)
      audio.volume = (options.volume ?? 1) * effectiveVolume
      audio.loop = options.loop ?? false
      
      // Add to sound effects array for cleanup
      soundEffectsRef.current.push(audio)
      
      // Remove from array when finished
      audio.addEventListener('ended', () => {
        const index = soundEffectsRef.current.indexOf(audio)
        if (index > -1) {
          soundEffectsRef.current.splice(index, 1)
        }
      })
      
      await audio.play()
    } catch (error) {
      console.warn('Failed to play sound:', error)
    }
  }
  
  const stopAllSounds = () => {
    soundEffectsRef.current.forEach(audio => {
      audio.pause()
      audio.currentTime = 0
    })
    soundEffectsRef.current = []
  }
  
  const playBackgroundMusic = async (musicUrl: string) => {
    if (!audioEnabled || isMuted) return
    
    try {
      // Stop current background music if playing
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause()
        backgroundMusicRef.current = null
      }
      
      const audio = new Audio(musicUrl)
      audio.volume = effectiveVolume * 0.3 // Background music should be quieter
      audio.loop = true
      
      backgroundMusicRef.current = audio
      
      audio.addEventListener('play', () => setIsPlaying(true))
      audio.addEventListener('pause', () => setIsPlaying(false))
      audio.addEventListener('ended', () => setIsPlaying(false))
      
      await audio.play()
    } catch (error) {
      console.warn('Failed to play background music:', error)
    }
  }
  
  const stopBackgroundMusic = () => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.pause()
      backgroundMusicRef.current.currentTime = 0
      backgroundMusicRef.current = null
      setIsPlaying(false)
    }
  }
  
  const setBackgroundVolume = (volume: number) => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.volume = volume * effectiveVolume * 0.3
    }
  }
  
  // Update audio volumes when settings change
  useEffect(() => {
    // Update background music volume
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.volume = effectiveVolume * 0.3
    }
    
    // Update sound effects volume
    soundEffectsRef.current.forEach(audio => {
      audio.volume = effectiveVolume
    })
  }, [effectiveVolume])
  
  // Handle audio preference changes
  useEffect(() => {
    if (audioPreference === 'disabled') {
      setAudioEnabled(false)
    } else if (audioPreference === 'auto') {
      // Auto-enable based on user interaction
      const handleUserInteraction = () => {
        setAudioEnabled(true)
        document.removeEventListener('click', handleUserInteraction)
        document.removeEventListener('keydown', handleUserInteraction)
      }
      
      document.addEventListener('click', handleUserInteraction)
      document.addEventListener('keydown', handleUserInteraction)
      
      return () => {
        document.removeEventListener('click', handleUserInteraction)
        document.removeEventListener('keydown', handleUserInteraction)
      }
    }
  }, [audioPreference, setAudioEnabled])
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAllSounds()
      stopBackgroundMusic()
    }
  }, [])
  
  const value: AudioContextType = {
    audioEnabled,
    audioVolume,
    audioPreference,
    isMuted,
    isPlaying,
    setAudioEnabled,
    setAudioVolume,
    setAudioPreference,
    toggleMute,
    toggleAudio,
    playSound,
    stopAllSounds,
    playBackgroundMusic,
    stopBackgroundMusic,
    setBackgroundVolume,
  }
  
  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  )
}

export function useAudio() {
  const context = useContext(AudioContext)
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider')
  }
  return context
}