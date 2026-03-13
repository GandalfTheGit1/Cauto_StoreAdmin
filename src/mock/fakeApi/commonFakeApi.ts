import type { Server } from 'miragejs'

import wildCardSearch from '@/utils/wildCardSearch'

export default function commonFakeApi(server: Server, apiPrefix: string) {
  server.get(
    `${apiPrefix}/notification/list`,
    schema => schema.db.notificationListData
  )

  server.get(`${apiPrefix}/notification/count`, ({ db }) => {
    const unreadNotification = db.notificationListData.where({
      readed: false,
    })
    return { count: unreadNotification.length }
  })

  server.post(`${apiPrefix}/search/query`, (schema, { requestBody }) => {
    const body = JSON.parse(requestBody)
    const { query } = body
    const searchData = schema.db.searchQueryPoolData.filter(
      elm => typeof elm !== 'function'
    )
    const result = wildCardSearch(searchData, query, 'title')
    const categories: (string | number)[] = []

    result.forEach(elm => {
      if (!categories.includes(elm.categoryTitle)) {
        categories.push(elm.categoryTitle)
      }
    })

    const data = categories.map(category => {
      return {
        title: category,
        data: result.filter(elm => elm.categoryTitle === category),
      }
    })
    return data
  })

  server.post(`${apiPrefix}/search/global`, (schema, { requestBody }) => {
    const body = JSON.parse(requestBody)
    const { query } = body
    
    if (!query || query.trim().length < 2) {
      return []
    }

    const results = []
    
    // Search in navigation/pages
    const navigationData = schema.db.searchQueryPoolData.filter(
      elm => typeof elm !== 'function'
    )
    const navigationResults = wildCardSearch(navigationData, query, 'title')
    if (navigationResults.length > 0) {
      results.push({
        title: 'Pages & Navigation',
        data: navigationResults.slice(0, 5).map(item => ({
          id: `nav-${item.title.replace(/\s+/g, '-').toLowerCase()}`,
          title: item.title,
          url: item.url,
          icon: item.icon,
          category: item.category,
          categoryTitle: item.categoryTitle,
          type: 'navigation'
        }))
      })
    }

    // Search in products
    const products = schema.db.productData.filter(elm => typeof elm !== 'function')
    const productResults = wildCardSearch(products, query, ['name', 'brand', 'category'])
    if (productResults.length > 0) {
      results.push({
        title: 'Products',
        data: productResults.slice(0, 8).map(product => ({
          id: `product-${product.id}`,
          title: product.name,
          subtitle: `${product.brand} • ${product.category}`,
          url: `/app/sales/product-edit/${product.id}`,
          avatar: product.img,
          category: 'Products',
          categoryTitle: 'Sales',
          type: 'product',
          metadata: {
            price: product.price,
            status: product.stock > 0 ? 'In Stock' : 'Out of Stock',
            statusColor: product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }
        }))
      })
    }

    // Search in orders
    const orders = schema.db.orderData.filter(elm => typeof elm !== 'function')
    const orderResults = wildCardSearch(orders, query, ['id', 'customer', 'paymentIdentifier'])
    if (orderResults.length > 0) {
      results.push({
        title: 'Orders',
        data: orderResults.slice(0, 6).map(order => ({
          id: `order-${order.id}`,
          title: `Order #${order.id}`,
          subtitle: `${order.customer} • $${order.totalAmount}`,
          url: `/app/sales/order-details/${order.id}`,
          category: 'Orders',
          categoryTitle: 'Sales',
          type: 'order',
          metadata: {
            date: new Date(order.date * 1000).toLocaleDateString(),
            status: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'][order.status] || 'Unknown',
            statusColor: [
              'bg-yellow-100 text-yellow-800',
              'bg-blue-100 text-blue-800', 
              'bg-purple-100 text-purple-800',
              'bg-green-100 text-green-800',
              'bg-red-100 text-red-800'
            ][order.status] || 'bg-gray-100 text-gray-800'
          }
        }))
      })
    }

    // Search in customers (from CRM contacts)
    const contacts = schema.db.crmContactsData.filter(elm => typeof elm !== 'function')
    const contactResults = wildCardSearch(contacts, query, ['firstName', 'lastName', 'email', 'company'])
    if (contactResults.length > 0) {
      results.push({
        title: 'Contacts',
        data: contactResults.slice(0, 6).map(contact => ({
          id: `contact-${contact.id}`,
          title: `${contact.firstName} ${contact.lastName}`,
          subtitle: `${contact.company} • ${contact.position}`,
          url: `/app/crm/customer-details?id=${contact.id}`,
          avatar: contact.avatar,
          category: 'Contacts',
          categoryTitle: 'CRM',
          type: 'contact',
          metadata: {
            status: contact.status,
            statusColor: contact.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }
        }))
      })
    }

    // Search in inventory items
    const inventoryItems = schema.db.inventoryData.filter(elm => typeof elm !== 'function')
    const inventoryResults = wildCardSearch(inventoryItems, query, ['name', 'category', 'location'])
    if (inventoryResults.length > 0) {
      results.push({
        title: 'Inventory',
        data: inventoryResults.slice(0, 6).map(item => ({
          id: `inventory-${item.id}`,
          title: item.name,
          subtitle: `${item.category} • Location: ${item.location}`,
          url: `/app/inventory/product-list`,
          category: 'Inventory',
          categoryTitle: 'Inventory',
          type: 'inventory',
          metadata: {
            status: item.stock > item.reorderLevel ? 'In Stock' : item.stock > 0 ? 'Low Stock' : 'Out of Stock',
            statusColor: item.stock > item.reorderLevel ? 'bg-green-100 text-green-800' : 
                        item.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
          }
        }))
      })
    }

    return results
  })
}
