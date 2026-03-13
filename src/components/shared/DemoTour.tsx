import React, { useState, useEffect } from 'react'
import { Button, Dialog, Card } from '@/components/ui'
import { HiOutlineX, HiOutlineArrowRight, HiOutlineArrowLeft } from 'react-icons/hi'
import { useNavigate, useLocation } from 'react-router-dom'
import appConfig from '@/configs/app.config'

export interface TourStep {
  id: string
  title: string
  content: string
  target?: string
  route?: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  action?: () => void
}

export interface DemoTourProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
  steps: TourStep[]
}

const defaultTourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Elstar Dashboard Demo',
    content: 'This is a fully functional admin dashboard showcasing sales management, inventory tracking, CRM, and analytics. Let\'s take a quick tour of the key features.',
    route: '/app/sales/product-list'
  },
  {
    id: 'sales',
    title: 'Sales Management',
    content: 'Manage your products, orders, and customers. View sales performance and track revenue growth with comprehensive analytics.',
    route: '/app/sales/product-list',
    target: '[data-tour="sales-nav"]'
  },
  {
    id: 'inventory',
    title: 'Inventory Tracking',
    content: 'Monitor stock levels, track inventory movements, and manage suppliers. Get alerts for low stock and automate reordering.',
    route: '/app/inventory/product-list',
    target: '[data-tour="inventory-nav"]'
  },
  {
    id: 'crm',
    title: 'Customer Relationship Management',
    content: 'Manage contacts, track leads, and monitor sales opportunities. Build stronger customer relationships with comprehensive CRM tools.',
    route: '/app/crm/dashboard',
    target: '[data-tour="crm-nav"]'
  },
  {
    id: 'analytics',
    title: 'Analytics & Reporting',
    content: 'Get insights into your business performance with interactive charts, KPIs, and forecasting tools.',
    route: '/app/analytics/dashboard',
    target: '[data-tour="analytics-nav"]'
  },
  {
    id: 'demo-features',
    title: 'Demo Features',
    content: 'This demo includes realistic sample data, interactive CRUD operations, and all features work without requiring a backend. Try creating, editing, or deleting items to see the system in action.',
  },
  {
    id: 'complete',
    title: 'Tour Complete!',
    content: 'You\'re all set! Explore the dashboard and try out different features. You can restart this tour anytime from the help menu.',
  }
]

export function DemoTour({ 
  isOpen, 
  onClose, 
  onComplete, 
  steps = defaultTourSteps 
}: DemoTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isNavigating, setIsNavigating] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const step = steps[currentStep]
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === steps.length - 1

  useEffect(() => {
    if (!isOpen || !step?.route) return

    const navigateToRoute = async () => {
      if (location.pathname !== step.route) {
        setIsNavigating(true)
        navigate(step.route!)
        // Wait for navigation to complete
        setTimeout(() => setIsNavigating(false), 500)
      }
    }

    navigateToRoute()
  }, [currentStep, isOpen, step?.route, navigate, location.pathname])

  const handleNext = () => {
    if (step?.action) {
      step.action()
    }
    
    if (isLastStep) {
      onComplete()
      onClose()
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSkip = () => {
    onClose()
  }

  if (!isOpen || !appConfig.enableMock) return null

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      className="demo-tour-dialog"
    >
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        
        <Card className="relative w-full max-w-md mx-auto z-10">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">
                    {currentStep + 1}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {currentStep + 1} of {steps.length}
                </span>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>

            {/* Content */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {step?.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step?.content}
              </p>
              
              {isNavigating && (
                <div className="mt-4 flex items-center text-sm text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  Navigating...
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                {!isFirstStep && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handlePrevious}
                    disabled={isNavigating}
                    className="flex items-center"
                  >
                    <HiOutlineArrowLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                )}
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="plain"
                  size="sm"
                  onClick={handleSkip}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Skip Tour
                </Button>
                <Button
                  variant="solid"
                  size="sm"
                  onClick={handleNext}
                  disabled={isNavigating}
                  className="flex items-center"
                >
                  {isLastStep ? 'Get Started' : 'Next'}
                  {!isLastStep && <HiOutlineArrowRight className="w-4 h-4 ml-1" />}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Dialog>
  )
}

export default DemoTour