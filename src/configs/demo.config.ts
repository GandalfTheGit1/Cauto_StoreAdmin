/**
 * Demo-specific configuration for optimized deployment
 */

export interface DemoConfig {
  // Performance settings
  enableServiceWorker: boolean
  enableCodeSplitting: boolean
  enableAssetOptimization: boolean
  
  // Caching strategies
  cacheStaticAssets: boolean
  cacheDuration: number
  
  // Error handling
  enableErrorReporting: boolean
  enablePerformanceMonitoring: boolean
  
  // Demo features
  enableDemoTour: boolean
  enableDemoReset: boolean
  enableHelpPanel: boolean
  
  // Build optimization
  enableMinification: boolean
  enableTreeShaking: boolean
  enableGzipCompression: boolean
}

const demoConfig: DemoConfig = {
  // Performance settings
  enableServiceWorker: true,
  enableCodeSplitting: true,
  enableAssetOptimization: true,
  
  // Caching strategies
  cacheStaticAssets: true,
  cacheDuration: 24 * 60 * 60 * 1000, // 24 hours
  
  // Error handling
  enableErrorReporting: true,
  enablePerformanceMonitoring: true,
  
  // Demo features
  enableDemoTour: true,
  enableDemoReset: true,
  enableHelpPanel: true,
  
  // Build optimization
  enableMinification: true,
  enableTreeShaking: true,
  enableGzipCompression: true,
}

export default demoConfig