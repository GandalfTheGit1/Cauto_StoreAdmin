import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import DatePicker from '@/components/ui/DatePicker'
import Checkbox from '@/components/ui/Checkbox'
import { HiOutlineFilter, HiOutlineRefresh, HiOutlineX } from 'react-icons/hi'
import dayjs from 'dayjs'

export interface FilterState {
  dateRange: {
    start: Date | null
    end: Date | null
    preset: string
  }
  metrics: string[]
  categories: string[]
  regions: string[]
  customerSegments: string[]
}

interface AnalyticsFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  onApplyFilters: () => void
  onResetFilters: () => void
  isOpen: boolean
  onToggle: () => void
}

const datePresets = [
  { label: 'Last 7 days', value: 'week', days: 7 },
  { label: 'Last 30 days', value: 'month', days: 30 },
  { label: 'Last 90 days', value: 'quarter', days: 90 },
  { label: 'Last 365 days', value: 'year', days: 365 },
  { label: 'Custom range', value: 'custom', days: 0 },
]

const metricOptions = [
  { label: 'Revenue', value: 'revenue' },
  { label: 'Orders', value: 'orders' },
  { label: 'Customers', value: 'customers' },
  { label: 'Conversion Rate', value: 'conversion' },
  { label: 'Average Order Value', value: 'aov' },
  { label: 'Customer Lifetime Value', value: 'clv' },
]

const categoryOptions = [
  { label: 'Devices', value: 'devices' },
  { label: 'Watches', value: 'watches' },
  { label: 'Bags', value: 'bags' },
  { label: 'Accessories', value: 'accessories' },
  { label: 'Clothing', value: 'clothing' },
]

const regionOptions = [
  { label: 'North America', value: 'north_america' },
  { label: 'Europe', value: 'europe' },
  { label: 'Asia Pacific', value: 'asia_pacific' },
  { label: 'Latin America', value: 'latin_america' },
  { label: 'Middle East & Africa', value: 'mea' },
]

const customerSegmentOptions = [
  { label: 'Enterprise', value: 'enterprise' },
  { label: 'SMB', value: 'smb' },
  { label: 'Individual', value: 'individual' },
  { label: 'Reseller', value: 'reseller' },
]

const AnalyticsFilters = ({
  filters,
  onFiltersChange,
  onApplyFilters,
  onResetFilters,
  isOpen,
  onToggle
}: AnalyticsFiltersProps) => {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters)

  const handleDatePresetChange = (preset: string) => {
    const newFilters = { ...localFilters }
    newFilters.dateRange.preset = preset
    
    if (preset !== 'custom') {
      const presetData = datePresets.find(p => p.value === preset)
      if (presetData) {
        const end = new Date()
        const start = dayjs().subtract(presetData.days, 'day').toDate()
        newFilters.dateRange.start = start
        newFilters.dateRange.end = end
      }
    }
    
    setLocalFilters(newFilters)
  }

  const handleCustomDateChange = (dates: [Date | null, Date | null]) => {
    const newFilters = { ...localFilters }
    newFilters.dateRange.start = dates[0]
    newFilters.dateRange.end = dates[1]
    newFilters.dateRange.preset = 'custom'
    setLocalFilters(newFilters)
  }

  const handleMetricChange = (metric: string, checked: boolean) => {
    const newFilters = { ...localFilters }
    if (checked) {
      newFilters.metrics = [...newFilters.metrics, metric]
    } else {
      newFilters.metrics = newFilters.metrics.filter(m => m !== metric)
    }
    setLocalFilters(newFilters)
  }

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newFilters = { ...localFilters }
    if (checked) {
      newFilters.categories = [...newFilters.categories, category]
    } else {
      newFilters.categories = newFilters.categories.filter(c => c !== category)
    }
    setLocalFilters(newFilters)
  }

  const handleRegionChange = (region: string, checked: boolean) => {
    const newFilters = { ...localFilters }
    if (checked) {
      newFilters.regions = [...newFilters.regions, region]
    } else {
      newFilters.regions = newFilters.regions.filter(r => r !== region)
    }
    setLocalFilters(newFilters)
  }

  const handleCustomerSegmentChange = (segment: string, checked: boolean) => {
    const newFilters = { ...localFilters }
    if (checked) {
      newFilters.customerSegments = [...newFilters.customerSegments, segment]
    } else {
      newFilters.customerSegments = newFilters.customerSegments.filter(s => s !== segment)
    }
    setLocalFilters(newFilters)
  }

  const handleApply = () => {
    onFiltersChange(localFilters)
    onApplyFilters()
  }

  const handleReset = () => {
    const resetFilters: FilterState = {
      dateRange: {
        start: dayjs().subtract(30, 'day').toDate(),
        end: new Date(),
        preset: 'month'
      },
      metrics: ['revenue', 'orders', 'customers', 'conversion'],
      categories: [],
      regions: [],
      customerSegments: []
    }
    setLocalFilters(resetFilters)
    onFiltersChange(resetFilters)
    onResetFilters()
  }

  if (!isOpen) {
    return (
      <Button
        size="sm"
        variant="twoTone"
        icon={<HiOutlineFilter />}
        onClick={onToggle}
      >
        Filters
      </Button>
    )
  }

  return (
    <Card className="p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
          Analytics Filters
        </h4>
        <Button
          size="sm"
          variant="plain"
          icon={<HiOutlineX />}
          onClick={onToggle}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Date Range
          </label>
          <Select
            size="sm"
            value={localFilters.dateRange.preset}
            options={datePresets}
            onChange={handleDatePresetChange}
            className="mb-3"
          />
          {localFilters.dateRange.preset === 'custom' && (
            <DatePicker
              size="sm"
              placeholder="Select date range"
              selectsRange
              startDate={localFilters.dateRange.start}
              endDate={localFilters.dateRange.end}
              onChange={handleCustomDateChange}
            />
          )}
        </div>

        {/* Metrics */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Metrics
          </label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {metricOptions.map(option => (
              <Checkbox
                key={option.value}
                checked={localFilters.metrics.includes(option.value)}
                onChange={(checked) => handleMetricChange(option.value, checked)}
              >
                {option.label}
              </Checkbox>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Categories
          </label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {categoryOptions.map(option => (
              <Checkbox
                key={option.value}
                checked={localFilters.categories.includes(option.value)}
                onChange={(checked) => handleCategoryChange(option.value, checked)}
              >
                {option.label}
              </Checkbox>
            ))}
          </div>
        </div>

        {/* Regions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Regions
          </label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {regionOptions.map(option => (
              <Checkbox
                key={option.value}
                checked={localFilters.regions.includes(option.value)}
                onChange={(checked) => handleRegionChange(option.value, checked)}
              >
                {option.label}
              </Checkbox>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Segments */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Customer Segments
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {customerSegmentOptions.map(option => (
            <Checkbox
              key={option.value}
              checked={localFilters.customerSegments.includes(option.value)}
              onChange={(checked) => handleCustomerSegmentChange(option.value, checked)}
            >
              {option.label}
            </Checkbox>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <Button
          size="sm"
          variant="plain"
          onClick={handleReset}
          icon={<HiOutlineRefresh />}
        >
          Reset
        </Button>
        <Button
          size="sm"
          variant="solid"
          onClick={handleApply}
        >
          Apply Filters
        </Button>
      </div>
    </Card>
  )
}

export default AnalyticsFilters