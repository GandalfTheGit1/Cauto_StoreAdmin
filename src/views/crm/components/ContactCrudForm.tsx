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
import { ContactFormData } from '@/services/CRMService'

export interface ContactCrudFormProps {
  initialData?: Partial<ContactFormData>
  onSubmit: (values: ContactFormData, setSubmitting: (isSubmitting: boolean) => void) => void
  onCancel: () => void
  onDelete?: () => void
  isEdit?: boolean
}

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().required('Phone is required'),
  company: Yup.string().required('Company is required'),
  position: Yup.string().required('Position is required'),
  assignedTo: Yup.string().required('Assigned to is required'),
})

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

const sourceOptions = [
  { value: 'website', label: 'Website' },
  { value: 'referral', label: 'Referral' },
  { value: 'trade_show', label: 'Trade Show' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'cold_call', label: 'Cold Call' },
  { value: 'email_campaign', label: 'Email Campaign' },
]

const assigneeOptions = [
  { value: 'Sarah Johnson', label: 'Sarah Johnson' },
  { value: 'Mike Rodriguez', label: 'Mike Rodriguez' },
  { value: 'Jennifer Lee', label: 'Jennifer Lee' },
  { value: 'Tom Wilson', label: 'Tom Wilson' },
]

const tagOptions = [
  { value: 'enterprise', label: 'Enterprise' },
  { value: 'technology', label: 'Technology' },
  { value: 'startup', label: 'Startup' },
  { value: 'saas', label: 'SaaS' },
  { value: 'retail', label: 'Retail' },
  { value: 'operations', label: 'Operations' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'compliance', label: 'Compliance' },
  { value: 'high-value', label: 'High Value' },
  { value: 'mid-market', label: 'Mid Market' },
]

const ContactCrudForm = forwardRef<FormikProps<ContactFormData>, ContactCrudFormProps>(
  ({ initialData, onSubmit, onCancel, onDelete, isEdit = false }, ref) => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

    const defaultValues: ContactFormData = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      position: '',
      status: 'active',
      source: 'website',
      tags: [],
      assignedTo: 'Sarah Johnson',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States',
      },
      socialMedia: {
        linkedin: '',
        twitter: '',
      },
      notes: '',
      ...initialData,
    }

    const handleSubmit = (values: ContactFormData, { setSubmitting }: any) => {
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <Card>
                    <h5 className="mb-4">Basic Information</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormItem
                        label="First Name"
                        invalid={errors.firstName && touched.firstName}
                        errorMessage={errors.firstName}
                      >
                        <Input
                          name="firstName"
                          placeholder="Enter first name"
                          value={values.firstName}
                          onChange={(e) => setFieldValue('firstName', e.target.value)}
                        />
                      </FormItem>

                      <FormItem
                        label="Last Name"
                        invalid={errors.lastName && touched.lastName}
                        errorMessage={errors.lastName}
                      >
                        <Input
                          name="lastName"
                          placeholder="Enter last name"
                          value={values.lastName}
                          onChange={(e) => setFieldValue('lastName', e.target.value)}
                        />
                      </FormItem>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormItem
                        label="Email"
                        invalid={errors.email && touched.email}
                        errorMessage={errors.email}
                      >
                        <Input
                          name="email"
                          type="email"
                          placeholder="Enter email"
                          value={values.email}
                          onChange={(e) => setFieldValue('email', e.target.value)}
                        />
                      </FormItem>

                      <FormItem
                        label="Phone"
                        invalid={errors.phone && touched.phone}
                        errorMessage={errors.phone}
                      >
                        <Input
                          name="phone"
                          placeholder="Enter phone number"
                          value={values.phone}
                          onChange={(e) => setFieldValue('phone', e.target.value)}
                        />
                      </FormItem>
                    </div>
                  </Card>

                  {/* Company Information */}
                  <Card>
                    <h5 className="mb-4">Company Information</h5>
                    <FormItem
                      label="Company"
                      invalid={errors.company && touched.company}
                      errorMessage={errors.company}
                    >
                      <Input
                        name="company"
                        placeholder="Enter company name"
                        value={values.company}
                        onChange={(e) => setFieldValue('company', e.target.value)}
                      />
                    </FormItem>

                    <FormItem
                      label="Position"
                      invalid={errors.position && touched.position}
                      errorMessage={errors.position}
                    >
                      <Input
                        name="position"
                        placeholder="Enter position/title"
                        value={values.position}
                        onChange={(e) => setFieldValue('position', e.target.value)}
                      />
                    </FormItem>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormItem label="Status">
                        <Select
                          name="status"
                          placeholder="Select status"
                          options={statusOptions}
                          value={statusOptions.find(option => option.value === values.status)}
                          onChange={(option) => setFieldValue('status', option?.value)}
                        />
                      </FormItem>

                      <FormItem label="Source">
                        <Select
                          name="source"
                          placeholder="Select source"
                          options={sourceOptions}
                          value={sourceOptions.find(option => option.value === values.source)}
                          onChange={(option) => setFieldValue('source', option?.value)}
                        />
                      </FormItem>
                    </div>
                  </Card>
                </div>

                {/* Assignment and Tags */}
                <Card className="mt-6">
                  <h5 className="mb-4">Assignment & Tags</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormItem
                      label="Assigned To"
                      invalid={errors.assignedTo && touched.assignedTo}
                      errorMessage={errors.assignedTo}
                    >
                      <Select
                        name="assignedTo"
                        placeholder="Select assignee"
                        options={assigneeOptions}
                        value={assigneeOptions.find(option => option.value === values.assignedTo)}
                        onChange={(option) => setFieldValue('assignedTo', option?.value)}
                      />
                    </FormItem>

                    <FormItem label="Tags">
                      <Select
                        name="tags"
                        placeholder="Select tags"
                        options={tagOptions}
                        isMulti
                        value={tagOptions.filter(option => values.tags.includes(option.value))}
                        onChange={(options) => setFieldValue('tags', options?.map(opt => opt.value) || [])}
                      />
                    </FormItem>
                  </div>
                </Card>

                {/* Address */}
                <Card className="mt-6">
                  <h5 className="mb-4">Address</h5>
                  <FormItem label="Street Address">
                    <Input
                      name="address.street"
                      placeholder="Enter street address"
                      value={values.address?.street || ''}
                      onChange={(e) => setFieldValue('address.street', e.target.value)}
                    />
                  </FormItem>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <FormItem label="City">
                      <Input
                        name="address.city"
                        placeholder="City"
                        value={values.address?.city || ''}
                        onChange={(e) => setFieldValue('address.city', e.target.value)}
                      />
                    </FormItem>

                    <FormItem label="State">
                      <Input
                        name="address.state"
                        placeholder="State"
                        value={values.address?.state || ''}
                        onChange={(e) => setFieldValue('address.state', e.target.value)}
                      />
                    </FormItem>

                    <FormItem label="Zip Code">
                      <Input
                        name="address.zipCode"
                        placeholder="Zip code"
                        value={values.address?.zipCode || ''}
                        onChange={(e) => setFieldValue('address.zipCode', e.target.value)}
                      />
                    </FormItem>

                    <FormItem label="Country">
                      <Input
                        name="address.country"
                        placeholder="Country"
                        value={values.address?.country || ''}
                        onChange={(e) => setFieldValue('address.country', e.target.value)}
                      />
                    </FormItem>
                  </div>
                </Card>

                {/* Social Media & Notes */}
                <Card className="mt-6">
                  <h5 className="mb-4">Social Media & Notes</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormItem label="LinkedIn">
                      <Input
                        name="socialMedia.linkedin"
                        placeholder="LinkedIn profile URL"
                        value={values.socialMedia?.linkedin || ''}
                        onChange={(e) => setFieldValue('socialMedia.linkedin', e.target.value)}
                      />
                    </FormItem>

                    <FormItem label="Twitter">
                      <Input
                        name="socialMedia.twitter"
                        placeholder="Twitter handle"
                        value={values.socialMedia?.twitter || ''}
                        onChange={(e) => setFieldValue('socialMedia.twitter', e.target.value)}
                      />
                    </FormItem>
                  </div>

                  <FormItem label="Notes">
                    <Input
                      textArea
                      name="notes"
                      placeholder="Additional notes about this contact..."
                      value={values.notes || ''}
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
                        Delete Contact
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
                      {isEdit ? 'Update Contact' : 'Create Contact'}
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
          <h5 className="mb-4">Delete Contact</h5>
          <p className="mb-6">
            Are you sure you want to delete this contact? This action cannot be undone.
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

ContactCrudForm.displayName = 'ContactCrudForm'

export default ContactCrudForm