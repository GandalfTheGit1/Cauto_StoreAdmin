import { useEffect, useState } from 'react'
import Card from '@/components/ui/Card'
import Chart from '@/components/shared/Chart'
import { crmAnalyticsData } from '@/mock/data/crmData'

const CRMAnalytics = () => {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setData(crmAnalyticsData)
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

  const leadConversionOptions = {
    chart: {
      type: 'area',
      toolbar: { show: false }
    },
    stroke: {
      width: 2,
      curve: 'smooth'
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.1,
      }
    },
    colors: ['#3B82F6', '#10B981'],
    dataLabels: { enabled: false },
    legend: {
      show: true,
      position: 'top' as const,
    },
    xaxis: {
      categories: data.leadConversion.categories,
    }
  }

  const salesPipelineOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        columnWidth: '60%',
        borderRadius: 4,
      }
    },
    colors: ['#8B5CF6'],
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `$${(val / 1000).toFixed(0)}K`
    },
    xaxis: {
      categories: data.salesPipeline.categories,
    }
  }

  const customerSegmentOptions = {
    colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total Customers',
              formatter: () => data.customerSegments.series.reduce((a: number, b: number) => a + b, 0)
            }
          }
        }
      }
    },
    labels: data.customerSegments.labels,
    legend: { show: false }
  }

  return (
    <div className="space-y-6">
      {/* Lead Conversion Chart */}
      <Card className="p-6">
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            Lead Conversion Trends
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            New leads vs conversions over time
          </p>
        </div>
        <Chart
          series={data.leadConversion.series}
          height="350px"
          customOptions={leadConversionOptions}
          type="area"
        />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Pipeline */}
        <Card className="p-6">
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Sales Pipeline Value
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Opportunities by stage
            </p>
          </div>
          <Chart
            series={data.salesPipeline.series}
            height="300px"
            customOptions={salesPipelineOptions}
            type="bar"
          />
        </Card>

        {/* Customer Segments */}
        <Card className="p-6">
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Customer Segments
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Distribution by customer type
            </p>
          </div>
          <Chart
            series={data.customerSegments.series}
            height="300px"
            customOptions={customerSegmentOptions}
            type="donut"
          />
          <div className="grid grid-cols-2 gap-2 mt-4">
            {data.customerSegments.labels.map((label: string, index: number) => (
              <div key={label} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: customerSegmentOptions.colors[index] }}
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

export default CRMAnalytics