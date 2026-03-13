import { useEffect, useState } from 'react'
import Card from '@/components/ui/Card'
import Chart from '@/components/shared/Chart'
import { inventoryAnalyticsData } from '@/mock/data/inventoryData'

const InventoryAnalytics = () => {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setData(inventoryAnalyticsData)
      setLoading(false)
    }, 500)
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="p-6 animate-pulse">
            <div className="w-40 h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
            <div className="w-full h-80 bg-gray-200 dark:bg-gray-700 rounded" />
          </Card>
        ))}
      </div>
    )
  }

  const stockLevelsOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '60%',
        borderRadius: 4,
      }
    },
    colors: ['#10B981', '#F59E0B', '#EF4444'],
    dataLabels: { enabled: false },
    legend: {
      show: true,
      position: 'top' as const,
    },
    xaxis: {
      categories: data.stockLevels.categories,
    },
    yaxis: {
      title: { text: 'Units' }
    }
  }

  const turnoverOptions = {
    chart: {
      type: 'line',
      toolbar: { show: false }
    },
    stroke: {
      width: 3,
      curve: 'smooth'
    },
    colors: ['#3B82F6'],
    dataLabels: { enabled: false },
    xaxis: {
      categories: data.inventoryTurnover.categories,
    },
    yaxis: {
      title: { text: 'Turnover Rate' }
    }
  }

  const categoryDistributionOptions = {
    colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total Items',
              formatter: () => data.categoryDistribution.series.reduce((a: number, b: number) => a + b, 0)
            }
          }
        }
      }
    },
    labels: data.categoryDistribution.labels,
    legend: { show: false }
  }

  return (
    <div className="space-y-6">
      {/* Stock Levels Chart */}
      <Card className="p-6">
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            Stock Levels by Category
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Current, low, and out of stock items
          </p>
        </div>
        <Chart
          series={data.stockLevels.series}
          height="350px"
          customOptions={stockLevelsOptions}
          type="bar"
        />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inventory Turnover */}
        <Card className="p-6">
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Inventory Turnover Rate
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Monthly turnover trends
            </p>
          </div>
          <Chart
            series={data.inventoryTurnover.series}
            height="300px"
            customOptions={turnoverOptions}
            type="line"
          />
        </Card>

        {/* Category Distribution */}
        <Card className="p-6">
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Inventory by Category
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Distribution of items by category
            </p>
          </div>
          <Chart
            series={data.categoryDistribution.series}
            height="300px"
            customOptions={categoryDistributionOptions}
            type="donut"
          />
          <div className="grid grid-cols-2 gap-2 mt-4">
            {data.categoryDistribution.labels.map((label: string, index: number) => (
              <div key={label} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: categoryDistributionOptions.colors[index] }}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default InventoryAnalytics