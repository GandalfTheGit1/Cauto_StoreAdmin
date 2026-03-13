import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '@/store/rootReducer'

// Memoized selectors for expensive computations

// Complex analytics calculations
export const selectAdvancedAnalytics = createSelector(
  [
    (state: RootState) => state.dashboard.salesMetrics,
    (state: RootState) => state.dashboard.revenueData,
    (state: RootState) => state.products,
  ],
  (salesMetrics, revenueData, products) => {
    // Expensive calculations that should be memoized
    const totalRevenue = salesMetrics?.totalRevenue || 0
    const totalOrders = salesMetrics?.totalOrders || 0
    const totalCustomers = salesMetrics?.totalCustomers || 0
    
    // Calculate complex metrics
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
    const customerLifetimeValue = totalCustomers > 0 ? totalRevenue / totalCustomers : 0
    
    // Revenue trend analysis (expensive computation)
    const revenueTrend = revenueData?.length > 1 ? (() => {
      const sortedData = [...(revenueData || [])].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      )
      
      if (sortedData.length < 2) return { trend: 'neutral', rate: 0 }
      
      const firstHalf = sortedData.slice(0, Math.floor(sortedData.length / 2))
      const secondHalf = sortedData.slice(Math.floor(sortedData.length / 2))
      
      const firstHalfAvg = firstHalf.reduce((sum, item) => sum + item.value, 0) / firstHalf.length
      const secondHalfAvg = secondHalf.reduce((sum, item) => sum + item.value, 0) / secondHalf.length
      
      const growthRate = firstHalfAvg > 0 ? ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100 : 0
      
      return {
        trend: growthRate > 5 ? 'up' : growthRate < -5 ? 'down' : 'neutral',
        rate: Math.abs(growthRate)
      }
    })() : { trend: 'neutral', rate: 0 }
    
    // Product performance analysis
    const productMetrics = {
      totalProducts: products.productsSelected.length + products.offersSelected.length,
      cartValue: products.productsSelected.reduce((sum, p) => sum + (p.price * (p.quantity || 1)), 0) +
                 products.offersSelected.reduce((sum, o) => sum + (o.price * (o.quantity || 1)), 0),
      averageProductPrice: products.productsSelected.length > 0 ? 
        products.productsSelected.reduce((sum, p) => sum + p.price, 0) / products.productsSelected.length : 0
    }
    
    return {
      revenue: {
        total: totalRevenue,
        average: averageOrderValue,
        trend: revenueTrend
      },
      customers: {
        total: totalCustomers,
        lifetimeValue: customerLifetimeValue,
        averageOrdersPerCustomer: totalCustomers > 0 ? totalOrders / totalCustomers : 0
      },
      orders: {
        total: totalOrders,
        averageValue: averageOrderValue,
        conversionRate: totalCustomers > 0 ? (totalOrders / totalCustomers) * 100 : 0
      },
      products: productMetrics
    }
  }
)

// Expensive filtering and sorting operations
export const selectFilteredAndSortedData = createSelector(
  [
    (state: RootState, filters: any) => filters,
    (state: RootState) => state.dashboard.revenueData,
    (state: RootState) => state.dashboard.salesData,
  ],
  (filters, revenueData, salesData) => {
    // Expensive filtering and sorting operations
    let filteredRevenue = revenueData || []
    let filteredSales = salesData || []
    
    if (filters.dateRange) {
      const { start, end } = filters.dateRange
      const startDate = new Date(start)
      const endDate = new Date(end)
      
      filteredRevenue = filteredRevenue.filter(item => {
        const itemDate = new Date(item.date)
        return itemDate >= startDate && itemDate <= endDate
      })
      
      filteredSales = filteredSales.filter(item => {
        const itemDate = new Date(item.date)
        return itemDate >= startDate && itemDate <= endDate
      })
    }
    
    if (filters.sortBy) {
      const { field, direction } = filters.sortBy
      const sortMultiplier = direction === 'desc' ? -1 : 1
      
      filteredRevenue.sort((a, b) => {
        const aVal = a[field] || 0
        const bVal = b[field] || 0
        return (aVal - bVal) * sortMultiplier
      })
      
      filteredSales.sort((a, b) => {
        const aVal = a[field] || 0
        const bVal = b[field] || 0
        return (aVal - bVal) * sortMultiplier
      })
    }
    
    return {
      revenue: filteredRevenue,
      sales: filteredSales,
      totalRecords: filteredRevenue.length + filteredSales.length
    }
  }
)

// Aggregated dashboard data with expensive calculations
export const selectDashboardAggregations = createSelector(
  [selectAdvancedAnalytics],
  (analytics) => {
    // Expensive aggregation calculations
    const performanceScore = (() => {
      const revenueScore = Math.min(100, (analytics.revenue.total / 100000) * 100) // Normalize to 100k
      const customerScore = Math.min(100, (analytics.customers.total / 1000) * 100) // Normalize to 1k customers
      const orderScore = Math.min(100, (analytics.orders.total / 5000) * 100) // Normalize to 5k orders
      
      return Math.round((revenueScore + customerScore + orderScore) / 3)
    })()
    
    const healthMetrics = {
      revenue: analytics.revenue.trend.trend === 'up' ? 'healthy' : 
               analytics.revenue.trend.trend === 'down' ? 'warning' : 'stable',
      customers: analytics.customers.lifetimeValue > 100 ? 'healthy' : 
                 analytics.customers.lifetimeValue > 50 ? 'stable' : 'warning',
      orders: analytics.orders.conversionRate > 10 ? 'healthy' : 
              analytics.orders.conversionRate > 5 ? 'stable' : 'warning'
    }
    
    return {
      performanceScore,
      healthMetrics,
      keyInsights: {
        topMetric: analytics.revenue.total > 50000 ? 'revenue' : 
                   analytics.customers.total > 500 ? 'customers' : 'orders',
        improvementArea: healthMetrics.revenue === 'warning' ? 'revenue' :
                        healthMetrics.customers === 'warning' ? 'customers' : 'orders'
      }
    }
  }
)

// Preferences-based selectors
export const selectUserPreferences = (state: RootState) => state.preferences

export const selectTablePreferences = createSelector(
  [selectUserPreferences, (_, tableName: string) => tableName],
  (preferences, tableName) => ({
    pageSize: preferences.tablePageSize,
    columns: preferences.tableColumns[tableName] || [],
    lazyLoad: preferences.lazyLoadTables
  })
)

export const selectChartPreferences = createSelector(
  [selectUserPreferences],
  (preferences) => ({
    type: preferences.chartType,
    theme: preferences.chartTheme,
    animations: preferences.enableAnimations
  })
)

export const selectModulePreferences = createSelector(
  [selectUserPreferences, (_, moduleName: string) => moduleName],
  (preferences, moduleName) => ({
    isFavorite: preferences.favoriteModules.includes(moduleName),
    settings: preferences.moduleSettings[moduleName] || {}
  })
)