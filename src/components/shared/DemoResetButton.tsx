import React, { useState } from 'react'
import { Button, Dialog, Alert } from '@/components/ui'
import { HiOutlineRefresh, HiOutlineExclamationTriangle } from 'react-icons/hi'
import { resetDemoData } from '@/utils/demoDataSeeder'
import { useDemoTour } from '@/utils/hooks/useDemoTour'
import appConfig from '@/configs/app.config'

export interface DemoResetButtonProps {
  className?: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  variant?: 'solid' | 'twoTone' | 'plain' | 'default'
}

export function DemoResetButton({ 
  className = '', 
  size = 'sm',
  variant = 'plain' 
}: DemoResetButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const { resetTour } = useDemoTour()

  if (!appConfig.enableMock) return null

  const handleReset = async () => {
    setIsResetting(true)
    
    try {
      // Reset demo data
      resetDemoData()
      
      // Reset tour status
      resetTour()
      
      // Clear any other demo-related localStorage
      const keysToRemove = Object.keys(localStorage).filter(key => 
        key.startsWith('elstar-') || key.includes('demo')
      )
      keysToRemove.forEach(key => localStorage.removeItem(key))
      
      // Reload the page to reinitialize everything
      setTimeout(() => {
        window.location.reload()
      }, 500)
      
    } catch (error) {
      console.error('Failed to reset demo:', error)
      setIsResetting(false)
    }
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={`flex items-center ${className}`}
        onClick={() => setIsDialogOpen(true)}
        icon={<HiOutlineRefresh />}
      >
        Reset Demo
      </Button>

      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onRequestClose={() => setIsDialogOpen(false)}
      >
        <div className="p-6 max-w-md">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mr-3">
              <HiOutlineExclamationTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Reset Demo Data
            </h3>
          </div>

          <div className="mb-6">
            <Alert type="warning" className="mb-4">
              This will reset all demo data and restart the tour. The page will reload automatically.
            </Alert>
            
            <p className="text-gray-600 text-sm">
              This action will:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
              <li>Reset all sample data to initial state</li>
              <li>Clear any changes you've made</li>
              <li>Restart the demo tour</li>
              <li>Reload the application</li>
            </ul>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              variant="plain"
              onClick={() => setIsDialogOpen(false)}
              disabled={isResetting}
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              color="red"
              onClick={handleReset}
              loading={isResetting}
              className="flex items-center"
            >
              {isResetting ? 'Resetting...' : 'Reset Demo'}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  )
}

export default DemoResetButton