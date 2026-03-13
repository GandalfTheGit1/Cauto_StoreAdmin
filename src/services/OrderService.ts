import { Order, OrderFormData, OrderListParams, OrderListResponse } from '@/@types/orders'
import ApiService from './ApiService'

// Get orders with pagination, sorting, and filtering
export async function apiGetOrders(params: OrderListParams): Promise<OrderListResponse> {
  return ApiService.fetchData({
    url: '/sales/orders',
    method: 'get',
    params,
  })
}

// Get single order by ID
export async function apiGetOrder(id: string): Promise<Order> {
  return ApiService.fetchData({
    url: '/sales/orders-details',
    method: 'get',
    params: { id },
  })
}

// Create new order
export async function apiCreateOrder(data: OrderFormData): Promise<{ success: boolean; data: Order }> {
  return ApiService.fetchData({
    url: '/sales/orders/create',
    method: 'post',
    data,
  })
}

// Update existing order
export async function apiUpdateOrder(data: OrderFormData): Promise<{ success: boolean; data: Order }> {
  return ApiService.fetchData({
    url: '/sales/orders/update',
    method: 'put',
    data,
  })
}

// Delete order
export async function apiDeleteOrder(id: string): Promise<boolean> {
  return ApiService.fetchData({
    url: '/sales/orders/delete',
    method: 'delete',
    data: { id },
  })
}

// Update order status
export async function apiUpdateOrderStatus(id: string, status: number): Promise<{ success: boolean }> {
  return ApiService.fetchData({
    url: '/sales/orders/status',
    method: 'put',
    data: { id, status },
  })
}