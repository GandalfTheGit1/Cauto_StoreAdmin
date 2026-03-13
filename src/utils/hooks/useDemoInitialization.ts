import { useEffect, useState } from 'react'
import appConfig from '@/configs/app.config'
import { seedDemoData, isDemoDataSeeded, getDemoDataStats } from '@/utils/demoDataSeeder'

export interface DemoInitializationState {
  isInitialized: boolean
  isLoading: boolean
  error: string | null
  stats: ReturnType<typeof getDemoDataStats> | null
}

/**
 * Hook for initializing demo data on application startup
 */
export function useDemoInitialization() {
  const [state, setState] = useState<DemoInitializationState>({
    isInitialized: false,
    isLoading: false,
    error: null,
    stats: null
  })

  useEffect(() => {
    if (!appConfig.enableMock) {
      setState(prev => ({ ...prev, isInitialized: true }))
      return
    }

    const initializeDemoData = async () => {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      try {
        // Check if data is already seeded and current
        if (isDemoDataSeeded()) {
          const stats = getDemoDataStats()
          setState({
            isInitialized: true,
            isLoading: false,
            error: null,
            stats
          })
          return
        }

        // Seed fresh demo data
        console.log('🌱 Initializing demo data...')
        const seededData = seedDemoData()
        const stats = getDemoDataStats()
        
        setState({
          isInitialized: true,
          isLoading: false,
          error: null,
          stats
        })
        
        console.log('✅ Demo data initialization complete:', stats)
      } catch (error) {
        console.error('❌ Demo data initialization failed:', error)
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }))
      }
    }

    initializeDemoData()
  }, [])

  return state
}