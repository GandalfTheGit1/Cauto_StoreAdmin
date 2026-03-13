import { useState, useEffect } from 'react'
import appConfig from '@/configs/app.config'

const TOUR_STORAGE_KEY = 'elstar-demo-tour-completed'
const TOUR_VERSION = '1.0.0'

export interface UseDemoTourReturn {
  shouldShowTour: boolean
  isTourOpen: boolean
  startTour: () => void
  closeTour: () => void
  completeTour: () => void
  resetTour: () => void
  hasTourBeenCompleted: boolean
}

/**
 * Hook for managing demo tour state and persistence
 */
export function useDemoTour(): UseDemoTourReturn {
  const [isTourOpen, setIsTourOpen] = useState(false)
  const [hasTourBeenCompleted, setHasTourBeenCompleted] = useState(false)

  useEffect(() => {
    if (!appConfig.enableMock) return

    // Check if tour has been completed
    const checkTourStatus = () => {
      try {
        const stored = localStorage.getItem(TOUR_STORAGE_KEY)
        if (stored) {
          const data = JSON.parse(stored)
          const isCompleted = data.version === TOUR_VERSION && data.completed
          setHasTourBeenCompleted(isCompleted)
          
          // Auto-start tour for new users
          if (!isCompleted) {
            // Delay to allow app to fully load
            setTimeout(() => {
              setIsTourOpen(true)
            }, 1500)
          }
        } else {
          // First time user - start tour after delay
          setTimeout(() => {
            setIsTourOpen(true)
          }, 1500)
        }
      } catch (error) {
        console.warn('Could not check tour status:', error)
      }
    }

    checkTourStatus()
  }, [])

  const startTour = () => {
    setIsTourOpen(true)
  }

  const closeTour = () => {
    setIsTourOpen(false)
  }

  const completeTour = () => {
    try {
      localStorage.setItem(TOUR_STORAGE_KEY, JSON.stringify({
        completed: true,
        version: TOUR_VERSION,
        completedAt: Date.now()
      }))
      setHasTourBeenCompleted(true)
      setIsTourOpen(false)
      console.log('✅ Demo tour completed')
    } catch (error) {
      console.warn('Could not save tour completion status:', error)
    }
  }

  const resetTour = () => {
    try {
      localStorage.removeItem(TOUR_STORAGE_KEY)
      setHasTourBeenCompleted(false)
      console.log('🔄 Demo tour reset')
    } catch (error) {
      console.warn('Could not reset tour status:', error)
    }
  }

  return {
    shouldShowTour: appConfig.enableMock && !hasTourBeenCompleted,
    isTourOpen,
    startTour,
    closeTour,
    completeTour,
    resetTour,
    hasTourBeenCompleted
  }
}