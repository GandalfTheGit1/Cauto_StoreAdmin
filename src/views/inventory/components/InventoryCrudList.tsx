import { useEffect, useState } from 'react'
import { HiOutlinePencil, HiOutlineTrash, HiOutlinePlus, HiOutlineSearch, HiOutlineAdjustments } from 'react-icons/hi'
import { NumericFormat } from 'react-number-format'

import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Dialog from '@/components/ui/Dialog'
import Input from '@/components/ui/Input'
import Loading from '@/components/shared/Loading'
import Notification from '@/components/ui/Notification'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import Table from '@/components/ui/Table'
import toast from '@/components/ui/toast'
import Tooltip from '@/components/ui/Tooltip'
import {
  InventoryItem,
  InventoryFormData,
  InventoryListParams,
  apiGetInventoryItems,
  apiCreateInventoryItem,
  apiUpdateInventoryItem,
  apiDeleteInventoryItem,
  apiAdjustStock,
} from '@/services/InventoryService'

import InventoryCrudForm from './InventoryCrudForm'
import StockAdjustmentForm from './StockAdjustmentForm'

const { Tr, Th, Td, THead, TBody } = Table

interface InventoryCrudListProps {
  className?: string
}

const InventoryCrudList = ({ className }: InventoryCrudListProps) => {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: 'productName', order: 'asc' as 'asc' | 'desc' })

  // Dialog states
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isAdjustmentDialogOpen, setIsAdjustmentDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'devices', label: 'Electronics & Devices' },
    { value: 'watches', label: 'Watches & Timepieces' },
    { value: 'bags', label: 'Bags & Luggage' },
    { value: 'shoes', label: 'Shoes & Footwear' },
    { value: 'cloths', label: 'Clothing' },
    { value: 'accessories', label: 'Accessories' },
  ]

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'discontinued', label: 'Discontinued' },
  ]

  const fetchItems = async () => {
    setLoading(true)
    try {
      const params: InventoryListParams = {
        pageIndex: currentPage,
        pageSize,
        sort: sortConfig,
        query: searchQuery,
        filterData: {
          category: categoryFilter ? [categoryFilter] : undefined,
          status: statusFilter ? [statusFilter] : undefined,
        },
      }

      const response = await apiGetInventoryItems(params)
      setItems(response.data)
      setTotal(response.total)
    } catch (error) {
      toast.push(
        <Notification title="Error" type="danger">
          Failed to fetch inventory items
        </Notification>
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [currentPage, searchQuery, categoryFilter, statusFilter, sortConfig])

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      order: prev.key === key && prev.order === 'asc' ? 'desc' : 'asc',
    }))
  }

  const handleCreate = () => {
    setSelectedItem(null)
    setIsEditing(false)
    setIsFormDialogOpen(true)
  }

  const handleEdit = (item: InventoryItem) => {
    setSelectedItem(item)
    setIsEditing(true)
    setIsFormDialogOpen(true)
  }

  const handleDelete = (item: InventoryItem) => {
    setSelectedItem(item)
    setIsDeleteDialogOpen(true)
  }

  const handleAdjustStock = (item: InventoryItem) => {
    setSelectedItem(item)
    setIsAdjustmentDialogOpen(true)
  }

  const handleFormSubmit = async (values: InventoryFormData, setSubmitting: (isSubmitting: boolean) => void) => {
    try {
      if (isEditing && selectedItem) {
        await apiUpdateInventoryItem({ ...values, id: selectedItem.id })
        toast.push(
          <Notification title="Success" type="success">
            Inventory item updated successfully
          </Notification>
        )
      } else {
        await apiCreateInventoryItem(values)
        toast.push(
          <Notification title="Success" type="success">
            Inventory item created successfully
          </Notification>
        )
      }
      setIsFormDialogOpen(false)
      fetchItems()
    } catch (error) {
      toast.push(
        <Notification title="Error" type="danger">
          Failed to save inventory item
        </Notification>
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!selectedItem?.id) return

    try {
      await apiDeleteInventoryItem(selectedItem.id)
      toast.push(
        <Notification title="Success" type="success">
          Inventory item deleted successfully
        </Notification>
      )
      setIsDeleteDialogOpen(false)
      fetchItems()
    } catch (error) {
      toast.push(
        <Notification title="Error" type="danger">
          Failed to delete inventory item
        </Notification>
      )
    }
  }

  const handleStockAdjustment = async (quantity: number, reason: string) => {
    if (!selectedItem?.id) return

    try {
      await apiAdjustStock(selectedItem.id, quantity, reason)
      toast.push(
        <Notification title="Success" type="success">
          Stock adjusted successfully
        </Notification>
      )
      setIsAdjustmentDialogOpen(false)
      fetchItems()
    } catch (error) {
      toast.push(
        <Notification title="Error" type="danger">
          Failed to adjust stock
        </Notification>
      )
    }
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      active: { label: 'Active', className: 'bg-green-100 text-green-800' },
      inactive: { label: 'Inactive', className: 'bg-gray-100 text-gray-800' },
      discontinued: { label: 'Discontinued', className: 'bg-red-100 text-red-800' },
    }
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.active
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    )
  }

  const getStockLevelBadge = (item: InventoryItem) => {
    if (item.quantity === 0) {
      return <Badge className="bg-red-500 text-white">Out of Stock</Badge>
    } else if (item.quantity <= item.reorderLevel) {
      return <Badge className="bg-yellow-500 text-white">Low Stock</Badge>
    } else {
      return <Badge className="bg-green-500 text-white">In Stock</Badge>
    }
  }

  return (
    <div className={className}>
      <Card>
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
          <h4>Inventory Management</h4>
          <Button
            variant="solid"
            icon={<HiOutlinePlus />}
            onClick={handleCreate}
          >
            Add Item
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            placeholder="Filter by category"
            options={categoryOptions}
            value={categoryOptions.find(option => option.value === categoryFilter)}
            onChange={(option) => setCategoryFilter(option?.value || '')}
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
                    onClick={() => handleSort('productName')}
                    className="flex items-center gap-1 hover:text-gray-600"
                  >
                    Product
                    {sortConfig.key === 'productName' && (
                      <span>{sortConfig.order === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </button>
                </Th>
                <Th>SKU</Th>
                <Th>
                  <button
                    onClick={() => handleSort('category')}
                    className="flex items-center gap-1 hover:text-gray-600"
                  >
                    Category
                    {sortConfig.key === 'category' && (
                      <span>{sortConfig.order === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </button>
                </Th>
                <Th>Location</Th>
                <Th>
                  <button
                    onClick={() => handleSort('quantity')}
                    className="flex items-center gap-1 hover:text-gray-600"
                  >
                    Stock
                    {sortConfig.key === 'quantity' && (
                      <span>{sortConfig.order === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </button>
                </Th>
                <Th>
                  <button
                    onClick={() => handleSort('unitCost')}
                    className="flex items-center gap-1 hover:text-gray-600"
                  >
                    Unit Cost
                    {sortConfig.key === 'unitCost' && (
                      <span>{sortConfig.order === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </button>
                </Th>
                <Th>
                  <button
                    onClick={() => handleSort('totalValue')}
                    className="flex items-center gap-1 hover:text-gray-600"
                  >
                    Total Value
                    {sortConfig.key === 'totalValue' && (
                      <span>{sortConfig.order === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </button>
                </Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </THead>
            <TBody>
              {items.map((item) => (
                <Tr key={item.id}>
                  <Td>
                    <div>
                      <div className="font-medium">{item.productName}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        {getStockLevelBadge(item)}
                      </div>
                    </div>
                  </Td>
                  <Td className="font-mono text-sm">{item.sku}</Td>
                  <Td className="capitalize">{item.category}</Td>
                  <Td>{item.location}</Td>
                  <Td>
                    <div>
                      <div className="font-medium">{item.quantity}</div>
                      <div className="text-xs text-gray-500">
                        Available: {item.availableQuantity}
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <NumericFormat
                      displayType="text"
                      value={item.unitCost.toFixed(2)}
                      prefix="$"
                      thousandSeparator={true}
                    />
                  </Td>
                  <Td>
                    <NumericFormat
                      displayType="text"
                      value={item.totalValue.toFixed(2)}
                      prefix="$"
                      thousandSeparator={true}
                    />
                  </Td>
                  <Td>{getStatusBadge(item.status)}</Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <Tooltip title="Adjust Stock">
                        <Button
                          size="sm"
                          variant="plain"
                          icon={<HiOutlineAdjustments />}
                          onClick={() => handleAdjustStock(item)}
                        />
                      </Tooltip>
                      <Tooltip title="Edit">
                        <Button
                          size="sm"
                          variant="plain"
                          icon={<HiOutlinePencil />}
                          onClick={() => handleEdit(item)}
                        />
                      </Tooltip>
                      <Tooltip title="Delete">
                        <Button
                          size="sm"
                          variant="plain"
                          className="text-red-600 hover:text-red-700"
                          icon={<HiOutlineTrash />}
                          onClick={() => handleDelete(item)}
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
        width={800}
      >
        <h5 className="mb-4">
          {isEditing ? 'Edit Inventory Item' : 'Create New Inventory Item'}
        </h5>
        <InventoryCrudForm
          initialData={selectedItem || undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormDialogOpen(false)}
          onDelete={isEditing ? () => {
            setIsFormDialogOpen(false)
            handleDelete(selectedItem!)
          } : undefined}
          isEdit={isEditing}
        />
      </Dialog>

      {/* Stock Adjustment Dialog */}
      <Dialog
        isOpen={isAdjustmentDialogOpen}
        onClose={() => setIsAdjustmentDialogOpen(false)}
        onRequestClose={() => setIsAdjustmentDialogOpen(false)}
        width={500}
      >
        <h5 className="mb-4">Adjust Stock - {selectedItem?.productName}</h5>
        <StockAdjustmentForm
          currentStock={selectedItem?.quantity || 0}
          onSubmit={handleStockAdjustment}
          onCancel={() => setIsAdjustmentDialogOpen(false)}
        />
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onRequestClose={() => setIsDeleteDialogOpen(false)}
      >
        <h5 className="mb-4">Delete Inventory Item</h5>
        <p className="mb-6">
          Are you sure you want to delete "{selectedItem?.productName}"? This action cannot be undone.
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

export default InventoryCrudList