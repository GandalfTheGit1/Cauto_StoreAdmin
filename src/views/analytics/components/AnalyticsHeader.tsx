import Button from '@/components/ui/Button'
import { HiOutlineRefresh, HiOutlineDownload } from 'react-icons/hi'

const AnalyticsHeader = () => {
  const handleRefresh = () => {
    // Trigger data refresh
    window.location.reload()
  }

  const handleExport = () => {
    // Export functionality
    console.log('Exporting analytics data...')
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          Analytics Dashboard
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Comprehensive insights into your business performance
        </p>
      </div>
      
      <div className="flex gap-3">
        <Button
          size="sm"
          variant="twoTone"
          icon={<HiOutlineDownload />}
          onClick={handleExport}
        >
          Export
        </Button>
        
        <Button
          size="sm"
          variant="solid"
          icon={<HiOutlineRefresh />}
          onClick={handleRefresh}
        >
          Refresh
        </Button>
      </div>
    </div>
  )
}

export default AnalyticsHeader