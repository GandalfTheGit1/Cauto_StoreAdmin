import { Form, Formik, FormikProps } from 'formik'
import { forwardRef, useState, useEffect } from 'react'
import { HiOutlineTrash, HiOutlineSave, HiOutlinePlus } from 'react-icons/hi'
import * as Yup from 'yup'

import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Dialog from '@/components/ui/Dialog'
import { FormContainer, FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
// Textarea is part of Input component
import { OrderFormData, ORDER_STATUS, ORDER_STATUS_LABELS } from '@/@types/orders'
import { customersData } from '@/mock/data/salesData'
import { productsData } from '@/mock/data/salesData'

export interface OrderCrudFormProps {
  initialData?: Partial<OrderFormData>
  onSubmit: (values: OrderFormData, setSubmitting: (isSubmitting: boolean) => void) => void
  onCancel: () => void
  onDelete?: () => void
  isEdit?: boolean
}

const validationSchema = Yup.object().shape({
  customerId: Yup.string().required('Customer is required'),
  customerName: Yup.string().required('Customer name is required'),
  status: Yup.number().required('Status is required'),
  paymentMethod: Yup.string().required('Payment method is required'),
  items: Yup.array().min(1, 'At least one item is required'),
})

const statusOptions = Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => ({
  value: parseInt(value),
  label,
}))

const paymentMethodOptions = [
  { value: 'visa', label: 'Visa' },
  { value: 'master', label: 'Mastercard' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'cash', label: 'Cash' },
]

const customerOptions = customersData.map(customer => ({
  value: customer.id,
  label: `${customer.firstName} ${customer.lastName}`,
  email: customer.email,
  phone: customer.phone,
}))

const productOptions = productsData.map(product => ({
  value: product.id,
  label: product.name,
  price: product.price,
  img: product.img,
  productCode: product.productCode,
}))

const OrderCrudForm = forwardRef<FormikProps<OrderFormData>, OrderCrudFormProps>(
  ({ initialData, onSubmit, onCancel, onDelete, isEdit = false }, ref) => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

    const defaultValues: OrderFormData = {
      customerId: '',
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      items: [],
      status: ORDER_STATUS.PENDING,
      paymentMethod: 'visa',
      paymentIdentifier: '',
      shippingAddress: {
        line1: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States',
      },
      notes: '',
      subtotal: 0,
      tax: 0,
      shipping: 0,
      total: 0,
      ...initialData,
    }

    const calculateTotals = (items: any[]) => {
      const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0)
      const tax = subtotal * 0.08 // 8% tax
      const shipping = subtotal > 100 ? 0 : 15 // Free shipping over $100
      const total = subtotal + tax + shipping
      return { subtotal, tax, shipping, total }
    }

    const handleSubmit = (values: OrderFormData, { setSubmitting }: any) => {
      const totals = calculateTotals(values.items)
      const formData = {
        ...values,
        ...totals,
      }
      onSubmit(formData, setSubmitting)
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Customer Information */}
                  <Card>
                    <h5 className="mb-4">Customer Information</h5>
                    <FormItem
                      label="Customer"
                      invalid={errors.customerId && touched.customerId}
                      errorMessage={errors.customerId}
                    >
                      <Select
                        name="customerId"
                        placeholder="Select customer"
                        options={customerOptions}
                        value={customerOptions.find(option => option.value === values.customerId)}
                        onChange={(option) => {
                          setFieldValue('customerId', option?.value || '')
                          setFieldValue('customerName', option?.label || '')
                          setFieldValue('customerEmail', option?.email || '')
                          setFieldValue('customerPhone', option?.phone || '')
                        }}
                      />
                    </FormItem>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormItem label="Email">
                        <Input
                          name="customerEmail"
                          placeholder="Customer email"
                          value={values.customerEmail}
                          onChange={(e) => setFieldValue('customerEmail', e.target.value)}
                        />
                      </FormItem>

                      <FormItem label="Phone">
                        <Input
                          name="customerPhone"
                          placeholder="Customer phone"
                          value={values.customerPhone}
                          onChange={(e) => setFieldValue('customerPhone', e.target.value)}
                        />
                      </FormItem>
                    </div>
                  </Card>

                  {/* Order Details */}
                  <Card>
                    <h5 className="mb-4">Order Details</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                      <FormItem
                        label="Payment Method"
                        invalid={errors.paymentMethod && touched.paymentMethod}
                        errorMessage={errors.paymentMethod}
                      >
                        <Select
                          name="paymentMethod"
                          placeholder="Select payment method"
                          options={paymentMethodOptions}
                          value={paymentMethodOptions.find(option => option.value === values.paymentMethod)}
                          onChange={(option) => setFieldValue('paymentMethod', option?.value)}
                        />
                      </FormItem>
                    </div>

                    <FormItem label="Payment Identifier">
                      <Input
                        name="paymentIdentifier"
                        placeholder="e.g., •••• 1234"
                        value={values.paymentIdentifier}
                        onChange={(e) => setFieldValue('paymentIdentifier', e.target.value)}
                      />
                    </FormItem>
                  </Card>
                </div>

                {/* Shipping Address */}
                <Card className="mt-6">
                  <h5 className="mb-4">Shipping Address</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormItem label="Address Line 1" className="md:col-span-2">
                      <Input
                        name="shippingAddress.line1"
                        placeholder="Street address"
                        value={values.shippingAddress.line1}
                        onChange={(e) => setFieldValue('shippingAddress.line1', e.target.value)}
                      />
                    </FormItem>

                    <FormItem label="City">
                      <Input
                        name="shippingAddress.city"
                        placeholder="City"
                        value={values.shippingAddress.city}
                        onChange={(e) => setFieldValue('shippingAddress.city', e.target.value)}
                      />
                    </FormItem>

                    <FormItem label="State">
                      <Input
                        name="shippingAddress.state"
                        placeholder="State"
                        value={values.shippingAddress.state}
                        onChange={(e) => setFieldValue('shippingAddress.state', e.target.value)}
                      />
                    </FormItem>

                    <FormItem label="Zip Code">
                      <Input
                        name="shippingAddress.zipCode"
                        placeholder="Zip code"
                        value={values.shippingAddress.zipCode}
                        onChange={(e) => setFieldValue('shippingAddress.zipCode', e.target.value)}
                      />
                    </FormItem>

                    <FormItem label="Country">
                      <Input
                        name="shippingAddress.country"
                        placeholder="Country"
                        value={values.shippingAddress.country}
                        onChange={(e) => setFieldValue('shippingAddress.country', e.target.value)}
                      />
                    </FormItem>
                  </div>
                </Card>

                {/* Order Items */}
                <Card className="mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h5>Order Items</h5>
                    <Button
                      type="button"
                      size="sm"
                      icon={<HiOutlinePlus />}
                      onClick={() => {
                        const newItem = {
                          id: `item-${Date.now()}`,
                          productId: '',
                          productName: '',
                          productCode: '',
                          img: '',
                          price: 0,
                          quantity: 1,
                          total: 0,
                        }
                        setFieldValue('items', [...values.items, newItem])
                      }}
                    >
                      Add Item
                    </Button>
                  </div>

                  {values.items.map((item, index) => (
                    <div key={item.id || index} className="border rounded p-4 mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-1">Product</label>
                          <Select
                            placeholder="Select product"
                            options={productOptions}
                            value={productOptions.find(option => option.value === item.productId)}
                            onChange={(option) => {
                              const updatedItems = [...values.items]
                              updatedItems[index] = {
                                ...item,
                                productId: option?.value || '',
                                productName: option?.label || '',
                                productCode: option?.productCode || '',
                                img: option?.img || '',
                                price: option?.price || 0,
                                total: (option?.price || 0) * item.quantity,
                              }
                              setFieldValue('items', updatedItems)
                            }}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Quantity</label>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => {
                              const quantity = parseInt(e.target.value) || 1
                              const updatedItems = [...values.items]
                              updatedItems[index] = {
                                ...item,
                                quantity,
                                total: item.price * quantity,
                              }
                              setFieldValue('items', updatedItems)
                            }}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Total</label>
                          <Input
                            value={`$${item.total.toFixed(2)}`}
                            readOnly
                          />
                        </div>

                        <div>
                          <Button
                            type="button"
                            size="sm"
                            variant="plain"
                            className="text-red-600"
                            icon={<HiOutlineTrash />}
                            onClick={() => {
                              const updatedItems = values.items.filter((_, i) => i !== index)
                              setFieldValue('items', updatedItems)
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {values.items.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No items added. Click "Add Item" to get started.
                    </div>
                  )}
                </Card>

                {/* Notes */}
                <Card className="mt-6">
                  <h5 className="mb-4">Notes</h5>
                  <FormItem>
                    <Input
                      textArea
                      name="notes"
                      placeholder="Order notes..."
                      value={values.notes}
                      onChange={(e) => setFieldValue('notes', e.target.value)}
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
                        Delete Order
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
                      {isEdit ? 'Update Order' : 'Create Order'}
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
          <h5 className="mb-4">Delete Order</h5>
          <p className="mb-6">
            Are you sure you want to delete this order? This action cannot be undone.
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

OrderCrudForm.displayName = 'OrderCrudForm'

export default OrderCrudForm