import ApiService from './ApiService'

// Contact interfaces
export interface Contact {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  position: string
  avatar?: string
  status: 'active' | 'inactive'
  source: string
  tags: string[]
  assignedTo: string
  createdAt: number
  lastContact: number
  address?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  socialMedia?: {
    linkedin?: string
    twitter?: string
  }
  notes?: string
}

export interface ContactFormData extends Omit<Contact, 'id' | 'createdAt' | 'lastContact'> {
  id?: string
}

// Lead interfaces
export interface Lead {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  position: string
  avatar?: string
  status: 'new' | 'qualified' | 'nurturing' | 'converted' | 'lost'
  source: string
  score: number
  tags: string[]
  assignedTo: string
  createdAt: number
  lastActivity: number
  estimatedValue: number
  probability: number
  expectedCloseDate: number
  notes?: string
  activities: Activity[]
}

export interface LeadFormData extends Omit<Lead, 'id' | 'createdAt' | 'lastActivity' | 'activities'> {
  id?: string
}

// Opportunity interfaces
export interface Opportunity {
  id: string
  name: string
  contactId: string
  company: string
  stage: string
  value: number
  probability: number
  expectedCloseDate: number
  createdAt: number
  assignedTo: string
  source: string
  type: 'new_business' | 'existing_customer' | 'renewal'
  products: string[]
  competitors: string[]
  nextSteps: string
  notes?: string
  activities: Activity[]
}

export interface OpportunityFormData extends Omit<Opportunity, 'id' | 'createdAt' | 'activities'> {
  id?: string
}

// Activity interface
export interface Activity {
  id: string
  type: string
  subject: string
  date: number
  description: string
}

// List parameters
export interface CRMListParams {
  pageIndex: number
  pageSize: number
  sort: {
    order: 'asc' | 'desc'
    key: string
  }
  query?: string
  filterData?: {
    status?: string[]
    assignedTo?: string[]
    tags?: string[]
    source?: string[]
  }
}

export interface CRMListResponse<T> {
  data: T[]
  total: number
}

// Contact API functions
export async function apiGetContacts(params: CRMListParams): Promise<CRMListResponse<Contact>> {
  return ApiService.fetchData({
    url: '/crm/contacts',
    method: 'post',
    data: params,
  })
}

export async function apiGetContact(id: string): Promise<Contact> {
  return ApiService.fetchData({
    url: '/crm/contact',
    method: 'get',
    params: { id },
  })
}

export async function apiCreateContact(data: ContactFormData): Promise<{ success: boolean; data: Contact }> {
  return ApiService.fetchData({
    url: '/crm/contacts/create',
    method: 'post',
    data,
  })
}

export async function apiUpdateContact(data: ContactFormData): Promise<{ success: boolean; data: Contact }> {
  return ApiService.fetchData({
    url: '/crm/contacts/update',
    method: 'put',
    data,
  })
}

export async function apiDeleteContact(id: string): Promise<boolean> {
  return ApiService.fetchData({
    url: '/crm/contacts/delete',
    method: 'delete',
    data: { id },
  })
}

// Lead API functions
export async function apiGetLeads(params: CRMListParams): Promise<CRMListResponse<Lead>> {
  return ApiService.fetchData({
    url: '/crm/leads',
    method: 'post',
    data: params,
  })
}

export async function apiGetLead(id: string): Promise<Lead> {
  return ApiService.fetchData({
    url: '/crm/lead',
    method: 'get',
    params: { id },
  })
}

export async function apiCreateLead(data: LeadFormData): Promise<{ success: boolean; data: Lead }> {
  return ApiService.fetchData({
    url: '/crm/leads/create',
    method: 'post',
    data,
  })
}

export async function apiUpdateLead(data: LeadFormData): Promise<{ success: boolean; data: Lead }> {
  return ApiService.fetchData({
    url: '/crm/leads/update',
    method: 'put',
    data,
  })
}

export async function apiDeleteLead(id: string): Promise<boolean> {
  return ApiService.fetchData({
    url: '/crm/leads/delete',
    method: 'delete',
    data: { id },
  })
}

// Convert lead to opportunity
export async function apiConvertLead(leadId: string, opportunityData: Partial<OpportunityFormData>): Promise<{ success: boolean; data: Opportunity }> {
  return ApiService.fetchData({
    url: '/crm/leads/convert',
    method: 'post',
    data: { leadId, opportunityData },
  })
}

// Opportunity API functions
export async function apiGetOpportunities(params: CRMListParams): Promise<CRMListResponse<Opportunity>> {
  return ApiService.fetchData({
    url: '/crm/opportunities',
    method: 'post',
    data: params,
  })
}

export async function apiGetOpportunity(id: string): Promise<Opportunity> {
  return ApiService.fetchData({
    url: '/crm/opportunity',
    method: 'get',
    params: { id },
  })
}

export async function apiCreateOpportunity(data: OpportunityFormData): Promise<{ success: boolean; data: Opportunity }> {
  return ApiService.fetchData({
    url: '/crm/opportunities/create',
    method: 'post',
    data,
  })
}

export async function apiUpdateOpportunity(data: OpportunityFormData): Promise<{ success: boolean; data: Opportunity }> {
  return ApiService.fetchData({
    url: '/crm/opportunities/update',
    method: 'put',
    data,
  })
}

export async function apiDeleteOpportunity(id: string): Promise<boolean> {
  return ApiService.fetchData({
    url: '/crm/opportunities/delete',
    method: 'delete',
    data: { id },
  })
}

// Activity functions
export async function apiAddActivity(entityType: 'contact' | 'lead' | 'opportunity', entityId: string, activity: Omit<Activity, 'id'>): Promise<{ success: boolean; data: Activity }> {
  return ApiService.fetchData({
    url: '/crm/activities/create',
    method: 'post',
    data: { entityType, entityId, activity },
  })
}