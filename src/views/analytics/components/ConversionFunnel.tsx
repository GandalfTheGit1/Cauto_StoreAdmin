import Card from '@/components/ui/Card'
import { HiOutlineUsers, HiOutlineEye, HiOutlineHeart, HiOutlineShoppingCart, HiOutlineCurrencyDollar } from 'react-icons/hi'
import type { ConversionFunnel as ConversionFunnelType } from '../store/analyticsDashboardSlice'

type ConversionFunnelProps = {
  data?: ConversionFunnelType
  className?: string
}

const getStageIcon = (stage: string) => {
  const icons: Record<string, React.ReactNode> = {
    'Visitors': <HiOutlineEye className="w-5 h-5" />,
    'Leads': <HiOutlineUsers className="w-5 h-5" />,
    'Qualified Leads': <HiOutlineHeart className="w-5 h-5" />,
    'Opportunities': <HiOutlineShoppingCart className="w-5 h-5" />,
    'Customers': <HiOutlineCurrencyDollar className="w-5 h-5" />,
  }
  return icons[stage] || <HiOutlineUsers className="w-5 h-5" />
}

const getStageColor = (index: number) => {
  const colors = [
    'bg-blue-500',
    'bg-green-500', 
    'bg-yellow-500',
    'bg-orange-500',
    'bg-red-500'
  ]
  return colors[index] || 'bg-gray-500'
}

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('en-US').format(value)
}

const ConversionFunnel = ({ data, className }: ConversionFunnelProps) => {
  if (!data) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="w-32 h-6 bg-gray-200 dark:bg-gray-700 rounded mb-6" />
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                <div className="flex-1">
                  <div className="w-full h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                  <div className="w-1/2 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className={`p-6 ${className}`}>
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
          Conversion Funnel
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Customer journey from visitors to customers
        </p>
      </div>
      
      <div className="space-y-4">
        {data.map((stage, index) => {
          const nextStage = data[index + 1]
          const conversionRate = nextStage 
            ? ((nextStage.count / stage.count) * 100).toFixed(1)
            : null
          
          return (
            <div key={stage.stage}>
              <div className="flex items-center space-x-4">
                {/* Stage Icon */}
                <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${getStageColor(index)} text-white`}>
                  {getStageIcon(stage.stage)}
                </div>
                
                {/* Stage Info */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900 dark:text-white">
                      {stage.stage}
                    </h5>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatNumber(stage.count)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {stage.percentage.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${getStageColor(index)}`}
                      style={{ width: `${stage.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
              
              {/* Conversion Rate to Next Stage */}
              {conversionRate && (
                <div className="ml-16 mt-2 mb-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {conversionRate}% conversion to {nextStage.stage}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
      
      {/* Overall Conversion Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600">
              {data[0]?.count ? formatNumber(data[0].count) : '0'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Visitors</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">
              {data[data.length - 1]?.percentage.toFixed(2)}%
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Overall Conversion</p>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default ConversionFunnel