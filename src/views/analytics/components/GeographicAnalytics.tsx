import Card from '@/components/ui/Card'
import { HiOutlineTrendingUp, HiOutlineTrendingDown } from 'react-icons/hi'
import type { GeographicData } from '../store/analyticsDashboardSlice'

type GeographicAnalyticsProps = {
  data?: GeographicData
  className?: string
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

const getRegionFlag = (region: string) => {
  const flags: Record<string, string> = {
    'North America': '🇺🇸',
    'Europe': '🇪🇺',
    'Asia Pacific': '🌏',
    'Latin America': '🌎',
    'Middle East & Africa': '🌍',
  }
  return flags[region] || '🌐'
}

const GeographicAnalytics = ({ data, className }: GeographicAnalyticsProps) => {
  if (!data) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="w-32 h-6 bg-gray-200 dark:bg-gray-700 rounded mb-6" />
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
                <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            ))}
          </div>
        </div>
      </Card>
    )
  }

  const totalRevenue = data.reduce((sum, region) => sum + region.revenue, 0)
  const totalCustomers = data.reduce((sum, region) => sum + region.customers, 0)

  return (
    <Card className={`p-6 ${className}`}>
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
          Geographic Performance
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Revenue and customer distribution by region
        </p>
      </div>
      
      <div className="space-y-4">
        {data.map((region, index) => {
          const revenuePercentage = ((region.revenue / totalRevenue) * 100).toFixed(1)
          const customerPercentage = ((region.customers / totalCustomers) * 100).toFixed(1)
          
          return (
            <div 
              key={region.region}
              className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl">
                  {getRegionFlag(region.region)}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {region.region}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {region.customers} customers
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(region.revenue)}
                </p>
                <div className={`flex items-center justify-end space-x-1 text-sm ${
                  region.growth >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {region.growth >= 0 ? (
                    <HiOutlineTrendingUp className="w-3 h-3" />
                  ) : (
                    <HiOutlineTrendingDown className="w-3 h-3" />
                  )}
                  <span>{Math.abs(region.growth).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Revenue distribution bars */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Revenue Distribution
        </h5>
        <div className="space-y-3">
          {data.map((region) => {
            const percentage = (region.revenue / totalRevenue) * 100
            
            return (
              <div key={`bar-${region.region}`}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">
                    {region.region}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}

export default GeographicAnalytics