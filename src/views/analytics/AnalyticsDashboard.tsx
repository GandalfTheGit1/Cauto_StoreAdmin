import { useEffect, useState } from 'react'
import { injectReducer } from '@/store'
import Loading from '@/components/shared/Loading'
import { useAppDispatch } from '@/store'
import dayjs from 'dayjs'

import AnalyticsHeader from './components/AnalyticsHeader'
import AnalyticsFilters, { FilterState } from './components/AnalyticsFilters'
import KPICards from './components/KPICards'
import RevenueChart from './components/RevenueChart'
import SalesPerformanceChart from './components/SalesPerformanceChart'
import CustomerAcquisitionChart from './components/CustomerAcquisitionChart'
import TopProductsTable from './components/TopProductsTable'
import GeographicAnalytics from './components/GeographicAnalytics'
import ConversionFunnel from './components/ConversionFunnel'
import reducer, { getAnalyticsData, useAppSelector } from './store'

injectReducer('analyticsDashboard', reducer)

const AnalyticsDashboard = () => {
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  
  const { dashboardData, startDate, endDate } = useAppSelector(
    state => state.analyticsDashboard.data
  )

  const [filters, setFilters] = useState<FilterState>({
    dateRange: {
      start: dayjs().subtract(30, 'day').toDate(),
      end: new Date(),
      preset: 'month'
    },
    metrics: ['revenue', 'orders', 'customers', 'conversion'],
    categories: [],
    regions: [],
    customerSegments: []
  })

  useEffect(() => {
    setLoading(true)
    fetchData()
  }, [startDate, endDate])

  const fetchData = () => {
    dispatch(getAnalyticsData({ startDate, endDate })).then(() =>
      setLoading(false)
    )
  }

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters)
  }

  const handleApplyFilters = () => {
    setLoading(true)
    // In a real app, you would pass the filters to the API call
    fetchData()
    setFiltersOpen(false)
  }

  const handleResetFilters = () => {
    setLoading(true)
    fetchData()
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      <AnalyticsHeader />
      
      {/* Filters */}
      <AnalyticsFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
        isOpen={filtersOpen}
        onToggle={() => setFiltersOpen(!filtersOpen)}
      />
      
      <Loading loading={loading}>
        <div className="space-y-6">
          {/* KPI Cards */}
          <KPICards data={dashboardData?.kpiData} />
          
          {/* Revenue and Performance Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RevenueChart data={dashboardData?.revenueAnalytics} />
            <SalesPerformanceChart data={dashboardData?.salesByCategory} />
          </div>
          
          {/* Customer Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CustomerAcquisitionChart data={dashboardData?.customerAcquisition} />
            <ConversionFunnel data={dashboardData?.conversionFunnel} />
          </div>
          
          {/* Detailed Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <TopProductsTable 
              data={dashboardData?.topProducts} 
              className="lg:col-span-2"
            />
            <GeographicAnalytics data={dashboardData?.geographicData} />
          </div>
        </div>
      </Loading>
    </div>
  )
}

export default AnalyticsDashboard