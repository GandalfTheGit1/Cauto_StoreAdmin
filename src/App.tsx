import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'

import Layout from '@/components/layouts'
import { ErrorBoundary } from '@/components/shared'
import DemoErrorBoundary from '@/components/shared/DemoErrorBoundary'
import Theme from '@/components/template/Theme'
import appConfig from '@/configs/app.config'
import { useDemoInitialization } from '@/utils/hooks/useDemoInitialization'
import { demoPerformanceMonitor } from '@/utils/demoPerformanceMonitor'

import './locales'
import mockServer from './mock'
import { AuthProvider } from './services/Supabase/Auth/AuthContext'
import store, { persistor } from './store'

const environment = import.meta.env.VITE_NODE_ENV

if (appConfig.enableMock) {
  if (environment === 'production') {
    mockServer({ environment: 'production' })
  }

  if (environment === 'development') {
    mockServer({ environment: 'development' })
  }

  console.log('mockServer is enabled')
  // mockServer()
} else {
  console.log('mockServer is disabled')
  // mockServer()
}

function DemoInitializer({ children }: { children: React.ReactNode }) {
  const { isInitialized, isLoading, error } = useDemoInitialization()
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing demo data...</p>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="mb-2">Failed to initialize demo data</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    )
  }
  
  return <>{children}</>
}

function App() {
  // Initialize performance monitoring
  React.useEffect(() => {
    if (appConfig.enablePerformanceMonitoring) {
      const startTime = performance.now()
      demoPerformanceMonitor.markDemoDataLoad(startTime)
    }
  }, [])

  const ErrorBoundaryComponent = appConfig.isDemoMode ? DemoErrorBoundary : ErrorBoundary

  return (
    <ErrorBoundaryComponent>
      <AuthProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <BrowserRouter>
              <Theme>
                <DemoInitializer>
                  <Layout />
                </DemoInitializer>
              </Theme>
            </BrowserRouter>
          </PersistGate>
        </Provider>
      </AuthProvider>
    </ErrorBoundaryComponent>
  )
}

export default App
