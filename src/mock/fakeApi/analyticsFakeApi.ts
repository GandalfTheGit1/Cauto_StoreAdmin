import type { Server } from 'miragejs'

export default function analyticsFakeApi(server: Server, apiPrefix: string) {
  // Analytics dashboard endpoint
  server.post(`${apiPrefix}/analytics/dashboard`, schema => {
    return schema.db.analyticsDashboardData[0]
  })

  // Performance metrics endpoint
  server.get(`${apiPrefix}/analytics/performance`, schema => {
    return schema.db.performanceMetrics[0]
  })

  // Forecast data endpoint
  server.get(`${apiPrefix}/analytics/forecast`, schema => {
    return schema.db.forecastData[0]
  })

  // Revenue analytics with date range filtering
  server.post(`${apiPrefix}/analytics/revenue`, (schema, { requestBody }) => {
    const body = JSON.parse(requestBody)
    const { startDate, endDate, timeframe } = body
    
    // Return analytics data (in real implementation, would filter by date range)
    const analyticsData = schema.db.analyticsDashboardData[0]
    return {
      ...analyticsData.revenueAnalytics,
      timeframe: timeframe || 'monthly',
      dateRange: { startDate, endDate }
    }
  })

  // Customer analytics
  server.post(`${apiPrefix}/analytics/customers`, (schema, { requestBody }) => {
    const body = JSON.parse(requestBody)
    const { startDate, endDate } = body
    
    const analyticsData = schema.db.analyticsDashboardData[0]
    return {
      acquisition: analyticsData.customerAcquisition,
      segments: analyticsData.customerSegments,
      cohorts: analyticsData.cohortAnalysis,
      dateRange: { startDate, endDate }
    }
  })

  // Sales analytics
  server.post(`${apiPrefix}/analytics/sales`, (schema, { requestBody }) => {
    const body = JSON.parse(requestBody)
    const { startDate, endDate, category } = body
    
    const analyticsData = schema.db.analyticsDashboardData[0]
    let salesData = {
      byCategory: analyticsData.salesByCategory,
      topProducts: analyticsData.topProducts,
      geographic: analyticsData.geographicData,
      dateRange: { startDate, endDate }
    }

    // Filter by category if specified
    if (category && category !== 'all') {
      salesData.topProducts = salesData.topProducts.filter(
        (product: any) => product.category.toLowerCase() === category.toLowerCase()
      )
    }

    return salesData
  })

  // Conversion funnel analytics
  server.get(`${apiPrefix}/analytics/conversion`, schema => {
    const analyticsData = schema.db.analyticsDashboardData[0]
    return analyticsData.conversionFunnel
  })

  // KPI data
  server.get(`${apiPrefix}/analytics/kpi`, schema => {
    const analyticsData = schema.db.analyticsDashboardData[0]
    return analyticsData.kpiData
  })

  // Export analytics data
  server.post(`${apiPrefix}/analytics/export`, (schema, { requestBody }) => {
    const body = JSON.parse(requestBody)
    const { type, format, startDate, endDate } = body
    
    // Simulate export functionality
    return {
      success: true,
      downloadUrl: `/exports/analytics-${type}-${Date.now()}.${format}`,
      filename: `analytics-${type}-${new Date().toISOString().split('T')[0]}.${format}`,
      message: `${type} analytics exported successfully`
    }
  })
}