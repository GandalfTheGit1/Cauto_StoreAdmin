import { useState, useEffect } from 'react'
import { useAppSelector } from '@/store/hook'
import { getCacheStats } from '@/store/utils/performanceUtils'

interface PerformanceStats {
  stateSize: number
  cacheStats: {
    size: number
    keys: string[]
    totalMemory: number
  }
  memoryUsage?: {
    used: number
    total: number
    limit: number
  }
  renderCount: number
}

interface PerformanceMonitorProps {
  enabled?: boolean
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  className?: string
}

const PerformanceMonitor = ({ 
  enabled = process.env.NODE_ENV === 'development',
  position = 'bottom-right',
  className = ''
}: PerformanceMonitorProps) => {
  const [stats, setStats] = useState<PerformanceStats>({
    stateSize: 0,
    cacheStats: { size: 0, keys: [], totalMemory: 0 },
    renderCount: 0
  })
  const [isVisible, setIsVisible] = useState(false)
  
  // Get the entire state to calculate size
  const state = useAppSelector(state => state)
  
  useEffect(() => {
    if (!enabled) return
    
    const updateStats = () => {
      const stateSize = JSON.stringify(state).length
      const cacheStats = getCacheStats()
      
      let memoryUsage: { used: number; total: number; limit: number } | undefined
      if ('memory' in performance) {
        const memInfo = (performance as any).memory
        memoryUsage = {
          used: memInfo.usedJSHeapSize,
          total: memInfo.totalJSHeapSize,
          limit: memInfo.jsHeapSizeLimit
        }
      }
      
      setStats(prev => ({
        stateSize,
        cacheStats,
        memoryUsage,
        renderCount: prev.renderCount + 1
      }))
    }
    
    updateStats()
    
    // Update stats every 5 seconds
    const interval = setInterval(updateStats, 5000)
    
    return () => clearInterval(interval)
  }, [enabled, state])
  
  if (!enabled) return null
  
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  }
  
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
  
  return (
    <div className={`fixed ${positionClasses[position]} z-50 ${className}`}>
      <div className="bg-gray-900 text-white text-xs rounded-lg shadow-lg">
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="w-full px-3 py-2 text-left hover:bg-gray-800 rounded-lg transition-colors"
        >
          📊 Performance {isVisible ? '▼' : '▶'}
        </button>
        
        {isVisible && (
          <div className="p-3 border-t border-gray-700 space-y-2 min-w-64">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-gray-400">State Size:</div>
                <div className="font-mono">{formatBytes(stats.stateSize)}</div>
              </div>
              
              <div>
                <div className="text-gray-400">Renders:</div>
                <div className="font-mono">{stats.renderCount}</div>
              </div>
              
              <div>
                <div className="text-gray-400">Cache Entries:</div>
                <div className="font-mono">{stats.cacheStats.size}</div>
              </div>
              
              <div>
                <div className="text-gray-400">Cache Memory:</div>
                <div className="font-mono">{formatBytes(stats.cacheStats.totalMemory)}</div>
              </div>
              
              {stats.memoryUsage && (
                <>
                  <div>
                    <div className="text-gray-400">Heap Used:</div>
                    <div className="font-mono">{formatBytes(stats.memoryUsage.used)}</div>
                  </div>
                  
                  <div>
                    <div className="text-gray-400">Heap Total:</div>
                    <div className="font-mono">{formatBytes(stats.memoryUsage.total)}</div>
                  </div>
                </>
              )}
            </div>
            
            {stats.cacheStats.keys.length > 0 && (
              <div>
                <div className="text-gray-400 mb-1">Cache Keys:</div>
                <div className="max-h-32 overflow-y-auto">
                  {stats.cacheStats.keys.map(key => (
                    <div key={key} className="font-mono text-xs text-gray-300">
                      {key}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="pt-2 border-t border-gray-700">
              <button
                onClick={() => {
                  import('@/store/utils/performanceUtils').then(({ clearSelectorCache }) => {
                    clearSelectorCache()
                    console.log('Selector cache cleared')
                  })
                }}
                className="text-xs bg-red-600 hover:bg-red-700 px-2 py-1 rounded transition-colors"
              >
                Clear Cache
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PerformanceMonitor