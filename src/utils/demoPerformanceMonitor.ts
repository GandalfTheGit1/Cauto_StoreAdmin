/**
 * Demo Performance Monitor
 * 
 * Monitors and reports performance metrics for the demo application
 */

import appConfig from '@/configs/app.config'

export interface PerformanceMetrics {
  // Core Web Vitals
  fcp?: number // First Contentful Paint
  lcp?: number // Largest Contentful Paint
  fid?: number // First Input Delay
  cls?: number // Cumulative Layout Shift
  
  // Custom metrics
  demoDataLoadTime?: number
  tourInitTime?: number
  navigationTime?: number
  
  // Resource metrics
  jsSize?: number
  cssSize?: number
  imageSize?: number
  totalSize?: number
  
  // Runtime metrics
  memoryUsage?: number
  renderTime?: number
  
  // Timestamps
  timestamp: number
  sessionId: string
}

class DemoPerformanceMonitor {
  private metrics: PerformanceMetrics
  private observer?: PerformanceObserver
  private sessionId: string

  constructor() {
    this.sessionId = `demo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    this.metrics = {
      timestamp: Date.now(),
      sessionId: this.sessionId
    }
    
    if (appConfig.enableMock) {
      this.initializeMonitoring()
    }
  }

  private initializeMonitoring() {
    // Monitor Core Web Vitals
    this.observeWebVitals()
    
    // Monitor resource loading
    this.observeResourceTiming()
    
    // Monitor navigation timing
    this.observeNavigationTiming()
    
    // Monitor memory usage (if available)
    this.observeMemoryUsage()
    
    // Report metrics periodically
    this.startPeriodicReporting()
  }

  private observeWebVitals() {
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1] as any
        this.metrics.lcp = lastEntry.startTime
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          this.metrics.fid = entry.processingStart - entry.startTime
        })
      })
      fidObserver.observe({ entryTypes: ['first-input'] })

      // Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        })
        this.metrics.cls = clsValue
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })
    }

    // First Contentful Paint (from navigation timing)
    if ('performance' in window && 'getEntriesByType' in performance) {
      const paintEntries = performance.getEntriesByType('paint')
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint')
      if (fcpEntry) {
        this.metrics.fcp = fcpEntry.startTime
      }
    }
  }

  private observeResourceTiming() {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const resourceEntries = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
      
      let jsSize = 0
      let cssSize = 0
      let imageSize = 0
      
      resourceEntries.forEach(entry => {
        const size = entry.transferSize || 0
        
        if (entry.name.includes('.js')) {
          jsSize += size
        } else if (entry.name.includes('.css')) {
          cssSize += size
        } else if (entry.name.match(/\.(png|jpg|jpeg|gif|svg|webp)$/i)) {
          imageSize += size
        }
      })
      
      this.metrics.jsSize = jsSize
      this.metrics.cssSize = cssSize
      this.metrics.imageSize = imageSize
      this.metrics.totalSize = jsSize + cssSize + imageSize
    }
  }

  private observeNavigationTiming() {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]
      if (navEntries.length > 0) {
        const navEntry = navEntries[0]
        this.metrics.navigationTime = navEntry.loadEventEnd - navEntry.navigationStart
      }
    }
  }

  private observeMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      this.metrics.memoryUsage = memory.usedJSHeapSize
    }
  }

  private startPeriodicReporting() {
    // Report metrics every 30 seconds
    setInterval(() => {
      this.reportMetrics()
    }, 30000)

    // Report on page unload
    window.addEventListener('beforeunload', () => {
      this.reportMetrics()
    })
  }

  // Public methods
  public markDemoDataLoad(startTime: number) {
    this.metrics.demoDataLoadTime = Date.now() - startTime
  }

  public markTourInit(startTime: number) {
    this.metrics.tourInitTime = Date.now() - startTime
  }

  public markRenderTime(componentName: string, renderTime: number) {
    this.metrics.renderTime = renderTime
    console.log(`🎯 ${componentName} render time: ${renderTime}ms`)
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }

  public reportMetrics() {
    if (!appConfig.enableMock) return

    const report = {
      ...this.metrics,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    }

    // Log to console for demo purposes
    console.group('📊 Demo Performance Report')
    console.table(this.metrics)
    console.groupEnd()

    // Store in localStorage for demo purposes
    try {
      const existingReports = JSON.parse(localStorage.getItem('demo-performance-reports') || '[]')
      existingReports.push(report)
      // Keep only last 10 reports
      const recentReports = existingReports.slice(-10)
      localStorage.setItem('demo-performance-reports', JSON.stringify(recentReports))
    } catch (error) {
      console.warn('Could not store performance report:', error)
    }

    // In a real app, you would send this to an analytics service
    this.sendToAnalytics(report)
  }

  private sendToAnalytics(report: any) {
    // Demo analytics - in production this would go to Google Analytics, etc.
    if (typeof gtag !== 'undefined') {
      gtag('event', 'performance_report', {
        custom_parameter: JSON.stringify(report)
      })
    }
  }

  public getPerformanceGrade(): 'A' | 'B' | 'C' | 'D' | 'F' {
    const { fcp, lcp, fid, cls } = this.metrics
    
    let score = 0
    
    // FCP scoring (0-25 points)
    if (fcp && fcp < 1800) score += 25
    else if (fcp && fcp < 3000) score += 15
    else if (fcp && fcp < 4200) score += 5
    
    // LCP scoring (0-25 points)
    if (lcp && lcp < 2500) score += 25
    else if (lcp && lcp < 4000) score += 15
    else if (lcp && lcp < 5500) score += 5
    
    // FID scoring (0-25 points)
    if (fid && fid < 100) score += 25
    else if (fid && fid < 300) score += 15
    else if (fid && fid < 500) score += 5
    
    // CLS scoring (0-25 points)
    if (cls && cls < 0.1) score += 25
    else if (cls && cls < 0.25) score += 15
    else if (cls && cls < 0.4) score += 5
    
    if (score >= 90) return 'A'
    if (score >= 80) return 'B'
    if (score >= 70) return 'C'
    if (score >= 60) return 'D'
    return 'F'
  }
}

// Create singleton instance
export const demoPerformanceMonitor = new DemoPerformanceMonitor()

// Export utility functions
export function measureRenderTime<T extends (...args: any[]) => any>(
  fn: T,
  componentName: string
): T {
  return ((...args: any[]) => {
    const startTime = performance.now()
    const result = fn(...args)
    const endTime = performance.now()
    demoPerformanceMonitor.markRenderTime(componentName, endTime - startTime)
    return result
  }) as T
}

export function withPerformanceMonitoring<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
): React.ComponentType<P> {
  return (props: P) => {
    const startTime = performance.now()
    
    React.useEffect(() => {
      const endTime = performance.now()
      demoPerformanceMonitor.markRenderTime(componentName, endTime - startTime)
    }, [])
    
    return React.createElement(Component, props)
  }
}

export default demoPerformanceMonitor