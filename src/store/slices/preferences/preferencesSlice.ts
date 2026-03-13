import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface UserPreferences {
  // Dashboard preferences
  dashboardLayout: 'grid' | 'list'
  defaultDateRange: '7d' | '30d' | '90d' | '1y'
  
  // Table preferences
  tablePageSize: number
  tableColumns: Record<string, string[]>
  
  // Chart preferences
  chartType: 'line' | 'bar' | 'area'
  chartTheme: 'light' | 'dark' | 'auto'
  
  // Search preferences
  searchHistory: string[]
  recentFilters: Record<string, any>
  
  // Module preferences
  favoriteModules: string[]
  moduleSettings: Record<string, any>
  
  // Performance preferences
  enableAnimations: boolean
  lazyLoadTables: boolean
  cacheTimeout: number
}

export const initialState: UserPreferences = {
  dashboardLayout: 'grid',
  defaultDateRange: '30d',
  tablePageSize: 10,
  tableColumns: {},
  chartType: 'line',
  chartTheme: 'auto',
  searchHistory: [],
  recentFilters: {},
  favoriteModules: [],
  moduleSettings: {},
  enableAnimations: true,
  lazyLoadTables: true,
  cacheTimeout: 300000, // 5 minutes
}

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setDashboardLayout: (state, action: PayloadAction<'grid' | 'list'>) => {
      state.dashboardLayout = action.payload
    },
    
    setDefaultDateRange: (state, action: PayloadAction<'7d' | '30d' | '90d' | '1y'>) => {
      state.defaultDateRange = action.payload
    },
    
    setTablePageSize: (state, action: PayloadAction<number>) => {
      state.tablePageSize = Math.max(5, Math.min(100, action.payload))
    },
    
    setTableColumns: (state, action: PayloadAction<{ table: string; columns: string[] }>) => {
      state.tableColumns[action.payload.table] = action.payload.columns
    },
    
    setChartType: (state, action: PayloadAction<'line' | 'bar' | 'area'>) => {
      state.chartType = action.payload
    },
    
    setChartTheme: (state, action: PayloadAction<'light' | 'dark' | 'auto'>) => {
      state.chartTheme = action.payload
    },
    
    addSearchHistory: (state, action: PayloadAction<string>) => {
      const query = action.payload.trim()
      if (query && !state.searchHistory.includes(query)) {
        state.searchHistory.unshift(query)
        // Keep only last 10 searches
        state.searchHistory = state.searchHistory.slice(0, 10)
      }
    },
    
    clearSearchHistory: (state) => {
      state.searchHistory = []
    },
    
    setRecentFilter: (state, action: PayloadAction<{ key: string; filter: any }>) => {
      state.recentFilters[action.payload.key] = action.payload.filter
    },
    
    clearRecentFilters: (state) => {
      state.recentFilters = {}
    },
    
    toggleFavoriteModule: (state, action: PayloadAction<string>) => {
      const module = action.payload
      const index = state.favoriteModules.indexOf(module)
      if (index >= 0) {
        state.favoriteModules.splice(index, 1)
      } else {
        state.favoriteModules.push(module)
      }
    },
    
    setModuleSetting: (state, action: PayloadAction<{ module: string; setting: string; value: any }>) => {
      if (!state.moduleSettings[action.payload.module]) {
        state.moduleSettings[action.payload.module] = {}
      }
      state.moduleSettings[action.payload.module][action.payload.setting] = action.payload.value
    },
    
    setEnableAnimations: (state, action: PayloadAction<boolean>) => {
      state.enableAnimations = action.payload
    },
    
    setLazyLoadTables: (state, action: PayloadAction<boolean>) => {
      state.lazyLoadTables = action.payload
    },
    
    setCacheTimeout: (state, action: PayloadAction<number>) => {
      state.cacheTimeout = Math.max(60000, action.payload) // Minimum 1 minute
    },
    
    resetPreferences: () => initialState,
  },
})

export const {
  setDashboardLayout,
  setDefaultDateRange,
  setTablePageSize,
  setTableColumns,
  setChartType,
  setChartTheme,
  addSearchHistory,
  clearSearchHistory,
  setRecentFilter,
  clearRecentFilters,
  toggleFavoriteModule,
  setModuleSetting,
  setEnableAnimations,
  setLazyLoadTables,
  setCacheTimeout,
  resetPreferences,
} = preferencesSlice.actions

export type PreferencesState = UserPreferences

const preferencesReducer = preferencesSlice.reducer
export { preferencesReducer }
export default preferencesReducer 