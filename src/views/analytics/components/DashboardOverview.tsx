import { useEffect, useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { 
  HiOutlineTrendingUp, 
  HiOutlineTrendingDown,
  HiOutlineCurrencyDollar,
  HiOutlineShoppingCart,
  HiOutlineUsers,
  HiOutlineCube,
  HiOutlineChartBar,
  HiOutlineEye
} from 'react-icons/hi'
import { analyticsDashboardData } from '@/mock/data/analyticsData'
import { inventoryKPIData } from '@/mock/data/inventoryData'
import { crmKPIData } from '@/mock/data/crmData'

type OverviewKPI = {
  id: string
  title: string
  value: number
  growShrink: number
  icon: React.ReactNode
  formatter: (value: number) => string
  color: string
  module: string
  target?: number
  targetProgress?: number
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('en-US').format(value)
}

const formatPercentage = (value: number) => {
  return `${value.toFixed(1)}%`
}

const KPIOverviewCard = ({ kpi }: { kpi: OverviewKPI }) => {
  const isPositiveGrowth = kpi.growShrink >= 0
  
  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-200 group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-xl bg-${kpi.color}-100 dark:bg-${kpi.color}-900/20 group-hover:scale-110 transition-transform`}>
            <div className={`text-${kpi.color}-600 dark:text-${kpi.color}-400 text-xl`}>
              {kpi.icon}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              {kpi.module}
            </p>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {kpi.title}
            </p>
          </div>
        </div>
        
        <Button
          size="xs"
          variant="plain"
          icon={<HiOutlineEye />}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        />
      </div>
      
      <div className="mb-4">
        <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {kpi.formatter(kpi.value)}
        </p>
        
        <div className={`flex items-center space-x-1 text-sm ${
          isPositiveGrowth 
            ? 'text-green-600 dark:text-green-400' 
            : 'text-red-600 dark:text-red-400'
        }`}>
          {isPositiveGrowth ? (
            <HiOutlineTrendingUp className="w-4 h-4" />
          ) : (
            <HiOutlineTrendingDown className="w-4 h-4" />
          )}
          <span className="font-medium">
            {Math.abs(kpi.growShrink).toFixed(1)}%
          </span>
          <span className="text-gray-500 dark:text-gray-400">vs last period</span>
        </div>
      </div>
      
      {kpi.target && kpi.targetProgress && (
        <div>
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
            <span>Target Progress</span>
            <span>{kpi.targetProgress.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full bg-${kpi.color}-500 transition-all duration-500`}
              style={{ width: `${Math.min(kpi.targetProgress, 100)}%` }}
            />
          </div>
        </div>
      )}
    </Card>
  )
}

const DashboardOverview = () => {
  const [kpis, setKpis] = useState<OverviewKPI[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to get all KPI data
    setTimeout(() => {
      const overviewKPIs: OverviewKPI[] = [
        // Sales KPIs
        {
          id: 'revenue',
          title: 'Total Revenue',
          value: analyticsDashboardData.kpiData.revenue.current,
          growShrink: analyticsDashboardData.kpiData.revenue.growthRate,
          icon: <HiOutlineCurrencyDollar />,
          formatter: formatCurrency,
          color: 'blue',
          module: 'Sales',
          target: analyticsDashboardData.kpiData.revenue.target,
          targetProgress: analyticsDashboardData.kpiData.revenue.targetProgress,
        },
        {
          id: 'orders',
          title: 'Total Orders',
          value: analyticsDashboardData.kpiData.orders.current,
          growShrink: analyticsDashboardData.kpiData.orders.growthRate,
          icon: <HiOutlineShoppingCart />,
          formatter: formatNumber,
          color: 'green',
          module: 'Sales',
          target: analyticsDashboardData.kpiData.orders.target,
          targetProgress: analyticsDashboardData.kpiData.orders.targetProgress,
        },
        {
          id: 'customers',
          title: 'Total Customers',
          value: analyticsDashboardData.kpiData.customers.current,
          growShrink: analyticsDashboardData.kpiData.customers.growthRate,
          icon: <HiOutlineUsers />,
          formatter: formatNumber,
          color: 'purple',
          module: 'Sales',
          target: analyticsDashboardData.kpiData.customers.target,
          targetProgress: analyticsDashboardData.kpiData.customers.targetProgress,
        },
        
        // Inventory KPIs
        {
          id: 'inventory-items',
          title: 'Total Items',
          value: inventoryKPIData.totalItems.value,
          growShrink: inventoryKPIData.totalItems.growShrink,
          icon: <HiOutlineCube />,
          formatter: formatNumber,
          color: 'indigo',
          module: 'Inventory',
        },
        {
          id: 'inventory-value',
          title: 'Inventory Value',
          value: inventoryKPIData.totalValue.value,
          growShrink: inventoryKPIData.totalValue.growShrink,
          icon: <HiOutlineCurrencyDollar />,
          formatter: formatCurrency,
          color: 'emerald',
          module: 'Inventory',
        },
        
        // CRM KPIs
        {
          id: 'leads',
          title: 'Total Leads',
          value: crmKPIData.totalLeads.value,
          growShrink: crmKPIData.totalLeads.growShrink,
          icon: <HiOutlineUsers />,
          formatter: formatNumber,
          color: 'orange',
          module: 'CRM',
          target: 500,
          targetProgress: (crmKPIData.totalLeads.value / 500) * 100,
        },
        {
          id: 'pipeline',
          title: 'Pipeline Value',
          value: crmKPIData.pipelineValue.value,
          growShrink: crmKPIData.pipelineValue.growShrink,
          icon: <HiOutlineChartBar />,
          formatter: formatCurrency,
          color: 'pink',
          module: 'CRM',
          target: 500000,
          targetProgress: (crmKPIData.pipelineValue.value / 500000) * 100,
        },
        {
          id: 'conversion-rate',
          title: 'Conversion Rate',
          value: crmKPIData.conversionRate.value,
          growShrink: crmKPIData.conversionRate.growShrink,
          icon: <HiOutlineChartBar />,
          formatter: formatPercentage,
          color: 'cyan',
          module: 'CRM',
          target: 15,
          targetProgress: (crmKPIData.conversionRate.value / 15) * 100,
        },
      ]
      
      setKpis(overviewKPIs)
      setLoading(false)
    }, 500)
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <Card key={index} className="p-6 animate-pulse">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
              <div className="space-y-2">
                <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="w-24 h-6 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            Business Overview
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Key performance indicators across all business areas
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => (
          <KPIOverviewCard key={kpi.id} kpi={kpi} />
        ))}
      </div>
    </div>
  )
}

export default DashboardOverview