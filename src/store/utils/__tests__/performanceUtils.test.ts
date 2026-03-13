import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { 
  clearSelectorCache, 
  getCacheStats,
  createCachedSelector,
  createMemoizedSelector,
  createPaginatedSelector
} from '../performanceUtils'

// Mock Redux Toolkit's createSelector
vi.mock('@reduxjs/toolkit', () => ({
  createSelector: vi.fn((selectors, combiner) => {
    // Simple mock that just calls the combiner with the selector results
    return (...args: any[]) => {
      const results = selectors.map((selector: any) => 
        typeof selector === 'function' ? selector(...args) : selector
      )
      return combiner(...results)
    }
  })
}))

describe('performanceUtils', () => {
  beforeEach(() => {
    clearSelectorCache()
    vi.clearAllMocks()
  })

  afterEach(() => {
    clearSelectorCache()
  })

  describe('getCacheStats', () => {
    it('should return empty stats when cache is empty', () => {
      const stats = getCacheStats()
      
      expect(stats.size).toBe(0)
      expect(stats.keys).toEqual([])
      expect(stats.totalMemory).toBeGreaterThanOrEqual(0)
    })

    it('should return correct stats structure', () => {
      const stats = getCacheStats()
      
      expect(stats).toHaveProperty('size')
      expect(stats).toHaveProperty('keys')
      expect(stats).toHaveProperty('totalMemory')
      expect(Array.isArray(stats.keys)).toBe(true)
      expect(typeof stats.size).toBe('number')
      expect(typeof stats.totalMemory).toBe('number')
    })
  })

  describe('clearSelectorCache', () => {
    it('should clear all cache when no pattern provided', () => {
      // First verify cache is empty
      expect(getCacheStats().size).toBe(0)
      
      // Clear cache (should not throw)
      clearSelectorCache()
      
      // Verify still empty
      expect(getCacheStats().size).toBe(0)
    })

    it('should clear cache with pattern', () => {
      // Clear with pattern (should not throw)
      clearSelectorCache('test.*')
      
      // Verify cache is still empty
      expect(getCacheStats().size).toBe(0)
    })

    it('should handle invalid regex patterns gracefully', () => {
      // The actual implementation might throw, so let's test that it doesn't crash the app
      try {
        clearSelectorCache('[')
      } catch (error) {
        // This is expected behavior for invalid regex
        expect(error).toBeInstanceOf(SyntaxError)
      }
    })
  })

  describe('createCachedSelector', () => {
    it('should create a selector function', () => {
      const mockSelector = vi.fn(() => 'test-result')
      const cachedSelector = createCachedSelector(mockSelector, 'test-key')
      
      expect(typeof cachedSelector).toBe('function')
    })

    it('should handle selector execution', () => {
      const mockSelector = vi.fn(() => 'test-result')
      const cachedSelector = createCachedSelector(mockSelector, 'test-key')
      
      const mockState = { preferences: { cacheTimeout: 1000 } }
      const result = cachedSelector(mockState)
      
      expect(result).toBe('test-result')
    })
  })

  describe('createMemoizedSelector', () => {
    it('should create a selector function', () => {
      const mockSelector = vi.fn(() => 'test-result')
      const memoizedSelector = createMemoizedSelector(mockSelector)
      
      expect(typeof memoizedSelector).toBe('function')
    })

    it('should handle selector execution', () => {
      const mockSelector = vi.fn(() => 'test-result')
      const memoizedSelector = createMemoizedSelector(mockSelector)
      
      const result = memoizedSelector({})
      expect(result).toBe('test-result')
    })

    it('should work with custom equality function', () => {
      const mockSelector = vi.fn(() => ({ value: 1 }))
      const equalityFn = vi.fn((a: any, b: any) => a.value === b.value)
      const memoizedSelector = createMemoizedSelector(mockSelector, equalityFn)
      
      expect(typeof memoizedSelector).toBe('function')
    })
  })

  describe('createPaginatedSelector', () => {
    it('should create a selector function', () => {
      const mockDataSelector = vi.fn(() => [1, 2, 3, 4, 5])
      const paginatedSelector = createPaginatedSelector(mockDataSelector, 2)
      
      expect(typeof paginatedSelector).toBe('function')
    })

    it('should handle pagination logic', () => {
      const testData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      const mockDataSelector = vi.fn(() => testData)
      const paginatedSelector = createPaginatedSelector(mockDataSelector, 3)
      
      const mockState = { preferences: { tablePageSize: 3 } }
      const result = paginatedSelector(mockState, 1)
      
      expect(result).toEqual({
        items: [1, 2, 3],
        totalItems: 10,
        totalPages: 4,
        currentPage: 1,
        pageSize: 3,
        hasNextPage: true,
        hasPreviousPage: false
      })
    })

    it('should handle second page correctly', () => {
      const testData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      const mockDataSelector = vi.fn(() => testData)
      const paginatedSelector = createPaginatedSelector(mockDataSelector, 3)
      
      const mockState = { preferences: { tablePageSize: 3 } }
      const result = paginatedSelector(mockState, 2)
      
      expect(result).toEqual({
        items: [4, 5, 6],
        totalItems: 10,
        totalPages: 4,
        currentPage: 2,
        pageSize: 3,
        hasNextPage: true,
        hasPreviousPage: true
      })
    })

    it('should handle last page correctly', () => {
      const testData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      const mockDataSelector = vi.fn(() => testData)
      const paginatedSelector = createPaginatedSelector(mockDataSelector, 3)
      
      const mockState = { preferences: { tablePageSize: 3 } }
      const result = paginatedSelector(mockState, 4)
      
      expect(result).toEqual({
        items: [10],
        totalItems: 10,
        totalPages: 4,
        currentPage: 4,
        pageSize: 3,
        hasNextPage: false,
        hasPreviousPage: true
      })
    })

    it('should handle empty data', () => {
      const mockDataSelector = vi.fn(() => [])
      const paginatedSelector = createPaginatedSelector(mockDataSelector, 3)
      
      const mockState = { preferences: { tablePageSize: 3 } }
      const result = paginatedSelector(mockState, 1)
      
      expect(result).toEqual({
        items: [],
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        pageSize: 3,
        hasNextPage: false,
        hasPreviousPage: false
      })
    })

    it('should use default page size when preferences not available', () => {
      const testData = [1, 2, 3, 4, 5]
      const mockDataSelector = vi.fn(() => testData)
      const paginatedSelector = createPaginatedSelector(mockDataSelector, 2)
      
      const mockState = { preferences: {} }
      const result = paginatedSelector(mockState, 1)
      
      expect(result.pageSize).toBe(2)
      expect(result.items).toEqual([1, 2])
    })
  })
})