import Chart from '@/components/shared/Chart'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { COLORS } from '@/constants/chart.constant'
import type { SalesByCategory } from '../store/analyticsDashboardSlice'

type SalesPerformanceChartProps = {
  data?: SalesByCategory
  className?: string
}

const SalesPerformanceChart = ({ data, className }: SalesPerformanceChartProps) => {
  if (!data) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="w-40 h-6 bg-gray-200 dark:bg-gray-700 rounded mb-6" />
          <div className="w-full h-80 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </Card>
    )
  }

  const totalSales = data.series[0]?.data.reduce((a, b) => a + b, 0) || 0
  
  const customOptions = {
    chart: {
      type: 'bar',
      toolbar: {
        show: false
      }
    },
    colors: data.colors || COLORS,
    plotOptions: {
      bar: {
        horizontal: true,
        columnWidth: '60%',
        borderRadius: 4,
        dataLabels: {
          position: 'top'
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(val)
      },
      offsetX: 10,
      style: {
        fontSize: '12px',
        fontWeight: 'bold'
      }
    },
    legend: {
      show: false
    },
    grid: {
      borderColor: '#e7e7e7',
      strokeDashArray: 3,
    },
    xaxis: {
      categories: data.categories,
      labels: {
        formatter: (value: number) => {
          return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(value)
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '12px'
        }
      }
    },
    tooltip: {
      y: {
        formatter: (value: number) => {
          const percentage = ((value / totalSales) * 100).toFixed(1)
          return `${new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(value)} (${percentage}%)`
        }
      }
    }
  }

  return (
    <Card className={`p-6 ${className}`}>
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
          Sales by Category
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Revenue breakdown by product categories
        </p>
      </div>
      
      <Chart
        series={data.series}
        height="350px"
        customOptions={customOptions}
        type="bar"
      />
      
      {/* Category breakdown */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-4">
          {data.categories.map((category, index) => {
            const value = data.series[0]?.data[index] || 0
            const percentage = ((value / totalSales) * 100).toFixed(1)
            const color = data.colors?.[index] || COLORS[index % COLORS.length]
            
            return (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge
                    badgeStyle={{
                      backgroundColor: color,
                      width: '12px',
                      height: '12px',
                    }}
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {category}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    ${(value / 1000).toFixed(0)}K
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {percentage}%
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}

export default SalesPerformanceChart