import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '@/store/rootReducer'

// Cache for expensive selector results
const selectorCache = new Map<string, { result: any; timestamp: number }>()

// Create a cached selector that expires after a certain time
export function createCachedSelector<T>(
  selector: (state: RootState, ...args: any[]) => T,
  cacheKey: string,
  ttl: number = 300000 // 5 minutes default
) {
  return createSelector(
    [selector, (state: RootState) => state.preferences?.cacheTimeout || ttl],
    (result, timeout) => {
      const now = Date.now()
      const cached = selectorCache.get(cacheKey)
      
      if (cached && (now - cached.timestamp) < timeout) {
        return cached.result
      }
      
      selectorCache.set(cacheKey, { result, timestamp: now })
      return result
    }
  )
}

// Debounced selector for frequently changing data
export function createDebouncedSelector<T>(
  selector: (state: RootState, ...args: any[]) => T,
  delay: number = 300
) {
  let timeoutId: NodeJS.Timeout | null = null
  let lastResult: T
  
  return createSelector([selector], (result) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    timeoutId = setTimeout(() => {
      lastResult = result
    }, delay)
    
    return lastResult || result
  })
}

// Batch selector updates to reduce re-renders
export function createBatchedSelector<T>(
  selectors: Array<(state: RootState) => any>,
  combiner: (...results: any[]) => T
) {
  return createSelector(selectors, (...results) => {
    // Use requestAnimationFrame to batch updates
    return new Promise<T>((resolve) => {
      requestAnimationFrame(() => {
        resolve(combiner(...results))
      })
    })
  })
}

// Memoized selector with custom equality check
export function createMemoizedSelector<T>(
  selector: (state: RootState, ...args: any[]) => T,
  equalityFn?: (a: T, b: T) => boolean
) {
  let lastResult: T
  let lastArgs: any[]
  
  return createSelector([selector], (result) => {
    if (equalityFn && lastResult !== undefined) {
      if (equalityFn(result, lastResult)) {
        return lastResult
      }
    } else if (result === lastResult) {
      return lastResult
    }
    
    lastResult = result
    return result
  })
}

// Selector for paginated data with performance optimization
export function createPaginatedSelector<T>(
  dataSelector: (state: RootState) => T[],
  pageSize: number = 10
) {
  return createSelector(
    [
      dataSelector,
      (state: RootState, page: number) => page,
      (state: RootState) => state.preferences?.tablePageSize || pageSize
    ],
    (data, page, preferredPageSize) => {
      const actualPageSize = preferredPageSize || pageSize
      const startIndex = (page - 1) * actualPageSize
      const endIndex = startIndex + actualPageSize
      
      return {
        items: data.slice(startIndex, endIndex),
        totalItems: data.length,
        totalPages: Math.ceil(data.length / actualPageSize),
        currentPage: page,
        pageSize: actualPageSize,
        hasNextPage: endIndex < data.length,
        hasPreviousPage: page > 1
      }
    }
  )
}

// Clear selector cache
export function clearSelectorCache(pattern?: string) {
  if (pattern) {
    const regex = new RegExp(pattern)
    for (const key of selectorCache.keys()) {
      if (regex.test(key)) {
        selectorCache.delete(key)
      }
    }
  } else {
    selectorCache.clear()
  }
}

// Get cache statistics
export function getCacheStats() {
  return {
    size: selectorCache.size,
    keys: Array.from(selectorCache.keys()),
    totalMemory: JSON.stringify(Array.from(selectorCache.values())).length
  }
}

// Selector performance monitoring
export function createMonitoredSelector<T>(
  selector: (state: RootState, ...args: any[]) => T,
  name: string
) {
  return createSelector([selector], (result) => {
    const start = performance.now()
    const finalResult = result
    const end = performance.now()
    
    if (end - start > 10) { // Log if selector takes more than 10ms
      console.warn(`Slow selector "${name}" took ${end - start}ms`)
    }
    
    return finalResult
  })
}