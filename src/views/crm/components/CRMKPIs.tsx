import Card from '@/components/ui/Card'
import { 
  HiOutlineTrendingUp, 
  HiOutlineTrendingDown,
  HiOutlineUsers,
  HiOutlineUserAdd,
  HiOutlineCurrencyDollar,
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineCalendar,
  HiOutlineChartBar
} from 'react-icons/hi'

type CRMKPIData = {
  totalLeads: {
    value: number
    growShrink: number
  }
  newLeads: {
    value: number
    growShrink: number
  }
  conversions: {
    value: number
    growShrink: number
  }
  pipelineValue: {
    value: number
    growShrink: number
  }
  avgDealSize: {
    value: number
    growShrink: number
  }
  conversionRate: {
    value: number
    growShrink: number
  }
  activities: {
    value: number
    growShrink: number
  }
  meetings: {
    value: number
    growShrink: number
  }
}

type CRMKPIsProps = {
  data?: CRMKPIData
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
  growShrink, 
  icon, 
  formatter = (val: number) => val.toString(),
  color = 'blue',
  target,
  targetLabel
}: {
  title: string
  value: number
  growShrink: number
  icon: React.ReactNode
  formatter?: (value: number) => string
  color?: string
  target?: number
  targetLabel?: string
}) => {
  const isPositiveGrowth = growShrink >= 0
  const targetProgress = target ? (value / target) * 100 : null
  
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
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
      
      {target && targetProgress !== null && (
        <div>
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
            <span>{targetLabel || 'Target'}</span>
            <span>{targetProgress.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full bg-${color}-500`}
              style={{ width: `${Math.min(targetProgress, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Target: {formatter(target)}
          </p>
        </div>
      )}
    </Card>
  )
}

const CRMKPIs = ({ data }: CRMKPIsProps) => {
  if (!data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
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
    <div className="space-y-6">
      {/* Primary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Leads"
          value={data.totalLeads.value}
          growShrink={data.totalLeads.growShrink}
          icon={<HiOutlineUsers />}
          formatter={formatNumber}
          color="blue"
          target={500}
          targetLabel="Monthly Target"
        />
        
        <KPICard
          title="New Leads"
          value={data.newLeads.value}
          growShrink={data.newLeads.growShrink}
          icon={<HiOutlineUserAdd />}
          formatter={formatNumber}
          color="green"
          target={100}
          targetLabel="Monthly Target"
        />
        
        <KPICard
          title="Conversions"
          value={data.conversions.value}
          growShrink={data.conversions.growShrink}
          icon={<HiOutlineChartBar />}
          formatter={formatNumber}
          color="purple"
          target={25}
          targetLabel="Monthly Target"
        />
        
        <KPICard
          title="Pipeline Value"
          value={data.pipelineValue.value}
          growShrink={data.pipelineValue.growShrink}
          icon={<HiOutlineCurrencyDollar />}
          formatter={formatCurrency}
          color="indigo"
          target={500000}
          targetLabel="Target Pipeline"
        />
      </div>
      
      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Avg Deal Size"
          value={data.avgDealSize.value}
          growShrink={data.avgDealSize.growShrink}
          icon={<HiOutlineCurrencyDollar />}
          formatter={formatCurrency}
          color="orange"
        />
        
        <KPICard
          title="Conversion Rate"
          value={data.conversionRate.value}
          growShrink={data.conversionRate.growShrink}
          icon={<HiOutlineChartBar />}
          formatter={formatPercentage}
          color="pink"
          target={15}
          targetLabel="Target Rate"
        />
        
        <KPICard
          title="Activities"
          value={data.activities.value}
          growShrink={data.activities.growShrink}
          icon={<HiOutlinePhone />}
          formatter={formatNumber}
          color="cyan"
        />
        
        <KPICard
          title="Meetings"
          value={data.meetings.value}
          growShrink={data.meetings.growShrink}
          icon={<HiOutlineCalendar />}
          formatter={formatNumber}
          color="teal"
        />
      </div>
    </div>
  )
}

export default CRMKPIs