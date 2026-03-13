import { Form, Formik, FormikProps } from 'formik'
import { forwardRef, useState } from 'react'
import { HiOutlineTrash, HiOutlineSave } from 'react-icons/hi'
import * as Yup from 'yup'

import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Dialog from '@/components/ui/Dialog'
import { FormContainer, FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Notification from '@/components/ui/Notification'
import Select from '@/components/ui/Select'
// Textarea is part of Input component
import toast from '@/components/ui/toast'
import Upload from '@/components/ui/Upload'
import { ProductFormData, apiUploadProductImage } from '@/services/ProductService'

export interface ProductCrudFormProps {
  initialData?: Partial<ProductFormData>
  onSubmit: (values: ProductFormData, setSubmitting: (isSubmitting: boolean) => void) => void
  onCancel: () => void
  onDelete?: () => void
  isEdit?: boolean
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Product name is required'),
  description: Yup.string().required('Description is required'),
  category: Yup.string().required('Category is required'),
  price: Yup.number().min(0, 'Price must be positive').required('Price is required'),
  stock: Yup.number().min(0, 'Stock must be positive').required('Stock is required'),
  brand: Yup.string().required('Brand is required'),
  vendor: Yup.string().required('Vendor is required'),
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
  { value: 0, label: 'Active' },
  { value: 1, label: 'Low Stock' },
  { value: 2, label: 'Out of Stock' },
]

const ProductCrudForm = forwardRef<FormikProps<ProductFormData>, ProductCrudFormProps>(
  ({ initialData, onSubmit, onCancel, onDelete, isEdit = false }, ref) => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [uploadedImages, setUploadedImages] = useState<string[]>(
      initialData?.imgList?.map(img => img.img) || []
    )

    const defaultValues: ProductFormData = {
      name: '',
      description: '',
      category: '',
      price: 0,
      stock: 0,
      status: 0,
      costPerItem: 0,
      taxRate: 6,
      tags: [],
      brand: '',
      vendor: '',
      ...initialData,
    }

    const handleImageUpload = async (files: File[]) => {
      try {
        const uploadPromises = files.map(file => apiUploadProductImage(file))
        const results = await Promise.all(uploadPromises)
        const newImages = results.map(result => result.url)
        setUploadedImages(prev => [...prev, ...newImages])
        
        toast.push(
          <Notification title="Success" type="success">
            Images uploaded successfully
          </Notification>
        )
      } catch (error) {
        toast.push(
          <Notification title="Error" type="danger">
            Failed to upload images
          </Notification>
        )
      }
    }

    const handleImageRemove = (index: number) => {
      setUploadedImages(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = (values: ProductFormData, { setSubmitting }: any) => {
      const formData = {
        ...values,
        img: uploadedImages[0] || '/img/products/product-1.jpg',
        imgList: uploadedImages.map((img, index) => ({
          id: `${values.id || 'new'}-img-${index}`,
          name: `image-${index + 1}`,
          img,
        })),
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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    {/* Basic Information */}
                    <Card>
                      <h5 className="mb-4">Basic Information</h5>
                      <FormItem
                        label="Product Name"
                        invalid={errors.name && touched.name}
                        errorMessage={errors.name}
                      >
                        <Input
                          name="name"
                          placeholder="Enter product name"
                          value={values.name}
                          onChange={(e) => setFieldValue('name', e.target.value)}
                        />
                      </FormItem>
                      
                      <FormItem
                        label="Description"
                        invalid={errors.description && touched.description}
                        errorMessage={errors.description}
                      >
                        <Input
                          textArea
                          name="description"
                          placeholder="Enter product description"
                          value={values.description}
                          onChange={(e) => setFieldValue('description', e.target.value)}
                        />
                      </FormItem>
                    </Card>

                    {/* Organization */}
                    <Card>
                      <h5 className="mb-4">Organization</h5>
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
                          label="Brand"
                          invalid={errors.brand && touched.brand}
                          errorMessage={errors.brand}
                        >
                          <Input
                            name="brand"
                            placeholder="Enter brand"
                            value={values.brand}
                            onChange={(e) => setFieldValue('brand', e.target.value)}
                          />
                        </FormItem>

                        <FormItem
                          label="Vendor"
                          invalid={errors.vendor && touched.vendor}
                          errorMessage={errors.vendor}
                        >
                          <Input
                            name="vendor"
                            placeholder="Enter vendor"
                            value={values.vendor}
                            onChange={(e) => setFieldValue('vendor', e.target.value)}
                          />
                        </FormItem>

                        <FormItem label="Status">
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

                    {/* Pricing */}
                    <Card>
                      <h5 className="mb-4">Pricing</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormItem
                          label="Price"
                          invalid={errors.price && touched.price}
                          errorMessage={errors.price}
                        >
                          <Input
                            name="price"
                            type="number"
                            placeholder="0.00"
                            value={values.price}
                            onChange={(e) => setFieldValue('price', parseFloat(e.target.value) || 0)}
                          />
                        </FormItem>

                        <FormItem
                          label="Cost per Item"
                          invalid={errors.costPerItem && touched.costPerItem}
                          errorMessage={errors.costPerItem}
                        >
                          <Input
                            name="costPerItem"
                            type="number"
                            placeholder="0.00"
                            value={values.costPerItem}
                            onChange={(e) => setFieldValue('costPerItem', parseFloat(e.target.value) || 0)}
                          />
                        </FormItem>

                        <FormItem
                          label="Stock"
                          invalid={errors.stock && touched.stock}
                          errorMessage={errors.stock}
                        >
                          <Input
                            name="stock"
                            type="number"
                            placeholder="0"
                            value={values.stock}
                            onChange={(e) => setFieldValue('stock', parseInt(e.target.value) || 0)}
                          />
                        </FormItem>
                      </div>
                    </Card>
                  </div>

                  {/* Images */}
                  <div>
                    <Card>
                      <h5 className="mb-4">Product Images</h5>
                      <Upload
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                      >
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <p className="text-gray-500">Drop images here or click to upload</p>
                        </div>
                      </Upload>
                      
                      {uploadedImages.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 gap-2">
                          {uploadedImages.map((img, index) => (
                            <div key={index} className="relative">
                              <img
                                src={img}
                                alt={`Product ${index + 1}`}
                                className="w-full h-20 object-cover rounded"
                              />
                              <button
                                type="button"
                                onClick={() => handleImageRemove(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </Card>
                  </div>
                </div>

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
                        Delete Product
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
                      {isEdit ? 'Update Product' : 'Create Product'}
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
          <h5 className="mb-4">Delete Product</h5>
          <p className="mb-6">
            Are you sure you want to delete this product? This action cannot be undone.
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

ProductCrudForm.displayName = 'ProductCrudForm'

export default ProductCrudForm