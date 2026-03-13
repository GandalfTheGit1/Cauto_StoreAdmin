import React, { useState } from 'react'
import { Button, Card, Tooltip } from '@/components/ui'
import { 
  HiOutlineQuestionMarkCircle, 
  HiOutlineX, 
  HiOutlinePlay,
  HiOutlineRefresh,
  HiOutlineInformationCircle
} from 'react-icons/hi'
import { useDemoTour } from '@/utils/hooks/useDemoTour'
import { DemoResetButton } from './DemoResetButton'
import { getDemoDataStats, getDemoScenarios } from '@/utils/demoDataSeeder'
import appConfig from '@/configs/app.config'

export interface DemoHelpPanelProps {
  className?: string
}

export function DemoHelpPanel({ className = '' }: DemoHelpPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { startTour, hasTourBeenCompleted } = useDemoTour()

  if (!appConfig.enableMock) return null

  const stats = getDemoDataStats()
  const scenarios = getDemoScenarios()

  const features = [
    {
      title: 'Sales Management',
      description: 'Create, edit, and manage products and orders',
      tips: ['Try adding a new product', 'Edit existing product details', 'Process customer orders']
    },
    {
      title: 'Inventory Tracking',
      description: 'Monitor stock levels and manage suppliers',
      tips: ['Check low stock alerts', 'View inventory movements', 'Manage supplier information']
    },
    {
      title: 'CRM System',
      description: 'Manage customer relationships and sales pipeline',
      tips: ['Add new contacts', 'Track sales opportunities', 'Manage customer communications']
    },
    {
      title: 'Analytics Dashboard',
      description: 'View business insights and performance metrics',
      tips: ['Explore interactive charts', 'Filter data by date ranges', 'Monitor KPIs and trends']
    }
  ]

  return (
    <>
      {/* Help Button */}
      <Tooltip title="Demo Help & Information">
        <Button
          variant="plain"
          size="sm"
          className={`fixed bottom-4 right-4 z-40 shadow-lg ${className}`}
          onClick={() => setIsOpen(true)}
          icon={<HiOutlineQuestionMarkCircle />}
        >
          Help
        </Button>
      </Tooltip>

      {/* Help Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsOpen(false)} />
          
          <Card className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto z-10">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <HiOutlineInformationCircle className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Demo Help & Information
                  </h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <HiOutlineX className="w-5 h-5" />
                </button>
              </div>

              {/* Demo Stats */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Demo Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-blue-800">{stats.totalProducts}</div>
                    <div className="text-blue-600">Products</div>
                  </div>
                  <div>
                    <div className="font-medium text-blue-800">{stats.totalCustomers}</div>
                    <div className="text-blue-600">Customers</div>
                  </div>
                  <div>
                    <div className="font-medium text-blue-800">{stats.totalOrders}</div>
                    <div className="text-blue-600">Orders</div>
                  </div>
                  <div>
                    <div className="font-medium text-blue-800">{stats.scenarios}</div>
                    <div className="text-blue-600">Scenarios</div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-blue-600">
                  Last updated: {stats.lastSeeded}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="solid"
                    size="sm"
                    onClick={() => {
                      setIsOpen(false)
                      startTour()
                    }}
                    icon={<HiOutlinePlay />}
                  >
                    {hasTourBeenCompleted ? 'Restart Tour' : 'Start Tour'}
                  </Button>
                  <DemoResetButton size="sm" variant="default" />
                </div>
              </div>

              {/* Features Guide */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Features Guide</h3>
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">{feature.title}</h4>
                      <p className="text-gray-600 text-sm mb-3">{feature.description}</p>
                      <div className="space-y-1">
                        <div className="text-xs font-medium text-gray-700">Try these:</div>
                        {feature.tips.map((tip, tipIndex) => (
                          <div key={tipIndex} className="text-xs text-gray-600 flex items-center">
                            <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                            {tip}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Demo Scenarios */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Demo Scenarios</h3>
                <div className="space-y-3">
                  {Object.entries(scenarios).map(([key, scenario]) => (
                    <div key={key} className="border-l-4 border-blue-500 pl-4 py-2">
                      <h4 className="font-medium text-gray-900 text-sm">{scenario.name}</h4>
                      <p className="text-gray-600 text-xs mt-1">{scenario.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>Orders: {scenario.orderCount}</span>
                        <span>Spent: ${scenario.totalSpent.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">💡 Tips</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• All data changes are temporary and reset on page reload</li>
                  <li>• Try creating, editing, and deleting items to see full functionality</li>
                  <li>• Use filters and search to explore data management features</li>
                  <li>• Check out the analytics dashboard for interactive charts</li>
                  <li>• This demo works entirely offline - no backend required!</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}

export default DemoHelpPanel