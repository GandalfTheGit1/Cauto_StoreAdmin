import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '@/store/rootReducer'

// Basic preferences selector
const selectPreferences = (state: RootState) => state.preferences

// Dashboard preferences
export const selectDashboardPreferences = createSelector(
  [selectPreferences],
  (preferences) => ({
    layout: preferences.dashboardLayout,
    dateRange: preferences.defaultDateRange,
    chartType: preferences.chartType,
    chartTheme: preferences.chartTheme,
  })
)

// Table preferences with memoization
export const selectTablePreferences = createSelector(
  [selectPreferences, (_, tableName: string) => tableName],
  (preferences, tableName) => ({
    pageSize: preferences.tablePageSize,
    columns: preferences.tableColumns[tableName] || [],
    lazyLoad: preferences.lazyLoadTables,
  })
)

// Performance preferences
export const selectPerformancePreferences = createSelector(
  [selectPreferences],
  (preferences) => ({
    enableAnimations: preferences.enableAnimations,
    lazyLoadTables: preferences.lazyLoadTables,
    cacheTimeout: preferences.cacheTimeout,
  })
)

// Search preferences
export const selectSearchPreferences = createSelector(
  [selectPreferences],
  (preferences) => ({
    history: preferences.searchHistory,
    recentFilters: preferences.recentFilters,
  })
)

// Module preferences
export const selectModulePreferences = createSelector(
  [selectPreferences, (_, moduleName: string) => moduleName],
  (preferences, moduleName) => ({
    isFavorite: preferences.favoriteModules.includes(moduleName),
    settings: preferences.moduleSettings[moduleName] || {},
  })
)

// Favorite modules list
export const selectFavoriteModules = createSelector(
  [selectPreferences],
  (preferences) => preferences.favoriteModules
)

// Chart configuration based on preferences
export const selectChartConfiguration = createSelector(
  [selectPreferences, (state: RootState) => state.theme],
  (preferences, theme) => {
    const isDark = theme.mode === 'dark' || 
      (preferences.chartTheme === 'auto' && theme.mode === 'dark') ||
      preferences.chartTheme === 'dark'
    
    return {
      type: preferences.chartType,
      theme: isDark ? 'dark' : 'light',
      animations: preferences.enableAnimations,
      colors: isDark ? 
        ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'] :
        ['#1E40AF', '#059669', '#D97706', '#DC2626', '#7C3AED']
    }
  }
)

// Table configuration based on preferences and theme
export const selectTableConfiguration = createSelector(
  [selectPreferences, (state: RootState) => state.theme, (_, tableName: string) => tableName],
  (preferences, theme, tableName) => ({
    pageSize: preferences.tablePageSize,
    columns: preferences.tableColumns[tableName] || [],
    lazyLoad: preferences.lazyLoadTables,
    isDark: theme.mode === 'dark',
    animations: preferences.enableAnimations,
  })
)

// Recent filters for a specific module
export const selectRecentFiltersForModule = createSelector(
  [selectPreferences, (_, moduleName: string) => moduleName],
  (preferences, moduleName) => preferences.recentFilters[moduleName] || {}
)

// Check if user has customized preferences
export const selectHasCustomPreferences = createSelector(
  [selectPreferences],
  (preferences) => {
    const defaultPrefs = {
      dashboardLayout: 'grid',
      defaultDateRange: '30d',
      tablePageSize: 10,
      chartType: 'line',
      chartTheme: 'auto',
      enableAnimations: true,
      lazyLoadTables: true,
    }
    
    return Object.keys(defaultPrefs).some(key => 
      preferences[key as keyof typeof defaultPrefs] !== defaultPrefs[key as keyof typeof defaultPrefs]
    ) || 
    preferences.favoriteModules.length > 0 ||
    Object.keys(preferences.moduleSettings).length > 0 ||
    preferences.searchHistory.length > 0
  }
)