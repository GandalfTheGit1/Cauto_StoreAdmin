import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '@/store/rootReducer'

// Basic selectors
const selectDashboard = (state: RootState) => state.dashboard

// Memoized selectors for sales analytics
export const selectSalesMetrics = createSelector(
  [selectDashboard],
  (dashboard) => dashboard.salesMetrics || {}
)

export const selectRevenueData = createSelector(
  [selectDashboard],
  (dashboard) => dashboard.revenueData || []
)

export const selectTopProducts = createSelector(
  [selectDashboard],
  (dashboard) => dashboard.topProducts || []
)

export const selectSalesGrowth = createSelector(
  [selectSalesMetrics],
  (metrics) => {
    const currentRevenue = metrics.totalRevenue || 0
    const previousRevenue = metrics.previousRevenue || 0
    
    if (previousRevenue === 0) return 0
    
    return ((currentRevenue - previousRevenue) / previousRevenue) * 100
  }
)

export const selectSalesTrends = createSelector(
  [selectRevenueData],
  (revenueData) => {
    if (!revenueData.length) return { trend: 'neutral', percentage: 0 }
    
    const recent = revenueData.slice(-7) // Last 7 data points
    if (recent.length < 2) return { trend: 'neutral', percentage: 0 }
    
    const firstValue = recent[0].value
    const lastValue = recent[recent.length - 1].value
    
    const percentage = ((lastValue - firstValue) / firstValue) * 100
    const trend = percentage > 5 ? 'up' : percentage < -5 ? 'down' : 'neutral'
    
    return { trend, percentage: Math.abs(percentage) }
  }
)

export const selectDashboardSummary = createSelector(
  [selectSalesMetrics, selectSalesGrowth, selectSalesTrends],
  (metrics, growth, trends) => ({
    totalRevenue: metrics.totalRevenue || 0,
    totalOrders: metrics.totalOrders || 0,
    averageOrderValue: metrics.averageOrderValue || 0,
    growth,
    trends,
  })
)