import Chart from '@/components/shared/Chart'
import Card from '@/components/ui/Card'
import Select from '@/components/ui/Select'
import { useState } from 'react'
import type { CustomerAcquisition } from '../store/analyticsDashboardSlice'

type CustomerAcquisitionChartProps = {
  data?: CustomerAcquisition
  className?: string
}

const timeframeOptions = [
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Quarterly', value: 'quarterly' },
]

const CustomerAcquisitionChart = ({ data, className }: CustomerAcquisitionChartProps) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('weekly')
  
  if (!data) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="flex justify-between items-center mb-6">
            <div className="w-40 h-6 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
          <div className="w-full h-80 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </Card>
    )
  }

  const customOptions = {
    chart: {
      type: 'area',
      stacked: false,
      toolbar: {
        show: false
      }
    },
    colors: data.series.map(series => series.color),
    stroke: {
      width: 3,
      curve: 'smooth'
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.1,
        stops: [0, 90, 100]
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
          return value.toString()
        }
      }
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value: number) => {
          return `${value} customers`
        }
      }
    }
  }

  const totalNewCustomers = data.series.find(s => s.name === 'New Customers')?.data.reduce((a, b) => a + b, 0) || 0
  const totalReturningCustomers = data.series.find(s => s.name === 'Returning Customers')?.data.reduce((a, b) => a + b, 0) || 0
  const totalCustomers = totalNewCustomers + totalReturningCustomers
  const retentionRate = totalCustomers > 0 ? ((totalReturningCustomers / totalCustomers) * 100).toFixed(1) : '0'

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            Customer Acquisition
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            New vs returning customer trends
          </p>
        </div>
        
        <Select
          size="sm"
          value={selectedTimeframe}
          options={timeframeOptions}
          onChange={setSelectedTimeframe}
          className="min-w-[120px]"
        />
      </div>
      
      <Chart
        series={data.series}
        xAxis={data.categories}
        height="350px"
        customOptions={customOptions}
        type="area"
      />
      
      {/* Summary metrics */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">
            {totalNewCustomers}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">New Customers</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">
            {totalReturningCustomers}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Returning</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">
            {retentionRate}%
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Retention Rate</p>
        </div>
      </div>
    </Card>
  )
}

export default CustomerAcquisitionChart