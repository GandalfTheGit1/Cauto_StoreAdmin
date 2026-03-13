import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { HiOutlinePencil, HiOutlineTrash, HiOutlinePlus, HiOutlineEye } from 'react-icons/hi'
import { NumericFormat } from 'react-number-format'

import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Dialog from '@/components/ui/Dialog'
import Loading from '@/components/shared/Loading'
import Notification from '@/components/ui/Notification'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import Table from '@/components/ui/Table'
import toast from '@/components/ui/toast'
import Tooltip from '@/components/ui/Tooltip'
import SearchInput from '@/components/shared/SearchInput'
import SearchHighlight from '@/components/shared/SearchHighlight'
import {
  Order,
  OrderFormData,
  OrderListParams,
  ORDER_STATUS_LABELS,
} from '@/@types/orders'
import {
  apiGetOrders,
  apiCreateOrder,
  apiUpdateOrder,
  apiDeleteOrder,
  apiUpdateOrderStatus,
} from '@/services/OrderService'

import OrderCrudForm from './OrderCrudForm'

const { Tr, Th, Td, THead, TBody } = Table

interface OrderCrudListProps {
  className?: string
}

const orderStatusColor: Record<number, { dotClass: string; textClass: string }> = {
  0: { dotClass: 'bg-emerald-500', textClass: 'text-emerald-500' },
  1: { dotClass: 'bg-amber-500', textClass: 'text-amber-500' },
  2: { dotClass: 'bg-red-500', textClass: 'text-red-500' },
  3: { dotClass: 'bg-gray-500', textClass: 'text-gray-500' },
  4: { dotClass: 'bg-blue-500', textClass: 'text-blue-500' },
  5: { dotClass: 'bg-purple-500', textClass: 'text-purple-500' },
  6: { dotClass: 'bg-green-600', textClass: 'text-green-600' },
}

const PaymentMethodImage = ({ paymentMethod }: { paymentMethod: string }) => {
  const imageMap: Record<string, string> = {
    visa: '/img/others/img-8.png',
    master: '/img/others/img-9.png',
    paypal: '/img/others/img-10.png',
  }
  
  return imageMap[paymentMethod] ? (
    <img className="max-h-[20px]" src={imageMap[paymentMethod]} alt={paymentMethod} />
  ) : (
    <span className="text-sm">{paymentMethod}</span>
  )
}

const OrderCrudList = ({ className }: OrderCrudListProps) => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: 'date', order: 'desc' as 'asc' | 'desc' })

  // Dialog states
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const statusOptions = [
    { value: '', label: 'All Status' },
    ...Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => ({
      value,
      label,
    })),
  ]

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const params: OrderListParams = {
        pageIndex: currentPage,
        pageSize,
        sort: sortConfig,
        query: searchQuery,
        filterData: {
          status: statusFilter ? [parseInt(statusFilter)] : undefined,
        },
      }

      const response = await apiGetOrders(params)
      setOrders(response.data)
      setTotal(response.total)
    } catch (error) {
      toast.push(
        <Notification title="Error" type="danger">
          Failed to fetch orders
        </Notification>
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [currentPage, searchQuery, statusFilter, sortConfig])

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      order: prev.key === key && prev.order === 'asc' ? 'desc' : 'asc',
    }))
  }

  const handleCreate = () => {
    setSelectedOrder(null)
    setIsEditing(false)
    setIsFormDialogOpen(true)
  }

  const handleEdit = (order: Order) => {
    const formData: Partial<OrderFormData> = {
      id: order.id,
      customerId: order.customerId || '',
      customerName: order.customer,
      customerEmail: '',
      customerPhone: '',
      items: order.items || [],
      status: order.status,
      paymentMethod: order.paymentMethod,
      paymentIdentifier: order.paymentIdentifier,
      shippingAddress: order.shippingAddress || {
        line1: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States',
      },
      notes: order.notes || '',
      subtotal: 0,
      tax: 0,
      shipping: 0,
      total: order.totalAmount,
    }
    setSelectedOrder(order)
    setIsEditing(true)
    setIsFormDialogOpen(true)
  }

  const handleDelete = (order: Order) => {
    setSelectedOrder(order)
    setIsDeleteDialogOpen(true)
  }

  const handleStatusChange = async (orderId: string, newStatus: number) => {
    try {
      await apiUpdateOrderStatus(orderId, newStatus)
      toast.push(
        <Notification title="Success" type="success">
          Order status updated successfully
        </Notification>
      )
      fetchOrders()
    } catch (error) {
      toast.push(
        <Notification title="Error" type="danger">
          Failed to update order status
        </Notification>
      )
    }
  }

  const handleFormSubmit = async (values: OrderFormData, setSubmitting: (isSubmitting: boolean) => void) => {
    try {
      if (isEditing && selectedOrder) {
        await apiUpdateOrder({ ...values, id: selectedOrder.id })
        toast.push(
          <Notification title="Success" type="success">
            Order updated successfully
          </Notification>
        )
      } else {
        await apiCreateOrder(values)
        toast.push(
          <Notification title="Success" type="success">
            Order created successfully
          </Notification>
        )
      }
      setIsFormDialogOpen(false)
      fetchOrders()
    } catch (error) {
      toast.push(
        <Notification title="Error" type="danger">
          Failed to save order
        </Notification>
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!selectedOrder?.id) return

    try {
      await apiDeleteOrder(selectedOrder.id)
      toast.push(
        <Notification title="Success" type="success">
          Order deleted successfully
        </Notification>
      )
      setIsDeleteDialogOpen(false)
      fetchOrders()
    } catch (error) {
      toast.push(
        <Notification title="Error" type="danger">
          Failed to delete order
        </Notification>
      )
    }
  }

  const getStatusBadge = (status: number) => {
    const statusInfo = orderStatusColor[status] || orderStatusColor[0]
    const label = ORDER_STATUS_LABELS[status as keyof typeof ORDER_STATUS_LABELS] || 'Unknown'
    
    return (
      <div className="flex items-center">
        <Badge className={statusInfo.dotClass} />
        <span className={`ml-2 capitalize font-semibold ${statusInfo.textClass}`}>
          {label}
        </span>
      </div>
    )
  }

  return (
    <div className={className}>
      <Card>
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
          <h4>Order Management</h4>
          <Button
            variant="solid"
            icon={<HiOutlinePlus />}
            onClick={handleCreate}
          >
            Create Order
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <SearchInput
            placeholder="Search orders by ID, customer, payment..."
            value={searchQuery}
            onChange={setSearchQuery}
            autoFocus={false}
          />
          <Select
            placeholder="Filter by status"
            options={statusOptions}
            value={statusOptions.find(option => option.value === statusFilter)}
            onChange={(option) => setStatusFilter(option?.value || '')}
          />
        </div>

        {/* Table */}
        <Loading loading={loading}>
          <Table>
            <THead>
              <Tr>
                <Th>
                  <button
                    onClick={() => handleSort('id')}
                    className="flex items-center gap-1 hover:text-gray-600"
                  >
                    Order ID
                    {sortConfig.key === 'id' && (
                      <span>{sortConfig.order === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </button>
                </Th>
                <Th>
                  <button
                    onClick={() => handleSort('date')}
                    className="flex items-center gap-1 hover:text-gray-600"
                  >
                    Date
                    {sortConfig.key === 'date' && (
                      <span>{sortConfig.order === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </button>
                </Th>
                <Th>
                  <button
                    onClick={() => handleSort('customer')}
                    className="flex items-center gap-1 hover:text-gray-600"
                  >
                    Customer
                    {sortConfig.key === 'customer' && (
                      <span>{sortConfig.order === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </button>
                </Th>
                <Th>Status</Th>
                <Th>Payment Method</Th>
                <Th>
                  <button
                    onClick={() => handleSort('totalAmount')}
                    className="flex items-center gap-1 hover:text-gray-600"
                  >
                    Total
                    {sortConfig.key === 'totalAmount' && (
                      <span>{sortConfig.order === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </button>
                </Th>
                <Th>Actions</Th>
              </Tr>
            </THead>
            <TBody>
              {orders.map((order) => (
                <Tr key={order.id}>
                  <Td>
                    <span className="font-semibold">
                      #<SearchHighlight
                        text={order.id}
                        searchWords={[searchQuery]}
                      />
                    </span>
                  </Td>
                  <Td>{dayjs.unix(order.date).format('DD/MM/YYYY')}</Td>
                  <Td>
                    <SearchHighlight
                      text={order.customer}
                      searchWords={[searchQuery]}
                    />
                  </Td>
                  <Td>
                    <Select
                      size="sm"
                      options={statusOptions.slice(1)}
                      value={statusOptions.find(option => option.value === String(order.status))}
                      onChange={(option) => {
                        if (option?.value) {
                          handleStatusChange(order.id, parseInt(option.value))
                        }
                      }}
                    />
                  </Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <PaymentMethodImage paymentMethod={order.paymentMethod} />
                      <SearchHighlight
                        text={order.paymentIdentifier}
                        searchWords={[searchQuery]}
                      />
                    </div>
                  </Td>
                  <Td>
                    <NumericFormat
                      displayType="text"
                      value={order.totalAmount.toFixed(2)}
                      prefix="$"
                      thousandSeparator={true}
                    />
                  </Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <Tooltip title="View">
                        <Button
                          size="sm"
                          variant="plain"
                          icon={<HiOutlineEye />}
                          onClick={() => {
                            // Navigate to order details
                            window.open(`/app/sales/order-details/${order.id}`, '_blank')
                          }}
                        />
                      </Tooltip>
                      <Tooltip title="Edit">
                        <Button
                          size="sm"
                          variant="plain"
                          icon={<HiOutlinePencil />}
                          onClick={() => handleEdit(order)}
                        />
                      </Tooltip>
                      <Tooltip title="Delete">
                        <Button
                          size="sm"
                          variant="plain"
                          className="text-red-600 hover:text-red-700"
                          icon={<HiOutlineTrash />}
                          onClick={() => handleDelete(order)}
                        />
                      </Tooltip>
                    </div>
                  </Td>
                </Tr>
              ))}
            </TBody>
          </Table>
        </Loading>

        {/* Pagination */}
        {total > pageSize && (
          <div className="flex justify-center mt-6">
            <Pagination
              total={total}
              currentPage={currentPage}
              pageSize={pageSize}
              onChange={setCurrentPage}
            />
          </div>
        )}
      </Card>

      {/* Form Dialog */}
      <Dialog
        isOpen={isFormDialogOpen}
        onClose={() => setIsFormDialogOpen(false)}
        onRequestClose={() => setIsFormDialogOpen(false)}
        width={1200}
      >
        <h5 className="mb-4">
          {isEditing ? 'Edit Order' : 'Create New Order'}
        </h5>
        <OrderCrudForm
          initialData={isEditing && selectedOrder ? {
            id: selectedOrder.id,
            customerId: selectedOrder.customerId || '',
            customerName: selectedOrder.customer,
            items: selectedOrder.items || [],
            status: selectedOrder.status,
            paymentMethod: selectedOrder.paymentMethod,
            paymentIdentifier: selectedOrder.paymentIdentifier,
            shippingAddress: selectedOrder.shippingAddress || {
              line1: '',
              city: '',
              state: '',
              zipCode: '',
              country: 'United States',
            },
            notes: selectedOrder.notes || '',
            subtotal: 0,
            tax: 0,
            shipping: 0,
            total: selectedOrder.totalAmount,
          } : undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormDialogOpen(false)}
          onDelete={isEditing ? () => {
            setIsFormDialogOpen(false)
            handleDelete(selectedOrder!)
          } : undefined}
          isEdit={isEditing}
        />
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onRequestClose={() => setIsDeleteDialogOpen(false)}
      >
        <h5 className="mb-4">Delete Order</h5>
        <p className="mb-6">
          Are you sure you want to delete order "#{selectedOrder?.id}"? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button onClick={() => setIsDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="solid"
            className="bg-red-600 hover:bg-red-700"
            onClick={handleDeleteConfirm}
          >
            Delete
          </Button>
        </div>
      </Dialog>
    </div>
  )
}

export default OrderCrudList