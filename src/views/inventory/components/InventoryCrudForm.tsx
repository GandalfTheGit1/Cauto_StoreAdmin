import { Form, Formik, FormikProps } from 'formik'
import { forwardRef, useState } from 'react'
import { HiOutlineTrash, HiOutlineSave } from 'react-icons/hi'
import * as Yup from 'yup'

import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Dialog from '@/components/ui/Dialog'
import { FormContainer, FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
// Textarea is part of Input component
import { InventoryFormData } from '@/services/InventoryService'

export interface InventoryCrudFormProps {
  initialData?: Partial<InventoryFormData>
  onSubmit: (values: InventoryFormData, setSubmitting: (isSubmitting: boolean) => void) => void
  onCancel: () => void
  onDelete?: () => void
  isEdit?: boolean
}

const validationSchema = Yup.object().shape({
  productName: Yup.string().required('Product name is required'),
  sku: Yup.string().required('SKU is required'),
  category: Yup.string().required('Category is required'),
  warehouseId: Yup.string().required('Warehouse is required'),
  location: Yup.string().required('Location is required'),
  quantity: Yup.number().min(0, 'Quantity must be positive').required('Quantity is required'),
  reorderLevel: Yup.number().min(0, 'Reorder level must be positive').required('Reorder level is required'),
  reorderQuantity: Yup.number().min(0, 'Reorder quantity must be positive').required('Reorder quantity is required'),
  unitCost: Yup.number().min(0, 'Unit cost must be positive').required('Unit cost is required'),
  supplierId: Yup.string().required('Supplier is required'),
})

const categoryOptions = [
  { value: 'devices', label: 'Electronics & Devices' },
  { value: 'watches', label: 'Watches & Timepieces' },
  { value: 'bags', label: 'Bags & Luggage' },
  { value: 'shoes', label: 'Shoes & Footwear' },
  { value: 'cloths', label: 'Clothing' },
  { value: 'accessories', label: 'Accessories' },
]

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'discontinued', label: 'Discontinued' },
]

const warehouseOptions = [
  { value: 'wh-001', label: 'Main Warehouse (MW-001)' },
  { value: 'wh-002', label: 'East Coast Distribution (ECD-002)' },
]

const supplierOptions = [
  { value: 'sup-001', label: 'WindForce co, Ltd' },
  { value: 'sup-002', label: 'Gaming Gear Ltd' },
  { value: 'sup-003', label: 'Luxury Goods Inc' },
]

const InventoryCrudForm = forwardRef<FormikProps<InventoryFormData>, InventoryCrudFormProps>(
  ({ initialData, onSubmit, onCancel, onDelete, isEdit = false }, ref) => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

    const defaultValues: InventoryFormData = {
      productId: '',
      productName: '',
      sku: '',
      category: '',
      warehouseId: '',
      location: '',
      quantity: 0,
      reservedQuantity: 0,
      reorderLevel: 10,
      reorderQuantity: 50,
      unitCost: 0,
      supplierId: '',
      status: 'active',
      ...initialData,
    }

    const handleSubmit = (values: InventoryFormData, { setSubmitting }: any) => {
      onSubmit(values, setSubmitting)
    }

    return (
      <>
        <Formik
          innerRef={ref}
          initialValues={defaultValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, isSubmitting, setFieldValue }) => (
            <Form>
              <FormContainer>
                {/* Product Information */}
                <Card>
                  <h5 className="mb-4">Product Information</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormItem
                      label="Product Name"
                      invalid={errors.productName && touched.productName}
                      errorMessage={errors.productName}
                    >
                      <Input
                        name="productName"
                        placeholder="Enter product name"
                        value={values.productName}
                        onChange={(e) => setFieldValue('productName', e.target.value)}
                      />
                    </FormItem>

                    <FormItem
                      label="SKU"
                      invalid={errors.sku && touched.sku}
                      errorMessage={errors.sku}
                    >
                      <Input
                        name="sku"
                        placeholder="Enter SKU"
                        value={values.sku}
                        onChange={(e) => setFieldValue('sku', e.target.value)}
                      />
                    </FormItem>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormItem
                      label="Category"
                      invalid={errors.category && touched.category}
                      errorMessage={errors.category}
                    >
                      <Select
                        name="category"
                        placeholder="Select category"
                        options={categoryOptions}
                        value={categoryOptions.find(option => option.value === values.category)}
                        onChange={(option) => setFieldValue('category', option?.value)}
                      />
                    </FormItem>

                    <FormItem
                      label="Status"
                      invalid={errors.status && touched.status}
                      errorMessage={errors.status}
                    >
                      <Select
                        name="status"
                        placeholder="Select status"
                        options={statusOptions}
                        value={statusOptions.find(option => option.value === values.status)}
                        onChange={(option) => setFieldValue('status', option?.value)}
                      />
                    </FormItem>
                  </div>
                </Card>

                {/* Location & Warehouse */}
                <Card className="mt-6">
                  <h5 className="mb-4">Location & Warehouse</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormItem
                      label="Warehouse"
                      invalid={errors.warehouseId && touched.warehouseId}
                      errorMessage={errors.warehouseId}
                    >
                      <Select
                        name="warehouseId"
                        placeholder="Select warehouse"
                        options={warehouseOptions}
                        value={warehouseOptions.find(option => option.value === values.warehouseId)}
                        onChange={(option) => setFieldValue('warehouseId', option?.value)}
                      />
                    </FormItem>

                    <FormItem
                      label="Location"
                      invalid={errors.location && touched.location}
                      errorMessage={errors.location}
                    >
                      <Input
                        name="location"
                        placeholder="e.g., A-1-001"
                        value={values.location}
                        onChange={(e) => setFieldValue('location', e.target.value)}
                      />
                    </FormItem>
                  </div>
                </Card>

                {/* Stock Information */}
                <Card className="mt-6">
                  <h5 className="mb-4">Stock Information</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormItem
                      label="Current Quantity"
                      invalid={errors.quantity && touched.quantity}
                      errorMessage={errors.quantity}
                    >
                      <Input
                        name="quantity"
                        type="number"
                        placeholder="0"
                        value={values.quantity}
                        onChange={(e) => setFieldValue('quantity', parseInt(e.target.value) || 0)}
                      />
                    </FormItem>

                    <FormItem
                      label="Reserved Quantity"
                      invalid={errors.reservedQuantity && touched.reservedQuantity}
                      errorMessage={errors.reservedQuantity}
                    >
                      <Input
                        name="reservedQuantity"
                        type="number"
                        placeholder="0"
                        value={values.reservedQuantity}
                        onChange={(e) => setFieldValue('reservedQuantity', parseInt(e.target.value) || 0)}
                      />
                    </FormItem>

                    <FormItem
                      label="Unit Cost"
                      invalid={errors.unitCost && touched.unitCost}
                      errorMessage={errors.unitCost}
                    >
                      <Input
                        name="unitCost"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={values.unitCost}
                        onChange={(e) => setFieldValue('unitCost', parseFloat(e.target.value) || 0)}
                      />
                    </FormItem>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormItem
                      label="Reorder Level"
                      invalid={errors.reorderLevel && touched.reorderLevel}
                      errorMessage={errors.reorderLevel}
                    >
                      <Input
                        name="reorderLevel"
                        type="number"
                        placeholder="10"
                        value={values.reorderLevel}
                        onChange={(e) => setFieldValue('reorderLevel', parseInt(e.target.value) || 0)}
                      />
                    </FormItem>

                    <FormItem
                      label="Reorder Quantity"
                      invalid={errors.reorderQuantity && touched.reorderQuantity}
                      errorMessage={errors.reorderQuantity}
                    >
                      <Input
                        name="reorderQuantity"
                        type="number"
                        placeholder="50"
                        value={values.reorderQuantity}
                        onChange={(e) => setFieldValue('reorderQuantity', parseInt(e.target.value) || 0)}
                      />
                    </FormItem>
                  </div>
                </Card>

                {/* Supplier Information */}
                <Card className="mt-6">
                  <h5 className="mb-4">Supplier Information</h5>
                  <FormItem
                    label="Supplier"
                    invalid={errors.supplierId && touched.supplierId}
                    errorMessage={errors.supplierId}
                  >
                    <Select
                      name="supplierId"
                      placeholder="Select supplier"
                      options={supplierOptions}
                      value={supplierOptions.find(option => option.value === values.supplierId)}
                      onChange={(option) => setFieldValue('supplierId', option?.value)}
                    />
                  </FormItem>
                </Card>

                {/* Actions */}
                <div className="flex items-center justify-between mt-8 pt-4 border-t">
                  <div>
                    {isEdit && onDelete && (
                      <Button
                        type="button"
                        variant="plain"
                        className="text-red-600"
                        icon={<HiOutlineTrash />}
                        onClick={() => setDeleteDialogOpen(true)}
                      >
                        Delete Item
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={onCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="solid"
                      loading={isSubmitting}
                      icon={<HiOutlineSave />}
                    >
                      {isEdit ? 'Update Item' : 'Create Item'}
                    </Button>
                  </div>
                </div>
              </FormContainer>
            </Form>
          )}
        </Formik>

        {/* Delete Confirmation Dialog */}
        <Dialog
          isOpen={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onRequestClose={() => setDeleteDialogOpen(false)}
        >
          <h5 className="mb-4">Delete Inventory Item</h5>
          <p className="mb-6">
            Are you sure you want to delete this inventory item? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="solid"
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                setDeleteDialogOpen(false)
                onDelete?.()
              }}
            >
              Delete
            </Button>
          </div>
        </Dialog>
      </>
    )
  }
)

InventoryCrudForm.displayName = 'InventoryCrudForm'

export default InventoryCrudForm