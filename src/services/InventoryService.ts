import ApiService from './ApiService'

// Inventory item interfaces
export interface InventoryItem {
  id: string
  productId: string
  productName: string
  sku: string
  category: string
  warehouseId: string
  location: string
  quantity: number
  reservedQuantity: number
  availableQuantity: number
  reorderLevel: number
  reorderQuantity: number
  unitCost: number
  totalValue: number
  supplierId: string
  lastRestocked: number
  status: 'active' | 'inactive' | 'discontinued'
}

export interface InventoryFormData extends Omit<InventoryItem, 'id' | 'lastRestocked' | 'totalValue' | 'availableQuantity'> {
  id?: string
}

// Movement interfaces
export interface InventoryMovement {
  id: string
  productId: string
  productName: string
  sku: string
  type: 'inbound' | 'outbound' | 'adjustment' | 'transfer'
  quantity: number
  unitCost: number
  totalCost: number
  warehouseId: string
  location: string
  supplierId?: string
  reference: string
  reason: string
  date: number
  processedBy: string
  notes?: string
}

export interface MovementFormData extends Omit<InventoryMovement, 'id' | 'date' | 'totalCost'> {
  id?: string
}

// Supplier interfaces
export interface Supplier {
  id: string
  name: string
  code: string
  contactPerson: string
  email: string
  phone: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  paymentTerms: string
  leadTime: number
  rating: number
  status: 'active' | 'inactive'
  categories: string[]
  totalOrders: number
  totalValue: number
  createdAt: number
}

export interface SupplierFormData extends Omit<Supplier, 'id' | 'createdAt' | 'totalOrders' | 'totalValue'> {
  id?: string
}

// Stock alert interfaces
export interface StockAlert {
  id: string
  productId: string
  productName: string
  sku: string
  type: 'low_stock' | 'out_of_stock' | 'overstock'
  currentStock: number
  reorderLevel: number
  severity: 'low' | 'medium' | 'high' | 'critical'
  createdAt: number
  acknowledged: boolean
}

// List parameters
export interface InventoryListParams {
  pageIndex: number
  pageSize: number
  sort: {
    order: 'asc' | 'desc'
    key: string
  }
  query?: string
  filterData?: {
    category?: string[]
    warehouse?: string[]
    status?: string[]
    supplier?: string[]
  }
}

export interface InventoryListResponse<T> {
  data: T[]
  total: number
}

// Inventory item API functions
export async function apiGetInventoryItems(params: InventoryListParams): Promise<InventoryListResponse<InventoryItem>> {
  return ApiService.fetchData({
    url: '/inventory/items',
    method: 'post',
    data: params,
  })
}

export async function apiGetInventoryItem(id: string): Promise<InventoryItem> {
  return ApiService.fetchData({
    url: '/inventory/item',
    method: 'get',
    params: { id },
  })
}

export async function apiCreateInventoryItem(data: InventoryFormData): Promise<{ success: boolean; data: InventoryItem }> {
  return ApiService.fetchData({
    url: '/inventory/items/create',
    method: 'post',
    data,
  })
}

export async function apiUpdateInventoryItem(data: InventoryFormData): Promise<{ success: boolean; data: InventoryItem }> {
  return ApiService.fetchData({
    url: '/inventory/items/update',
    method: 'put',
    data,
  })
}

export async function apiDeleteInventoryItem(id: string): Promise<boolean> {
  return ApiService.fetchData({
    url: '/inventory/items/delete',
    method: 'delete',
    data: { id },
  })
}

// Stock adjustment
export async function apiAdjustStock(productId: string, quantity: number, reason: string): Promise<{ success: boolean }> {
  return ApiService.fetchData({
    url: '/inventory/adjust-stock',
    method: 'post',
    data: { productId, quantity, reason },
  })
}

// Movement API functions
export async function apiGetMovements(params: InventoryListParams): Promise<InventoryListResponse<InventoryMovement>> {
  return ApiService.fetchData({
    url: '/inventory/movements',
    method: 'post',
    data: params,
  })
}

export async function apiCreateMovement(data: MovementFormData): Promise<{ success: boolean; data: InventoryMovement }> {
  return ApiService.fetchData({
    url: '/inventory/movements/create',
    method: 'post',
    data,
  })
}

// Supplier API functions
export async function apiGetSuppliers(params: InventoryListParams): Promise<InventoryListResponse<Supplier>> {
  return ApiService.fetchData({
    url: '/inventory/suppliers',
    method: 'post',
    data: params,
  })
}

export async function apiGetSupplier(id: string): Promise<Supplier> {
  return ApiService.fetchData({
    url: '/inventory/supplier',
    method: 'get',
    params: { id },
  })
}

export async function apiCreateSupplier(data: SupplierFormData): Promise<{ success: boolean; data: Supplier }> {
  return ApiService.fetchData({
    url: '/inventory/suppliers/create',
    method: 'post',
    data,
  })
}

export async function apiUpdateSupplier(data: SupplierFormData): Promise<{ success: boolean; data: Supplier }> {
  return ApiService.fetchData({
    url: '/inventory/suppliers/update',
    method: 'put',
    data,
  })
}

export async function apiDeleteSupplier(id: string): Promise<boolean> {
  return ApiService.fetchData({
    url: '/inventory/suppliers/delete',
    method: 'delete',
    data: { id },
  })
}

// Stock alerts API functions
export async function apiGetStockAlerts(params: InventoryListParams): Promise<InventoryListResponse<StockAlert>> {
  return ApiService.fetchData({
    url: '/inventory/alerts',
    method: 'post',
    data: params,
  })
}

export async function apiAcknowledgeAlert(id: string): Promise<{ success: boolean }> {
  return ApiService.fetchData({
    url: '/inventory/alerts/acknowledge',
    method: 'put',
    data: { id },
  })
}

// Dashboard data
export async function apiGetInventoryDashboard(): Promise<any> {
  return ApiService.fetchData({
    url: '/inventory/dashboard',
    method: 'get',
  })
}