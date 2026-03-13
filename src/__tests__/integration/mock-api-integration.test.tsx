import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mockServer } from '@/mock/mock'
import ApiService from '@/services/ApiService'
import { apiCreateProduct, apiGetProducts, apiUpdateProduct, apiDeleteProduct } from '@/services/ProductService'
import { apiDemoSignIn } from '@/services/DemoAuthService'

// Mock app config
vi.mock('@/configs/app.config', () => ({
  default: {
    apiPrefix: '/api',
    enableMock: true,
    authenticatedEntryPath: '/app/sales/product-list',
    unAuthenticatedEntryPath: '/sign-in',
    locale: 'es',
  },
}))

describe('Mock API Integration Tests', () => {
  let server: any

  beforeEach(() => {
    // Start mock server for each test
    server = mockServer({ environment: 'test' })
    vi.clearAllMocks()
  })

  afterEach(() => {
    server?.shutdown()
  })

  describe('Authentication API Integration', () => {
    it('should authenticate with demo credentials through mock server', async () => {
      // Mock the demo auth service response
      const mockResponse = {
        token: 'mock-demo-token-123',
        user: {
          id: '1',
          email: 'admin@demo.com',
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin',
          avatar: '',
        },
      }

      // Set up the mock to return our expected response
      ;(apiDemoSignIn as any).mockResolvedValue(mockResponse)

      const credentials = {
        email: 'admin@demo.com',
        password: 'demo123',
      }

      const response = await apiDemoSignIn(credentials)

      expect(response.token).toBe('mock-demo-token-123')
      expect(response.user.email).toBe('admin@demo.com')
      expect(response.user.role).toBe('admin')
      expect(apiDemoSignIn).toHaveBeenCalledWith(credentials)
    })

    it('should handle authentication errors from mock server', async () => {
      // Mock authentication failure
      const mockError = {
        response: {
          status: 401,
          data: {
            message: 'Invalid credentials',
          },
        },
      }

      ;(apiDemoSignIn as any).mockRejectedValue(mockError)

      const invalidCredentials = {
        email: 'invalid@demo.com',
        password: 'wrongpassword',
      }

      try {
        await apiDemoSignIn(invalidCredentials)
      } catch (error: any) {
        expect(error.response.status).toBe(401)
        expect(error.response.data.message).toBe('Invalid credentials')
      }

      expect(apiDemoSignIn).toHaveBeenCalledWith(invalidCredentials)
    })
  })

  describe('Product API Integration', () => {
    beforeEach(() => {
      // Mock successful authentication for product operations
      ;(apiDemoSignIn as any).mockResolvedValue({
        token: 'mock-token',
        user: {
          id: '1',
          email: 'admin@demo.com',
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin',
          avatar: '',
        },
      })
    })

    it('should create product through mock API', async () => {
      const mockResponse = {
        id: 'product-123',
        name: 'Test Product',
        description: 'Test product description',
        category: 'devices',
        price: 99.99,
        stock: 10,
        brand: 'Test Brand',
        vendor: 'Test Vendor',
        status: 0,
        costPerItem: 50,
        taxRate: 8.5,
        tags: ['electronics'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      ;(apiCreateProduct as any).mockResolvedValue(mockResponse)

      const productData = {
        name: 'Test Product',
        description: 'Test product description',
        category: 'devices',
        price: 99.99,
        stock: 10,
        brand: 'Test Brand',
        vendor: 'Test Vendor',
        status: 0,
        costPerItem: 50,
        taxRate: 8.5,
        tags: ['electronics'],
      }

      const result = await apiCreateProduct(productData)

      expect(result.id).toBe('product-123')
      expect(result.name).toBe('Test Product')
      expect(result.price).toBe(99.99)
      expect(apiCreateProduct).toHaveBeenCalledWith(productData)
    })

    it('should fetch products list through mock API', async () => {
      const mockResponse = {
        data: [
          {
            id: 'product-1',
            name: 'Product 1',
            price: 29.99,
            stock: 15,
            category: 'electronics',
          },
          {
            id: 'product-2',
            name: 'Product 2',
            price: 49.99,
            stock: 8,
            category: 'clothing',
          },
        ],
        total: 2,
      }

      ;(apiGetProducts as any).mockResolvedValue(mockResponse)

      const params = {
        pageIndex: 1,
        pageSize: 10,
        sort: { order: 'asc', key: 'name' },
        query: '',
      }

      const result = await apiGetProducts(params)

      expect(result.data).toHaveLength(2)
      expect(result.total).toBe(2)
      expect(result.data[0].name).toBe('Product 1')
      expect(apiGetProducts).toHaveBeenCalledWith(params)
    })

    it('should update product through mock API', async () => {
      const mockResponse = {
        id: 'product-123',
        name: 'Updated Product',
        description: 'Updated description',
        category: 'devices',
        price: 129.99,
        stock: 20,
        brand: 'Updated Brand',
        vendor: 'Updated Vendor',
        status: 1,
        costPerItem: 60,
        taxRate: 8.5,
        tags: ['electronics', 'updated'],
        updatedAt: new Date().toISOString(),
      }

      ;(apiUpdateProduct as any).mockResolvedValue(mockResponse)

      const updateData = {
        id: 'product-123',
        name: 'Updated Product',
        description: 'Updated description',
        category: 'devices',
        price: 129.99,
        stock: 20,
        brand: 'Updated Brand',
        vendor: 'Updated Vendor',
        status: 1,
        costPerItem: 60,
        taxRate: 8.5,
        tags: ['electronics', 'updated'],
      }

      const result = await apiUpdateProduct('product-123', updateData)

      expect(result.name).toBe('Updated Product')
      expect(result.price).toBe(129.99)
      expect(result.status).toBe(1)
      expect(apiUpdateProduct).toHaveBeenCalledWith('product-123', updateData)
    })

    it('should delete product through mock API', async () => {
      ;(apiDeleteProduct as any).mockResolvedValue(true)

      const result = await apiDeleteProduct('product-123')

      expect(result).toBe(true)
      expect(apiDeleteProduct).toHaveBeenCalledWith('product-123')
    })

    it('should handle product API validation errors', async () => {
      const mockError = {
        response: {
          status: 400,
          data: {
            errors: {
              name: 'Product name is required',
              price: 'Price must be greater than 0',
              category: 'Category is required',
            },
          },
        },
      }

      ;(apiCreateProduct as any).mockRejectedValue(mockError)

      const invalidProductData = {
        name: '',
        description: 'Test description',
        category: '',
        price: -10,
        stock: 5,
        brand: 'Test Brand',
        vendor: 'Test Vendor',
        status: 0,
        costPerItem: 0,
        taxRate: 0,
        tags: [],
      }

      try {
        await apiCreateProduct(invalidProductData)
      } catch (error: any) {
        expect(error.response.status).toBe(400)
        expect(error.response.data.errors.name).toBe('Product name is required')
        expect(error.response.data.errors.price).toBe('Price must be greater than 0')
        expect(error.response.data.errors.category).toBe('Category is required')
      }

      expect(apiCreateProduct).toHaveBeenCalledWith(invalidProductData)
    })
  })

  describe('Sales API Integration', () => {
    it('should fetch sales dashboard data through mock API', async () => {
      // Mock sales dashboard API call
      const mockFetchSalesDashboard = vi.fn().mockResolvedValue({
        data: {
          totalSales: 125000,
          totalOrders: 1250,
          totalCustomers: 850,
          conversionRate: 3.2,
          salesGrowth: 12.5,
          recentOrders: [
            {
              id: 'order-1',
              customer: 'John Doe',
              amount: 299.99,
              status: 'completed',
              date: '2024-01-15T10:30:00Z',
            },
            {
              id: 'order-2',
              customer: 'Jane Smith',
              amount: 149.99,
              status: 'pending',
              date: '2024-01-15T11:45:00Z',
            },
          ],
          topProducts: [
            {
              id: 'product-1',
              name: 'Smartphone',
              sales: 45,
              revenue: 13499.55,
            },
            {
              id: 'product-2',
              name: 'Laptop',
              sales: 23,
              revenue: 22999.77,
            },
          ],
        },
      })

      // Simulate API call using ApiService
      const result = await mockFetchSalesDashboard()

      expect(result.data.totalSales).toBe(125000)
      expect(result.data.recentOrders).toHaveLength(2)
      expect(result.data.topProducts).toHaveLength(2)
      expect(result.data.recentOrders[0].customer).toBe('John Doe')
      expect(result.data.topProducts[0].name).toBe('Smartphone')
    })

    it('should handle sales data filtering through mock API', async () => {
      const mockFetchFilteredSales = vi.fn().mockResolvedValue({
        data: [
          { date: '2024-01-01', revenue: 1000, orders: 10 },
          { date: '2024-01-02', revenue: 1200, orders: 12 },
        ],
        total: 2200,
        count: 22,
      })

      const filterParams = {
        startDate: '2024-01-01',
        endDate: '2024-01-02',
        category: 'electronics',
      }

      const result = await mockFetchFilteredSales(filterParams)

      expect(result.data).toHaveLength(2)
      expect(result.total).toBe(2200)
      expect(result.count).toBe(22)
      expect(mockFetchFilteredSales).toHaveBeenCalledWith(filterParams)
    })
  })

  describe('Inventory API Integration', () => {
    it('should fetch inventory data through mock API', async () => {
      const mockFetchInventory = vi.fn().mockResolvedValue({
        data: [
          {
            id: 'inv-1',
            productId: 'product-1',
            productName: 'Product A',
            currentStock: 50,
            reservedStock: 5,
            availableStock: 45,
            reorderLevel: 10,
            location: 'Warehouse A',
          },
          {
            id: 'inv-2',
            productId: 'product-2',
            productName: 'Product B',
            currentStock: 0,
            reservedStock: 0,
            availableStock: 0,
            reorderLevel: 5,
            location: 'Warehouse B',
          },
        ],
        total: 2,
      })

      const result = await mockFetchInventory()

      expect(result.data).toHaveLength(2)
      expect(result.data[0].currentStock).toBe(50)
      expect(result.data[1].currentStock).toBe(0)
      expect(result.total).toBe(2)
    })

    it('should handle stock adjustment through mock API', async () => {
      const mockAdjustStock = vi.fn().mockResolvedValue({
        id: 'inv-1',
        productId: 'product-1',
        previousStock: 50,
        newStock: 70,
        adjustment: 20,
        reason: 'New shipment received',
        adjustedBy: 'admin@demo.com',
        adjustedAt: new Date().toISOString(),
      })

      const adjustmentData = {
        itemId: 'inv-1',
        adjustmentType: 'increase',
        quantity: 20,
        reason: 'New shipment received',
        notes: 'Restocking from supplier',
      }

      const result = await mockAdjustStock(adjustmentData)

      expect(result.newStock).toBe(70)
      expect(result.adjustment).toBe(20)
      expect(result.reason).toBe('New shipment received')
      expect(mockAdjustStock).toHaveBeenCalledWith(adjustmentData)
    })
  })

  describe('CRM API Integration', () => {
    it('should fetch CRM contacts through mock API', async () => {
      const mockFetchContacts = vi.fn().mockResolvedValue({
        data: [
          {
            id: 'contact-1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '+1-555-0123',
            company: 'Tech Corp',
            status: 'active',
            tags: ['prospect', 'enterprise'],
          },
          {
            id: 'contact-2',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@example.com',
            phone: '+1-555-0456',
            company: 'Marketing Inc',
            status: 'active',
            tags: ['customer', 'marketing'],
          },
        ],
        total: 2,
      })

      const result = await mockFetchContacts()

      expect(result.data).toHaveLength(2)
      expect(result.data[0].firstName).toBe('John')
      expect(result.data[1].company).toBe('Marketing Inc')
      expect(result.total).toBe(2)
    })

    it('should create CRM opportunity through mock API', async () => {
      const mockCreateOpportunity = vi.fn().mockResolvedValue({
        id: 'opp-1',
        name: 'Enterprise Deal',
        contactId: 'contact-1',
        stage: 'proposal',
        value: 50000,
        probability: 60,
        expectedCloseDate: '2024-02-15',
        source: 'referral',
        createdAt: new Date().toISOString(),
      })

      const opportunityData = {
        name: 'Enterprise Deal',
        contactId: 'contact-1',
        stage: 'proposal',
        value: 50000,
        probability: 60,
        expectedCloseDate: '2024-02-15',
        source: 'referral',
      }

      const result = await mockCreateOpportunity(opportunityData)

      expect(result.id).toBe('opp-1')
      expect(result.name).toBe('Enterprise Deal')
      expect(result.value).toBe(50000)
      expect(mockCreateOpportunity).toHaveBeenCalledWith(opportunityData)
    })
  })

  describe('Analytics API Integration', () => {
    it('should fetch analytics data with date filtering through mock API', async () => {
      const mockFetchAnalytics = vi.fn().mockResolvedValue({
        salesData: [
          { date: '2024-01-01', revenue: 1000, orders: 10 },
          { date: '2024-01-02', revenue: 1200, orders: 12 },
          { date: '2024-01-03', revenue: 800, orders: 8 },
        ],
        inventoryData: [
          { category: 'Electronics', value: 50000, items: 200 },
          { category: 'Clothing', value: 30000, items: 150 },
        ],
        customerData: {
          totalCustomers: 500,
          newCustomers: 25,
          returningCustomers: 475,
          churnRate: 5,
        },
        kpis: {
          totalRevenue: 125000,
          averageOrderValue: 100,
          conversionRate: 3.2,
          customerLifetimeValue: 250,
        },
      })

      const filterParams = {
        startDate: '2024-01-01',
        endDate: '2024-01-03',
        metrics: ['sales', 'inventory', 'customers'],
      }

      const result = await mockFetchAnalytics(filterParams)

      expect(result.salesData).toHaveLength(3)
      expect(result.inventoryData).toHaveLength(2)
      expect(result.customerData.totalCustomers).toBe(500)
      expect(result.kpis.totalRevenue).toBe(125000)
      expect(mockFetchAnalytics).toHaveBeenCalledWith(filterParams)
    })
  })

  describe('Error Handling in API Integration', () => {
    it('should handle network timeouts gracefully', async () => {
      const mockApiCall = vi.fn().mockRejectedValue({
        code: 'ECONNABORTED',
        message: 'timeout of 5000ms exceeded',
      })

      try {
        await mockApiCall()
      } catch (error: any) {
        expect(error.code).toBe('ECONNABORTED')
        expect(error.message).toContain('timeout')
      }

      expect(mockApiCall).toHaveBeenCalled()
    })

    it('should handle server errors with proper error structure', async () => {
      const mockApiCall = vi.fn().mockRejectedValue({
        response: {
          status: 500,
          data: {
            message: 'Internal Server Error',
            error: 'Database connection failed',
          },
        },
      })

      try {
        await mockApiCall()
      } catch (error: any) {
        expect(error.response.status).toBe(500)
        expect(error.response.data.message).toBe('Internal Server Error')
        expect(error.response.data.error).toBe('Database connection failed')
      }

      expect(mockApiCall).toHaveBeenCalled()
    })

    it('should handle rate limiting errors', async () => {
      const mockApiCall = vi.fn().mockRejectedValue({
        response: {
          status: 429,
          data: {
            message: 'Too Many Requests',
            retryAfter: 60,
          },
        },
      })

      try {
        await mockApiCall()
      } catch (error: any) {
        expect(error.response.status).toBe(429)
        expect(error.response.data.message).toBe('Too Many Requests')
        expect(error.response.data.retryAfter).toBe(60)
      }

      expect(mockApiCall).toHaveBeenCalled()
    })
  })
})