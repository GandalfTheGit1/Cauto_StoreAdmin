import { Middleware } from '@reduxjs/toolkit'
import type { RootState } from '@/store/rootReducer'

// Performance monitoring middleware
export const performanceMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
  const start = performance.now()
  
  // Execute the action
  const result = next(action)
  
  const end = performance.now()
  const duration = end - start
  
  // Log slow actions (> 50ms)
  if (duration > 50) {
    console.warn(`Slow action "${action.type}" took ${duration.toFixed(2)}ms`)
  }
  
  // Track action performance in development
  if (process.env.NODE_ENV === 'development') {
    const state = store.getState()
    
    // Store performance metrics in preferences if available
    if (state.preferences && duration > 100) {
      // Could dispatch an action to track slow operations
      console.group(`Performance Warning: ${action.type}`)
      console.log(`Duration: ${duration.toFixed(2)}ms`)
      console.log('Action:', action)
      console.log('State size:', JSON.stringify(state).length)
      console.groupEnd()
    }
  }
  
  return result
}

// Cache invalidation middleware
export const cacheInvalidationMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
  const result = next(action)
  
  // Define which actions should invalidate which caches
  const cacheInvalidationMap: Record<string, string[]> = {
    // Auth actions
    'auth/signIn': ['user-profile', 'user-permissions'],
    'auth/signOut': ['*'], // Invalidate all caches on logout
    
    // Dashboard actions
    'dashboard/updateSalesMetrics': ['analytics-overview', 'chart-data', 'analytics-trends'],
    'dashboard/updateRevenueData': ['chart-data', 'analytics-trends'],
    
    // Product actions
    'products/addProduct': ['cart-summary', 'inventory-analytics'],
    'products/removeProduct': ['cart-summary', 'inventory-analytics'],
    'products/updateQuantity': ['cart-summary', 'inventory-analytics'],
    
    // Preferences actions
    'preferences/setTablePageSize': ['table-*'],
    'preferences/setCacheTimeout': ['*'],
  }
  
  const cachesToInvalidate = cacheInvalidationMap[action.type] || []
  
  if (cachesToInvalidate.length > 0) {
    // Import cache clearing function dynamically to avoid circular dependencies
    import('../utils/performanceUtils').then(({ clearSelectorCache }) => {
      cachesToInvalidate.forEach(pattern => {
        if (pattern === '*') {
          clearSelectorCache()
        } else {
          clearSelectorCache(pattern)
        }
      })
    })
  }
  
  return result
}

// Memory usage monitoring middleware
export const memoryMonitoringMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
  const result = next(action)
  
  // Monitor memory usage in development
  if (process.env.NODE_ENV === 'development' && 'memory' in performance) {
    const memInfo = (performance as any).memory
    const state = store.getState()
    const stateSize = JSON.stringify(state).length
    
    // Warn if state is getting too large (> 10MB)
    if (stateSize > 10 * 1024 * 1024) {
      console.warn(`Large state detected: ${(stateSize / 1024 / 1024).toFixed(2)}MB`)
    }
    
    // Warn if heap usage is high
    if (memInfo.usedJSHeapSize > 100 * 1024 * 1024) { // 100MB
      console.warn(`High memory usage: ${(memInfo.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`)
    }
  }
  
  return result
}

// Batch action middleware for performance
export const batchActionMiddleware: Middleware<{}, RootState> = (store) => {
  let batchedActions: any[] = []
  let batchTimeout: NodeJS.Timeout | null = null
  
  return (next) => (action) => {
    // Check if this is a batchable action
    const batchableActions = [
      'products/updateQuantity',
      'dashboard/updateMetric',
      'preferences/setModuleSetting'
    ]
    
    if (batchableActions.some(type => action.type.startsWith(type))) {
      batchedActions.push(action)
      
      if (batchTimeout) {
        clearTimeout(batchTimeout)
      }
      
      batchTimeout = setTimeout(() => {
        // Process all batched actions at once
        const actions = [...batchedActions]
        batchedActions = []
        
        actions.forEach(batchedAction => {
          next(batchedAction)
        })
        
        batchTimeout = null
      }, 16) // Batch within one frame (16ms)
      
      return action // Return the action but don't process it yet
    }
    
    return next(action)
  }
}

// State persistence optimization middleware
export const persistenceOptimizationMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
  const result = next(action)
  
  // Only persist certain actions to reduce storage writes
  const persistableActions = [
    'auth/',
    'theme/',
    'locale/',
    'preferences/',
  ]
  
  const shouldPersist = persistableActions.some(prefix => action.type.startsWith(prefix))
  
  if (shouldPersist) {
    // Debounce persistence to avoid too frequent writes
    const debouncedPersist = debounce(() => {
      // The redux-persist middleware will handle the actual persistence
      // This is just for optimization tracking
    }, 1000)
    
    debouncedPersist()
  }
  
  return result
}

// Utility function for debouncing
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    
    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}