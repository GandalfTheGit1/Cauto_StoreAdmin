import Card from '@/components/ui/Card'
import { 
  HiOutlineTrendingUp, 
  HiOutlineTrendingDown,
  HiOutlineCurrencyDollar,
  HiOutlineShoppingCart,
  HiOutlineUsers,
  HiOutlineChartBar
} from 'react-icons/hi'
import type { KPIData } from '../store/analyticsDashboardSlice'

type KPICardsProps = {
  data?: KPIData
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

const KPICard = ({ 
  title, 
  value, 
  previousValue, 
  growthRate, 
  target, 
  targetProgress, 
  icon, 
  formatter = (val: number) => val.toString(),
  color = 'blue'
}: {
  title: string
  value: number
  previousValue: number
  growthRate: number
  target: number
  targetProgress: number
  icon: React.ReactNode
  formatter?: (value: number) => string
  color?: string
}) => {
  const isPositiveGrowth = growthRate >= 0
  const progressColor = targetProgress >= 90 ? 'green' : targetProgress >= 70 ? 'yellow' : 'red'
  
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-lg bg-${color}-100 dark:bg-${color}-900/20`}>
            <div className={`text-${color}-600 dark:text-${color}-400 text-xl`}>
              {icon}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {title}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatter(value)}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className={`flex items-center space-x-1 ${
            isPositiveGrowth ? 'text-green-600' : 'text-red-600'
          }`}>
            {isPositiveGrowth ? (
              <HiOutlineTrendingUp className="w-4 h-4" />
            ) : (
              <HiOutlineTrendingDown className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {formatPercentage(Math.abs(growthRate))}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            vs {formatter(previousValue)}
          </p>
        </div>
      </div>
      
      {/* Progress bar for target */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
          <span>Target Progress</span>
          <span>{formatPercentage(targetProgress)}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full bg-${progressColor}-500`}
            style={{ width: `${Math.min(targetProgress, 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Target: {formatter(target)}
        </p>
      </div>
    </Card>
  )
}

const KPICards = ({ data }: KPICardsProps) => {
  if (!data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="p-6 animate-pulse">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              <div className="space-y-2">
                <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KPICard
        title="Total Revenue"
        value={data.revenue.current}
        previousValue={data.revenue.previous}
        growthRate={data.revenue.growthRate}
        target={data.revenue.target}
        targetProgress={data.revenue.targetProgress}
        icon={<HiOutlineCurrencyDollar />}
        formatter={formatCurrency}
        color="blue"
      />
      
      <KPICard
        title="Total Orders"
        value={data.orders.current}
        previousValue={data.orders.previous}
        growthRate={data.orders.growthRate}
        target={data.orders.target}
        targetProgress={data.orders.targetProgress}
        icon={<HiOutlineShoppingCart />}
        formatter={formatNumber}
        color="green"
      />
      
      <KPICard
        title="Total Customers"
        value={data.customers.current}
        previousValue={data.customers.previous}
        growthRate={data.customers.growthRate}
        target={data.customers.target}
        targetProgress={data.customers.targetProgress}
        icon={<HiOutlineUsers />}
        formatter={formatNumber}
        color="purple"
      />
      
      <KPICard
        title="Conversion Rate"
        value={data.conversion.current}
        previousValue={data.conversion.previous}
        growthRate={data.conversion.growthRate}
        target={data.conversion.target}
        targetProgress={data.conversion.targetProgress}
        icon={<HiOutlineChartBar />}
        formatter={formatPercentage}
        color="orange"
      />
    </div>
  )
}

export default KPICards