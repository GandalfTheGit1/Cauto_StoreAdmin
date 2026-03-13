import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button, Card, Alert } from '@/components/ui'
import { HiOutlineRefresh, HiOutlineExclamationTriangle } from 'react-icons/hi'
import appConfig from '@/configs/app.config'
import { resetDemoData } from '@/utils/demoDataSeeder'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  errorId: string
}

export class DemoErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    })

    // Log error for demo purposes
    if (appConfig.enableMock) {
      console.group('🚨 Demo Error Boundary Caught Error')
      console.error('Error:', error)
      console.error('Error Info:', errorInfo)
      console.error('Component Stack:', errorInfo.componentStack)
      console.groupEnd()
    }

    // In a real app, you would send this to an error reporting service
    this.logErrorToService(error, errorInfo)
  }

  logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    // Demo error logging - in production this would go to a service like Sentry
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      errorId: this.state.errorId,
      isDemoMode: appConfig.enableMock
    }

    // Store in localStorage for demo purposes
    try {
      const existingErrors = JSON.parse(localStorage.getItem('demo-error-reports') || '[]')
      existingErrors.push(errorReport)
      // Keep only last 10 errors
      const recentErrors = existingErrors.slice(-10)
      localStorage.setItem('demo-error-reports', JSON.stringify(recentErrors))
    } catch (e) {
      console.warn('Could not store error report:', e)
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    })
  }

  handleResetDemo = () => {
    try {
      resetDemoData()
      window.location.reload()
    } catch (error) {
      console.error('Failed to reset demo:', error)
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
          <Card className="w-full max-w-2xl">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <HiOutlineExclamationTriangle className="w-8 h-8 text-red-500 mr-3" />
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    Oops! Something went wrong
                  </h1>
                  <p className="text-gray-600 text-sm">
                    Error ID: {this.state.errorId}
                  </p>
                </div>
              </div>

              {appConfig.enableMock && (
                <Alert type="info" className="mb-4">
                  This is a demo environment. The error has been logged for debugging purposes.
                </Alert>
              )}

              <div className="mb-6">
                <p className="text-gray-700 mb-4">
                  We apologize for the inconvenience. You can try the following options:
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="solid"
                      onClick={this.handleRetry}
                      icon={<HiOutlineRefresh />}
                    >
                      Try Again
                    </Button>
                    <span className="text-sm text-gray-600">
                      Retry the last action
                    </span>
                  </div>

                  {appConfig.enableMock && (
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="default"
                        onClick={this.handleResetDemo}
                        icon={<HiOutlineRefresh />}
                      >
                        Reset Demo
                      </Button>
                      <span className="text-sm text-gray-600">
                        Reset all demo data and reload
                      </span>
                    </div>
                  )}

                  <div className="flex items-center space-x-3">
                    <Button
                      variant="plain"
                      onClick={() => window.location.reload()}
                    >
                      Reload Page
                    </Button>
                    <span className="text-sm text-gray-600">
                      Refresh the entire application
                    </span>
                  </div>
                </div>
              </div>

              {/* Error details for demo mode */}
              {appConfig.enableMock && this.state.error && (
                <details className="mt-6">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2">
                    Technical Details (Demo Mode)
                  </summary>
                  <div className="bg-gray-100 rounded p-3 text-xs font-mono">
                    <div className="mb-2">
                      <strong>Error:</strong> {this.state.error.message}
                    </div>
                    {this.state.error.stack && (
                      <div className="mb-2">
                        <strong>Stack:</strong>
                        <pre className="whitespace-pre-wrap mt-1">
                          {this.state.error.stack}
                        </pre>
                      </div>
                    )}
                    {this.state.errorInfo?.componentStack && (
                      <div>
                        <strong>Component Stack:</strong>
                        <pre className="whitespace-pre-wrap mt-1">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}
            </div>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

export default DemoErrorBoundary