/**
 * Demo Data Seeder
 * 
 * This utility populates the application with comprehensive, realistic sample data
 * for demonstration purposes. It creates diverse user scenarios and maintains
 * proper data relationships across all modules.
 */

import { 
  productsData, 
  customersData, 
  ordersData, 
  salesDashboardData,
  categoriesData 
} from '@/mock/data/salesData'
import { enhancedOrdersData } from '@/mock/data/enhancedOrdersData'
import { 
  contactsData, 
  leadsData, 
  opportunitiesData, 
  crmDashboardData,
  eventsData,
  mailData 
} from '@/mock/data/crmData'
import { 
  inventoryDashboardData,
  warehousesData,
  suppliersData,
  inventoryMovementsData,
  stockAlertsData,
  purchaseOrdersData 
} from '@/mock/data/inventoryData'
import { 
  analyticsDashboardData, 
  performanceMetrics, 
  forecastData 
} from '@/mock/data/analyticsData'

export interface DemoDataSeed {
  // Sales module data
  products: typeof productsData
  customers: typeof customersData
  orders: typeof ordersData
  enhancedOrders: typeof enhancedOrdersData
  salesDashboard: typeof salesDashboardData
  categories: typeof categoriesData
  
  // CRM module data
  contacts: typeof contactsData
  leads: typeof leadsData
  opportunities: typeof opportunitiesData
  crmDashboard: typeof crmDashboardData
  events: typeof eventsData
  emails: typeof mailData
  
  // Inventory module data
  inventoryDashboard: typeof inventoryDashboardData
  warehouses: typeof warehousesData
  suppliers: typeof suppliersData
  inventoryMovements: typeof inventoryMovementsData
  stockAlerts: typeof stockAlertsData
  purchaseOrders: typeof purchaseOrdersData
  
  // Analytics module data
  analyticsDashboard: typeof analyticsDashboardData
  performanceMetrics: typeof performanceMetrics
  forecast: typeof forecastData
  
  // Metadata
  seededAt: number
  version: string
}

/**
 * Demo user scenarios for different use cases
 */
export const demoScenarios = {
  // Enterprise customer with large orders
  enterprise: {
    customerId: 'cust-001',
    name: 'John Smith - Enterprise Customer',
    description: 'Large enterprise customer with high-value orders and multiple touchpoints',
    orderCount: 15,
    totalSpent: 2847.50,
    crmOpportunities: ['opp-001'],
    inventoryImpact: 'high'
  },
  
  // Growing startup with potential
  startup: {
    customerId: 'cust-002', 
    name: 'Sarah Johnson - Startup Founder',
    description: 'Fast-growing startup with increasing order frequency',
    orderCount: 8,
    totalSpent: 1456.75,
    crmOpportunities: ['opp-002'],
    inventoryImpact: 'medium'
  },
  
  // Loyal individual customer
  individual: {
    customerId: 'cust-003',
    name: 'Michael Brown - Loyal Customer',
    description: 'Long-term individual customer with consistent purchasing pattern',
    orderCount: 22,
    totalSpent: 4123.25,
    crmOpportunities: [],
    inventoryImpact: 'medium'
  },
  
  // Inactive customer for retention scenarios
  inactive: {
    customerId: 'cust-004',
    name: 'Emily Davis - Inactive Customer',
    description: 'Previously active customer who needs re-engagement',
    orderCount: 3,
    totalSpent: 567.80,
    crmOpportunities: [],
    inventoryImpact: 'low'
  }
}

/**
 * Generates additional demo data to supplement existing mock data
 */
export function generateAdditionalDemoData(): Partial<DemoDataSeed> {
  const now = Date.now()
  
  // Generate additional products for better variety
  const additionalProducts = [
    {
      id: '28',
      name: 'Smart Home Hub',
      productCode: 'BIS-028',
      img: '/img/products/product-5.jpg',
      imgList: [{ id: '28-img-0', name: 'image-1', img: '/img/products/product-5.jpg' }],
      category: 'devices',
      subcategory: 'smart_home',
      price: 299,
      stock: 65,
      status: 0,
      costPerItem: 180,
      bulkDiscountPrice: 270,
      taxRate: 6,
      tags: ['smart', 'home', 'iot'],
      brand: 'SmartTech',
      vendor: 'IoT Solutions Ltd',
      sku: 'ST-HUB-028',
      weight: 0.8,
      dimensions: '15x15x5 cm',
      warranty: '3 years',
      rating: 4.6,
      reviewCount: 189,
      createdAt: new Date('2023-09-01').getTime(),
      updatedAt: new Date('2024-11-03').getTime(),
      description: '<p>Advanced smart home hub with voice control and automation capabilities.</p><br/><ul><li>Voice control with Alexa and Google Assistant</li><li>Supports 100+ smart devices</li><li>Advanced automation rules</li><li>Mobile app control</li><li>Local processing for privacy</li></ul>',
    },
    {
      id: '29',
      name: 'Wireless Charging Pad',
      productCode: 'BIS-029',
      img: '/img/products/product-6.jpg',
      imgList: [{ id: '29-img-0', name: 'image-1', img: '/img/products/product-6.jpg' }],
      category: 'accessories',
      subcategory: 'charging',
      price: 49,
      stock: 150,
      status: 0,
      costPerItem: 25,
      bulkDiscountPrice: 44,
      taxRate: 6,
      tags: ['wireless', 'charging', 'qi'],
      brand: 'ChargeTech',
      vendor: 'Power Solutions Inc',
      sku: 'CT-PAD-029',
      weight: 0.3,
      dimensions: '10x10x1 cm',
      warranty: '2 years',
      rating: 4.2,
      reviewCount: 267,
      createdAt: new Date('2023-11-15').getTime(),
      updatedAt: new Date('2024-10-30').getTime(),
      description: '<p>Fast wireless charging pad compatible with all Qi-enabled devices.</p><br/><ul><li>15W fast wireless charging</li><li>Universal Qi compatibility</li><li>LED charging indicator</li><li>Non-slip surface</li><li>Overcharge protection</li></ul>',
    },
    {
      id: '30',
      name: 'Bluetooth Speaker Pro',
      productCode: 'BIS-030',
      img: '/img/products/product-7.jpg',
      imgList: [{ id: '30-img-0', name: 'image-1', img: '/img/products/product-7.jpg' }],
      category: 'devices',
      subcategory: 'audio',
      price: 159,
      stock: 88,
      status: 0,
      costPerItem: 95,
      bulkDiscountPrice: 145,
      taxRate: 6,
      tags: ['bluetooth', 'speaker', 'portable'],
      brand: 'AudioMax',
      vendor: 'Sound Systems Ltd',
      sku: 'AM-SPK-030',
      weight: 1.2,
      dimensions: '20x8x8 cm',
      warranty: '2 years',
      rating: 4.7,
      reviewCount: 145,
      createdAt: new Date('2024-01-10').getTime(),
      updatedAt: new Date('2024-11-01').getTime(),
      description: '<p>Premium portable Bluetooth speaker with exceptional sound quality.</p><br/><ul><li>360-degree surround sound</li><li>20-hour battery life</li><li>IPX7 waterproof rating</li><li>Voice assistant integration</li><li>Multi-device pairing</li></ul>',
    }
  ]
  
  // Generate additional customers for diverse scenarios
  const additionalCustomers = [
    {
      id: 'cust-005',
      firstName: 'Alex',
      lastName: 'Thompson',
      email: 'alex.thompson@techstartup.com',
      phone: '+1 (555) 654-3210',
      avatar: '/img/avatars/thumb-5.jpg',
      status: 'active',
      totalOrders: 12,
      totalSpent: 3245.80,
      averageOrderValue: 270.48,
      lastOrderDate: new Date('2024-11-02').getTime(),
      createdAt: new Date('2023-06-12').getTime(),
      address: {
        street: '567 Innovation Blvd',
        city: 'Seattle',
        state: 'WA',
        zipCode: '98101',
        country: 'United States',
      },
      preferences: {
        newsletter: true,
        smsNotifications: true,
        categories: ['devices', 'accessories'],
      },
    },
    {
      id: 'cust-006',
      firstName: 'Maria',
      lastName: 'Garcia',
      email: 'maria.garcia@retailcorp.com',
      phone: '+1 (555) 789-4561',
      avatar: '/img/avatars/thumb-6.jpg',
      status: 'active',
      totalOrders: 28,
      totalSpent: 5678.90,
      averageOrderValue: 202.82,
      lastOrderDate: new Date('2024-10-29').getTime(),
      createdAt: new Date('2022-09-08').getTime(),
      address: {
        street: '890 Business Park Dr',
        city: 'Phoenix',
        state: 'AZ',
        zipCode: '85001',
        country: 'United States',
      },
      preferences: {
        newsletter: true,
        smsNotifications: false,
        categories: ['devices', 'watches', 'accessories'],
      },
    }
  ]
  
  // Generate recent orders for better demo flow
  const additionalOrders = [
    {
      id: '96001',
      date: now - (24 * 60 * 60 * 1000), // Yesterday
      customer: 'Alex Thompson',
      status: 0, // Processing
      paymentMehod: 'visa',
      paymentIdendifier: '•••• 4532',
      totalAmount: 458,
    },
    {
      id: '96002',
      date: now - (2 * 24 * 60 * 60 * 1000), // 2 days ago
      customer: 'Maria Garcia',
      status: 1, // Shipped
      paymentMehod: 'master',
      paymentIdendifier: '•••• 7890',
      totalAmount: 299,
    },
    {
      id: '96003',
      date: now - (3 * 24 * 60 * 60 * 1000), // 3 days ago
      customer: 'John Smith',
      status: 2, // Delivered
      paymentMehod: 'paypal',
      paymentIdendifier: '••••@email.com',
      totalAmount: 189,
    }
  ]
  
  return {
    // Additional data to supplement existing mock data
    additionalProducts,
    additionalCustomers,
    additionalOrders,
    seededAt: now,
    version: '1.0.0'
  }
}

/**
 * Seeds the application with comprehensive demo data
 */
export function seedDemoData(): DemoDataSeed {
  const additionalData = generateAdditionalDemoData()
  
  const demoData: DemoDataSeed = {
    // Sales module data
    products: [...productsData, ...(additionalData.additionalProducts || [])],
    customers: [...customersData, ...(additionalData.additionalCustomers || [])],
    orders: [...ordersData, ...(additionalData.additionalOrders || [])],
    enhancedOrders: enhancedOrdersData,
    salesDashboard: salesDashboardData,
    categories: categoriesData,
    
    // CRM module data
    contacts: contactsData,
    leads: leadsData,
    opportunities: opportunitiesData,
    crmDashboard: crmDashboardData,
    events: eventsData,
    emails: mailData,
    
    // Inventory module data
    inventoryDashboard: inventoryDashboardData,
    warehouses: warehousesData,
    suppliers: suppliersData,
    inventoryMovements: inventoryMovementsData,
    stockAlerts: stockAlertsData,
    purchaseOrders: purchaseOrdersData,
    
    // Analytics module data
    analyticsDashboard: analyticsDashboardData,
    performanceMetrics: performanceMetrics,
    forecast: forecastData,
    
    // Metadata
    seededAt: additionalData.seededAt!,
    version: additionalData.version!
  }
  
  // Store seeded data in localStorage for persistence during demo session
  try {
    localStorage.setItem('elstar-demo-data', JSON.stringify({
      seededAt: demoData.seededAt,
      version: demoData.version,
      scenarios: demoScenarios
    }))
    console.log('✅ Demo data seeded successfully')
  } catch (error) {
    console.warn('⚠️ Could not persist demo data to localStorage:', error)
  }
  
  return demoData
}

/**
 * Checks if demo data has been seeded and is current
 */
export function isDemoDataSeeded(): boolean {
  try {
    const stored = localStorage.getItem('elstar-demo-data')
    if (!stored) return false
    
    const data = JSON.parse(stored)
    const daysSinceSeeded = (Date.now() - data.seededAt) / (1000 * 60 * 60 * 24)
    
    // Re-seed if data is older than 7 days
    return daysSinceSeeded < 7
  } catch {
    return false
  }
}

/**
 * Gets demo scenario information
 */
export function getDemoScenarios() {
  return demoScenarios
}

/**
 * Resets demo data (useful for demo reset functionality)
 */
export function resetDemoData(): DemoDataSeed {
  localStorage.removeItem('elstar-demo-data')
  return seedDemoData()
}

/**
 * Gets demo data statistics for dashboard display
 */
export function getDemoDataStats() {
  const data = seedDemoData()
  
  return {
    totalProducts: data.products.length,
    totalCustomers: data.customers.length,
    totalOrders: data.orders.length + data.enhancedOrders.length,
    totalContacts: data.contacts.length,
    totalLeads: data.leads.length,
    totalOpportunities: data.opportunities.length,
    scenarios: Object.keys(demoScenarios).length,
    lastSeeded: new Date(data.seededAt).toLocaleString()
  }
}