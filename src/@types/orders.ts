export interface Order {
  id: string
  date: number
  customer: string
  customerId?: string
  status: number
  paymentMethod: string
  paymentIdentifier: string
  totalAmount: number
  items?: OrderItem[]
  shippingAddress?: Address
  billingAddress?: Address
  notes?: string
  createdAt?: number
  updatedAt?: number
}

export interface OrderItem {
  id: string
  productId: string
  productName: string
  productCode?: string
  img?: string
  price: number
  quantity: number
  total: number
  details?: {
    color?: string[]
    size?: string[]
    gender?: string[]
  }
}

export interface Address {
  line1: string
  line2?: string
  line3?: string
  line4?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
}

export interface OrderFormData {
  id?: string
  customerId: string
  customerName: string
  customerEmail?: string
  customerPhone?: string
  items: OrderItem[]
  status: number
  paymentMethod: string
  paymentIdentifier: string
  shippingAddress: Address
  billingAddress?: Address
  notes?: string
  subtotal: number
  tax: number
  shipping: number
  total: number
}

export interface OrderListParams {
  pageIndex: number
  pageSize: number
  sort: {
    order: 'asc' | 'desc'
    key: string
  }
  query?: string
  filterData?: {
    status?: number[]
    paymentMethod?: string[]
    dateRange?: [number, number]
  }
}

export interface OrderListResponse {
  data: Order[]
  total: number
}

export const ORDER_STATUS = {
  PAID: 0,
  PENDING: 1,
  FAILED: 2,
  CANCELLED: 3,
  PROCESSING: 4,
  SHIPPED: 5,
  DELIVERED: 6,
} as const

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PAID]: 'Paid',
  [ORDER_STATUS.PENDING]: 'Pending',
  [ORDER_STATUS.FAILED]: 'Failed',
  [ORDER_STATUS.CANCELLED]: 'Cancelled',
  [ORDER_STATUS.PROCESSING]: 'Processing',
  [ORDER_STATUS.SHIPPED]: 'Shipped',
  [ORDER_STATUS.DELIVERED]: 'Delivered',
} as const