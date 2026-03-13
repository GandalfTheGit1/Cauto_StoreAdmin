import { Form, Formik } from 'formik'
import { useState } from 'react'
import { HiOutlineSave } from 'react-icons/hi'
import * as Yup from 'yup'

import Button from '@/components/ui/Button'
import { FormContainer, FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
// Textarea is part of Input component

interface StockAdjustmentFormProps {
  currentStock: number
  onSubmit: (quantity: number, reason: string) => void
  onCancel: () => void
}

const validationSchema = Yup.object().shape({
  adjustmentType: Yup.string().required('Adjustment type is required'),
  quantity: Yup.number()
    .min(1, 'Quantity must be greater than 0')
    .required('Quantity is required'),
  reason: Yup.string().required('Reason is required'),
})

const adjustmentTypeOptions = [
  { value: 'increase', label: 'Increase Stock' },
  { value: 'decrease', label: 'Decrease Stock' },
]

const reasonOptions = [
  { value: 'Purchase Order', label: 'Purchase Order' },
  { value: 'Damaged Goods', label: 'Damaged Goods' },
  { value: 'Lost Items', label: 'Lost Items' },
  { value: 'Found Items', label: 'Found Items' },
  { value: 'Cycle Count Adjustment', label: 'Cycle Count Adjustment' },
  { value: 'Return to Supplier', label: 'Return to Supplier' },
  { value: 'Customer Return', label: 'Customer Return' },
  { value: 'Other', label: 'Other' },
]

const StockAdjustmentForm = ({ currentStock, onSubmit, onCancel }: StockAdjustmentFormProps) => {
  const [customReason, setCustomReason] = useState('')

  const initialValues = {
    adjustmentType: '',
    quantity: 1,
    reason: '',
    notes: '',
  }

  const handleSubmit = (values: any) => {
    const adjustmentQuantity = values.adjustmentType === 'increase' 
      ? values.quantity 
      : -values.quantity
    
    const reason = values.reason === 'Other' ? customReason : values.reason
    const fullReason = values.notes ? `${reason} - ${values.notes}` : reason
    
    onSubmit(adjustmentQuantity, fullReason)
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, isSubmitting, setFieldValue }) => (
        <Form>
          <FormContainer>
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Current Stock Level</div>
              <div className="text-2xl font-bold text-gray-900">{currentStock} units</div>
            </div>

            <FormItem
              label="Adjustment Type"
              invalid={errors.adjustmentType && touched.adjustmentType}
              errorMessage={errors.adjustmentType}
            >
              <Select
                name="adjustmentType"
                placeholder="Select adjustment type"
                options={adjustmentTypeOptions}
                value={adjustmentTypeOptions.find(option => option.value === values.adjustmentType)}
                onChange={(option) => setFieldValue('adjustmentType', option?.value)}
              />
            </FormItem>

            <FormItem
              label="Quantity"
              invalid={errors.quantity && touched.quantity}
              errorMessage={errors.quantity}
            >
              <Input
                name="quantity"
                type="number"
                min="1"
                placeholder="Enter quantity"
                value={values.quantity}
                onChange={(e) => setFieldValue('quantity', parseInt(e.target.value) || 1)}
              />
            </FormItem>

            {values.adjustmentType && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-600">
                  New Stock Level: {' '}
                  <span className="font-bold">
                    {values.adjustmentType === 'increase' 
                      ? currentStock + values.quantity
                      : Math.max(0, currentStock - values.quantity)
                    } units
                  </span>
                </div>
              </div>
            )}

            <FormItem
              label="Reason"
              invalid={errors.reason && touched.reason}
              errorMessage={errors.reason}
            >
              <Select
                name="reason"
                placeholder="Select reason"
                options={reasonOptions}
                value={reasonOptions.find(option => option.value === values.reason)}
                onChange={(option) => setFieldValue('reason', option?.value)}
              />
            </FormItem>

            {values.reason === 'Other' && (
              <FormItem label="Custom Reason">
                <Input
                  placeholder="Enter custom reason"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                />
              </FormItem>
            )}

            <FormItem label="Additional Notes">
              <Input
                textArea
                name="notes"
                placeholder="Enter additional notes (optional)"
                value={values.notes}
                onChange={(e) => setFieldValue('notes', e.target.value)}
              />
            </FormItem>

            <div className="flex justify-end gap-2 mt-6">
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
                Apply Adjustment
              </Button>
            </div>
          </FormContainer>
        </Form>
      )}
    </Formik>
  )
}

export default StockAdjustmentForm