import ApiService from './ApiService'

export interface ProductFormData {
  id?: string
  name: string
  description: string
  category: string
  subcategory?: string
  price: number
  stock: number
  status: number
  costPerItem: number
  bulkDiscountPrice?: number
  taxRate: number
  tags: string[]
  brand: string
  vendor: string
  sku?: string
  weight?: number
  dimensions?: string
  warranty?: string
  img?: string
  imgList?: Array<{
    id: string
    name: string
    img: string
  }>
}

export interface ProductListParams {
  pageIndex: number
  pageSize: number
  sort: {
    order: 'asc' | 'desc'
    key: string
  }
  query?: string
  filterData?: {
    category?: string[]
    status?: number[]
    brand?: string[]
  }
}

export interface ProductListResponse {
  data: ProductFormData[]
  total: number
}

// Get products with pagination, sorting, and filtering
export async function apiGetProducts(params: ProductListParams): Promise<ProductListResponse> {
  return ApiService.fetchData({
    url: '/sales/products',
    method: 'post',
    data: params,
  })
}

// Get single product by ID
export async function apiGetProduct(id: string): Promise<ProductFormData> {
  return ApiService.fetchData({
    url: '/sales/product',
    method: 'get',
    params: { id },
  })
}

// Create new product
export async function apiCreateProduct(data: ProductFormData): Promise<{ success: boolean; data: ProductFormData }> {
  return ApiService.fetchData({
    url: '/sales/products/create',
    method: 'post',
    data,
  })
}

// Update existing product
export async function apiUpdateProduct(data: ProductFormData): Promise<{ success: boolean; data: ProductFormData }> {
  return ApiService.fetchData({
    url: '/sales/products/update',
    method: 'put',
    data,
  })
}

// Delete product
export async function apiDeleteProduct(id: string): Promise<boolean> {
  return ApiService.fetchData({
    url: '/sales/products/delete',
    method: 'delete',
    data: { id },
  })
}

// Upload product image
export async function apiUploadProductImage(file: File): Promise<{ success: boolean; url: string; filename: string }> {
  const formData = new FormData()
  formData.append('file', file)
  
  return ApiService.fetchData({
    url: '/sales/upload',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

// Get product categories
export async function apiGetCategories(): Promise<Array<{ id: string; name: string; displayName: string }>> {
  return ApiService.fetchData({
    url: '/sales/categories',
    method: 'get',
  })
}