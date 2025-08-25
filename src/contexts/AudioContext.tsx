import React, { createContext, useContext, useEffect, useRef, ReactNode, useCallback, useMemo } from 'react'
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
    setAudioEnabled: setAudioEnabledStore,
    setAudioVolume: setAudioVolumeStore,
    setAudioPreference: setAudioPreferenceStore,
  } = useUserSettingsStore()
  
  const [isMuted, setIsMuted] = React.useState(false)
  const [isPlaying, setIsPlaying] = React.useState(false)
  
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null)
  const soundEffectsRef = useRef<HTMLAudioElement[]>([])
  const autoEnableAttachedRef = useRef(false)
  
  const effectiveVolume = useMemo(() => {
    if (!audioEnabled || isMuted) return 0
    return audioVolume
  }, [audioEnabled, isMuted, audioVolume])
  
  const toggleMute = useCallback(() => {
    setIsMuted((m) => !m)
  }, [])
  
  const setAudioEnabled = useCallback((enabled: boolean) => {
    // Evita set redundante para não disparar re-render/cascata
    if (enabled === audioEnabled) return
    setAudioEnabledStore(enabled)
  }, [audioEnabled, setAudioEnabledStore])

  const setAudioVolume = useCallback((volume: number) => {
    setAudioVolumeStore(volume)
  }, [setAudioVolumeStore])

  const setAudioPreference = useCallback((preference: AudioPreference) => {
    setAudioPreferenceStore(preference)
  }, [setAudioPreferenceStore])

  const toggleAudio = useCallback(() => {
    setAudioEnabled(!audioEnabled)
  }, [audioEnabled, setAudioEnabled])
  
  const playSound = useCallback(async (soundUrl: string, options: { volume?: number; loop?: boolean } = {}) => {
    if (!audioEnabled || isMuted) return
    
    try {
      const audio = new Audio(soundUrl)
      audio.volume = (options.volume ?? 1) * Math.min(1, Math.max(0, effectiveVolume))
      audio.loop = options.loop ?? false
      audio.preload = 'auto'
      audio.crossOrigin = 'anonymous'
      
      // Add to sound effects array for cleanup
      soundEffectsRef.current.push(audio)
      
      // Remove from array when finished or on pause
      const removeRef = () => {
        const index = soundEffectsRef.current.indexOf(audio)
        if (index > -1) {
          soundEffectsRef.current.splice(index, 1)
        }
      }
      audio.addEventListener('ended', removeRef)
      audio.addEventListener('pause', removeRef)
      
      await audio.play()
    } catch (error) {
      console.warn('Failed to play sound:', error)
    }
  }, [audioEnabled, isMuted, effectiveVolume])
  
  const stopAllSounds = useCallback(() => {
    soundEffectsRef.current.forEach(audio => {
      try {
        audio.pause()
        audio.currentTime = 0
      } catch { /* noop */ }
    })
    soundEffectsRef.current = []
  }, [])
  
  const playBackgroundMusic = useCallback(async (musicUrl: string) => {
    if (!audioEnabled || isMuted) return
    
    try {
      // Stop current background music if playing
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause()
        backgroundMusicRef.current = null
      }
      
      const audio = new Audio(musicUrl)
      audio.volume = Math.min(1, Math.max(0, effectiveVolume)) * 0.3 // Background music should be quieter
      audio.loop = true
      audio.preload = 'auto'
      audio.crossOrigin = 'anonymous'
      
      backgroundMusicRef.current = audio
      
      audio.addEventListener('play', () => setIsPlaying(true))
      audio.addEventListener('pause', () => setIsPlaying(false))
      audio.addEventListener('ended', () => setIsPlaying(false))
      
      await audio.play()
    } catch (error) {
      console.warn('Failed to play background music:', error)
    }
  }, [audioEnabled, isMuted, effectiveVolume])
  
  const stopBackgroundMusic = useCallback(() => {
    if (backgroundMusicRef.current) {
      try {
        backgroundMusicRef.current.pause()
        backgroundMusicRef.current.currentTime = 0
      } catch { /* noop */ }
      backgroundMusicRef.current = null
      setIsPlaying(false)
    }
  }, [])
  
  const setBackgroundVolume = useCallback((volume: number) => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.volume = volume * Math.min(1, Math.max(0, effectiveVolume)) * 0.3
    }
  }, [effectiveVolume])
  
  // Update audio volumes when settings change
  useEffect(() => {
    // Update background music volume
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.volume = Math.min(1, Math.max(0, effectiveVolume)) * 0.3
    }
    
    // Update sound effects volume
    soundEffectsRef.current.forEach(audio => {
      audio.volume = Math.min(1, Math.max(0, effectiveVolume))
    })
  }, [effectiveVolume])
  
  // Handle audio preference changes (auto-enable apenas uma vez)
  useEffect(() => {
    if (audioPreference === 'disabled') {
      setAudioEnabled(false)
      return
    }

    if (audioPreference !== 'auto') {
      return
    }

    if (autoEnableAttachedRef.current) return
    const handleUserInteraction = () => {
      setAudioEnabled(true)
      document.removeEventListener('click', handleUserInteraction)
      document.removeEventListener('keydown', handleUserInteraction)
      autoEnableAttachedRef.current = false
    }
    document.addEventListener('click', handleUserInteraction)
    document.addEventListener('keydown', handleUserInteraction)
    autoEnableAttachedRef.current = true
    
    return () => {
      document.removeEventListener('click', handleUserInteraction)
      document.removeEventListener('keydown', handleUserInteraction)
      autoEnableAttachedRef.current = false
    }
  }, [audioPreference, setAudioEnabled])
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAllSounds()
      stopBackgroundMusic()
    }
  }, [stopAllSounds, stopBackgroundMusic])
  
  const value: AudioContextType = useMemo(() => ({
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
  }), [audioEnabled, audioVolume, audioPreference, isMuted, isPlaying, setAudioEnabled, setAudioVolume, setAudioPreference, toggleMute, toggleAudio, playSound, stopAllSounds, playBackgroundMusic, stopBackgroundMusic, setBackgroundVolume])
  
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