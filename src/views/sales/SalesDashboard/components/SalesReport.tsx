import Chart from '@/components/shared/Chart'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { HiOutlineDownload, HiOutlineEye } from 'react-icons/hi'

type SalesReportProps = {
  data?: {
    series?: {
      name: string
      data: number[]
    }[]
    categories?: string[]
  }
  className?: string
}

const SalesReport = ({ className, data = {} }: SalesReportProps) => {
  const customOptions = {
    chart: {
      type: 'line',
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
        }
      }
    },
    stroke: {
      width: 3,
      curve: 'smooth'
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
    <Card className={className}>
      <div className='flex items-center justify-between mb-4'>
        <div>
          <h4 className="text-lg font-semibold">Sales Report</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Revenue performance over time
          </p>
        </div>
        <div className="flex space-x-2">
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
        series={data.series}
        xAxis={data.categories}
        height='380px'
        customOptions={customOptions}
        type="line"
      />
    </Card>
  )
}

export default SalesReport
