export type AppConfig = {
  apiPrefix: string
  authenticatedEntryPath: string
  unAuthenticatedEntryPath: string
  authenticatedEntryPathForSellers: string
  tourPath: string
  locale: string
  enableMock: boolean
  // Demo-specific configurations
  isDemoMode: boolean
  enableDemoTour: boolean
  enableDemoReset: boolean
  enableHelpPanel: boolean
  enablePerformanceMonitoring: boolean
}

const appConfig: AppConfig = {
  apiPrefix: import.meta.env.VITE_API_PREFIX || '/api',
  authenticatedEntryPath: '/app/sales/product-list',
  authenticatedEntryPathForSellers: '/app/sales/leaderboardSellers',
  unAuthenticatedEntryPath: '/sign-in',
  tourPath: '/app/account/kyc-form',
  locale: 'es',
  enableMock: import.meta.env.VITE_ENABLE_MOCK === 'true' || true,
  
  // Demo-specific configurations
  isDemoMode: import.meta.env.VITE_DEMO_MODE === 'true' || false,
  enableDemoTour: import.meta.env.VITE_ENABLE_DEMO_TOUR === 'true' || true,
  enableDemoReset: import.meta.env.VITE_ENABLE_DEMO_RESET === 'true' || true,
  enableHelpPanel: import.meta.env.VITE_ENABLE_HELP_PANEL === 'true' || true,
  enablePerformanceMonitoring: import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING === 'true' || true,
}

export default appConfig
