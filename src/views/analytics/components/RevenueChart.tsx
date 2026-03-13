import { useState } from 'react'
import Chart from '@/components/shared/Chart'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { HiOutlineDownload, HiOutlineEye } from 'react-icons/hi'
import type { RevenueAnalytics } from '../store/analyticsDashboardSlice'

type RevenueChartProps = {
  data?: RevenueAnalytics
  className?: string
}

const chartTypeOptions = [
  { label: 'Line Chart', value: 'line' },
  { label: 'Area Chart', value: 'area' },
  { label: 'Column Chart', value: 'column' },
]

const timeframeOptions = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Quarterly', value: 'quarterly' },
]

const RevenueChart = ({ data, className }: RevenueChartProps) => {
  const [chartType, setChartType] = useState('line')
  const [timeframe, setTimeframe] = useState('monthly')
  
  if (!data) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="flex justify-between items-center mb-6">
            <div className="w-32 h-6 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
          <div className="w-full h-80 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </Card>
    )
  }

  const chartSeries = data.series.map(series => ({
    name: series.name,
    data: series.data,
    type: series.type || 'column',
  }))

  const customOptions = {
    chart: {
      type: chartType,
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
        }
      }
    },
    colors: data.series.map(series => series.color),
    stroke: {
      width: data.series.map(series => series.dashArray ? 2 : 3),
      dashArray: data.series.map(series => series.dashArray || 0),
      curve: 'smooth'
    },
    fill: chartType === 'area' ? {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.1,
      }
    } : undefined,
    plotOptions: {
      bar: {
        columnWidth: '60%',
        borderRadius: 4,
      }
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      show: true,
      position: 'top' as const,
      horizontalAlign: 'right' as const,
    },
    grid: {
      borderColor: '#e7e7e7',
      strokeDashArray: 3,
    },
    xaxis: {
      categories: data.categories,
      labels: {
        style: {
          fontSize: '12px'
        }
      }
    },
    yaxis: {
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
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value: number) => {
          return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(value)
        }
      }
    }
  }

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            Revenue Analytics
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Revenue performance vs targets over time
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Select
            size="sm"
            value={timeframe}
            options={timeframeOptions}
            onChange={setTimeframe}
            className="min-w-[120px]"
          />
          <Select
            size="sm"
            value={chartType}
            options={chartTypeOptions}
            onChange={setChartType}
            className="min-w-[120px]"
          />
          <Button
            size="sm"
            variant="twoTone"
            icon={<HiOutlineEye />}
          >
            Details
          </Button>
          <Button
            size="sm"
            variant="solid"
            icon={<HiOutlineDownload />}
          >
            Export
          </Button>
        </div>
      </div>
      
      <Chart
        series={chartSeries}
        xAxis={data.categories}
        height="400px"
        customOptions={customOptions}
        type={chartType as 'line' | 'area' | 'bar'}
      />
      
      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ${(data.series[0].data.reduce((a, b) => a + b, 0) / 1000).toFixed(0)}K
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">
            ${((data.series[0].data[data.series[0].data.length - 1] - data.series[0].data[0]) / 1000).toFixed(0)}K
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Growth</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">
            ${(data.series[0].data.reduce((a, b) => a + b, 0) / data.series[0].data.length / 1000).toFixed(0)}K
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Avg Monthly</p>
        </div>
      </div>
    </Card>
  )
}

export default RevenueChart