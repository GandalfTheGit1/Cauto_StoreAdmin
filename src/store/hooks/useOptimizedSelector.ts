import { useSelector, shallowEqual } from 'react-redux'
import { useMemo, useRef, useCallback } from 'react'
import type { RootState } from '@/store/rootReducer'

// Hook for using selectors with performance optimizations
export function useOptimizedSelector<T>(
  selector: (state: RootState) => T,
  equalityFn?: (left: T, right: T) => boolean
) {
  return useSelector(selector, equalityFn || shallowEqual)
}

// Hook for memoized selectors with dependencies
export function useMemoizedSelector<T, Args extends any[]>(
  selectorFactory: (...args: Args) => (state: RootState) => T,
  deps: Args,
  equalityFn?: (left: T, right: T) => boolean
) {
  const selector = useMemo(
    () => selectorFactory(...deps),
    deps
  )
  
  return useSelector(selector, equalityFn || shallowEqual)
}

// Hook for cached selectors with automatic cache invalidation
export function useCachedSelector<T>(
  selector: (state: RootState) => T,
  cacheKey: string,
  ttl: number = 300000, // 5 minutes default
  equalityFn?: (left: T, right: T) => boolean
) {
  const cacheRef = useRef<{ result: T; timestamp: number } | null>(null)
  
  const cachedSelector = useCallback((state: RootState) => {
    const now = Date.now()
    const cached = cacheRef.current
    
    if (cached && (now - cached.timestamp) < ttl) {
      return cached.result
    }
    
    const result = selector(state)
    cacheRef.current = { result, timestamp: now }
    return result
  }, [selector, ttl])
  
  return useSelector(cachedSelector, equalityFn || shallowEqual)
}

// Hook for debounced selectors
export function useDebouncedSelector<T>(
  selector: (state: RootState) => T,
  delay: number = 300,
  equalityFn?: (left: T, right: T) => boolean
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastResultRef = useRef<T>()
  
  const debouncedSelector = useCallback((state: RootState) => {
    const result = selector(state)
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    timeoutRef.current = setTimeout(() => {
      lastResultRef.current = result
    }, delay)
    
    return lastResultRef.current !== undefined ? lastResultRef.current : result
  }, [selector, delay])
  
  return useSelector(debouncedSelector, equalityFn || shallowEqual)
}

// Hook for performance monitoring of selectors
export function useMonitoredSelector<T>(
  selector: (state: RootState) => T,
  name: string,
  equalityFn?: (left: T, right: T) => boolean
) {
  const monitoredSelector = useCallback((state: RootState) => {
    const start = performance.now()
    const result = selector(state)
    const end = performance.now()
    
    if (end - start > 10) { // Log if selector takes more than 10ms
      console.warn(`Slow selector "${name}" took ${end - start}ms`)
    }
    
    return result
  }, [selector, name])
  
  return useSelector(monitoredSelector, equalityFn || shallowEqual)
}

// Hook for batch selector updates
export function useBatchedSelectors<T extends Record<string, any>>(
  selectors: { [K in keyof T]: (state: RootState) => T[K] },
  equalityFn?: (left: T, right: T) => boolean
) {
  const batchedSelector = useCallback((state: RootState) => {
    const result = {} as T
    
    // Use requestAnimationFrame to batch updates
    requestAnimationFrame(() => {
      Object.keys(selectors).forEach(key => {
        result[key as keyof T] = selectors[key as keyof T](state)
      })
    })
    
    return result
  }, [selectors])
  
  return useSelector(batchedSelector, equalityFn || shallowEqual)
}

// Hook for conditional selectors (only run when condition is met)
export function useConditionalSelector<T>(
  selector: (state: RootState) => T,
  condition: (state: RootState) => boolean,
  fallback: T,
  equalityFn?: (left: T, right: T) => boolean
) {
  const conditionalSelector = useCallback((state: RootState) => {
    if (condition(state)) {
      return selector(state)
    }
    return fallback
  }, [selector, condition, fallback])
  
  return useSelector(conditionalSelector, equalityFn || shallowEqual)
}

// Hook for paginated data selection
export function usePaginatedSelector<T>(
  dataSelector: (state: RootState) => T[],
  page: number,
  pageSize?: number,
  equalityFn?: (left: any, right: any) => boolean
) {
  const paginatedSelector = useCallback((state: RootState) => {
    const data = dataSelector(state)
    const actualPageSize = pageSize || state.preferences?.tablePageSize || 10
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
  }, [dataSelector, page, pageSize])
  
  return useSelector(paginatedSelector, equalityFn || shallowEqual)
}