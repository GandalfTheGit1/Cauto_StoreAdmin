import Card from '@/components/ui/Card'
import { 
  HiOutlineTrendingUp, 
  HiOutlineTrendingDown,
  HiOutlineCurrencyDollar,
  HiOutlineShoppingCart,
  HiOutlineUsers,
  HiOutlineChartBar
} from 'react-icons/hi'

type StatisticData = {
  revenue?: {
    value: number
    growShrink: number
  }
  orders?: {
    value: number
    growShrink: number
  }
  purchases?: {
    value: number
    growShrink: number
  }
  customers?: {
    value: number
    growShrink: number
  }
  conversion?: {
    value: number
    growShrink: number
  }
  aov?: {
    value: number
    growShrink: number
  }
}

type EnhancedStatisticProps = {
  data?: StatisticData
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

const StatCard = ({ 
  title, 
  value, 
  growShrink, 
  icon, 
  formatter = (val: number) => val.toString(),
  color = 'blue'
}: {
  title: string
  value: number
  growShrink: number
  icon: React.ReactNode
  formatter?: (value: number) => string
  color?: string
}) => {
  const isPositiveGrowth = growShrink >= 0
  
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-xl bg-${color}-100 dark:bg-${color}-900/20`}>
            <div className={`text-${color}-600 dark:text-${color}-400 text-xl`}>
              {icon}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              {title}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatter(value)}
            </p>
          </div>
        </div>
        
        <div className={`flex items-center space-x-1 px-3 py-1 rounded-full ${
          isPositiveGrowth 
            ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
            : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
        }`}>
          {isPositiveGrowth ? (
            <HiOutlineTrendingUp className="w-4 h-4" />
          ) : (
            <HiOutlineTrendingDown className="w-4 h-4" />
          )}
          <span className="text-sm font-semibold">
            {Math.abs(growShrink).toFixed(1)}%
          </span>
        </div>
      </div>
    </Card>
  )
}

const EnhancedStatistic = ({ data }: EnhancedStatisticProps) => {
  if (!data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="p-6 animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {data.revenue && (
        <StatCard
          title="Total Revenue"
          value={data.revenue.value}
          growShrink={data.revenue.growShrink}
          icon={<HiOutlineCurrencyDollar />}
          formatter={formatCurrency}
          color="blue"
        />
      )}
      
      {data.orders && (
        <StatCard
          title="Total Orders"
          value={data.orders.value}
          growShrink={data.orders.growShrink}
          icon={<HiOutlineShoppingCart />}
          formatter={formatNumber}
          color="green"
        />
      )}
      
      {data.customers && (
        <StatCard
          title="Customers"
          value={data.customers.value}
          growShrink={data.customers.growShrink}
          icon={<HiOutlineUsers />}
          formatter={formatNumber}
          color="purple"
        />
      )}
      
      {data.conversion && (
        <StatCard
          title="Conversion Rate"
          value={data.conversion.value}
          growShrink={data.conversion.growShrink}
          icon={<HiOutlineChartBar />}
          formatter={formatPercentage}
          color="orange"
        />
      )}
      
      {data.aov && (
        <StatCard
          title="Avg Order Value"
          value={data.aov.value}
          growShrink={data.aov.growShrink}
          icon={<HiOutlineCurrencyDollar />}
          formatter={formatCurrency}
          color="indigo"
        />
      )}
      
      {data.purchases && (
        <StatCard
          title="Purchases"
          value={data.purchases.value}
          growShrink={data.purchases.growShrink}
          icon={<HiOutlineShoppingCart />}
          formatter={formatNumber}
          color="pink"
        />
      )}
    </div>
  )
}

export default EnhancedStatistic