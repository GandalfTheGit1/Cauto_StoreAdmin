import Card from '@/components/ui/Card'
import { 
  HiOutlineTrendingUp, 
  HiOutlineTrendingDown,
  HiOutlineCube,
  HiOutlineExclamationTriangle,
  HiOutlineX,
  HiOutlineCurrencyDollar,
  HiOutlineRefresh,
  HiOutlineClipboardList
} from 'react-icons/hi'

type InventoryKPIData = {
  totalItems: {
    value: number
    growShrink: number
  }
  lowStock: {
    value: number
    growShrink: number
  }
  outOfStock: {
    value: number
    growShrink: number
  }
  totalValue: {
    value: number
    growShrink: number
  }
  turnoverRate: {
    value: number
    growShrink: number
  }
  reorderAlerts: {
    value: number
    growShrink: number
  }
}

type InventoryKPIsProps = {
  data?: InventoryKPIData
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

const formatDecimal = (value: number) => {
  return value.toFixed(1)
}

const KPICard = ({ 
  title, 
  value, 
  growShrink, 
  icon, 
  formatter = (val: number) => val.toString(),
  color = 'blue',
  alertLevel = 'normal'
}: {
  title: string
  value: number
  growShrink: number
  icon: React.ReactNode
  formatter?: (value: number) => string
  color?: string
  alertLevel?: 'normal' | 'warning' | 'critical'
}) => {
  const isPositiveGrowth = growShrink >= 0
  
  const getAlertStyles = () => {
    switch (alertLevel) {
      case 'warning':
        return 'border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10'
      case 'critical':
        return 'border-l-4 border-red-500 bg-red-50 dark:bg-red-900/10'
      default:
        return 'border-l-4 border-transparent'
    }
  }
  
  return (
    <Card className={`p-6 hover:shadow-lg transition-shadow ${getAlertStyles()}`}>
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
      
      {alertLevel !== 'normal' && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className={`text-sm font-medium ${
            alertLevel === 'critical' ? 'text-red-600' : 'text-yellow-600'
          }`}>
            {alertLevel === 'critical' ? 'Immediate attention required' : 'Monitor closely'}
          </p>
        </div>
      )}
    </Card>
  )
}

const InventoryKPIs = ({ data }: InventoryKPIsProps) => {
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
      <KPICard
        title="Total Items"
        value={data.totalItems.value}
        growShrink={data.totalItems.growShrink}
        icon={<HiOutlineCube />}
        formatter={formatNumber}
        color="blue"
      />
      
      <KPICard
        title="Low Stock Items"
        value={data.lowStock.value}
        growShrink={data.lowStock.growShrink}
        icon={<HiOutlineExclamationTriangle />}
        formatter={formatNumber}
        color="yellow"
        alertLevel={data.lowStock.value > 20 ? 'warning' : 'normal'}
      />
      
      <KPICard
        title="Out of Stock"
        value={data.outOfStock.value}
        growShrink={data.outOfStock.growShrink}
        icon={<HiOutlineX />}
        formatter={formatNumber}
        color="red"
        alertLevel={data.outOfStock.value > 0 ? 'critical' : 'normal'}
      />
      
      <KPICard
        title="Inventory Value"
        value={data.totalValue.value}
        growShrink={data.totalValue.growShrink}
        icon={<HiOutlineCurrencyDollar />}
        formatter={formatCurrency}
        color="green"
      />
      
      <KPICard
        title="Turnover Rate"
        value={data.turnoverRate.value}
        growShrink={data.turnoverRate.growShrink}
        icon={<HiOutlineRefresh />}
        formatter={formatDecimal}
        color="purple"
      />
      
      <KPICard
        title="Reorder Alerts"
        value={data.reorderAlerts.value}
        growShrink={data.reorderAlerts.growShrink}
        icon={<HiOutlineClipboardList />}
        formatter={formatNumber}
        color="orange"
        alertLevel={data.reorderAlerts.value > 5 ? 'warning' : 'normal'}
      />
    </div>
  )
}

export default InventoryKPIs