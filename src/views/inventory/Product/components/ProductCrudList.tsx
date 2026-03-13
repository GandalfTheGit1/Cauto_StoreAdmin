import { useEffect, useState } from 'react'
import { HiOutlinePencil, HiOutlineTrash, HiOutlinePlus } from 'react-icons/hi'

import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Dialog from '@/components/ui/Dialog'
import Loading from '@/components/shared/Loading'
import Notification from '@/components/ui/Notification'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import Table from '@/components/ui/Table'
import toast from '@/components/ui/toast'
import SearchInput from '@/components/shared/SearchInput'
import SearchHighlight from '@/components/shared/SearchHighlight'
import {
  ProductFormData,
  ProductListParams,
  apiGetProducts,
  apiCreateProduct,
  apiUpdateProduct,
  apiDeleteProduct,
} from '@/services/ProductService'

import ProductCrudForm from './ProductCrudForm'

const { Tr, Th, Td, THead, TBody } = Table

interface ProductCrudListProps {
  className?: string
}

const ProductCrudList = ({ className }: ProductCrudListProps) => {
  const [products, setProducts] = useState<ProductFormData[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: 'name', order: 'asc' as 'asc' | 'desc' })

  // Dialog states
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ProductFormData | null>(null)
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
    { value: '0', label: 'Active' },
    { value: '1', label: 'Low Stock' },
    { value: '2', label: 'Out of Stock' },
  ]

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params: ProductListParams = {
        pageIndex: currentPage,
        pageSize,
        sort: sortConfig,
        query: searchQuery,
        filterData: {
          category: categoryFilter ? [categoryFilter] : undefined,
          status: statusFilter ? [parseInt(statusFilter)] : undefined,
        },
      }

      const response = await apiGetProducts(params)
      setProducts(response.data)
      setTotal(response.total)
    } catch (error) {
      toast.push(
        <Notification title="Error" type="danger">
          Failed to fetch products
        </Notification>
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [currentPage, searchQuery, categoryFilter, statusFilter, sortConfig])

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      order: prev.key === key && prev.order === 'asc' ? 'desc' : 'asc',
    }))
  }

  const handleCreate = () => {
    setSelectedProduct(null)
    setIsEditing(false)
    setIsFormDialogOpen(true)
  }

  const handleEdit = (product: ProductFormData) => {
    setSelectedProduct(product)
    setIsEditing(true)
    setIsFormDialogOpen(true)
  }

  const handleDelete = (product: ProductFormData) => {
    setSelectedProduct(product)
    setIsDeleteDialogOpen(true)
  }

  const handleFormSubmit = async (values: ProductFormData, setSubmitting: (isSubmitting: boolean) => void) => {
    try {
      if (isEditing && selectedProduct) {
        await apiUpdateProduct({ ...values, id: selectedProduct.id })
        toast.push(
          <Notification title="Success" type="success">
            Product updated successfully
          </Notification>
        )
      } else {
        await apiCreateProduct(values)
        toast.push(
          <Notification title="Success" type="success">
            Product created successfully
          </Notification>
        )
      }
      setIsFormDialogOpen(false)
      fetchProducts()
    } catch (error) {
      toast.push(
        <Notification title="Error" type="danger">
          Failed to save product
        </Notification>
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!selectedProduct?.id) return

    try {
      await apiDeleteProduct(selectedProduct.id)
      toast.push(
        <Notification title="Success" type="success">
          Product deleted successfully
        </Notification>
      )
      setIsDeleteDialogOpen(false)
      fetchProducts()
    } catch (error) {
      toast.push(
        <Notification title="Error" type="danger">
          Failed to delete product
        </Notification>
      )
    }
  }

  const getStatusBadge = (status: number) => {
    const statusMap = {
      0: { label: 'Active', className: 'bg-green-100 text-green-800' },
      1: { label: 'Low Stock', className: 'bg-yellow-100 text-yellow-800' },
      2: { label: 'Out of Stock', className: 'bg-red-100 text-red-800' },
    }
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap[0]
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    )
  }

  return (
    <div className={className}>
      <Card>
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
          <h4>Product Management</h4>
          <Button
            variant="solid"
            icon={<HiOutlinePlus />}
            onClick={handleCreate}
          >
            Add Product
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <SearchInput
            placeholder="Search products by name, brand, category..."
            value={searchQuery}
            onChange={setSearchQuery}
            autoFocus={false}
          />
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
                    onClick={() => handleSort('name')}
                    className="flex items-center gap-1 hover:text-gray-600"
                  >
                    Product
                    {sortConfig.key === 'name' && (
                      <span>{sortConfig.order === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </button>
                </Th>
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
                <Th>
                  <button
                    onClick={() => handleSort('brand')}
                    className="flex items-center gap-1 hover:text-gray-600"
                  >
                    Brand
                    {sortConfig.key === 'brand' && (
                      <span>{sortConfig.order === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </button>
                </Th>
                <Th>
                  <button
                    onClick={() => handleSort('price')}
                    className="flex items-center gap-1 hover:text-gray-600"
                  >
                    Price
                    {sortConfig.key === 'price' && (
                      <span>{sortConfig.order === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </button>
                </Th>
                <Th>
                  <button
                    onClick={() => handleSort('stock')}
                    className="flex items-center gap-1 hover:text-gray-600"
                  >
                    Stock
                    {sortConfig.key === 'stock' && (
                      <span>{sortConfig.order === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </button>
                </Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </THead>
            <TBody>
              {products.map((product) => (
                <Tr key={product.id}>
                  <Td>
                    <div className="flex items-center gap-3">
                      <img
                        src={product.img || '/img/products/product-1.jpg'}
                        alt={product.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                      <div>
                        <div className="font-medium">
                          <SearchHighlight
                            text={product.name}
                            searchWords={[searchQuery]}
                          />
                        </div>
                        <div className="text-sm text-gray-500">{product.sku || product.id}</div>
                      </div>
                    </div>
                  </Td>
                  <Td className="capitalize">
                    <SearchHighlight
                      text={product.category}
                      searchWords={[searchQuery]}
                    />
                  </Td>
                  <Td>
                    <SearchHighlight
                      text={product.brand}
                      searchWords={[searchQuery]}
                    />
                  </Td>
                  <Td>${product.price}</Td>
                  <Td>{product.stock}</Td>
                  <Td>{getStatusBadge(product.status)}</Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="plain"
                        icon={<HiOutlinePencil />}
                        onClick={() => handleEdit(product)}
                      />
                      <Button
                        size="sm"
                        variant="plain"
                        className="text-red-600 hover:text-red-700"
                        icon={<HiOutlineTrash />}
                        onClick={() => handleDelete(product)}
                      />
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
          {isEditing ? 'Edit Product' : 'Create New Product'}
        </h5>
        <ProductCrudForm
          initialData={selectedProduct || undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormDialogOpen(false)}
          onDelete={isEditing ? () => {
            setIsFormDialogOpen(false)
            handleDelete(selectedProduct!)
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
        <h5 className="mb-4">Delete Product</h5>
        <p className="mb-6">
          Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
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

export default ProductCrudList