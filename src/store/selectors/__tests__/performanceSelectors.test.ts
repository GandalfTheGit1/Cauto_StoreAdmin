import { describe, it, expect, vi } from 'vitest'
import { 
  selectUserPreferences,
  selectTablePreferences,
  selectChartPreferences,
  selectModulePreferences
} from '../performanceSelectors'

// Mock Redux Toolkit's createSelector for the complex selectors
vi.mock('@reduxjs/toolkit', () => ({
  createSelector: vi.fn((selectors, combiner) => {
    return (...args: any[]) => {
      const results = selectors.map((selector: any) => 
        typeof selector === 'function' ? selector(...args) : selector
      )
      return combiner(...results)
    }
  })
}))

describe('performanceSelectors', () => {
  const mockState = {
    preferences: {
      tablePageSize: 25,
      tableColumns: {
        products: ['name', 'price', 'stock'],
        orders: ['id', 'customer', 'total']
      },
      lazyLoadTables: true,
      chartType: 'line',
      chartTheme: 'dark',
      enableAnimations: true,
      favoriteModules: ['dashboard', 'products'],
      moduleSettings: {
        dashboard: { autoRefresh: true, refreshInterval: 30000 },
        products: { showImages: true, compactView: false }
      },
      cacheTimeout: 300000
    },
    dashboard: {
      salesMetrics: {
        totalRevenue: 150000,
        totalOrders: 1200,
        totalCustomers: 800
      },
      revenueData: [
        { date: '2024-01-01', value: 10000 },
        { date: '2024-01-02', value: 12000 },
        { date: '2024-01-03', value: 15000 }
      ],
      salesData: []
    },
    products: {
      productsSelected: [
        { id: 1, name: 'Product 1', price: 100, quantity: 2 },
        { id: 2, name: 'Product 2', price: 200, quantity: 1 }
      ],
      offersSelected: [
        { id: 1, name: 'Offer 1', price: 50, quantity: 1 }
      ]
    }
  } as any

  describe('selectUserPreferences', () => {
    it('should return user preferences from state', () => {
      const result = selectUserPreferences(mockState)
      
      expect(result).toEqual(mockState.preferences)
    })

    it('should handle missing preferences', () => {
      const stateWithoutPrefs = { ...mockState, preferences: undefined }
      const result = selectUserPreferences(stateWithoutPrefs)
      
      expect(result).toBeUndefined()
    })
  })

  describe('selectTablePreferences', () => {
    it('should return table preferences for existing table', () => {
      const result = selectTablePreferences(mockState, 'products')
      
      expect(result).toEqual({
        pageSize: 25,
        columns: ['name', 'price', 'stock'],
        lazyLoad: true
      })
    })

    it('should return empty columns for non-existing table', () => {
      const result = selectTablePreferences(mockState, 'nonexistent')
      
      expect(result).toEqual({
        pageSize: 25,
        columns: [],
        lazyLoad: true
      })
    })

    it('should handle missing table columns config', () => {
      const stateWithoutColumns = {
        ...mockState,
        preferences: {
          ...mockState.preferences,
          tableColumns: {}
        }
      }
      
      const result = selectTablePreferences(stateWithoutColumns, 'products')
      
      expect(result.columns).toEqual([])
    })
  })

  describe('selectChartPreferences', () => {
    it('should return chart preferences', () => {
      const result = selectChartPreferences(mockState)
      
      expect(result).toEqual({
        type: 'line',
        theme: 'dark',
        animations: true
      })
    })

    it('should handle missing chart preferences', () => {
      const stateWithoutChartPrefs = {
        ...mockState,
        preferences: {
          ...mockState.preferences,
          chartType: undefined,
          chartTheme: undefined,
          enableAnimations: undefined
        }
      }
      
      const result = selectChartPreferences(stateWithoutChartPrefs)
      
      expect(result).toEqual({
        type: undefined,
        theme: undefined,
        animations: undefined
      })
    })
  })

  describe('selectModulePreferences', () => {
    it('should return module preferences for favorite module', () => {
      const result = selectModulePreferences(mockState, 'dashboard')
      
      expect(result).toEqual({
        isFavorite: true,
        settings: { autoRefresh: true, refreshInterval: 30000 }
      })
    })

    it('should return module preferences for non-favorite module', () => {
      const result = selectModulePreferences(mockState, 'analytics')
      
      expect(result).toEqual({
        isFavorite: false,
        settings: {}
      })
    })

    it('should handle module with settings but not favorite', () => {
      const result = selectModulePreferences(mockState, 'products')
      
      expect(result).toEqual({
        isFavorite: true,
        settings: { showImages: true, compactView: false }
      })
    })

    it('should handle missing module settings', () => {
      const stateWithoutModuleSettings = {
        ...mockState,
        preferences: {
          ...mockState.preferences,
          moduleSettings: {}
        }
      }
      
      const result = selectModulePreferences(stateWithoutModuleSettings, 'dashboard')
      
      expect(result.settings).toEqual({})
    })

    it('should handle missing favorite modules array', () => {
      const stateWithoutFavorites = {
        ...mockState,
        preferences: {
          ...mockState.preferences,
          favoriteModules: []
        }
      }
      
      const result = selectModulePreferences(stateWithoutFavorites, 'dashboard')
      
      expect(result.isFavorite).toBe(false)
    })
  })
})