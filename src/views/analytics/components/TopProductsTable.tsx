import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { HiOutlineTrendingUp, HiOutlineTrendingDown } from 'react-icons/hi'
import type { TopProduct } from '../store/analyticsDashboardSlice'

type TopProductsTableProps = {
  data?: TopProduct[]
  className?: string
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    'Devices': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    'Watches': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    'Bags': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
    'Accessories': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
    'Clothing': 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400',
  }
  return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
}

const TopProductsTable = ({ data, className }: TopProductsTableProps) => {
  if (!data) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="w-32 h-6 bg-gray-200 dark:bg-gray-700 rounded mb-6" />
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="flex-1 space-y-2">
                  <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="w-1/2 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
                <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            ))}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className={`p-6 ${className}`}>
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
          Top Performing Products
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Best selling products by revenue and growth
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                Rank
              </th>
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                Product
              </th>
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                Category
              </th>
              <th className="text-right py-3 px-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                Revenue
              </th>
              <th className="text-right py-3 px-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                Units
              </th>
              <th className="text-right py-3 px-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                Growth
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((product, index) => (
              <tr 
                key={product.id} 
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <td className="py-4 px-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {index + 1}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-2">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      ID: {product.id}
                    </p>
                  </div>
                </td>
                <td className="py-4 px-2">
                  <Badge className={getCategoryColor(product.category)}>
                    {product.category}
                  </Badge>
                </td>
                <td className="py-4 px-2 text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(product.revenue)}
                  </p>
                </td>
                <td className="py-4 px-2 text-right">
                  <p className="text-gray-700 dark:text-gray-300">
                    {product.units}
                  </p>
                </td>
                <td className="py-4 px-2 text-right">
                  <div className={`flex items-center justify-end space-x-1 ${
                    product.growth >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {product.growth >= 0 ? (
                      <HiOutlineTrendingUp className="w-4 h-4" />
                    ) : (
                      <HiOutlineTrendingDown className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium">
                      {Math.abs(product.growth).toFixed(1)}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(data.reduce((sum, product) => sum + product.revenue, 0))}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {data.reduce((sum, product) => sum + product.units, 0)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Units</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">
              {(data.reduce((sum, product) => sum + product.growth, 0) / data.length).toFixed(1)}%
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Avg Growth</p>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default TopProductsTable