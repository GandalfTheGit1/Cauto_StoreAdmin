import type { Server } from 'miragejs'

import paginate from '@/utils/paginate'
import sortBy, { Primer } from '@/utils/sortBy'
import wildCardSearch from '@/utils/wildCardSearch'

export default function crmFakeApi(server: Server, apiPrefix: string) {
  server.get(`${apiPrefix}/crm/dashboard`, schema => {
    return schema.db.crmDashboardData[0]
  })

  server.get(`${apiPrefix}/crm/calendar`, schema => schema.db.eventsData)

  server.post(`${apiPrefix}/crm/customers`, (schema, { requestBody }) => {
    const body = JSON.parse(requestBody)
    const { pageIndex, pageSize, sort, query } = body
    const { order, key } = sort
    const users = schema.db.userDetailData
    const sanitizeUsers = users.filter(elm => typeof elm !== 'function')
    let data = sanitizeUsers
    let total = users.length

    if (key && order) {
      if (key !== 'lastOnline') {
        data.sort(
          sortBy(key, order === 'desc', a => (a as string).toUpperCase())
        )
      } else {
        data.sort(sortBy(key, order === 'desc', parseInt as Primer))
      }
    }

    if (query) {
      data = wildCardSearch(data, query)
      total = data.length
    }

    data = paginate(data, pageSize, pageIndex)

    const responseData = {
      data: data,
      total: total,
    }
    return responseData
  })

  server.get(`${apiPrefix}/crm/customers-statistic`, () => {
    return {
      totalCustomers: {
        value: 2420,
        growShrink: 17.2,
      },
      activeCustomers: {
        value: 1897,
        growShrink: 32.7,
      },
      newCustomers: {
        value: 241,
        growShrink: -2.3,
      },
    }
  })

  server.get(`${apiPrefix}/crm/customer-details`, (schema, { queryParams }) => {
    const id = queryParams.id as string
    const user = schema.db.userDetailData.find(id)
    return user
  })

  server.del(`${apiPrefix}/crm/customer/delete`, (schema, { requestBody }) => {
    const { id } = JSON.parse(requestBody)
    schema.db.userDetailData.remove({ id })
    return {}
  })

  server.put(`${apiPrefix}/crm/customers`, (schema, { requestBody }) => {
    const data = JSON.parse(requestBody)
    const { id } = data
    schema.db.userDetailData.update({ id }, data)
    return {}
  })

  server.get(`${apiPrefix}/crm/mails`, (schema, { queryParams }) => {
    const { category } = queryParams
    let data = schema.db.mailData

    if (category === 'sentItem') {
      data = schema.db.mailData.where({ group: 'sentItem' })
    }

    if (category === 'deleted') {
      data = schema.db.mailData.where({ group: 'deleted' })
    }

    if (category === 'draft') {
      data = schema.db.mailData.where({ group: 'draft' })
    }

    if (category === 'starred') {
      data = schema.db.mailData.where({ starred: true })
    }

    if (
      category === 'work' ||
      category === 'private' ||
      category === 'important'
    ) {
      data = schema.db.mailData.where({ label: category })
    }

    return data
  })

  server.get(`${apiPrefix}/crm/mail`, (schema, { queryParams }) => {
    const id = queryParams.id as string
    const mail = schema.db.mailData.find(id)
    return mail
  })

  // Enhanced CRM endpoints

  // Contacts endpoints
  server.post(`${apiPrefix}/crm/contacts`, (schema, { requestBody }) => {
    const body = JSON.parse(requestBody)
    const { pageIndex, pageSize, sort, query } = body
    const { order, key } = sort
    const contacts = schema.db.contactsData
    const sanitizeContacts = contacts.filter(elm => typeof elm !== 'function')
    let data = sanitizeContacts
    let total = contacts.length

    if ((key === 'firstName' || key === 'lastName' || key === 'email' || key === 'company') && order) {
      data.sort(sortBy(key, order === 'desc', a => (a as string).toUpperCase()))
    } else {
      data.sort(sortBy(key, order === 'desc', parseInt as Primer))
    }

    if (query) {
      data = wildCardSearch(data, query)
      total = data.length
    }

    data = paginate(data, pageSize, pageIndex)

    return {
      data: data,
      total: total,
    }
  })

  server.get(`${apiPrefix}/crm/contact`, (schema, { queryParams }) => {
    const id = queryParams.id as string
    const contact = schema.db.contactsData.find(id)
    return contact
  })

  server.post(`${apiPrefix}/crm/contacts/create`, (schema, { requestBody }) => {
    const data = JSON.parse(requestBody)
    schema.db.contactsData.insert(data)
    return true
  })

  server.put(`${apiPrefix}/crm/contacts/update`, (schema, { requestBody }) => {
    const data = JSON.parse(requestBody)
    const { id } = data
    schema.db.contactsData.update({ id }, data)
    return true
  })

  server.del(`${apiPrefix}/crm/contacts/delete`, (schema, { requestBody }) => {
    const { id } = JSON.parse(requestBody)
    schema.db.contactsData.remove({ id })
    return true
  })

  // Leads endpoints
  server.post(`${apiPrefix}/crm/leads`, (schema, { requestBody }) => {
    const body = JSON.parse(requestBody)
    const { pageIndex, pageSize, sort, query } = body
    const { order, key } = sort
    const leads = schema.db.leadsData
    const sanitizeLeads = leads.filter(elm => typeof elm !== 'function')
    let data = sanitizeLeads
    let total = leads.length

    if ((key === 'firstName' || key === 'lastName' || key === 'email' || key === 'company' || key === 'status') && order) {
      data.sort(sortBy(key, order === 'desc', a => (a as string).toUpperCase()))
    } else {
      data.sort(sortBy(key, order === 'desc', parseInt as Primer))
    }

    if (query) {
      data = wildCardSearch(data, query)
      total = data.length
    }

    data = paginate(data, pageSize, pageIndex)

    return {
      data: data,
      total: total,
    }
  })

  server.get(`${apiPrefix}/crm/lead`, (schema, { queryParams }) => {
    const id = queryParams.id as string
    const lead = schema.db.leadsData.find(id)
    return lead
  })

  server.post(`${apiPrefix}/crm/leads/create`, (schema, { requestBody }) => {
    const data = JSON.parse(requestBody)
    schema.db.leadsData.insert(data)
    return true
  })

  server.put(`${apiPrefix}/crm/leads/update`, (schema, { requestBody }) => {
    const data = JSON.parse(requestBody)
    const { id } = data
    schema.db.leadsData.update({ id }, data)
    return true
  })

  server.del(`${apiPrefix}/crm/leads/delete`, (schema, { requestBody }) => {
    const { id } = JSON.parse(requestBody)
    schema.db.leadsData.remove({ id })
    return true
  })

  // Opportunities endpoints
  server.post(`${apiPrefix}/crm/opportunities`, (schema, { requestBody }) => {
    const body = JSON.parse(requestBody)
    const { pageIndex, pageSize, sort, query } = body
    const { order, key } = sort
    const opportunities = schema.db.opportunitiesData
    const sanitizeOpportunities = opportunities.filter(elm => typeof elm !== 'function')
    let data = sanitizeOpportunities
    let total = opportunities.length

    if ((key === 'name' || key === 'company' || key === 'stage') && order) {
      data.sort(sortBy(key, order === 'desc', a => (a as string).toUpperCase()))
    } else {
      data.sort(sortBy(key, order === 'desc', parseInt as Primer))
    }

    if (query) {
      data = wildCardSearch(data, query)
      total = data.length
    }

    data = paginate(data, pageSize, pageIndex)

    return {
      data: data,
      total: total,
    }
  })

  server.get(`${apiPrefix}/crm/opportunity`, (schema, { queryParams }) => {
    const id = queryParams.id as string
    const opportunity = schema.db.opportunitiesData.find(id)
    return opportunity
  })

  server.post(`${apiPrefix}/crm/opportunities/create`, (schema, { requestBody }) => {
    const data = JSON.parse(requestBody)
    schema.db.opportunitiesData.insert(data)
    return true
  })

  server.put(`${apiPrefix}/crm/opportunities/update`, (schema, { requestBody }) => {
    const data = JSON.parse(requestBody)
    const { id } = data
    schema.db.opportunitiesData.update({ id }, data)
    return true
  })

  server.del(`${apiPrefix}/crm/opportunities/delete`, (schema, { requestBody }) => {
    const { id } = JSON.parse(requestBody)
    schema.db.opportunitiesData.remove({ id })
    return true
  })

  // Pipeline stages
  server.get(`${apiPrefix}/crm/pipeline-stages`, (schema) => {
    return schema.db.pipelineStages
  })

  // Activity types
  server.get(`${apiPrefix}/crm/activity-types`, (schema) => {
    return schema.db.activityTypes
  })
}
