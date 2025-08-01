import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Question {
  id: string
  question: string
  options: string[]
  points: Record<string, number> // points for each rocker type
}

export interface RockerType {
  id: string
  name: string
  description: string
  emoji: string
  coupon: string
  traits: string[]
  recommendations: string[]
}

export interface QuizAnswer {
  questionId: string
  selectedOption: string
  points: Record<string, number>
}

export interface QuizResult {
  rockerType: RockerType
  totalPoints: Record<string, number>
  answers: QuizAnswer[]
  completedAt: Date
  shareUrl?: string
}

interface QuizState {
  // Current quiz session
  currentQuestionIndex: number
  answers: QuizAnswer[]
  isQuizStarted: boolean
  isQuizCompleted: boolean
  
  // Quiz results
  lastResult: QuizResult | null
  allResults: QuizResult[]
  
  // Quiz actions
  startQuiz: () => void
  answerQuestion: (questionId: string, selectedOption: string, points: Record<string, number>) => void
  nextQuestion: () => void
  previousQuestion: () => void
  completeQuiz: (result: QuizResult) => void
  resetQuiz: () => void
  
  // Results actions
  saveResult: (result: QuizResult) => void
  getResultById: (id: string) => QuizResult | undefined
  deleteResult: (completedAt: Date) => void
  clearAllResults: () => void
  
  // Statistics
  getQuizStats: () => {
    totalQuizzesTaken: number
    mostCommonType: string | null
    averageCompletionTime: number
    typeDistribution: Record<string, number>
  }
  
  // Sharing
  generateShareUrl: (result: QuizResult) => string
  setShareUrl: (completedAt: Date, shareUrl: string) => void
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentQuestionIndex: 0,
      answers: [],
      isQuizStarted: false,
      isQuizCompleted: false,
      lastResult: null,
      allResults: [],
      
      startQuiz: () => {
        set({
          currentQuestionIndex: 0,
          answers: [],
          isQuizStarted: true,
          isQuizCompleted: false,
        })
      },
      
      answerQuestion: (questionId: string, selectedOption: string, points: Record<string, number>) => {
        set((state) => {
          const existingAnswerIndex = state.answers.findIndex(a => a.questionId === questionId)
          const newAnswer: QuizAnswer = { questionId, selectedOption, points }
          
          if (existingAnswerIndex >= 0) {
            // Update existing answer
            const updatedAnswers = [...state.answers]
            updatedAnswers[existingAnswerIndex] = newAnswer
            return { answers: updatedAnswers }
          } else {
            // Add new answer
            return { answers: [...state.answers, newAnswer] }
          }
        })
      },
      
      nextQuestion: () => {
        set((state) => ({
          currentQuestionIndex: state.currentQuestionIndex + 1
        }))
      },
      
      previousQuestion: () => {
        set((state) => ({
          currentQuestionIndex: Math.max(0, state.currentQuestionIndex - 1)
        }))
      },
      
      completeQuiz: (result: QuizResult) => {
        set((state) => ({
          isQuizCompleted: true,
          lastResult: result,
          allResults: [...state.allResults, result]
        }))
      },
      
      resetQuiz: () => {
        set({
          currentQuestionIndex: 0,
          answers: [],
          isQuizStarted: false,
          isQuizCompleted: false,
        })
      },
      
      saveResult: (result: QuizResult) => {
        set((state) => ({
          allResults: [...state.allResults, result],
          lastResult: result
        }))
      },
      
      getResultById: (id: string) => {
        const state = get()
        return state.allResults.find(result => 
          result.completedAt.toISOString() === id
        )
      },
      
      deleteResult: (completedAt: Date) => {
        set((state) => ({
          allResults: state.allResults.filter(
            result => result.completedAt.getTime() !== completedAt.getTime()
          )
        }))
      },
      
      clearAllResults: () => {
        set({ allResults: [], lastResult: null })
      },
      
      getQuizStats: () => {
        const state = get()
        const results = state.allResults
        
        if (results.length === 0) {
          return {
            totalQuizzesTaken: 0,
            mostCommonType: null,
            averageCompletionTime: 0,
            typeDistribution: {}
          }
        }
        
        // Calculate type distribution
        const typeDistribution: Record<string, number> = {}
        results.forEach(result => {
          const type = result.rockerType.id
          typeDistribution[type] = (typeDistribution[type] || 0) + 1
        })
        
        // Find most common type
        const mostCommonType = Object.entries(typeDistribution)
          .sort(([,a], [,b]) => b - a)[0]?.[0] || null
        
        // Calculate average completion time (mock calculation)
        const averageCompletionTime = results.length > 0 ? 120 : 0 // 2 minutes average
        
        return {
          totalQuizzesTaken: results.length,
          mostCommonType,
          averageCompletionTime,
          typeDistribution
        }
      },
      
      generateShareUrl: (result: QuizResult) => {
        const baseUrl = window.location.origin
        const resultId = result.completedAt.getTime().toString()
        return `${baseUrl}/quiz/result/${resultId}`
      },
      
      setShareUrl: (completedAt: Date, shareUrl: string) => {
        set((state) => ({
          allResults: state.allResults.map(result => 
            result.completedAt.getTime() === completedAt.getTime()
              ? { ...result, shareUrl }
              : result
          )
        }))
      },
    }),
    {
      name: 'festival-quiz',
      version: 1,
    }
  )
)