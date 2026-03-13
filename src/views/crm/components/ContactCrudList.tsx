import { useEffect, useState } from 'react'
import { HiOutlinePencil, HiOutlineTrash, HiOutlinePlus, HiOutlineEye } from 'react-icons/hi'

import Avatar from '@/components/ui/Avatar'
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
  Contact,
  ContactFormData,
  CRMListParams,
  apiGetContacts,
  apiCreateContact,
  apiUpdateContact,
  apiDeleteContact,
} from '@/services/CRMService'

import ContactCrudForm from './ContactCrudForm'

const { Tr, Th, Td, THead, TBody } = Table

interface ContactCrudListProps {
  className?: string
}

const ContactCrudList = ({ className }: ContactCrudListProps) => {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: 'firstName', order: 'asc' as 'asc' | 'desc' })

  // Dialog states
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ]

  const fetchContacts = async () => {
    setLoading(true)
    try {
      const params: CRMListParams = {
        pageIndex: currentPage,
        pageSize,
        sort: sortConfig,
        query: searchQuery,
        filterData: {
          status: statusFilter ? [statusFilter] : undefined,
        },
      }

      const response = await apiGetContacts(params)
      setContacts(response.data)
      setTotal(response.total)
    } catch (error) {
      toast.push(
        <Notification title="Error" type="danger">
          Failed to fetch contacts
        </Notification>
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContacts()
  }, [currentPage, searchQuery, statusFilter, sortConfig])

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      order: prev.key === key && prev.order === 'asc' ? 'desc' : 'asc',
    }))
  }

  const handleCreate = () => {
    setSelectedContact(null)
    setIsEditing(false)
    setIsFormDialogOpen(true)
  }

  const handleEdit = (contact: Contact) => {
    setSelectedContact(contact)
    setIsEditing(true)
    setIsFormDialogOpen(true)
  }

  const handleDelete = (contact: Contact) => {
    setSelectedContact(contact)
    setIsDeleteDialogOpen(true)
  }

  const handleFormSubmit = async (values: ContactFormData, setSubmitting: (isSubmitting: boolean) => void) => {
    try {
      if (isEditing && selectedContact) {
        await apiUpdateContact({ ...values, id: selectedContact.id })
        toast.push(
          <Notification title="Success" type="success">
            Contact updated successfully
          </Notification>
        )
      } else {
        await apiCreateContact(values)
        toast.push(
          <Notification title="Success" type="success">
            Contact created successfully
          </Notification>
        )
      }
      setIsFormDialogOpen(false)
      fetchContacts()
    } catch (error) {
      toast.push(
        <Notification title="Error" type="danger">
          Failed to save contact
        </Notification>
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!selectedContact?.id) return

    try {
      await apiDeleteContact(selectedContact.id)
      toast.push(
        <Notification title="Success" type="success">
          Contact deleted successfully
        </Notification>
      )
      setIsDeleteDialogOpen(false)
      fetchContacts()
    } catch (error) {
      toast.push(
        <Notification title="Error" type="danger">
          Failed to delete contact
        </Notification>
      )
    }
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      active: { label: 'Active', className: 'bg-green-100 text-green-800' },
      inactive: { label: 'Inactive', className: 'bg-gray-100 text-gray-800' },
    }
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.active
    
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
          <h4>Contact Management</h4>
          <Button
            variant="solid"
            icon={<HiOutlinePlus />}
            onClick={handleCreate}
          >
            Add Contact
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <SearchInput
            placeholder="Search contacts by name, company, email..."
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
                <Th>Contact</Th>
                <Th>
                  <button
                    onClick={() => handleSort('company')}
                    className="flex items-center gap-1 hover:text-gray-600"
                  >
                    Company
                    {sortConfig.key === 'company' && (
                      <span>{sortConfig.order === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </button>
                </Th>
                <Th>
                  <button
                    onClick={() => handleSort('position')}
                    className="flex items-center gap-1 hover:text-gray-600"
                  >
                    Position
                    {sortConfig.key === 'position' && (
                      <span>{sortConfig.order === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </button>
                </Th>
                <Th>Email</Th>
                <Th>Phone</Th>
                <Th>Status</Th>
                <Th>Assigned To</Th>
                <Th>Actions</Th>
              </Tr>
            </THead>
            <TBody>
              {contacts.map((contact) => (
                <Tr key={contact.id}>
                  <Td>
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={contact.avatar}
                        alt={`${contact.firstName} ${contact.lastName}`}
                        size="sm"
                      />
                      <div>
                        <div className="font-medium">
                          <SearchHighlight
                            text={`${contact.firstName} ${contact.lastName}`}
                            searchWords={[searchQuery]}
                          />
                        </div>
                        <div className="text-sm text-gray-500">
                          {contact.tags.map(tag => (
                            <span key={tag} className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs mr-1">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <SearchHighlight
                      text={contact.company}
                      searchWords={[searchQuery]}
                    />
                  </Td>
                  <Td>
                    <SearchHighlight
                      text={contact.position}
                      searchWords={[searchQuery]}
                    />
                  </Td>
                  <Td>
                    <SearchHighlight
                      text={contact.email}
                      searchWords={[searchQuery]}
                    />
                  </Td>
                  <Td>{contact.phone}</Td>
                  <Td>{getStatusBadge(contact.status)}</Td>
                  <Td>{contact.assignedTo}</Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <Tooltip title="View">
                        <Button
                          size="sm"
                          variant="plain"
                          icon={<HiOutlineEye />}
                          onClick={() => {
                            // Navigate to contact details
                            console.log('View contact:', contact.id)
                          }}
                        />
                      </Tooltip>
                      <Tooltip title="Edit">
                        <Button
                          size="sm"
                          variant="plain"
                          icon={<HiOutlinePencil />}
                          onClick={() => handleEdit(contact)}
                        />
                      </Tooltip>
                      <Tooltip title="Delete">
                        <Button
                          size="sm"
                          variant="plain"
                          className="text-red-600 hover:text-red-700"
                          icon={<HiOutlineTrash />}
                          onClick={() => handleDelete(contact)}
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
          {isEditing ? 'Edit Contact' : 'Create New Contact'}
        </h5>
        <ContactCrudForm
          initialData={selectedContact || undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormDialogOpen(false)}
          onDelete={isEditing ? () => {
            setIsFormDialogOpen(false)
            handleDelete(selectedContact!)
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
        <h5 className="mb-4">Delete Contact</h5>
        <p className="mb-6">
          Are you sure you want to delete "{selectedContact?.firstName} {selectedContact?.lastName}"? This action cannot be undone.
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

export default ContactCrudList