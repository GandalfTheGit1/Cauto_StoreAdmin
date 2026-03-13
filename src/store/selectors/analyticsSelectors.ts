import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '@/store/rootReducer'
import { createCachedSelector, createMemoizedSelector } from '../utils/performanceUtils'

// Analytics selectors that combine data from multiple slices
export const selectAnalyticsOverview = createCachedSelector(
  createSelector(
    [
      (state: RootState) => state.dashboard,
      (state: RootState) => state.products,
    ],
    (dashboard, products) => {
      const salesMetrics = dashboard.salesMetrics || {}
      const cartSummary = {
        itemCount: products.productsSelected.length + products.offersSelected.length,
        total: products.productsSelected.reduce((sum, p) => sum + (p.price * (p.quantity || 1)), 0) +
               products.offersSelected.reduce((sum, o) => sum + (o.price * (o.quantity || 1)), 0)
      }
      
      return {
        revenue: salesMetrics.totalRevenue || 0,
        orders: salesMetrics.totalOrders || 0,
        products: salesMetrics.totalProducts || 0,
        customers: salesMetrics.totalCustomers || 0,
        cartValue: cartSummary.total,
        cartItems: cartSummary.itemCount,
      }
    }
  ),
  'analytics-overview',
  180000 // 3 minutes cache
)

export const selectPerformanceMetrics = createMemoizedSelector(
  createSelector(
    [selectAnalyticsOverview],
    (overview) => {
      const averageOrderValue = overview.orders > 0 ? overview.revenue / overview.orders : 0
      const revenuePerCustomer = overview.customers > 0 ? overview.revenue / overview.customers : 0
      
      return {
        averageOrderValue,
        revenuePerCustomer,
        conversionRate: overview.customers > 0 ? (overview.orders / overview.customers) * 100 : 0,
      }
    }
  ),
  // Custom equality check for performance metrics
  (a, b) => Math.abs(a.averageOrderValue - b.averageOrderValue) < 0.01 &&
            Math.abs(a.revenuePerCustomer - b.revenuePerCustomer) < 0.01 &&
            Math.abs(a.conversionRate - b.conversionRate) < 0.01
)

export const selectChartData = createCachedSelector(
  createSelector(
    [(state: RootState) => state.dashboard],
    (dashboard) => {
      return {
        revenue: dashboard.revenueData || [],
        sales: dashboard.salesData || [],
        products: dashboard.productData || [],
      }
    }
  ),
  'chart-data',
  120000 // 2 minutes cache for chart data
)

// Enhanced analytics with trend analysis
export const selectAnalyticsTrends = createCachedSelector(
  createSelector(
    [selectChartData],
    (chartData) => {
      const calculateTrend = (data: any[]) => {
        if (data.length < 2) return { trend: 'neutral', percentage: 0 }
        
        const recent = data.slice(-7) // Last 7 data points
        if (recent.length < 2) return { trend: 'neutral', percentage: 0 }
        
        const firstValue = recent[0].value || 0
        const lastValue = recent[recent.length - 1].value || 0
        
        if (firstValue === 0) return { trend: 'neutral', percentage: 0 }
        
        const percentage = ((lastValue - firstValue) / firstValue) * 100
        const trend = percentage > 5 ? 'up' : percentage < -5 ? 'down' : 'neutral'
        
        return { trend, percentage: Math.abs(percentage) }
      }
      
      return {
        revenue: calculateTrend(chartData.revenue),
        sales: calculateTrend(chartData.sales),
        products: calculateTrend(chartData.products),
      }
    }
  ),
  'analytics-trends',
  300000 // 5 minutes cache for trends
)