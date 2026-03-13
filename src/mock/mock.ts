import { createServer } from 'miragejs'

import appConfig from '@/configs/app.config'
import { seedDemoData, isDemoDataSeeded } from '@/utils/demoDataSeeder'

import {
  settingData,
  settingIntergrationData,
  settingBillingData,
  invoiceData,
  logData,
  accountFormData,
} from './data/accountData'
import { signInUserData } from './data/authData'
import { notificationListData, searchQueryPoolData } from './data/commonData'
import { 
  eventsData, 
  mailData, 
  crmDashboardData,
  contactsData,
  leadsData,
  opportunitiesData,
  pipelineStages,
  activityTypes,
} from './data/crmData'
import {
  portfolioData,
  walletsData,
  marketData,
  transactionHistoryData,
  cryptoDashboardData,
} from './data/cryptoData'
import {
  helpCenterCategoriesData,
  helpCenterArticleListData,
} from './data/knowledgeBaseData'
import {
  projectList,
  scrumboardData,
  issueData,
  projectDashboardData,
} from './data/projectData'
import {
  productsData,
  ordersData,
  orderDetailsData,
  salesDashboardData,
  customersData,
  inventoryData,
  categoriesData,
} from './data/salesData'
import { enhancedOrdersData } from './data/enhancedOrdersData'
import { usersData, userDetailData } from './data/usersData'
import {
  inventoryDashboardData,
  warehousesData,
  suppliersData,
  inventoryMovementsData,
  stockAlertsData,
  purchaseOrdersData,
} from './data/inventoryData'
import {
  analyticsDashboardData,
  performanceMetrics,
  forecastData,
} from './data/analyticsData'
import {
  commonFakeApi,
  projectFakeApi,
  crmFakeApi,
  salesFakeApi,
  accountFakeApi,
  cryptoFakeApi,
  authFakeApi,
  knowledgeBaseFakeApi,
  inventoryFakeApi,
  analyticsFakeApi,
} from './fakeApi'

const { apiPrefix } = appConfig

export function mockServer({ environment = 'test' }) {
  return createServer({
    environment,
    seeds(server) {
      // Get seeded demo data or use defaults
      const demoData = isDemoDataSeeded() ? seedDemoData() : null
      
      server.db.loadData({
        // Common data
        notificationListData,
        searchQueryPoolData,
        
        // Project data
        projectList,
        scrumboardData,
        issueData,
        projectDashboardData,
        
        // User data
        usersData,
        userDetailData,
        signInUserData,
        
        // Sales data - use seeded data if available
        productsData: demoData?.products || productsData,
        ordersData: demoData?.orders || ordersData,
        orderDetailsData,
        salesDashboardData: demoData?.salesDashboard || salesDashboardData,
        customersData: demoData?.customers || customersData,
        categoriesData: demoData?.categories || categoriesData,
        enhancedOrdersData: demoData?.enhancedOrders || enhancedOrdersData,
        
        // CRM data - use seeded data if available
        eventsData: demoData?.events || eventsData,
        mailData: demoData?.emails || mailData,
        crmDashboardData: demoData?.crmDashboard || crmDashboardData,
        contactsData: demoData?.contacts || contactsData,
        leadsData: demoData?.leads || leadsData,
        opportunitiesData: demoData?.opportunities || opportunitiesData,
        pipelineStages,
        activityTypes,
        
        // Inventory data - use seeded data if available
        inventoryData,
        inventoryDashboardData: demoData?.inventoryDashboard || inventoryDashboardData,
        warehousesData: demoData?.warehouses || warehousesData,
        suppliersData: demoData?.suppliers || suppliersData,
        inventoryMovementsData: demoData?.inventoryMovements || inventoryMovementsData,
        stockAlertsData: demoData?.stockAlerts || stockAlertsData,
        purchaseOrdersData: demoData?.purchaseOrders || purchaseOrdersData,
        
        // Analytics data - use seeded data if available
        analyticsDashboardData: demoData?.analyticsDashboard || analyticsDashboardData,
        performanceMetrics: demoData?.performanceMetrics || performanceMetrics,
        forecastData: demoData?.forecast || forecastData,
        
        // Account data
        settingData,
        settingIntergrationData,
        settingBillingData,
        invoiceData,
        logData,
        accountFormData,
        
        // Crypto data
        portfolioData,
        walletsData,
        marketData,
        transactionHistoryData,
        cryptoDashboardData,
        
        // Knowledge base data
        helpCenterCategoriesData,
        helpCenterArticleListData,
      })
      
      // Log demo data status
      if (demoData) {
        console.log('📊 Mock server loaded with seeded demo data')
      } else {
        console.log('📊 Mock server loaded with default data')
      }
    },
    routes() {
      if (environment === 'development') {
        this.passthrough('/shops/upload')
        // Add more passthroughs as needed
      }
      this.urlPrefix = ''
      this.namespace = ''
      this.passthrough(request => {
        const isExternal = request.url.startsWith('http')
        const isResource = request.url.startsWith('data:text')
        return isExternal || isResource
      })
      this.passthrough()

      commonFakeApi(this, apiPrefix)
      projectFakeApi(this, apiPrefix)
      crmFakeApi(this, apiPrefix)
      salesFakeApi(this, apiPrefix)
      accountFakeApi(this, apiPrefix)
      authFakeApi(this, apiPrefix)
      cryptoFakeApi(this, apiPrefix)
      knowledgeBaseFakeApi(this, apiPrefix)
      inventoryFakeApi(this, apiPrefix)
      analyticsFakeApi(this, apiPrefix)
    },
  })
}
